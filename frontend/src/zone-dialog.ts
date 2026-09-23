/**
 * `luna-zone-dialog` — the zone's detail view.
 *
 * Opened by tapping a Luna card, or by the "Schedule & details" button on
 * the zone's device page. It lives directly under `document.body`, outside
 * any dashboard, so the device page can open it too. It follows Home
 * Assistant's live state by reading the `home-assistant` root element,
 * which is always there, rather than depending on whichever card opened it.
 *
 * Two tabs:
 * - Overview: the zone's numbers, quick actions, home/away, every device
 *   with its state, batteries and the zone's settings. Rows open Home
 *   Assistant's own dialog for that entity.
 * - Schedule: the week editor.
 */

import { LitElement, css, html, nothing, unsafeCSS as unsafe } from "lit";
import { state } from "lit/decorators.js";
import { LUNA, tint } from "./colors";
import { localize, type StringKey } from "./i18n";
import type { LunaScheduleEditor } from "./schedule-editor";
import type { HassEntity, HomeAssistant, ScheduleBlock } from "./types";
import {
  formatHumidity,
  formatTemp,
  isBoosting,
  isLunaZone,
  readZone,
  zoneColor,
  zoneIcon,
  type ZoneSource,
} from "./zone";

export type DialogTab = "overview" | "schedule";

interface RootElement extends HTMLElement {
  hass?: HomeAssistant;
}

const SETTINGS: Array<{ key: string; label: StringKey }> = [
  { key: "zone_mode", label: "mode" },
  { key: "away_temp", label: "away_temp" },
  { key: "boost_offset", label: "boost_offset" },
  { key: "hysteresis", label: "hysteresis" },
  { key: "min_cycle", label: "min_cycle" },
  { key: "night_mode", label: "night_mode" },
  { key: "night_temp", label: "night_temp" },
];

const SOURCE_LABEL: Record<ZoneSource, StringKey> = {
  schedule: "schedule",
  manual: "manual",
  away: "away",
  boost: "boost",
  none: "no_schedule",
};

function root(): RootElement | null {
  return document.querySelector("home-assistant") as RootElement | null;
}

export class LunaZoneDialog extends LitElement {
  @state() hass?: HomeAssistant;
  @state() private entityId?: string;
  @state() private tab: DialogTab = "overview";
  @state() private schedule?: ScheduleBlock[];
  @state() private saving = false;
  @state() private error?: string;
  @state() private confirmClose = false;
  @state() private toast?: string;

  private hassTimer?: number;
  private tickTimer?: number;
  private toastTimer?: number;
  private restoreFocus?: Element | null;
  private bodyOverflow = "";

  open(entityId: string, tab: DialogTab = "overview", hass?: HomeAssistant): void {
    this.restoreFocus = document.activeElement;
    this.entityId = entityId;
    this.tab = tab;
    this.error = undefined;
    this.confirmClose = false;
    this.schedule = undefined;
    this.hass = hass ?? root()?.hass ?? this.hass;
    if (!this.isConnected) document.body.appendChild(this);
    this.bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.clearInterval(this.hassTimer);
    this.hassTimer = window.setInterval(() => {
      const live = root()?.hass;
      if (live && live !== this.hass) this.hass = live;
    }, 1000);
    window.clearInterval(this.tickTimer);
    this.tickTimer = window.setInterval(() => this.requestUpdate(), 1000);
    void this.loadSchedule();
    void this.updateComplete.then(() => (this.renderRoot.querySelector(".dialog") as HTMLElement | null)?.focus());
  }

  close(force = false): void {
    const editor = this.editor;
    if (!force && editor?.dirty) {
      this.tab = "schedule";
      this.confirmClose = true;
      return;
    }
    window.clearInterval(this.hassTimer);
    window.clearInterval(this.tickTimer);
    window.clearTimeout(this.toastTimer);
    document.body.style.overflow = this.bodyOverflow;
    this.confirmClose = false;
    this.remove();
    (this.restoreFocus as HTMLElement | null)?.focus?.();
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this.onKey);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.onKey);
  }

  private readonly onKey = (ev: KeyboardEvent): void => {
    if (ev.key === "Escape") {
      ev.preventDefault();
      if (this.confirmClose) this.confirmClose = false;
      else this.close();
    }
  };

  private get editor(): LunaScheduleEditor | null {
    return this.renderRoot?.querySelector("luna-schedule-editor") as LunaScheduleEditor | null;
  }

  private get stateObj(): HassEntity | undefined {
    return this.entityId ? this.hass?.states[this.entityId] : undefined;
  }

  private L(key: StringKey, vars?: Record<string, string | number>) {
    return localize(this.hass, key, vars);
  }

  private async loadSchedule(): Promise<void> {
    const stateObj = this.stateObj;
    if (!this.hass || !stateObj || !isLunaZone(stateObj)) return;
    try {
      const res = await this.hass.callWS<{ schedule: ScheduleBlock[] }>({
        type: "luna_climate/schedule/get",
        zone_id: stateObj.attributes.luna_zone_id,
      });
      this.schedule = res.schedule;
    } catch (err) {
      this.error = String((err as { message?: string })?.message ?? err);
    }
  }

  private async onSave(ev: CustomEvent<{ schedule: ScheduleBlock[] }>): Promise<void> {
    const stateObj = this.stateObj;
    if (!this.hass || !stateObj) return;
    this.saving = true;
    this.error = undefined;
    try {
      const res = await this.hass.callWS<{ schedule: ScheduleBlock[] }>({
        type: "luna_climate/schedule/set",
        zone_id: stateObj.attributes.luna_zone_id,
        schedule: ev.detail.schedule,
      });
      this.schedule = res.schedule;
      this.showToast(this.L("saved"));
    } catch (err) {
      this.error = String((err as { message?: string })?.message ?? err);
    } finally {
      this.saving = false;
    }
  }

  private showToast(text: string): void {
    this.toast = text;
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => (this.toast = undefined), 2500);
  }

  private moreInfo(entityId: string): void {
    if (this.editor?.dirty) {
      this.tab = "schedule";
      this.confirmClose = true;
      return;
    }
    this.close(true);
    const target = root() ?? document.body;
    target.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));
  }

  private async service(service: string, data: Record<string, unknown> = {}): Promise<void> {
    if (!this.hass || !this.entityId) return;
    await this.hass.callService("luna_climate", service, { entity_id: this.entityId, ...data });
  }

  private settingEntity(key: string): string | undefined {
    const entities = this.hass?.entities;
    const deviceId = this.entityId ? entities?.[this.entityId]?.device_id : undefined;
    if (!entities || !deviceId) return undefined;
    return Object.values(entities).find((e) => e.device_id === deviceId && e.translation_key === key)?.entity_id;
  }

  private homeEntity(): HassEntity | undefined {
    const entities = this.hass?.entities;
    if (!entities) return undefined;
    const id = Object.values(entities).find((e) => e.platform === "luna_climate" && e.translation_key === "home")?.entity_id;
    return id ? this.hass!.states[id] : undefined;
  }

  private batteryState(): HassEntity | undefined {
    const id = this.settingEntity("battery_min");
    return id ? this.hass!.states[id] : undefined;
  }

  // -- rendering -----------------------------------------------------------

  protected render() {
    const hass = this.hass;
    const stateObj = this.stateObj;
    if (!hass || !this.entityId) return nothing;

    const valid = stateObj && isLunaZone(stateObj);
    const zone = valid ? readZone(stateObj) : undefined;
    const color = zone ? zoneColor(zone) : LUNA.off;
    const style = `--zone-color: ${color}; --zone-shape: ${tint(color, 16)};`;

    return html`
      <div class="backdrop" @click=${() => this.close()}></div>
      <div class="dialog" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="title" style=${style}>
        <header>
          <span class="shape"><ha-icon .icon=${zone ? zoneIcon(zone) : "mdi:alert-circle-outline"}></ha-icon></span>
          <div class="titles">
            <h2 id="title">${zone?.name ?? this.entityId}</h2>
            ${zone ? html`<span class="sub">${this.L(SOURCE_LABEL[zone.source] ?? "schedule")} · ${formatTemp(zone.value, hass)}</span>` : nothing}
          </div>
          <button type="button" class="close" aria-label=${this.L("close")} @click=${() => this.close()}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </header>

        <nav class="tabs" role="tablist">
          ${(["overview", "schedule"] as DialogTab[]).map(
            (t) => html`<button
              type="button"
              role="tab"
              class=${this.tab === t ? "active" : ""}
              aria-selected=${this.tab === t ? "true" : "false"}
              @click=${() => (this.tab = t)}
            >
              ${this.L(t === "overview" ? "overview" : "schedule")}
            </button>`,
          )}
        </nav>

        <div class="content">
          ${!zone
            ? html`<p class="error">${this.L("not_luna", { entity: this.entityId })}</p>`
            : this.tab === "overview"
              ? this.renderOverview(zone)
              : nothing}
          <luna-schedule-editor
            class=${zone && this.tab === "schedule" ? "" : "hidden"}
            .hass=${hass}
            .schedule=${this.schedule}
            .busy=${this.saving}
            .error=${this.error}
            @schedule-save=${this.onSave}
          ></luna-schedule-editor>
        </div>

        ${this.confirmClose
          ? html`<div class="confirm" role="alertdialog" aria-live="assertive">
              <span>${this.L("unsaved")}</span>
              <div>
                <button type="button" class="ghost" @click=${() => (this.confirmClose = false)}>${this.L("keep_editing")}</button>
                <button type="button" class="danger" @click=${() => this.close(true)}>${this.L("discard_close")}</button>
              </div>
            </div>`
          : nothing}
        ${this.toast ? html`<div class="toast" role="status">${this.toast}</div>` : nothing}
      </div>
    `;
  }

  private renderOverview(zone: ReturnType<typeof readZone>) {
    const hass = this.hass!;
    const L = this.L.bind(this);
    const boosting = isBoosting(zone);
    const left = boosting ? Math.max(0, zone.boostEndsAt! - Date.now()) : 0;
    const secs = Math.floor(left / 1000);
    const home = this.homeEntity();
    const battery = this.batteryState();
    const levels = (battery?.attributes.luna_batteries ?? []) as Array<{ entity_id: string; device: string; level: number }>;
    const flags = (battery?.attributes.luna_battery_flags ?? []) as Array<{ entity_id: string; device: string; low: boolean }>;

    const stat = (label: StringKey, value: string, icon?: string) =>
      html`<div class="stat">
        <span class="label">${L(label)}</span>
        <span class="value">${icon ? html`<ha-icon .icon=${icon}></ha-icon>` : nothing}${value}</span>
      </div>`;

    return html`
      <section class="stats">
        ${stat("current", zone.current !== undefined ? formatTemp(zone.current, hass) : "–", zone.heating ? "mdi:fire" : undefined)}
        ${stat("target", formatTemp(zone.value, hass))}
        ${zone.humidity !== undefined ? stat("humidity", formatHumidity(zone.humidity, hass), "mdi:water-percent") : nothing}
        ${stat("mode", L(SOURCE_LABEL[zone.source] ?? "schedule"))}
      </section>

      <section class="actions">
        ${boosting
          ? html`<button type="button" class="action boosting" @click=${() => this.service("cancel_boost")}>
              <ha-icon icon="mdi:fire"></ha-icon>${L("boost")} · ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}
              <span class="muted">${L("cancel")}</span>
            </button>`
          : [30, 60].map(
              (d) => html`<button type="button" class="action" @click=${() => this.service("boost", { duration: d })}>
                <ha-icon icon="mdi:fire"></ha-icon>${L("boost_for", { min: d })}
              </button>`,
            )}
        ${zone.source === "manual"
          ? html`<button type="button" class="action" @click=${() => this.service("resume_schedule")}>
              <ha-icon icon="mdi:calendar-clock"></ha-icon>${L("resume")}
            </button>`
          : nothing}
      </section>

      <section class="group">
        <h3>${L("home")}</h3>
        <div class="list">
          ${home
            ? html`<button type="button" class="row" @click=${() => this.moreInfo(home.entity_id)}>
                <ha-icon .icon=${home.state === "on" ? "mdi:home-account" : "mdi:home-export-outline"}></ha-icon>
                <span class="name">${home.state === "on" ? L("home") : L("everyone_away")}</span>
                <span class="state">${this.stateObj?.attributes.luna_away_enabled === false ? L("not_following_away") : L("follows_away")}</span>
              </button>`
            : html`<div class="row static"><span class="name">${L("none")}</span></div>`}
        </div>
      </section>

      ${this.renderDevices(L("thermostats_title"), zone.thermostats)}
      ${this.renderDevices(L("sensors_title"), (this.stateObj?.attributes.luna_temp_sensors as string[]) ?? [])}
      ${this.renderDevices(L("linked_title"), zone.linkedDevices)}

      ${levels.length || flags.length
        ? html`<section class="group">
            <h3>${L("batteries")}</h3>
            <div class="list">
              ${levels.map(
                (b) => html`<button type="button" class="row" @click=${() => this.moreInfo(b.entity_id)}>
                  <ha-icon .icon=${b.level < 5 ? "mdi:battery-alert-variant-outline" : "mdi:battery"}></ha-icon>
                  <span class="name">${b.device}</span>
                  <span class="state ${b.level < 5 ? "warn" : ""}">${Math.round(b.level)}%</span>
                </button>`,
              )}
              ${flags.map(
                (b) => html`<button type="button" class="row" @click=${() => this.moreInfo(b.entity_id)}>
                  <ha-icon .icon=${b.low ? "mdi:battery-alert-variant-outline" : "mdi:battery"}></ha-icon>
                  <span class="name">${b.device}</span>
                  <span class="state ${b.low ? "warn" : ""}">${b.low ? L("battery_low") : "OK"}</span>
                </button>`,
              )}
            </div>
          </section>`
        : nothing}

      <section class="group">
        <h3>${L("settings")}</h3>
        <div class="list">
          ${SETTINGS.map(({ key, label }) => {
            const id = this.settingEntity(key);
            const s = id ? hass.states[id] : undefined;
            if (!id || !s) return nothing;
            return html`<button type="button" class="row" @click=${() => this.moreInfo(id)}>
              <span class="name">${L(label)}</span>
              <span class="state">${hass.formatEntityState ? hass.formatEntityState(s) : s.state}</span>
              <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            </button>`;
          })}
        </div>
      </section>

      <button type="button" class="link" @click=${() => this.moreInfo(this.entityId!)}>
        ${L("open_in_ha")} <ha-icon icon="mdi:open-in-new"></ha-icon>
      </button>
    `;
  }

  private renderDevices(title: string, ids: string[]) {
    if (!ids.length) return nothing;
    const hass = this.hass!;
    return html`<section class="group">
      <h3>${title}</h3>
      <div class="list">
        ${ids.map((id) => {
          const s = hass.states[id];
          const name = String(s?.attributes.friendly_name ?? id);
          let text: string = s ? (hass.formatEntityState ? hass.formatEntityState(s) : s.state) : this.L("unavailable");
          if (s && id.startsWith("climate.")) {
            const parts = [text];
            if (typeof s.attributes.temperature === "number") parts.push(`→ ${formatTemp(s.attributes.temperature, hass)}`);
            if (typeof s.attributes.current_temperature === "number") parts.push(`${this.L("now")} ${formatTemp(s.attributes.current_temperature, hass)}`);
            text = parts.join(" · ");
          }
          return html`<button type="button" class="row" @click=${() => this.moreInfo(id)}>
            ${s ? html`<ha-state-icon .hass=${hass} .stateObj=${s}></ha-state-icon>` : html`<ha-icon icon="mdi:help-circle-outline"></ha-icon>`}
            <span class="name">${name}</span>
            <span class="state">${text}</span>
          </button>`;
        })}
      </div>
    </section>`;
  }

  static styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--ha-font-family-body, Roboto, system-ui, sans-serif);
      color: var(--primary-text-color);
      --luna-soft: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
    .backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      animation: fade 150ms ease;
    }
    .dialog {
      position: relative;
      box-sizing: border-box;
      width: min(720px, calc(100vw - 32px));
      /* Fixed, so switching tabs doesn't make the dialog jump. */
      height: min(860px, calc(100vh - 48px));
      outline: none;
      display: flex;
      flex-direction: column;
      border-radius: 24px;
      background: var(--ha-card-background, var(--card-background-color, #1c1c1c));
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
      overflow: hidden;
      animation: rise 180ms ease;
    }
    @keyframes fade {
      from {
        opacity: 0;
      }
    }
    @keyframes rise {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
    }
    @media (max-width: 600px) {
      .dialog {
        width: 100vw;
        height: 100dvh;
        border-radius: 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .backdrop,
      .dialog {
        animation: none;
      }
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
    ha-icon,
    ha-state-icon {
      --mdc-icon-size: 20px;
    }

    header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 18px 16px 10px 20px;
    }
    .shape {
      flex: none;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--zone-shape);
      color: var(--zone-color);
      --mdc-icon-size: 24px;
    }
    .titles {
      flex: 1;
      min-width: 0;
    }
    h2 {
      margin: 0;
      font-size: 20px;
      line-height: 26px;
      font-weight: 600;
    }
    .sub {
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .close {
      all: unset;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--secondary-text-color);
    }
    .close:hover {
      background: var(--luna-soft);
    }
    .close:focus-visible {
      outline: 2px solid var(--primary-color);
    }

    .tabs {
      display: flex;
      gap: 4px;
      padding: 0 20px;
      border-bottom: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    }
    .tabs button {
      all: unset;
      padding: 12px 14px;
      font-size: 14px;
      font-weight: 600;
      color: var(--secondary-text-color);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
    }
    .tabs button.active {
      color: var(--primary-text-color);
      border-bottom-color: var(--zone-color);
    }
    .tabs button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }

    .content {
      flex: 1;
      overflow-y: auto;
      padding: 18px 20px 20px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      overscroll-behavior: contain;
    }
    .hidden {
      display: none !important;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 8px;
    }
    .stat {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 12px 14px;
      border-radius: 14px;
      background: var(--luna-soft);
    }
    .stat .label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .stat .value {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 20px;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      --mdc-icon-size: 18px;
    }
    .stat .value ha-icon {
      color: var(--zone-color);
    }

    .actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .action {
      all: unset;
      box-sizing: border-box;
      flex: 1 1 140px;
      height: 44px;
      padding: 0 14px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
      background: var(--luna-soft);
    }
    .action ha-icon {
      color: ${unsafe(LUNA.boost)};
    }
    .action.boosting {
      background: color-mix(in srgb, ${unsafe(LUNA.boost)} 18%, transparent);
    }
    .action .muted {
      margin-left: auto;
      color: var(--secondary-text-color);
      font-weight: 500;
    }
    .action:focus-visible {
      outline: 2px solid var(--primary-color);
    }

    .group h3 {
      margin: 0 0 8px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }
    .list {
      border-radius: 14px;
      overflow: hidden;
      background: var(--luna-soft);
    }
    .row {
      all: unset;
      box-sizing: border-box;
      width: 100%;
      min-height: 48px;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
    }
    .row + .row {
      border-top: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .row:hover {
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    }
    .row:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }
    .row.static {
      cursor: default;
    }
    .row > ha-icon,
    .row > ha-state-icon {
      flex: none;
      color: var(--secondary-text-color);
    }
    .row .name {
      flex: 1;
      min-width: 0;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .row .state {
      font-size: 13.5px;
      color: var(--secondary-text-color);
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .row .state.warn {
      color: ${unsafe(LUNA.warning)};
      font-weight: 600;
    }
    .row .chev {
      --mdc-icon-size: 18px;
    }
    .link {
      all: unset;
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-color);
      cursor: pointer;
      --mdc-icon-size: 16px;
    }
    .link:focus-visible {
      outline: 2px solid var(--primary-color);
    }
    .error {
      color: var(--error-color);
    }

    .confirm {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      padding: 12px 20px;
      border-top: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent);
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, var(--ha-card-background, var(--card-background-color)));
      font-size: 14px;
    }
    .confirm div {
      display: flex;
      gap: 8px;
    }
    .confirm button {
      all: unset;
      height: 40px;
      padding: 0 14px;
      border-radius: 10px;
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
    }
    .confirm .ghost {
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 20%, transparent);
    }
    .confirm .danger {
      background: var(--error-color, #db4437);
      color: #fff;
    }
    .toast {
      position: absolute;
      left: 50%;
      bottom: 20px;
      transform: translateX(-50%);
      padding: 10px 16px;
      border-radius: 10px;
      background: var(--primary-text-color);
      color: var(--card-background-color, #fff);
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
  `;
}

let instance: LunaZoneDialog | undefined;

/** Open the detail view for a Luna zone's climate entity. */
export function openZoneDialog(entityId: string, tab: DialogTab = "overview", hass?: HomeAssistant): void {
  if (!customElements.get("luna-zone-dialog")) return;
  instance ??= document.createElement("luna-zone-dialog") as LunaZoneDialog;
  instance.open(entityId, tab, hass);
}
