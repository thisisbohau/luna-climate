/**
 * Reads a Luna zone from its climate entity.
 *
 * Every card goes through this one function, so the attribute names the
 * integration exposes are spelled out in exactly one place on the frontend.
 */

import { LUNA } from "./colors";
import { localize } from "./i18n";
import type { HassEntity, HomeAssistant, TargetValue } from "./types";

export type ZoneSource = "schedule" | "manual" | "away" | "boost" | "none";

export interface ZoneView {
  entityId: string;
  zoneId: string;
  name: string;
  available: boolean;
  source: ZoneSource;
  value: TargetValue;
  current?: number;
  humidity?: number;
  heating: boolean;
  precomfort: boolean;
  boostStartedAt?: number;
  boostEndsAt?: number;
  thermostats: string[];
  linkedDevices: string[];
}

export function isLunaZone(stateObj?: HassEntity): boolean {
  return Boolean(stateObj && stateObj.attributes.luna_zone_id);
}

export function parseValue(raw: unknown): TargetValue {
  if (raw === "off" || raw === "max") return raw;
  const n = Number(raw);
  return Number.isFinite(n) ? n : "off";
}

export function readZone(stateObj: HassEntity): ZoneView {
  const a = stateObj.attributes;
  const value = parseValue(a.luna_value);
  const current =
    typeof a.current_temperature === "number" ? a.current_temperature : undefined;
  const heating =
    a.hvac_action === "heating" ||
    (a.hvac_action === undefined &&
      value !== "off" &&
      current !== undefined &&
      (value === "max" || current < value - 0.2));

  const ends = a.luna_boost_ends_at ? Date.parse(a.luna_boost_ends_at) : NaN;
  const started = a.luna_boost_started_at
    ? Date.parse(a.luna_boost_started_at)
    : NaN;

  return {
    entityId: stateObj.entity_id,
    zoneId: String(a.luna_zone_id ?? ""),
    name: String(a.luna_zone_name ?? a.friendly_name ?? stateObj.entity_id),
    available: stateObj.state !== "unavailable",
    source: (a.luna_source as ZoneSource) ?? "none",
    value,
    current,
    humidity: typeof a.current_humidity === "number" ? a.current_humidity : undefined,
    heating,
    precomfort: Boolean(a.luna_precomfort_active),
    boostEndsAt: Number.isFinite(ends) ? ends : undefined,
    boostStartedAt: Number.isFinite(started) ? started : undefined,
    thermostats: Array.isArray(a.luna_thermostats) ? a.luna_thermostats : [],
    linkedDevices: Array.isArray(a.luna_linked_devices) ? a.luna_linked_devices : [],
  };
}

export function isBoosting(zone: ZoneView, now = Date.now()): boolean {
  return zone.source === "boost" && zone.boostEndsAt !== undefined && zone.boostEndsAt > now;
}

/** The colour that explains why the zone is doing what it does. */
export function zoneColor(zone: ZoneView, value: TargetValue = zone.value, source = zone.source): string {
  if (value === "off") return LUNA.off;
  if (source === "boost") return LUNA.boost;
  if (source === "away") return LUNA.away;
  if (value === "max") return LUNA.max;
  return LUNA.heat;
}

export function zoneIcon(zone: ZoneView, override?: string): string {
  if (override) return override;
  if (!zone.thermostats.length && zone.linkedDevices.length) return "mdi:heating-coil";
  return "mdi:radiator";
}

export interface ZoneBattery {
  /** True when any battery behind the zone is low. */
  low: boolean;
  /** How many batteries were found (valves, sensors, ...). */
  count: number;
}

/**
 * The zone's battery status, as the integration reports it on the zone's
 * climate entity: every battery on the zone's devices and on the devices
 * linked to them (a Tado zone's valves and wireless sensor). Undefined
 * when the zone has no batteries at all.
 */
export function readBattery(hass: HomeAssistant, entityId: string): ZoneBattery | undefined {
  const attrs = hass.states[entityId]?.attributes;
  const count = Number(attrs?.luna_battery_count ?? 0);
  if (!count) return undefined;
  return { low: Boolean(attrs?.luna_battery_low), count };
}

export function formatTemp(value: TargetValue | undefined, hass?: HomeAssistant): string {
  if (value === undefined) return "–";
  if (value === "off" || value === "max") return localize(hass, value);
  const lang = hass?.locale?.language ?? "en";
  return `${value.toLocaleString(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}°`;
}

export function formatHumidity(value: number, hass?: HomeAssistant): string {
  const lang = hass?.locale?.language ?? "en";
  return `${Math.round(value).toLocaleString(lang)}%`;
}
