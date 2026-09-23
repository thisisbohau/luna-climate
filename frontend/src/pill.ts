/**
 * The pill that both badge cards render.
 *
 * `LunaPillBase` owns everything shared: hass wiring, gestures, the
 * optional periodic refresh and the markup. Subclasses only decide what
 * the pill shows (`viewModel`) and what a gesture does (`actionFor` /
 * `onGesture`).
 */

import { LitElement, css, html, nothing, svg, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { GestureController, hasAction, runAction, type Gesture } from "./actions";
import { tint } from "./colors";
import type { ActionConfig, HassEntity, HomeAssistant, LovelaceCardConfig } from "./types";

export interface PillViewModel {
  /** Rendered through ha-state-icon when present, so HA's own icon applies. */
  stateObj?: HassEntity;
  icon?: string;
  name?: string;
  content?: string;
  color: string;
  /** 0..1 draws a ring around the icon; undefined hides it. */
  progress?: number;
  indicator?: boolean;
  indicatorColor?: string;
  ariaLabel: string;
}

const RING = 2 * Math.PI * 17;

export abstract class LunaPillBase<C extends LovelaceCardConfig> extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() protected config?: C;

  private tickTimer?: number;

  protected readonly gestures = new GestureController(
    (gesture) => void this.onGesture(gesture),
    () => ({
      hold: hasAction(this.actionFor("hold")),
      doubleTap: hasAction(this.actionFor("double_tap")),
    }),
  );

  abstract setConfig(config: C): void;
  protected abstract viewModel(): PillViewModel | undefined;
  protected abstract actionFor(gesture: Gesture): ActionConfig | undefined;

  /** Milliseconds between forced refreshes, or 0 for none. */
  protected tickEvery(): number {
    return 0;
  }

  protected entityId(): string | undefined {
    return typeof this.config?.entity === "string" ? this.config.entity : undefined;
  }

  protected async onGesture(gesture: Gesture): Promise<void> {
    if (!this.hass) return;
    await runAction(this, this.hass, this.entityId(), this.actionFor(gesture));
  }

  getCardSize(): number {
    return 1;
  }

  getGridOptions() {
    return { columns: 6, rows: 1, min_columns: 3, min_rows: 1 };
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearInterval(this.tickTimer);
    this.tickTimer = undefined;
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    const every = this.tickEvery();
    if (every && this.tickTimer === undefined) {
      this.tickTimer = window.setInterval(() => this.requestUpdate(), every);
    } else if (!every && this.tickTimer !== undefined) {
      window.clearInterval(this.tickTimer);
      this.tickTimer = undefined;
    }
  }

  protected render() {
    if (!this.config || !this.hass) return nothing;
    const vm = this.viewModel();
    if (!vm) return nothing;

    const style = [
      `--pill-color: ${vm.color}`,
      `--pill-shape: ${tint(vm.color, 18)}`,
      `--pill-ring-track: ${tint(vm.color, 22)}`,
      `--pill-indicator: ${vm.indicatorColor ?? "var(--error-color, #db4437)"}`,
    ].join(";");

    const offset = vm.progress === undefined ? RING : RING * (1 - Math.min(1, Math.max(0, vm.progress)));

    return html`
      <ha-card style=${style}>
        <button
          class="pill"
          type="button"
          aria-label=${vm.ariaLabel}
          @pointerdown=${this.gestures.down}
          @pointermove=${this.gestures.move}
          @pointerup=${this.gestures.up}
          @pointercancel=${this.gestures.cancel}
          @pointerleave=${this.gestures.cancel}
          @keydown=${this.gestures.key}
          @contextmenu=${this.gestures.contextMenu}
        >
          <span class="icon">
            <span class="shape">
              ${vm.stateObj
                ? html`<ha-state-icon
                    .hass=${this.hass}
                    .stateObj=${vm.stateObj}
                    .icon=${vm.icon}
                  ></ha-state-icon>`
                : html`<ha-icon .icon=${vm.icon ?? "mdi:help-circle-outline"}></ha-icon>`}
            </span>
            ${vm.progress === undefined
              ? nothing
              : svg`<svg class="ring" viewBox="0 0 36 36" aria-hidden="true">
                  <circle class="track" cx="18" cy="18" r="17"></circle>
                  <circle class="bar" cx="18" cy="18" r="17"
                    stroke-dasharray=${RING.toFixed(2)}
                    stroke-dashoffset=${offset.toFixed(2)}></circle>
                </svg>`}
            ${vm.indicator ? html`<span class="dot"></span>` : nothing}
          </span>
          <span class="text">
            ${vm.name ? html`<span class="name">${vm.name}</span>` : nothing}
            ${vm.content ? html`<span class="content">${vm.content}</span>` : nothing}
          </span>
        </button>
      </ha-card>
    `;
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    ha-card {
      height: 100%;
      min-height: 44px;
      box-sizing: border-box;
      display: flex;
      overflow: hidden;
      border-radius: var(--luna-pill-radius, 999px);
    }
    .pill {
      all: unset;
      box-sizing: border-box;
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 16px 0 6px;
      cursor: pointer;
      border-radius: inherit;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      touch-action: manipulation;
      transition: background-color 150ms ease;
    }
    .pill:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }
    .pill:active {
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
    .icon {
      position: relative;
      flex: none;
      width: 36px;
      height: 36px;
    }
    .shape {
      position: absolute;
      inset: 3px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--pill-shape);
      color: var(--pill-color);
      --mdc-icon-size: 18px;
      transition: background-color 200ms ease, color 200ms ease;
    }
    .ring {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }
    .ring .track {
      fill: none;
      stroke: var(--pill-ring-track);
      stroke-width: 2;
    }
    .ring .bar {
      fill: none;
      stroke: var(--pill-color);
      stroke-width: 2;
      stroke-linecap: round;
      transition: stroke-dashoffset 1s linear;
    }
    .dot {
      position: absolute;
      top: 0;
      right: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--pill-indicator);
      box-shadow: 0 0 0 2px var(--ha-card-background, var(--card-background-color, #1c1c1c));
    }
    .text {
      display: flex;
      flex-direction: column;
      min-width: 0;
      line-height: 1.3;
    }
    .name {
      font-size: var(--ha-font-size-xs, 11px);
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .content {
      font-size: var(--ha-font-size-s, 13px);
      font-weight: var(--ha-font-weight-bold, 600);
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-variant-numeric: tabular-nums;
    }
  `;
}
