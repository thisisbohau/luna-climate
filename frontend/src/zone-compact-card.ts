/**
 * `custom:luna-zone-compact-card` — a Luna zone without the dial.
 *
 * Three stats (mode, temperature, humidity) over the schedule strip. Meant
 * for overview dashboards where the full card would be too tall; the
 * header opens the zone's details for anything more.
 *
 *   type: custom:luna-zone-compact-card
 *   entity: climate.luna_wohnzimmer
 *   show_humidity: true     # optional
 */

import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { fireEvent } from "./actions";
import { tint } from "./colors";
import { localize, type StringKey } from "./i18n";
import { ScheduleController, renderScheduleStrip, scheduleStripStyles } from "./schedule-strip";
import type { HomeAssistant, LovelaceCardConfig } from "./types";
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

export interface ZoneCompactCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
  icon?: string;
  show_humidity?: boolean;
}

const MODE: Record<ZoneSource, { icon: string; label: StringKey }> = {
  schedule: { icon: "mdi:calendar-clock", label: "schedule" },
  manual: { icon: "mdi:hand-back-right-outline", label: "manual" },
  away: { icon: "mdi:home-export-outline", label: "away" },
  boost: { icon: "mdi:fire", label: "boost" },
  none: { icon: "mdi:calendar-remove-outline", label: "no_schedule" },
};

export class LunaZoneCompactCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private config?: ZoneCompactCardConfig;

  private tickTimer?: number;
  private tickEvery = 0;

  private readonly scheduleCtl = new ScheduleController(this, () => ({
    hass: this.hass,
    zone: this.zone,
    enabled: true,
  }));

  setConfig(config: ZoneCompactCardConfig): void {
    if (!config?.entity) throw new Error("Set the entity of a Luna Climate zone");
    this.config = { show_humidity: true, ...config };
  }

  static getStubConfig(hass: HomeAssistant): ZoneCompactCardConfig {
    const entity =
      Object.keys(hass.states).find((id) => isLunaZone(hass.states[id])) ?? "climate.luna_zone";
    return { type: "custom:luna-zone-compact-card", entity };
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
        { name: "show_humidity", selector: { boolean: {} } },
      ],
      computeLabel: (s: { name: string }) =>
        ({ entity: "Luna zone", name: "Name", icon: "Icon", show_humidity: "Show humidity" })[s.name] ?? s.name,
    };
  }

  getCardSize(): number {
    return 3;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearInterval(this.tickTimer);
    this.tickTimer = undefined;
    this.tickEvery = 0;
  }

  private get zone(): ZoneView | undefined {
    const stateObj = this.config && this.hass?.states[this.config.entity];
    return stateObj && isLunaZone(stateObj) ? readZone(stateObj) : undefined;
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    const zone = this.zone;
    if (!zone) return;
    // Boost minutes need a refresh; otherwise twice a minute moves the
    // "now" marker along the strip.
    const every = isBoosting(zone) ? 10000 : 30000;
    if (every !== this.tickEvery) {
      window.clearInterval(this.tickTimer);
      this.tickEvery = every;
      this.tickTimer = window.setInterval(() => this.requestUpdate(), every);
    }
  }

  private moreInfo(): void {
    if (this.config) fireEvent(this, "hass-more-info", { entityId: this.config.entity });
  }

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
    const color = zoneColor(zone);
    const boosting = isBoosting(zone);
    const mode = zone.precomfort && zone.source === "schedule"
      ? { icon: "mdi:map-marker-radius-outline", label: "precomfort" as StringKey }
      : MODE[zone.source] ?? MODE.none;

    let modeValue = L(mode.label);
    if (boosting) {
      const left = Math.max(0, zone.boostEndsAt! - Date.now());
      modeValue = `${L("boost")} · ${Math.ceil(left / 60000)} ${L("min")}`;
    } else if (zone.value === "off" && zone.source !== "manual") {
      modeValue = `${L(mode.label)} · ${L("off")}`;
    }

    const target = zone.value === "off" ? L("off") : formatTemp(zone.value, hass);
    const temp = zone.current !== undefined ? formatTemp(zone.current, hass) : "–";
    const showHumidity = this.config.show_humidity !== false && zone.humidity !== undefined;
    const battery = readBattery(hass, zone.entityId);

    const style = `--zone-color: ${color}; --zone-shape: ${tint(color, 16)};`;

    return html`
      <ha-card style=${style} class=${zone.available ? "" : "unavailable"}>
        <button class="header" type="button" @click=${this.moreInfo} aria-label=${zone.name}>
          <span class="shape"><ha-icon .icon=${zoneIcon(zone, this.config.icon)}></ha-icon></span>
          <span class="name">${this.config.name ?? zone.name}</span>
          ${battery?.warning
            ? html`<span class="battery" title=${L("battery")}>
                <ha-icon icon="mdi:battery-alert-variant-outline"></ha-icon>
                ${battery.lowest !== undefined ? `${Math.round(battery.lowest)}%` : L("battery_low")}
              </span>`
            : nothing}
        </button>

        <div class="stats ${showHumidity ? "three" : "two"}">
          <div class="stat mode">
            <span class="label">${L("mode")}</span>
            <span class="value">
              <ha-icon .icon=${mode.icon}></ha-icon>
              <span class="text">${zone.available ? modeValue : L("unavailable")}</span>
            </span>
          </div>
          <div class="stat">
            <span class="label">${L("temperature")}</span>
            <span class="value">
              ${zone.heating ? html`<ha-icon class="flame" icon="mdi:fire"></ha-icon>` : nothing}
              <span class="text">${temp}</span>
              <span class="target" title=${L("target")}>→ ${target}</span>
            </span>
          </div>
          ${showHumidity
            ? html`<div class="stat">
                <span class="label">${L("humidity")}</span>
                <span class="value">
                  <ha-icon class="water" icon="mdi:water-percent"></ha-icon>
                  <span class="text">${formatHumidity(zone.humidity!, hass)}</span>
                </span>
              </div>`
            : nothing}
        </div>

        ${renderScheduleStrip({
          hass,
          schedule: this.scheduleCtl.schedule,
          source: zone.source,
          onResume: () => void hass.callService("luna_climate", "resume_schedule", { entity_id: zone.entityId }),
        })}
      </ha-card>
    `;
  }

  static styles = [
    scheduleStripStyles,
    css`
      :host {
        display: block;
      }
      ha-card {
        padding: 12px 16px 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        box-sizing: border-box;
        height: 100%;
        font-variant-numeric: tabular-nums;
        container-type: inline-size;
      }
      ha-card.message {
        flex-direction: row;
        align-items: center;
        gap: 12px;
        color: var(--error-color);
      }
      ha-card.unavailable .stats,
      ha-card.unavailable .schedule {
        opacity: 0.5;
      }
      .header {
        all: unset;
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
        cursor: pointer;
        border-radius: 18px;
      }
      .header:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
      .shape {
        flex: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--zone-shape);
        color: var(--zone-color);
        --mdc-icon-size: 20px;
      }
      .name {
        flex: 1;
        min-width: 0;
        font-size: var(--ha-font-size-m, 15px);
        font-weight: var(--ha-font-weight-bold, 600);
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .battery {
        flex: none;
        display: inline-flex;
        align-items: center;
        gap: 3px;
        height: 26px;
        padding: 0 9px 0 7px;
        border-radius: 13px;
        font-size: 12px;
        font-weight: 600;
        color: var(--luna-warning-color, var(--error-color, #db4437));
        background: color-mix(in srgb, var(--luna-warning-color, var(--error-color, #db4437)) 14%, transparent);
        --mdc-icon-size: 15px;
      }

      .stats {
        display: grid;
        gap: 8px;
      }
      .stats.three {
        grid-template-columns: minmax(0, 1.35fr) minmax(0, 1.2fr) minmax(0, 1fr);
      }
      .stats.two {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      }
      .stat {
        display: flex;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
        padding: 8px 10px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      }
      .label {
        font-size: var(--ha-font-size-xs, 11px);
        line-height: 14px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .value {
        display: flex;
        align-items: center;
        gap: 4px;
        min-width: 0;
        font-size: var(--ha-font-size-m, 15px);
        line-height: 20px;
        font-weight: var(--ha-font-weight-bold, 600);
        color: var(--primary-text-color);
        --mdc-icon-size: 16px;
      }
      .value .text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      }
      .mode ha-icon,
      .value .flame {
        flex: none;
        color: var(--zone-color);
      }
      .value .water {
        flex: none;
        color: var(--luna-humidity-color, var(--blue-color, #2196f3));
      }
      .value .target {
        flex: none;
        font-size: 12px;
        font-weight: 500;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      /* Narrow: tighter tiles, and the target moves out of the way. */
      @container (max-width: 380px) {
        .stat {
          padding: 7px 8px;
        }
        .value {
          font-size: 14px;
        }
        .value .target {
          display: none;
        }
        .mode ha-icon {
          display: none;
        }
      }
    `,
  ];
}
