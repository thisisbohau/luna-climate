/**
 * `custom:luna-boost-badge` — the badge preset for a Luna zone.
 *
 * One tap boosts the zone; another tap cancels. A ring around the icon
 * counts the boost down, and a dot flags a low battery in the zone.
 *
 *   type: custom:luna-boost-badge
 *   entity: climate.luna_bad
 *   duration: 30            # minutes, default 30
 *   hold_action:            # default: open the zone's more-info dialog
 *     action: more-info
 */

import type { Gesture } from "./actions";
import { haptic } from "./actions";
import { LUNA } from "./colors";
import { localize } from "./i18n";
import { LunaPillBase, type PillViewModel } from "./pill";
import type { ActionConfig, HomeAssistant, LovelaceCardConfig } from "./types";
import { formatHumidity, formatTemp, isBoosting, isLunaZone, readBattery, readZone, zoneColor, zoneIcon } from "./zone";

export interface BoostBadgeConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
  icon?: string;
  duration?: number;
  show_humidity?: boolean;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

export class LunaBoostBadge extends LunaPillBase<BoostBadgeConfig> {
  setConfig(config: BoostBadgeConfig): void {
    if (!config?.entity) throw new Error("Set the entity of a Luna Climate zone");
    this.config = { duration: 30, show_humidity: true, ...config };
  }

  static getStubConfig(hass: HomeAssistant): BoostBadgeConfig {
    const entity =
      Object.keys(hass.states).find((id) => isLunaZone(hass.states[id])) ?? "climate.luna_zone";
    return { type: "custom:luna-boost-badge", entity };
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
            { name: "duration", selector: { number: { min: 5, max: 240, step: 5, unit_of_measurement: "min", mode: "box" } } },
          ],
        },
        { name: "show_humidity", selector: { boolean: {} } },
        { name: "hold_action", selector: { ui_action: { default_action: "more-info" } } },
      ],
      computeLabel: (s: { name: string }) =>
        ({
          entity: "Luna zone",
          name: "Name",
          duration: "Boost duration",
          show_humidity: "Show humidity",
          hold_action: "Hold",
        })[s.name] ?? s.name,
    };
  }

  protected tickEvery(): number {
    const stateObj = this.config && this.hass?.states[this.config.entity];
    // Minutes on the label, but the ring moves smoothly enough at 5 s.
    return stateObj && isLunaZone(stateObj) && isBoosting(readZone(stateObj)) ? 5000 : 0;
  }

  protected actionFor(gesture: Gesture): ActionConfig | undefined {
    const c = this.config;
    if (!c) return undefined;
    if (gesture === "tap") return c.tap_action; // undefined = built-in boost toggle
    if (gesture === "hold") return c.hold_action ?? { action: "more-info" };
    return c.double_tap_action;
  }

  protected async onGesture(gesture: Gesture): Promise<void> {
    if (gesture !== "tap" || this.config?.tap_action || !this.hass || !this.config) {
      return super.onGesture(gesture);
    }
    const stateObj = this.hass.states[this.config.entity];
    if (!stateObj || !isLunaZone(stateObj)) return;
    const zone = readZone(stateObj);
    haptic(isBoosting(zone) ? "light" : "success");
    if (isBoosting(zone)) {
      await this.hass.callService("luna_climate", "cancel_boost", { entity_id: zone.entityId });
    } else {
      await this.hass.callService("luna_climate", "boost", {
        entity_id: zone.entityId,
        duration: this.config.duration ?? 30,
      });
    }
  }

  protected viewModel(): PillViewModel | undefined {
    const c = this.config!;
    const hass = this.hass!;
    const stateObj = hass.states[c.entity];

    if (!stateObj) {
      return {
        icon: "mdi:alert-circle-outline",
        name: c.entity,
        content: localize(hass, "unavailable"),
        color: LUNA.warning,
        ariaLabel: c.entity,
      };
    }
    if (!isLunaZone(stateObj)) {
      return {
        icon: "mdi:alert-circle-outline",
        name: c.name ?? c.entity,
        content: localize(hass, "not_luna", { entity: "" }).trim(),
        color: LUNA.warning,
        ariaLabel: localize(hass, "not_luna", { entity: c.entity }),
      };
    }

    const zone = readZone(stateObj);
    const name = c.name ?? zone.name;
    const minutes = c.duration ?? 30;
    const battery = readBattery(hass, zone.entityId);
    const now = Date.now();

    if (!zone.available) {
      return {
        icon: zoneIcon(zone, c.icon),
        name,
        content: localize(hass, "unavailable"),
        color: LUNA.off,
        ariaLabel: `${name}, ${localize(hass, "unavailable")}`,
      };
    }

    if (isBoosting(zone, now)) {
      const left = Math.max(0, zone.boostEndsAt! - now);
      const total =
        zone.boostStartedAt !== undefined ? zone.boostEndsAt! - zone.boostStartedAt : minutes * 60000;
      return {
        icon: "mdi:fire",
        name,
        content: `${localize(hass, "boost")} · ${Math.ceil(left / 60000)} ${localize(hass, "min")}`,
        color: LUNA.boost,
        progress: total > 0 ? left / total : 0,
        indicator: battery?.warning,
        ariaLabel: localize(hass, "cancel_boost_aria", { zone: name }),
      };
    }

    const current = zone.current !== undefined ? formatTemp(zone.current, hass) : "–";
    const humidity =
      c.show_humidity !== false && zone.humidity !== undefined ? formatHumidity(zone.humidity, hass) : undefined;
    let icon = zoneIcon(zone, c.icon);
    let content = humidity ? `${current} · ${humidity}` : current;
    if (zone.source === "away") {
      icon = "mdi:home-export-outline";
      content = `${localize(hass, "away")} · ${formatTemp(zone.value, hass)}`;
    } else if (zone.value === "off") {
      icon = "mdi:power";
      content = `${localize(hass, "off")} · ${current}`;
    }

    return {
      icon,
      name,
      content,
      color: zoneColor(zone),
      indicator: battery?.warning,
      ariaLabel: localize(hass, "boost_badge_aria", { zone: name, min: minutes }),
    };
  }
}
