/**
 * `custom:luna-badge-card` — a general-purpose pill for any entity.
 *
 * Every text-like field accepts a plain value or a Jinja template:
 *
 *   type: custom:luna-badge-card
 *   entity: sensor.washing_machine
 *   name: Washer
 *   content: "{{ states('sensor.washer_remaining') }} min left"
 *   icon: mdi:washing-machine
 *   color: "{{ 'blue' if is_state('sensor.washing_machine', 'running') else 'grey' }}"
 *   progress: "{{ states('sensor.washer_progress') }}"   # 0..100
 *   indicator: "{{ is_state('binary_sensor.washer_door', 'on') }}"
 *   tap_action:
 *     action: more-info
 */

import type { PropertyValues } from "lit";
import type { Gesture } from "./actions";
import { resolveColor } from "./colors";
import { LunaPillBase, type PillViewModel } from "./pill";
import { TemplateRenderer } from "./templates";
import type { ActionConfig, HomeAssistant, LovelaceCardConfig } from "./types";

export interface BadgeCardConfig extends LovelaceCardConfig {
  entity?: string;
  name?: string;
  content?: string;
  icon?: string;
  color?: string;
  progress?: string | number;
  indicator?: string | boolean;
  indicator_color?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

const TEMPLATED = ["name", "content", "icon", "color", "progress", "indicator", "indicator_color"] as const;

function truthy(value: string | undefined): boolean {
  if (value === undefined) return false;
  const v = value.trim().toLowerCase();
  return !(v === "" || v === "false" || v === "0" || v === "off" || v === "none" || v === "no");
}

export class LunaBadgeCard extends LunaPillBase<BadgeCardConfig> {
  private readonly templates = new TemplateRenderer(() => this.requestUpdate());
  private resync = true;

  setConfig(config: BadgeCardConfig): void {
    if (!config) throw new Error("Invalid configuration");
    if (!config.entity && !config.content && !config.name) {
      throw new Error("Set an entity, or at least a name or content");
    }
    this.config = { ...config };
    this.resync = true;
  }

  static getStubConfig(hass: HomeAssistant): BadgeCardConfig {
    const entity = Object.keys(hass.states).find((id) => id.startsWith("light.") || id.startsWith("sensor."));
    return { type: "custom:luna-badge-card", entity };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "name", selector: { text: {} } },
            { name: "icon", selector: { icon: {} }, context: { icon_entity: "entity" } },
          ],
        },
        { name: "content", selector: { template: {} } },
        { name: "color", selector: { ui_color: { include_state: false, include_none: true } } },
        { name: "progress", selector: { template: {} } },
        { name: "indicator", selector: { template: {} } },
        { name: "tap_action", selector: { ui_action: { default_action: "more-info" } } },
        { name: "hold_action", selector: { ui_action: { default_action: "none" } } },
        { name: "double_tap_action", selector: { ui_action: { default_action: "none" } } },
      ],
      computeLabel: (s: { name: string }) =>
        ({
          entity: "Entity",
          name: "Name (small line)",
          icon: "Icon",
          content: "Content (bold line) — text or template",
          color: "Colour",
          progress: "Progress ring, 0–100 — number or template",
          indicator: "Indicator dot — template, shown when truthy",
          tap_action: "Tap",
          hold_action: "Hold",
          double_tap_action: "Double tap",
        })[s.name] ?? s.name,
    };
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.templates.clear();
  }

  connectedCallback(): void {
    super.connectedCallback();
    // Re-subscribe after being moved or re-attached by the dashboard.
    this.resync = true;
    this.requestUpdate();
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (!this.hass || !this.config || !this.isConnected) return;
    if (this.resync) {
      this.resync = false;
      const fields: Record<string, unknown> = {};
      for (const key of TEMPLATED) fields[key] = this.config[key];
      this.templates.sync(this.hass, fields, {
        config: this.config,
        user: this.hass.user?.name,
        entity: this.config.entity,
      });
    }
  }

  protected actionFor(gesture: Gesture): ActionConfig | undefined {
    const c = this.config;
    if (!c) return undefined;
    if (gesture === "tap") return c.tap_action ?? (c.entity ? { action: "more-info" } : undefined);
    if (gesture === "hold") return c.hold_action;
    return c.double_tap_action;
  }

  protected viewModel(): PillViewModel | undefined {
    const c = this.config!;
    const hass = this.hass!;
    const t = (key: (typeof TEMPLATED)[number]) => this.templates.value(key, c[key]);
    const stateObj = c.entity ? hass.states[c.entity] : undefined;

    const name = t("name") ?? (stateObj ? String(stateObj.attributes.friendly_name ?? c.entity) : undefined);
    const content =
      t("content") ??
      (stateObj ? (hass.formatEntityState ? hass.formatEntityState(stateObj) : stateObj.state) : undefined);

    const progressRaw = t("progress");
    let progress: number | undefined;
    if (progressRaw !== undefined && progressRaw.trim() !== "") {
      const n = Number(progressRaw);
      // Always a percentage; guessing between 0..1 and 0..100 would make
      // a value of exactly 1 ambiguous.
      if (Number.isFinite(n)) progress = Math.min(100, Math.max(0, n)) / 100;
    }

    const color = resolveColor(t("color")) ?? "var(--state-icon-color, var(--primary-color))";

    return {
      stateObj,
      icon: t("icon"),
      name,
      content,
      color,
      progress,
      indicator: truthy(t("indicator")),
      indicatorColor: resolveColor(t("indicator_color")),
      ariaLabel: [name, content].filter(Boolean).join(", "),
    };
  }
}
