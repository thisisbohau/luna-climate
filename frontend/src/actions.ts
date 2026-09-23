/**
 * Standard Lovelace actions (tap / hold / double tap) without depending on
 * Home Assistant's internal helpers, which are not exported to custom cards.
 * The config shape matches HA's own, so the visual editor's `ui_action`
 * selector produces exactly what this consumes.
 */

import type { ActionConfig, HomeAssistant } from "./types";
import { openZoneDialog } from "./zone-dialog";

export function fireEvent(
  node: EventTarget,
  type: string,
  detail?: unknown,
): void {
  node.dispatchEvent(
    new CustomEvent(type, { bubbles: true, composed: true, detail }),
  );
}

export function haptic(kind: "light" | "success" | "warning" = "light"): void {
  // The companion apps listen for this on window.
  fireEvent(window, "haptic", kind);
}

export function hasAction(action?: ActionConfig): boolean {
  return action !== undefined && action.action !== "none";
}

export async function runAction(
  node: HTMLElement,
  hass: HomeAssistant,
  entityId: string | undefined,
  action: ActionConfig | undefined,
): Promise<void> {
  if (!action || action.action === "none") return;

  if (action.confirmation) {
    const text =
      typeof action.confirmation === "object" && action.confirmation.text
        ? action.confirmation.text
        : "Are you sure?";
    haptic("warning");
    if (!window.confirm(text)) return;
  }

  const target = action.entity ?? entityId;

  switch (action.action) {
    case "more-info":
      // A Luna zone opens its own detail view instead of the stock dialog.
      if (target && hass.states[target]?.attributes.luna_zone_id !== undefined) {
        openZoneDialog(target, "overview", hass);
      } else if (target) {
        fireEvent(node, "hass-more-info", { entityId: target });
      }
      return;

    case "toggle":
      if (target) {
        await hass.callService("homeassistant", "toggle", { entity_id: target });
        haptic("light");
      }
      return;

    case "perform-action":
    case "call-service": {
      const name = action.perform_action ?? action.service;
      if (!name || !name.includes(".")) return;
      const [domain, service] = name.split(".", 2);
      await hass.callService(
        domain,
        service,
        action.data ?? action.service_data,
        action.target,
      );
      haptic("light");
      return;
    }

    case "navigate":
      if (!action.navigation_path) return;
      if (action.navigation_replace) {
        history.replaceState(null, "", action.navigation_path);
      } else {
        history.pushState(null, "", action.navigation_path);
      }
      fireEvent(window, "location-changed", {
        replace: Boolean(action.navigation_replace),
      });
      return;

    case "url":
      if (action.url_path) window.open(action.url_path);
      return;

    case "fire-dom-event":
      fireEvent(node, "ll-custom", action);
      return;
  }
}

export type Gesture = "tap" | "hold" | "double_tap";

/**
 * Turns pointer input on one element into tap / hold / double-tap.
 *
 * Double tap is only waited for when it is configured, so plain taps stay
 * instant. Moving more than a few pixels cancels the gesture, which keeps
 * scrolling on touch screens from firing actions.
 */
export class GestureController {
  private holdTimer?: number;
  private tapTimer?: number;
  private held = false;
  private startX = 0;
  private startY = 0;
  private active = false;

  constructor(
    private readonly onGesture: (gesture: Gesture) => void,
    private readonly options: () => { hold: boolean; doubleTap: boolean },
  ) {}

  readonly down = (ev: PointerEvent): void => {
    if (ev.button !== 0) return;
    this.active = true;
    this.held = false;
    this.startX = ev.clientX;
    this.startY = ev.clientY;
    window.clearTimeout(this.holdTimer);
    if (this.options().hold) {
      this.holdTimer = window.setTimeout(() => {
        this.held = true;
        haptic("light");
        this.onGesture("hold");
      }, 500);
    }
  };

  readonly move = (ev: PointerEvent): void => {
    if (!this.active) return;
    if (
      Math.abs(ev.clientX - this.startX) > 10 ||
      Math.abs(ev.clientY - this.startY) > 10
    ) {
      this.cancel();
    }
  };

  readonly up = (): void => {
    if (!this.active) return;
    this.active = false;
    window.clearTimeout(this.holdTimer);
    if (this.held) return;

    if (!this.options().doubleTap) {
      this.onGesture("tap");
      return;
    }
    if (this.tapTimer !== undefined) {
      window.clearTimeout(this.tapTimer);
      this.tapTimer = undefined;
      this.onGesture("double_tap");
      return;
    }
    this.tapTimer = window.setTimeout(() => {
      this.tapTimer = undefined;
      this.onGesture("tap");
    }, 250);
  };

  readonly cancel = (): void => {
    this.active = false;
    window.clearTimeout(this.holdTimer);
  };

  /** Keyboard activation: Enter and Space act as a tap. */
  readonly key = (ev: KeyboardEvent): void => {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      this.onGesture("tap");
    }
  };

  readonly contextMenu = (ev: Event): void => {
    // A long press on touch screens would otherwise open the browser menu.
    if (this.options().hold) ev.preventDefault();
  };
}
