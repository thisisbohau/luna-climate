/**
 * `custom:luna-zone-card` — the main card for one Luna Climate zone.
 *
 *   type: custom:luna-zone-card
 *   entity: climate.luna_wohnzimmer
 *   boost_durations: [30, 60]     # optional
 *   show_schedule: true           # optional
 *   show_stepper: true            # optional
 *
 * The arc runs from Off on the left to Max on the right -- the same values
 * a schedule block can take. The white ring is the measured temperature,
 * the coloured handle is the target, and the bright stretch between them
 * is how far the room still has to go.
 *
 * Dragging the handle or using − / + previews locally and commits once,
 * so a drag does not send a service call per pixel.
 */

import { LitElement, css, html, nothing, svg, unsafeCSS, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { fireEvent, haptic } from "./actions";
import { LUNA, tint } from "./colors";
import { localize, type StringKey } from "./i18n";
import { ScheduleController, renderScheduleStrip, scheduleStripStyles } from "./schedule-strip";
import type { HomeAssistant, LovelaceCardConfig, TargetValue } from "./types";
import {
  formatHumidity,
  formatTemp,
  isBoosting,
  isLunaZone,
  readBattery,
  readZone,
  zoneColor,
  zoneIcon,
  type ZoneSource,
  type ZoneView,
} from "./zone";

export interface ZoneCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
  icon?: string;
  boost_durations?: Array<number | string>;
  show_schedule?: boolean;
  show_stepper?: boolean;
  show_humidity?: boolean;
}

// Dial geometry, in the SVG's own coordinate space.
const G = { W: 366, H: 232, cx: 183, cy: 170, r: 150, T0: 10, T1: 27, A0: 200, A1: -20 };
const MIN_NUMERIC = 10.5;
const MAX_NUMERIC = 25;

const ang = (t: number) => G.A0 - ((t - G.T0) / (G.T1 - G.T0)) * (G.A0 - G.A1);
const pt = (a: number, rr: number) => {
  const rad = (a * Math.PI) / 180;
  return { x: +(G.cx + rr * Math.cos(rad)).toFixed(2), y: +(G.cy - rr * Math.sin(rad)).toFixed(2) };
};
const arc = (t1: number, t2: number): string => {
  if (t2 - t1 < 0.01) return "";
  const a1 = ang(t1);
  const a2 = ang(t2);
  const p1 = pt(a1, G.r);
  const p2 = pt(a2, G.r);
  return `M ${p1.x} ${p1.y} A ${G.r} ${G.r} 0 ${a1 - a2 > 180 ? 1 : 0} 1 ${p2.x} ${p2.y}`;
};
const TICKS = (() => {
  let d = "";
  for (let t = 11; t <= 26; t++) {
    const a = ang(t);
    const q1 = pt(a, G.r - 13);
    const q2 = pt(a, G.r - (t % 5 === 0 ? 22 : 18));
    d += `M ${q1.x} ${q1.y} L ${q2.x} ${q2.y} `;
  }
  return d;
})();
const TRACK = arc(G.T0, G.T1);
const BOOST = unsafeCSS(LUNA.boost);
const WARNING = unsafeCSS(LUNA.warning);

const position = (v: TargetValue) => (v === "off" ? G.T0 : v === "max" ? G.T1 : Math.min(G.T1, Math.max(G.T0, v)));

function clampTarget(t: number): TargetValue {
  if (t < MIN_NUMERIC - 0.25) return "off";
  if (t > MAX_NUMERIC + 0.25) return "max";
  return Math.min(MAX_NUMERIC, Math.max(MIN_NUMERIC, Math.round(t * 2) / 2));
}

const CHIP: Record<ZoneSource, { icon: string; label: StringKey }> = {
  schedule: { icon: "mdi:calendar-clock", label: "schedule" },
  manual: { icon: "mdi:hand-back-right-outline", label: "manual" },
  away: { icon: "mdi:home-export-outline", label: "away" },
  boost: { icon: "mdi:fire", label: "boost" },
  none: { icon: "mdi:calendar-remove-outline", label: "no_schedule" },
};

export class LunaZoneCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private config?: ZoneCardConfig;
  @state() private pending?: TargetValue;

  private readonly scheduleCtl = new ScheduleController(this, () => ({
    hass: this.hass,
    zone: this.zone,
    enabled: this.config?.show_schedule !== false,
  }));
  private dragging = false;
  private commitTimer?: number;
  private echoTimer?: number;
  private awaitingEcho?: TargetValue;
  private tickTimer?: number;
  private tickEvery = 0;

  setConfig(config: ZoneCardConfig): void {
    if (!config?.entity) throw new Error("Set the entity of a Luna Climate zone");
    this.config = { show_schedule: true, show_stepper: true, show_humidity: true, boost_durations: [30, 60], ...config };
  }

  static getStubConfig(hass: HomeAssistant): ZoneCardConfig {
    const entity =
      Object.keys(hass.states).find((id) => isLunaZone(hass.states[id])) ?? "climate.luna_zone";
    return { type: "custom:luna-zone-card", entity };
  }

  static getConfigForm() {
    return {
      schema: [
        {
          name: "entity",
          required: true,
          selector: { entity: { filter: { integration: "luna_climate", domain: "climate" } } },
        },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "name", selector: { text: {} } },
            { name: "icon", selector: { icon: {} } },
          ],
        },
        {
          name: "boost_durations",
          selector: {
            select: {
              multiple: true,
              custom_value: true,
              options: ["15", "30", "45", "60", "90", "120"].map((v) => ({ value: v, label: `${v} min` })),
            },
          },
        },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "show_schedule", selector: { boolean: {} } },
            { name: "show_stepper", selector: { boolean: {} } },
            { name: "show_humidity", selector: { boolean: {} } },
          ],
        },
      ],
      computeLabel: (s: { name: string }) =>
        ({
          entity: "Luna zone",
          name: "Name",
          icon: "Icon",
          boost_durations: "Boost buttons",
          show_schedule: "Show schedule strip",
          show_stepper: "Show − / + buttons",
          show_humidity: "Show humidity",
        })[s.name] ?? s.name,
    };
  }

  getCardSize(): number {
    return 8;
  }

  getGridOptions() {
    // Full width by default, like HA's thermostat card; half is the
    // smallest the dial stays legible at.
    return { columns: 12, min_columns: 6 };
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearInterval(this.tickTimer);
    window.clearTimeout(this.commitTimer);
    window.clearTimeout(this.echoTimer);
    this.tickTimer = undefined;
    this.tickEvery = 0;
  }

  private get zone(): ZoneView | undefined {
    const stateObj = this.config && this.hass?.states[this.config.entity];
    return stateObj && isLunaZone(stateObj) ? readZone(stateObj) : undefined;
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    const zone = this.zone;
    // Drop the local preview once Home Assistant reports the new value.
    if (zone && this.awaitingEcho !== undefined && !this.dragging) {
      if (zone.source === "manual" && zone.value === this.awaitingEcho) {
        this.clearPending();
      }
    }
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    const zone = this.zone;
    if (!zone || !this.hass) return;

    // One second while a boost counts down, otherwise twice a minute for
    // the "now" marker.
    const every = isBoosting(zone) ? 1000 : 30000;
    if (every !== this.tickEvery) {
      window.clearInterval(this.tickTimer);
      this.tickEvery = every;
      this.tickTimer = window.setInterval(() => this.requestUpdate(), every);
    }
  }

  // -- target changes ----------------------------------------------------

  private clearPending(): void {
    this.pending = undefined;
    this.awaitingEcho = undefined;
    window.clearTimeout(this.echoTimer);
  }

  private shownValue(zone: ZoneView): TargetValue {
    return this.pending ?? zone.value;
  }

  private step(delta: number): void {
    const zone = this.zone;
    if (!zone) return;
    const v = this.shownValue(zone);
    let t = v === "off" ? G.T0 : v === "max" ? MAX_NUMERIC + 0.5 : v;
    t += delta * 0.5;
    if (v === "max" && delta < 0) t = MAX_NUMERIC;
    if (v === "off" && delta > 0) t = MIN_NUMERIC;
    this.pending = clampTarget(t);
    haptic("light");
    window.clearTimeout(this.commitTimer);
    this.commitTimer = window.setTimeout(() => this.commit(), 900);
  }

  private async commit(): Promise<void> {
    const zone = this.zone;
    const value = this.pending;
    if (!zone || value === undefined || !this.hass) return;
    this.awaitingEcho = value;
    // Fall back to whatever HA reports if the echo never matches exactly.
    window.clearTimeout(this.echoTimer);
    this.echoTimer = window.setTimeout(() => this.clearPending(), 4000);
    try {
      await this.hass.callService("luna_climate", "set_target", {
        entity_id: zone.entityId,
        value: typeof value === "number" ? value : value,
      });
    } catch (err) {
      this.clearPending();
      throw err;
    }
  }

  private pointerToTarget(ev: PointerEvent): { value: TargetValue; onArc: boolean } {
    const svgEl = ev.currentTarget as SVGSVGElement;
    const rect = svgEl.getBoundingClientRect();
    const k = rect.width / G.W;
    const x = (ev.clientX - rect.left) / k;
    const y = (ev.clientY - rect.top) / k;
    const d = Math.hypot(x - G.cx, y - G.cy);
    let a = (Math.atan2(G.cy - y, x - G.cx) * 180) / Math.PI;
    if (a < -90) a += 360;
    a = Math.max(G.A1, Math.min(G.A0, a));
    const t = G.T0 + ((G.A0 - a) / (G.A0 - G.A1)) * (G.T1 - G.T0);
    return { value: clampTarget(t), onArc: Math.abs(d - G.r) <= 30 };
  }

  private readonly onPointerDown = (ev: PointerEvent): void => {
    const hit = this.pointerToTarget(ev);
    if (!hit.onArc) return;
    ev.preventDefault();
    this.dragging = true;
    window.clearTimeout(this.commitTimer);
    (ev.currentTarget as Element).setPointerCapture?.(ev.pointerId);
    this.pending = hit.value;
  };

  private readonly onPointerMove = (ev: PointerEvent): void => {
    if (!this.dragging) return;
    const next = this.pointerToTarget(ev).value;
    if (next !== this.pending) {
      this.pending = next;
      haptic("light");
    }
  };

  private readonly onPointerUp = (): void => {
    if (!this.dragging) return;
    this.dragging = false;
    void this.commit();
  };

  private async call(service: string, data: Record<string, unknown> = {}): Promise<void> {
    const zone = this.zone;
    if (!zone || !this.hass) return;
    this.clearPending();
    await this.hass.callService("luna_climate", service, { entity_id: zone.entityId, ...data });
  }

  private moreInfo(): void {
    if (this.config) fireEvent(this, "hass-more-info", { entityId: this.config.entity });
  }

  // -- rendering ---------------------------------------------------------

  protected render() {
    if (!this.config || !this.hass) return nothing;
    const hass = this.hass;
    const stateObj = hass.states[this.config.entity];
    if (!stateObj || !isLunaZone(stateObj)) {
      return html`<ha-card class="message">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>${localize(hass, "not_luna", { entity: this.config.entity })}</span>
      </ha-card>`;
    }

    const zone = readZone(stateObj);
    const L = (key: StringKey, vars?: Record<string, string | number>) => localize(hass, key, vars);
    const fmt = (v: TargetValue | undefined) => formatTemp(v, hass);

    const value = this.shownValue(zone);
    const source: ZoneSource = this.pending !== undefined ? "manual" : zone.source;
    const boosting = source === "boost" && isBoosting(zone);
    const isOff = value === "off";
    const isMax = value === "max";
    const heating = this.pending === undefined ? zone.heating : !isOff && zone.current !== undefined && position(value) > zone.current;
    const color = zoneColor(zone, value, source);

    // Dial.
    const tpos = position(value);
    const cpos = zone.current !== undefined ? position(zone.current) : undefined;
    const seg = isOff || cpos === undefined ? "" : arc(Math.min(tpos, cpos), Math.max(tpos, cpos));
    const tp = pt(ang(tpos), G.r);
    const cp = cpos !== undefined ? pt(ang(cpos), G.r) : undefined;

    // Header.
    const chip = zone.precomfort && source === "schedule"
      ? { icon: "mdi:map-marker-radius-outline", label: "precomfort" as StringKey }
      : CHIP[source] ?? CHIP.none;
    const battery = readBattery(hass, zone.entityId);
    const devices: string[] = [];
    if (zone.thermostats.length) {
      devices.push(zone.thermostats.length === 1 ? L("thermostat") : L("thermostats", { n: zone.thermostats.length }));
    }
    for (const id of zone.linkedDevices) {
      const s = hass.states[id];
      devices.push(String(s?.attributes.friendly_name ?? id));
    }
    const stateWord = heating ? L("heating") : isOff ? L("off") : L("idle");
    const subtitle = [stateWord, devices.join(" + ")].filter(Boolean).join(" · ");

    // Centre.
    const centerLabel = source === "schedule" ? L("target") : L(CHIP[source].label);
    const big = isOff ? L("off") : isMax ? L("max") : (value as number).toLocaleString(hass.locale?.language ?? "en", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const currentText = zone.current !== undefined ? fmt(zone.current) : "–";
    const sub = isOff ? `${currentText}` : `${heating ? L("heating") : L("idle")} · ${L("now")} ${currentText}`;
    const humidity =
      this.config.show_humidity !== false && zone.humidity !== undefined ? formatHumidity(zone.humidity, hass) : undefined;

    // Boost.
    const now = Date.now();
    const left = boosting ? Math.max(0, zone.boostEndsAt! - now) : 0;
    const total = boosting && zone.boostStartedAt !== undefined ? zone.boostEndsAt! - zone.boostStartedAt : 0;
    const secs = Math.floor(left / 1000);
    const countdown = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;

    const durations = (this.config.boost_durations ?? [30, 60])
      .map((d) => Number(d))
      .filter((d) => Number.isFinite(d) && d > 0)
      .slice(0, 4);

    const style = `--zone-color: ${color}; --zone-shape: ${tint(color, 16)};`;

    return html`
      <ha-card style=${style} class=${zone.available ? "" : "unavailable"}>
        <div class="header">
          <button class="info" type="button" @click=${this.moreInfo} aria-label=${zone.name}>
            <span class="shape"><ha-icon .icon=${zoneIcon(zone, this.config.icon)}></ha-icon></span>
            <span class="titles">
              <span class="name">${this.config.name ?? zone.name}</span>
              <span class="sub">${zone.available ? subtitle : L("unavailable")}</span>
            </span>
          </button>
          ${battery?.warning
            ? html`<span class="chip warn" title=${L("battery")}>
                <ha-icon icon="mdi:battery-alert-variant-outline"></ha-icon>
                <span>${battery.lowest !== undefined ? `${Math.round(battery.lowest)}%` : L("battery_low")}</span>
              </span>`
            : nothing}
          <span class="chip" title=${L(chip.label)}>
            <ha-icon .icon=${chip.icon}></ha-icon>
            <span>${L(chip.label)}</span>
          </span>
        </div>

        <div class="dial">
          <svg
            viewBox="0 0 ${G.W} ${G.H}"
            role="img"
            aria-label=${`${centerLabel} ${fmt(value)}, ${L("now")} ${currentText}`}
            @pointerdown=${this.onPointerDown}
            @pointermove=${this.onPointerMove}
            @pointerup=${this.onPointerUp}
            @pointercancel=${this.onPointerUp}
          >
            <path class="track" d=${TRACK}></path>
            <path class="ticks" d=${TICKS}></path>
            ${svg`<path class="seg ${heating ? "active" : ""}" d=${seg}></path>`}
            ${cp ? svg`<circle class="current" cx=${cp.x} cy=${cp.y} r="6"></circle>` : nothing}
            <circle class="handle" cx=${tp.x} cy=${tp.y} r="12"></circle>
          </svg>
          <span class="end off">${L("off")}</span>
          <span class="end max">${L("max")}</span>
          <div class="center">
            <span class="label">${centerLabel}</span>
            <span class="big">${big}${isOff || isMax ? nothing : html`<span class="deg">°</span>`}</span>
            <span class="now">
              ${heating ? html`<ha-icon icon="mdi:fire"></ha-icon>` : nothing}
              <span>${sub}</span>
              ${humidity
                ? html`<span class="hum" title=${L("humidity")}>
                    <ha-icon icon="mdi:water-percent"></ha-icon>${humidity}
                  </span>`
                : nothing}
            </span>
          </div>
          ${this.config.show_stepper === false
            ? nothing
            : html`<div class="stepper">
                <button type="button" aria-label=${L("lower")} @click=${() => this.step(-1)}>
                  <ha-icon icon="mdi:minus"></ha-icon>
                </button>
                <span class="divider"></span>
                <button type="button" aria-label=${L("raise")} @click=${() => this.step(1)}>
                  <ha-icon icon="mdi:plus"></ha-icon>
                </button>
              </div>`}
        </div>

        ${this.config.show_schedule === false
          ? nothing
          : renderScheduleStrip({
              hass,
              schedule: this.scheduleCtl.schedule,
              source,
              onResume: () => void this.call("resume_schedule"),
            })}

        <div class="actions">
          ${boosting
            ? html`<button type="button" class="boosting" @click=${() => this.call("cancel_boost")} aria-label=${L("cancel_boost_aria", { zone: zone.name })}>
                <span class="fill" style=${`width: ${total > 0 ? ((left / total) * 100).toFixed(2) : 0}%`}></span>
                <ha-icon icon="mdi:fire"></ha-icon>
                <span class="label">${L("boost_to", { value: fmt(zone.value), left: countdown })}</span>
                <span class="cancel">${L("cancel")}</span>
              </button>`
            : durations.map(
                (d) => html`<button type="button" class="boost" @click=${() => this.call("boost", { duration: d })}>
                  <ha-icon icon="mdi:fire"></ha-icon>
                  <span>${L("boost_for", { min: d })}</span>
                </button>`,
              )}
        </div>
      </ha-card>
    `;
  }

  static styles = [
    scheduleStripStyles,
    css`
    :host {
      display: block;
      --luna-track: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
      --luna-soft: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
    ha-card {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      box-sizing: border-box;
      height: 100%;
      font-variant-numeric: tabular-nums;
      container-type: inline-size;
    }
    /* Narrow cards: chips drop their label and keep the icon, so the
       zone name gets the room. The label stays available as a title. */
    @container (max-width: 360px) {
      .chip {
        padding: 0 7px;
      }
      .chip span {
        display: none;
      }
    }
    ha-card.unavailable .dial,
    ha-card.unavailable .actions,
    ha-card.unavailable .schedule {
      opacity: 0.5;
      pointer-events: none;
    }
    ha-card.message {
      flex-direction: row;
      align-items: center;
      gap: 12px;
      color: var(--error-color);
    }
    button {
      font: inherit;
      color: inherit;
      -webkit-tap-highlight-color: transparent;
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    /* header */
    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 40px;
    }
    .info {
      all: unset;
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      border-radius: 20px;
    }
    .info:focus-visible {
      outline: 2px solid var(--primary-color);
    }
    .shape {
      flex: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--zone-shape);
      color: var(--zone-color);
      --mdc-icon-size: 22px;
      transition: background-color 200ms ease, color 200ms ease;
    }
    .titles {
      display: flex;
      flex-direction: column;
      min-width: 0;
      gap: 2px;
    }
    .name {
      font-size: var(--ha-font-size-m, 15px);
      font-weight: var(--ha-font-weight-bold, 600);
      line-height: 20px;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sub {
      font-size: var(--ha-font-size-s, 12.5px);
      line-height: 16px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .chip {
      flex: none;
      height: 28px;
      box-sizing: border-box;
      padding: 0 10px 0 8px;
      border-radius: 14px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: var(--luna-soft);
      color: var(--secondary-text-color);
      font-size: var(--ha-font-size-xs, 12px);
      font-weight: var(--ha-font-weight-bold, 600);
      --mdc-icon-size: 16px;
    }
    .chip ha-icon {
      color: var(--zone-color);
    }
    .chip.warn {
      background: color-mix(in srgb, ${WARNING} 14%, transparent);
      color: ${WARNING};
    }
    .chip.warn ha-icon {
      color: inherit;
    }

    /* dial */
    .dial {
      position: relative;
      container-type: inline-size;
      aspect-ratio: 366 / 232;
      width: 100%;
      /* Past this the dial only adds height; the card stays compact in a
         wide column and the arc stays a comfortable drag target. */
      max-width: 380px;
      margin: 4px auto 0;
    }
    .dial svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
      touch-action: none;
      cursor: grab;
    }
    .track {
      fill: none;
      stroke: var(--luna-track);
      stroke-width: 6;
      stroke-linecap: round;
    }
    .ticks {
      fill: none;
      stroke: color-mix(in srgb, var(--primary-text-color) 22%, transparent);
      stroke-width: 1.5;
      stroke-linecap: round;
    }
    .seg {
      fill: none;
      stroke: color-mix(in srgb, var(--primary-text-color) 30%, transparent);
      stroke-width: 6;
      stroke-linecap: round;
    }
    .seg.active {
      stroke: var(--zone-color);
    }
    .current {
      fill: var(--ha-card-background, var(--card-background-color));
      stroke: var(--primary-text-color);
      stroke-width: 2.5;
    }
    .handle {
      fill: var(--zone-color);
      stroke: var(--ha-card-background, var(--card-background-color));
      stroke-width: 4;
      transition: fill 200ms ease;
    }
    .end {
      position: absolute;
      top: 87%;
      font-size: clamp(10px, 3cqw, 11px);
      color: var(--secondary-text-color);
      pointer-events: none;
    }
    .end.off {
      left: 12.6%;
    }
    .end.max {
      right: 12%;
    }
    .center {
      position: absolute;
      left: 0;
      right: 0;
      top: 26.5%;
      display: flex;
      flex-direction: column;
      align-items: center;
      pointer-events: none;
    }
    .center .label {
      font-size: clamp(10px, 3.1cqw, 11.5px);
      line-height: 1.4;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: var(--ha-font-weight-bold, 600);
      color: var(--secondary-text-color);
    }
    .center .big {
      display: flex;
      align-items: flex-start;
      font-size: clamp(34px, 16.4cqw, 60px);
      line-height: 1.07;
      font-weight: 300;
      letter-spacing: -0.02em;
      color: var(--primary-text-color);
      margin-top: 2px;
    }
    .center .deg {
      font-size: 0.43em;
      line-height: 1.5;
      color: var(--secondary-text-color);
      margin-left: 2px;
    }
    .center .now {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: clamp(11px, 3.55cqw, 13px);
      line-height: 1.4;
      color: var(--secondary-text-color);
      --mdc-icon-size: clamp(12px, 3.8cqw, 14px);
    }
    .center .now ha-icon {
      color: var(--zone-color);
    }
    .center .hum {
      display: inline-flex;
      align-items: center;
      gap: 1px;
      margin-left: 4px;
    }
    .center .hum ha-icon {
      color: var(--secondary-text-color);
    }
    .stepper {
      position: absolute;
      left: 50%;
      top: 76.7%;
      transform: translateX(-50%);
      width: clamp(88px, 28.4cqw, 104px);
      height: clamp(36px, 12cqw, 44px);
      border-radius: 999px;
      background: var(--luna-soft);
      display: flex;
      align-items: stretch;
    }
    .stepper button {
      all: unset;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--primary-text-color);
      --mdc-icon-size: 18px;
    }
    .stepper button:first-child {
      border-radius: 999px 0 0 999px;
    }
    .stepper button:last-child {
      border-radius: 0 999px 999px 0;
    }
    .stepper button:active {
      background: var(--luna-soft);
    }
    .stepper button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }
    .stepper .divider {
      width: 1px;
      margin: 12px 0;
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    }

    .schedule {
      margin-top: 4px;
    }

    /* actions */
    .actions {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }
    .actions button {
      all: unset;
      box-sizing: border-box;
      flex: 1 1 0;
      min-width: 0;
      height: 44px;
      border-radius: 12px;
      background: var(--luna-soft);
      color: var(--primary-text-color);
      font-size: var(--ha-font-size-s, 13.5px);
      font-weight: var(--ha-font-weight-bold, 600);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      cursor: pointer;
      --mdc-icon-size: 17px;
      transition: background-color 150ms ease;
    }
    .actions button ha-icon {
      color: ${BOOST};
    }
    .actions button:active {
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    }
    .actions button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .actions .boosting {
      position: relative;
      overflow: hidden;
      justify-content: flex-start;
      padding: 0 14px;
      background: color-mix(in srgb, ${BOOST} 10%, transparent);
    }
    .actions .boosting .fill {
      position: absolute;
      inset: 0 auto 0 0;
      background: color-mix(in srgb, ${BOOST} 22%, transparent);
      transition: width 1s linear;
    }
    .actions .boosting ha-icon,
    .actions .boosting .label,
    .actions .boosting .cancel {
      position: relative;
    }
    .actions .boosting .label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .actions .boosting .cancel {
      margin-left: auto;
      padding-left: 8px;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
  `,
  ];
}
