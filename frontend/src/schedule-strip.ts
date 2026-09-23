/**
 * The schedule strip shared by the full and the compact zone card: the
 * caption ("21.5° until 22:30 · then 18.0°") over a 24-hour bar of today's
 * blocks with a marker for now.
 *
 * `ScheduleController` fetches the zone's schedule over the integration's
 * websocket and refetches when the active block changes or ten minutes
 * pass, so a host card only has to render.
 */

import { css, html, type ReactiveController, type ReactiveControllerHost } from "lit";
import { LUNA, tint } from "./colors";
import { localize, type StringKey } from "./i18n";
import { dayView, formatClock, zonedNow, type DayView } from "./schedule";
import type { HomeAssistant, ScheduleBlock, TargetValue } from "./types";
import { formatTemp, type ZoneSource, type ZoneView } from "./zone";

export class ScheduleController implements ReactiveController {
  schedule?: ScheduleBlock[];
  private key?: string;

  constructor(
    private readonly host: ReactiveControllerHost,
    private readonly source: () => { hass?: HomeAssistant; zone?: ZoneView; enabled: boolean },
  ) {
    host.addController(this);
  }

  hostConnected(): void {
    this.key = undefined;
  }

  hostUpdated(): void {
    const { hass, zone, enabled } = this.source();
    if (!hass || !zone || !enabled) return;
    const block = hass.states[zone.entityId]?.attributes.luna_block_start ?? "";
    const key = `${zone.zoneId}|${block}|${Math.floor(Date.now() / 600000)}`;
    if (key === this.key) return;
    this.key = key;
    void this.fetch(hass, zone.zoneId);
  }

  private async fetch(hass: HomeAssistant, zoneId: string): Promise<void> {
    try {
      const res = await hass.callWS<{ schedule: ScheduleBlock[] }>({
        type: "luna_climate/schedule/get",
        zone_id: zoneId,
      });
      this.schedule = res.schedule;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("luna card: could not load schedule", err);
      this.schedule = [];
    }
    this.host.requestUpdate();
  }
}

export interface StripOptions {
  hass: HomeAssistant;
  schedule?: ScheduleBlock[];
  source: ZoneSource;
  onResume: () => void;
}

export function renderScheduleStrip({ hass, schedule, source, onResume }: StripOptions) {
  const L = (key: StringKey, vars?: Record<string, string | number>) => localize(hass, key, vars);
  const fmt = (v: TargetValue | undefined) => formatTemp(v, hass);
  const now = zonedNow(hass.config.time_zone);
  const view: DayView = schedule ? dayView(schedule, now) : { segments: [] };

  let until = "";
  if (view.nextAt !== undefined) {
    const clock = formatClock(view.nextAt);
    if (view.nextDayOffset === 0) until = `${L("until")} ${clock}`;
    else if (view.nextDayOffset === 1) until = `${L("until")} ${L("tomorrow")} ${clock}`;
    else {
      const day = new Date(Date.now() + view.nextDayOffset! * 86400000).toLocaleDateString(
        hass.locale?.language ?? "en",
        { weekday: "short" },
      );
      until = `${L("until")} ${day} ${clock}`;
    }
  } else if (view.current !== undefined) {
    until = L("all_day");
  }

  let left: string;
  if (source === "manual") left = L("manual_paused");
  else if (view.current === undefined) left = schedule ? L("no_schedule") : "";
  else left = `${source === "schedule" ? "" : `${L("schedule")} `}${fmt(view.current)} ${until}`.trim();

  const right = view.nextValue !== undefined ? `${L("then")} ${fmt(view.nextValue)}` : "";

  return html`
    <div class="schedule">
      <div class="caption">
        <span class="left">${left}</span>
        ${source === "manual"
          ? html`<button type="button" class="link" @click=${onResume}>${L("resume")}</button>`
          : html`<span class="right">${right}</span>`}
      </div>
      <div class="strip" aria-hidden="true">
        ${view.segments.map((s) => {
          const bg =
            s.value === "off"
              ? "color-mix(in srgb, var(--primary-text-color) 16%, transparent)"
              : s.value === "max"
                ? LUNA.max
                : tint(LUNA.heat, Math.round(Math.min(100, 35 + ((s.value - 17) / 8) * 65)));
          const l = (s.start / 1440) * 100;
          const w = ((s.end - s.start) / 1440) * 100;
          return html`<span
            class="block ${s.current ? "current" : ""}"
            style=${`left: calc(${l}% + 1px); width: calc(${w}% - 2px); background: ${bg};`}
          ></span>`;
        })}
        ${Array.from(
          { length: 25 },
          (_, h) => html`<span class="tick ${h % 6 === 0 ? "major" : ""}" style=${`left: ${(h / 24) * 100}%`}></span>`,
        )}
        ${[0, 6, 12, 18, 24].map(
          (h) =>
            html`<span class="hour ${h === 0 ? "first" : h === 24 ? "last" : ""}" style=${`left: ${(h / 24) * 100}%`}
              >${String(h).padStart(2, "0")}</span
            >`,
        )}
        <span class="now-marker" style=${`left: ${(now.minutes / 1440) * 100}%`}></span>
      </div>
    </div>
  `;
}

/** Styles for the strip. The host sets `--zone-color`. */
export const scheduleStripStyles = css`
  .caption {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 20px;
    font-size: var(--ha-font-size-s, 13px);
  }
  .caption .left {
    font-weight: 500;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .caption .right {
    color: var(--secondary-text-color);
    white-space: nowrap;
  }
  .caption .link {
    all: unset;
    cursor: pointer;
    font-weight: 600;
    color: var(--zone-color);
    white-space: nowrap;
    padding: 4px 0;
  }
  .caption .link:focus-visible {
    outline: 2px solid var(--primary-color);
  }
  .strip {
    position: relative;
    height: 42px;
    margin-top: 6px;
  }
  .block {
    position: absolute;
    top: 8px;
    height: 6px;
    border-radius: 3px;
    opacity: 0.5;
  }
  .block.current {
    opacity: 1;
  }
  .tick {
    position: absolute;
    top: 20px;
    width: 1px;
    height: 4px;
    background: color-mix(in srgb, var(--primary-text-color) 22%, transparent);
  }
  .tick.major {
    height: 7px;
  }
  .hour {
    position: absolute;
    top: 29px;
    transform: translateX(-50%);
    font-size: 10.5px;
    line-height: 13px;
    color: var(--secondary-text-color);
  }
  .hour.first {
    transform: none;
  }
  .hour.last {
    transform: translateX(-100%);
  }
  .now-marker {
    position: absolute;
    top: 0;
    width: 2px;
    height: 17px;
    margin-left: -1px;
    border-radius: 1px;
    background: var(--primary-text-color);
  }
  .now-marker::before {
    content: "";
    position: absolute;
    top: -1px;
    left: -4px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid var(--zone-color);
  }
`;
