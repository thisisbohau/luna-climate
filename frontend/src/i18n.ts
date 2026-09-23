/** The handful of strings the cards render, in English and German. */

import type { HomeAssistant } from "./types";

const STRINGS = {
  en: {
    heating: "Heating",
    idle: "Idle",
    off: "Off",
    max: "Max",
    schedule: "Schedule",
    manual: "Manual",
    away: "Away",
    boost: "Boost",
    precomfort: "Precomfort",
    no_schedule: "No schedule",
    target: "Target",
    now: "now",
    until: "until",
    then: "then",
    all_day: "all day",
    tomorrow: "tomorrow",
    manual_paused: "Manual · schedule paused",
    resume: "Resume schedule",
    boost_for: "Boost {min} min",
    boost_to: "Boost to {value} · {left} left",
    cancel: "Cancel",
    lower: "Lower target temperature",
    raise: "Raise target temperature",
    battery: "Battery",
    battery_low: "Low",
    thermostats: "{n} thermostats",
    thermostat: "1 thermostat",
    min: "min",
    boost_badge_aria: "Boost {zone} for {min} minutes",
    cancel_boost_aria: "Cancel boost in {zone}",
    unavailable: "Unavailable",
    not_luna: "{entity} is not a Luna Climate zone",
    humidity: "Humidity",
    mode: "Mode",
    temperature: "Temperature",
  },
  de: {
    heating: "Heizt",
    idle: "Bereit",
    off: "Aus",
    max: "Max",
    schedule: "Zeitplan",
    manual: "Manuell",
    away: "Abwesend",
    boost: "Boost",
    precomfort: "Vorheizen",
    no_schedule: "Kein Zeitplan",
    target: "Ziel",
    now: "aktuell",
    until: "bis",
    then: "danach",
    all_day: "ganztägig",
    tomorrow: "morgen",
    manual_paused: "Manuell · Zeitplan pausiert",
    resume: "Zeitplan fortsetzen",
    boost_for: "Boost {min} min",
    boost_to: "Boost auf {value} · noch {left}",
    cancel: "Abbrechen",
    lower: "Zieltemperatur senken",
    raise: "Zieltemperatur erhöhen",
    battery: "Batterie",
    battery_low: "Schwach",
    thermostats: "{n} Thermostate",
    thermostat: "1 Thermostat",
    min: "min",
    boost_badge_aria: "{zone} für {min} Minuten boosten",
    cancel_boost_aria: "Boost in {zone} abbrechen",
    unavailable: "Nicht verfügbar",
    not_luna: "{entity} ist keine Luna-Climate-Zone",
    humidity: "Luftfeuchte",
    mode: "Modus",
    temperature: "Temperatur",
  },
};

export type StringKey = keyof (typeof STRINGS)["en"];

export function localize(
  hass: HomeAssistant | undefined,
  key: StringKey,
  vars: Record<string, string | number> = {},
): string {
  const lang = (hass?.locale?.language ?? hass?.language ?? "en").slice(0, 2);
  const table = lang === "de" ? STRINGS.de : STRINGS.en;
  let text: string = table[key] ?? STRINGS.en[key];
  for (const [name, value] of Object.entries(vars)) {
    text = text.replace(`{${name}}`, String(value));
  }
  return text;
}
