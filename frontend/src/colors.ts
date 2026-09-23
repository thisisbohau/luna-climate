/**
 * Colour handling shared by the cards.
 *
 * Named colours map onto Home Assistant's theme variables, so the cards
 * follow whatever theme is active instead of hard-coding hex values.
 */

const THEME_COLORS = new Set([
  "primary",
  "accent",
  "red",
  "pink",
  "purple",
  "deep-purple",
  "indigo",
  "blue",
  "light-blue",
  "cyan",
  "teal",
  "green",
  "light-green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deep-orange",
  "brown",
  "light-grey",
  "grey",
  "dark-grey",
  "blue-grey",
  "black",
  "white",
  "disabled",
]);

export function resolveColor(color?: string | null): string | undefined {
  if (!color) return undefined;
  const trimmed = color.trim();
  if (!trimmed) return undefined;
  if (THEME_COLORS.has(trimmed)) return `var(--${trimmed}-color)`;
  return trimmed;
}

/** A translucent version of any CSS colour, for icon shapes and fills. */
export function tint(color: string, percent: number): string {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

/** The semantic colours used by the zone card and the boost badge. */
export const LUNA = {
  heat: "var(--luna-heat-color, var(--state-climate-heat-color, #ff8100))",
  boost: "var(--luna-boost-color, var(--deep-orange-color, #ff6f22))",
  away: "var(--luna-away-color, #8fa6c4)",
  off: "var(--luna-off-color, var(--disabled-color, #9e9e9e))",
  max: "var(--luna-max-color, var(--red-color, #f44336))",
  warning: "var(--luna-warning-color, var(--error-color, #db4437))",
};
