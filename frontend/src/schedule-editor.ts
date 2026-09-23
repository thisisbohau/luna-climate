/**
 * `luna-schedule-editor` — edits a zone's week, one day at a time.
 *
 * - Day chips pick the day; a dot marks days with their own blocks.
 * - The bar shows that day's blocks. Tap a block to select it; drag the
 *   handle at a block's start to move it (15-minute steps, never past a
 *   neighbour). Handles also move with the arrow keys.
 * - The hatched stretch before the first block is what carries over from
 *   the previous day. Tapping it offers a block at 00:00.
 * - The panel under the bar sets the selected block's value (off, a
 *   temperature, or max) and exact times, and splits or removes it.
 * - "Copy day" repeats the current day onto others.
 *
 * Nothing is sent until Save, which fires `schedule-save` with the stored
 * format. `schedule-cancel` asks the host to drop the edits.
 */

import { LitElement, css, html, nothing, unsafeCSS, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { fireEvent, haptic } from "./actions";
import { LUNA, tint } from "./colors";
import { localize, type StringKey } from "./i18n";
import {
  DAY,
  MAX_TEMP,
  MIN_TEMP,
  STEP,
  blockEnd,
  carryIn,
  clampTemp,
  cloneWeek,
  fromWeek,
  insertAt,
  moveStart,
  removeBlock,
  splitBlock,
  startBounds,
  toClock,
  toMinutes,
  toWeek,
  weeksEqual,
  type BlockValue,
  type Week,
} from "./schedule-model";
import type { HomeAssistant, ScheduleBlock } from "./types";
import { formatTemp } from "./zone";

type Selection = number | "carry" | undefined;

const MAX_COLOR = unsafeCSS(LUNA.max);
const HEAT_COLOR = unsafeCSS(LUNA.heat);

function valueColor(value: BlockValue): string {
  if (value === "off") return "color-mix(in srgb, var(--primary-text-color) 14%, transparent)";
  if (value === "max") return LUNA.max;
  return tint(LUNA.heat, Math.round(Math.min(100, 35 + ((value - 17) / 8) * 65)));
}

function valueInk(value: BlockValue): string {
  if (value === "off") return "var(--secondary-text-color)";
  if (value === "max" || value >= 22) return "#fff";
  return "var(--primary-text-color)";
}

export class LunaScheduleEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) schedule?: ScheduleBlock[];
  @property({ type: Boolean }) busy = false;
  @property({ attribute: false }) error?: string;

  @state() private week: Week = [[], [], [], [], [], [], []];
  @state() private original: Week = [[], [], [], [], [], [], []];
  @state() private day = (new Date().getDay() + 6) % 7;
  @state() private selected: Selection;
  @state() private copying = false;
  @state() private copyTargets = new Set<number>();
  @state() private dragging?: number;
  /** Bar width in px, so labels only show where they fit. */
  @state() private barWidth = 600;
  private resize?: ResizeObserver;

  protected firstUpdated(): void {
    const bar = this.renderRoot.querySelector(".bar");
    if (!bar || typeof ResizeObserver === "undefined") return;
    this.resize = new ResizeObserver(([entry]) => (this.barWidth = entry.contentRect.width));
    this.resize.observe(bar);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.resize?.disconnect();
    this.resize = undefined;
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.hasUpdated && !this.resize) this.firstUpdated();
  }
  private lastTemp = 21;

  /** True while there are unsaved edits. */
  get dirty(): boolean {
    return !weeksEqual(this.week, this.original);
  }

  /** Throw away edits and show the stored schedule again. */
  reset(): void {
    this.week = cloneWeek(this.original);
    this.selected = undefined;
    this.copying = false;
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (changed.has("schedule") && this.schedule) {
      const incoming = toWeek(this.schedule);
      // Adopt a new stored schedule, but never under the user's edits.
      if (!this.dirty || weeksEqual(incoming, this.week)) {
        this.original = incoming;
        this.week = cloneWeek(incoming);
        if (typeof this.selected === "number" && this.selected >= this.blocks.length) this.selected = undefined;
      }
    }
  }

  private get blocks() {
    return this.week[this.day];
  }

  private L(key: StringKey, vars?: Record<string, string | number>) {
    return localize(this.hass, key, vars);
  }

  private fmt(value: BlockValue) {
    return formatTemp(value, this.hass);
  }

  private dayName(day: number, style: "short" | "long" = "short"): string {
    // 2024-01-01 was a Monday, so day 0 lines up with Python's Monday = 0.
    const date = new Date(Date.UTC(2024, 0, 1 + day));
    return date.toLocaleDateString(this.hass?.locale?.language ?? "en", { weekday: style, timeZone: "UTC" });
  }

  private setDay(blocks: typeof this.week[number]): void {
    const week = cloneWeek(this.week);
    week[this.day] = blocks;
    this.week = week;
  }

  // -- block edits -------------------------------------------------------

  private select(sel: Selection): void {
    this.selected = this.selected === sel ? undefined : sel;
    this.copying = false;
  }

  private setValue(value: BlockValue): void {
    if (typeof this.selected !== "number") return;
    if (typeof value === "number") this.lastTemp = value;
    const blocks = this.blocks.map((b) => ({ ...b }));
    blocks[this.selected].value = value;
    this.setDay(blocks);
    haptic("light");
  }

  private stepTemp(delta: number): void {
    if (typeof this.selected !== "number") return;
    const current = this.blocks[this.selected].value;
    const base = typeof current === "number" ? current : this.lastTemp;
    this.setValue(clampTemp(base + delta * 0.5));
  }

  private addBlock(): void {
    const blocks = this.blocks;
    if (!blocks.length) {
      this.setDay([{ start: 6 * 60, value: this.lastTemp }]);
      this.selected = 0;
      return;
    }
    if (this.selected === "carry") {
      this.addAtMidnight();
      return;
    }
    const index = typeof this.selected === "number" ? this.selected : this.longestBlock();
    const result = splitBlock(blocks, index);
    if (!result) return;
    this.setDay(result.blocks);
    this.selected = result.index;
  }

  private addAtMidnight(): void {
    const value = carryIn(this.week, this.day) ?? this.lastTemp;
    const result = insertAt(this.blocks, 0, value);
    if (!result) return;
    this.setDay(result.blocks);
    this.selected = result.index;
  }

  private longestBlock(): number {
    let best = 0;
    let bestLength = -1;
    this.blocks.forEach((b, i) => {
      const length = blockEnd(this.blocks, i) - b.start;
      if (length > bestLength) {
        best = i;
        bestLength = length;
      }
    });
    return best;
  }

  private removeSelected(): void {
    if (typeof this.selected !== "number") return;
    const index = this.selected;
    this.setDay(removeBlock(this.blocks, index));
    this.selected = this.blocks.length ? Math.max(0, index - 1) : undefined;
  }

  private setStartFromInput(index: number, value: string): void {
    if (!value) return;
    this.setDay(moveStart(this.blocks, index, toMinutes(value)));
  }

  private setEndFromInput(index: number, value: string): void {
    if (!value || index + 1 >= this.blocks.length) return;
    this.setDay(moveStart(this.blocks, index + 1, toMinutes(value)));
  }

  // -- dragging ------------------------------------------------------------

  private minutesAt(ev: PointerEvent): number {
    const bar = this.renderRoot.querySelector(".bar") as HTMLElement;
    const rect = bar.getBoundingClientRect();
    return ((ev.clientX - rect.left) / rect.width) * DAY;
  }

  private onHandleDown(ev: PointerEvent, index: number): void {
    ev.preventDefault();
    ev.stopPropagation();
    (ev.currentTarget as Element).setPointerCapture?.(ev.pointerId);
    this.dragging = index;
    this.selected = index;
    this.copying = false;
  }

  private onHandleMove(ev: PointerEvent, index: number): void {
    if (this.dragging !== index) return;
    const before = this.blocks[index].start;
    const next = moveStart(this.blocks, index, this.minutesAt(ev));
    if (next[index].start !== before) {
      this.setDay(next);
      haptic("light");
    }
  }

  private onHandleUp(): void {
    this.dragging = undefined;
  }

  private onHandleKey(ev: KeyboardEvent, index: number): void {
    const delta = ev.key === "ArrowLeft" || ev.key === "ArrowDown" ? -STEP : ev.key === "ArrowRight" || ev.key === "ArrowUp" ? STEP : 0;
    if (!delta) return;
    ev.preventDefault();
    this.setDay(moveStart(this.blocks, index, this.blocks[index].start + delta));
    this.selected = index;
  }

  // -- copy ----------------------------------------------------------------

  private toggleCopyTarget(day: number): void {
    const next = new Set(this.copyTargets);
    if (next.has(day)) next.delete(day);
    else next.add(day);
    this.copyTargets = next;
  }

  private applyCopy(): void {
    const week = cloneWeek(this.week);
    for (const day of this.copyTargets) week[day] = this.blocks.map((b) => ({ ...b }));
    this.week = week;
    this.copying = false;
    this.copyTargets = new Set();
  }

  private save(): void {
    fireEvent(this, "schedule-save", { schedule: fromWeek(this.week) });
  }

  private cancel(): void {
    this.reset();
    fireEvent(this, "schedule-cancel");
  }

  // -- rendering -----------------------------------------------------------

  protected render() {
    const blocks = this.blocks;
    const carry = carryIn(this.week, this.day);
    const firstStart = blocks.length ? blocks[0].start : DAY;
    const pct = (m: number) => `${(m / DAY) * 100}%`;
    const px = (m: number) => (m / DAY) * this.barWidth;

    return html`
      <div class="days" role="tablist" aria-label=${this.L("days")}>
        ${[0, 1, 2, 3, 4, 5, 6].map(
          (d) => html`<button
            type="button"
            role="tab"
            class="day ${d === this.day ? "active" : ""}"
            aria-selected=${d === this.day ? "true" : "false"}
            @click=${() => {
              this.day = d;
              this.selected = undefined;
              this.copying = false;
            }}
          >
            ${this.dayName(d)}${this.week[d].length ? html`<span class="has"></span>` : nothing}
          </button>`,
        )}
      </div>

      <div class="bar-wrap">
        <div class="bar">
          ${firstStart > 0
            ? html`<button
                type="button"
                class="seg carry ${this.selected === "carry" ? "selected" : ""}"
                style=${`left: 0; width: ${pct(firstStart)}; --seg: ${carry !== undefined ? valueColor(carry) : "transparent"}; --ink: var(--secondary-text-color)`}
                aria-label=${this.L("carry_over")}
                @click=${() => this.select("carry")}
              >
                ${px(firstStart) >= 56 && carry !== undefined ? html`<span class="label">${this.fmt(carry)}</span>` : nothing}
              </button>`
            : nothing}
          ${blocks.map((b, i) => {
            const end = blockEnd(blocks, i);
            const width = end - b.start;
            return html`<button
              type="button"
              class="seg ${this.selected === i ? "selected" : ""} ${i === blocks.length - 1 ? "last" : ""}"
              style=${`left: ${pct(b.start)}; width: ${pct(width)}; --seg: ${valueColor(b.value)}; --ink: ${valueInk(b.value)}`}
              aria-label=${`${toClock(b.start)}–${toClock(end)}, ${this.fmt(b.value)}`}
              @click=${() => this.select(i)}
            >
              ${px(width) >= 52 ? html`<span class="label">${this.fmt(b.value)}</span>` : nothing}
              ${px(width) >= 104 ? html`<span class="time">${toClock(b.start)}–${toClock(end)}</span>` : nothing}
            </button>`;
          })}
          ${blocks.map(
            (b, i) => html`<button
              type="button"
              class="handle ${this.dragging === i ? "dragging" : ""}"
              style=${`left: ${pct(b.start)}`}
              aria-label=${this.L("move_start", { time: toClock(b.start) })}
              @pointerdown=${(ev: PointerEvent) => this.onHandleDown(ev, i)}
              @pointermove=${(ev: PointerEvent) => this.onHandleMove(ev, i)}
              @pointerup=${() => this.onHandleUp()}
              @pointercancel=${() => this.onHandleUp()}
              @keydown=${(ev: KeyboardEvent) => this.onHandleKey(ev, i)}
            >
              <span class="grip"></span>
              ${this.dragging === i ? html`<span class="bubble">${toClock(b.start)}</span>` : nothing}
            </button>`,
          )}
        </div>
        <div class="axis" aria-hidden="true">
          ${[0, 3, 6, 9, 12, 15, 18, 21, 24].map(
            (h) => html`<span class=${h === 0 ? "first" : h === 24 ? "last" : ""} style=${`left: ${(h / 24) * 100}%`}
              >${String(h).padStart(2, "0")}</span
            >`,
          )}
        </div>
      </div>

      <div class="tools">
        <button type="button" class="tool" @click=${this.addBlock}>
          <ha-icon icon="mdi:plus"></ha-icon>${this.L("add_block")}
        </button>
        <button
          type="button"
          class="tool ${this.copying ? "on" : ""}"
          ?disabled=${!blocks.length}
          @click=${() => {
            this.copying = !this.copying;
            this.selected = undefined;
          }}
        >
          <ha-icon icon="mdi:content-copy"></ha-icon>${this.L("copy_day")}
        </button>
      </div>

      ${this.copying ? this.renderCopy() : this.renderPanel(carry)}

      ${this.error ? html`<div class="error" role="alert">${this.error}</div>` : nothing}

      <div class="footer">
        <button type="button" class="ghost" ?disabled=${!this.dirty || this.busy} @click=${this.cancel}>
          ${this.L("discard")}
        </button>
        <button type="button" class="primary" ?disabled=${!this.dirty || this.busy} @click=${this.save}>
          ${this.busy ? this.L("saving") : this.L("save")}
        </button>
      </div>
    `;
  }

  private renderCopy() {
    return html`<div class="panel">
      <div class="panel-title">${this.L("copy_to", { day: this.dayName(this.day, "long") })}</div>
      <div class="targets">
        ${[0, 1, 2, 3, 4, 5, 6]
          .filter((d) => d !== this.day)
          .map(
            (d) => html`<button
              type="button"
              class="day small ${this.copyTargets.has(d) ? "active" : ""}"
              aria-pressed=${this.copyTargets.has(d) ? "true" : "false"}
              @click=${() => this.toggleCopyTarget(d)}
            >
              ${this.dayName(d)}
            </button>`,
          )}
      </div>
      <div class="row end">
        <button type="button" class="ghost" @click=${() => (this.copying = false)}>${this.L("cancel")}</button>
        <button type="button" class="primary" ?disabled=${!this.copyTargets.size} @click=${this.applyCopy}>
          ${this.L("apply")}
        </button>
      </div>
    </div>`;
  }

  private renderPanel(carry: BlockValue | undefined) {
    if (this.selected === "carry") {
      const from = this.dayName((this.day + 6) % 7, "long");
      return html`<div class="panel">
        <div class="hint">
          ${carry !== undefined
            ? this.L("carry_hint", { day: from, value: this.fmt(carry) })
            : this.L("empty_hint")}
        </div>
        <div class="row end">
          <button type="button" class="primary" @click=${this.addAtMidnight}>${this.L("add_midnight")}</button>
        </div>
      </div>`;
    }
    if (typeof this.selected !== "number") {
      return html`<div class="panel muted">
        <div class="hint">${this.blocks.length ? this.L("select_hint") : this.L("empty_hint")}</div>
      </div>`;
    }

    const i = this.selected;
    const b = this.blocks[i];
    const end = blockEnd(this.blocks, i);
    const [lo, hi] = startBounds(this.blocks, i);
    const isLast = i + 1 >= this.blocks.length;
    const temp = typeof b.value === "number" ? b.value : undefined;

    return html`<div class="panel">
      <div class="row times">
        <label>
          <span>${this.L("from")}</span>
          <input
            type="time"
            step="900"
            .value=${toClock(b.start)}
            min=${toClock(lo)}
            max=${toClock(hi)}
            @change=${(ev: Event) => this.setStartFromInput(i, (ev.target as HTMLInputElement).value)}
          />
        </label>
        <label>
          <span>${this.L("to")}</span>
          ${isLast
            ? html`<span class="fixed">${this.L("next_block")}</span>`
            : html`<input
                type="time"
                step="900"
                .value=${toClock(end)}
                @change=${(ev: Event) => this.setEndFromInput(i, (ev.target as HTMLInputElement).value)}
              />`}
        </label>
      </div>

      <div class="values" role="radiogroup" aria-label=${this.L("action")}>
        <button
          type="button"
          role="radio"
          class="value ${b.value === "off" ? "active" : ""}"
          aria-checked=${b.value === "off" ? "true" : "false"}
          @click=${() => this.setValue("off")}
        >
          <ha-icon icon="mdi:power"></ha-icon>${this.L("off")}
        </button>
        <div class="value temp ${temp !== undefined ? "active" : ""}">
          <button type="button" aria-label=${this.L("lower")} ?disabled=${temp !== undefined && temp <= MIN_TEMP} @click=${() => this.stepTemp(-1)}>
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>
          <button
            type="button"
            role="radio"
            class="reading"
            aria-checked=${temp !== undefined ? "true" : "false"}
            @click=${() => this.setValue(temp ?? this.lastTemp)}
          >
            ${this.fmt(temp ?? this.lastTemp)}
          </button>
          <button type="button" aria-label=${this.L("raise")} ?disabled=${temp !== undefined && temp >= MAX_TEMP} @click=${() => this.stepTemp(1)}>
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>
        <button
          type="button"
          role="radio"
          class="value ${b.value === "max" ? "active max" : ""}"
          aria-checked=${b.value === "max" ? "true" : "false"}
          @click=${() => this.setValue("max")}
        >
          <ha-icon icon="mdi:fire"></ha-icon>${this.L("max")}
        </button>
      </div>

      <div class="row">
        <button type="button" class="ghost" @click=${this.addBlock}>
          <ha-icon icon="mdi:content-cut"></ha-icon>${this.L("split")}
        </button>
        <button type="button" class="ghost danger" @click=${this.removeSelected}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>${this.L("remove")}
        </button>
      </div>
    </div>`;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 14px;
      --luna-soft: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
    button {
      font: inherit;
      color: inherit;
      -webkit-tap-highlight-color: transparent;
    }
    button:focus-visible,
    input:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    ha-icon {
      --mdc-icon-size: 18px;
    }

    .days,
    .targets {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .day {
      all: unset;
      position: relative;
      box-sizing: border-box;
      min-width: 44px;
      height: 36px;
      padding: 0 10px;
      border-radius: 18px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      background: var(--luna-soft);
      color: var(--secondary-text-color);
    }
    .day.active {
      background: var(--primary-text-color);
      color: var(--card-background-color, #fff);
    }
    .day .has {
      position: absolute;
      bottom: 4px;
      left: 50%;
      width: 4px;
      height: 4px;
      margin-left: -2px;
      border-radius: 50%;
      background: currentColor;
      opacity: 0.6;
    }
    .day.small {
      height: 32px;
      min-width: 40px;
    }

    .bar-wrap {
      padding: 14px 0 0;
    }
    .bar {
      position: relative;
      height: 56px;
      border-radius: 12px;
      background: var(--luna-soft);
      touch-action: none;
    }
    .seg {
      all: unset;
      box-sizing: border-box;
      position: absolute;
      top: 0;
      bottom: 0;
      padding: 6px 8px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 1px;
      overflow: hidden;
      cursor: pointer;
      background: var(--seg);
      color: var(--ink);
      border-left: 2px solid var(--card-background-color, #1c1c1c);
    }
    .seg:first-child {
      border-left: none;
      border-radius: 12px 0 0 12px;
    }
    .seg.carry {
      background:
        repeating-linear-gradient(135deg, transparent 0 6px, color-mix(in srgb, var(--card-background-color, #1c1c1c) 55%, transparent) 6px 10px),
        var(--seg);
      opacity: 0.75;
    }
    .seg.selected {
      box-shadow: inset 0 0 0 2px var(--primary-text-color);
      z-index: 1;
    }
    .seg:focus-visible {
      outline: none;
      box-shadow: inset 0 0 0 2px var(--primary-color);
    }
    .seg .label {
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
    }
    .seg .time {
      font-size: 11px;
      opacity: 0.85;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
    .seg.last {
      border-top-right-radius: 12px;
      border-bottom-right-radius: 12px;
    }
    .handle {
      all: unset;
      position: absolute;
      top: -8px;
      bottom: -8px;
      width: 28px;
      margin-left: -14px;
      z-index: 2;
      cursor: ew-resize;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: none;
    }
    .handle .grip {
      width: 6px;
      height: 30px;
      border-radius: 3px;
      background: var(--primary-text-color);
      box-shadow: 0 0 0 2px var(--card-background-color, #1c1c1c);
      transition: transform 120ms ease;
    }
    .handle:hover .grip,
    .handle.dragging .grip {
      transform: scaleY(1.15);
    }
    .handle:focus-visible {
      outline: none;
    }
    .handle:focus-visible .grip {
      box-shadow: 0 0 0 2px var(--card-background-color, #1c1c1c), 0 0 0 4px var(--primary-color);
    }
    .bubble {
      position: absolute;
      bottom: calc(100% + 4px);
      padding: 3px 7px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      background: var(--primary-text-color);
      color: var(--card-background-color, #fff);
      white-space: nowrap;
    }
    .axis {
      position: relative;
      height: 18px;
      margin-top: 4px;
    }
    .axis span {
      position: absolute;
      transform: translateX(-50%);
      font-size: 11px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .axis .first {
      transform: none;
    }
    .axis .last {
      transform: translateX(-100%);
    }

    .tools,
    .row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .row.end {
      justify-content: flex-end;
    }
    .tool,
    .ghost,
    .primary,
    .value {
      all: unset;
      box-sizing: border-box;
      height: 40px;
      padding: 0 14px;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
      background: var(--luna-soft);
      color: var(--primary-text-color);
    }
    .tool.on {
      background: var(--primary-text-color);
      color: var(--card-background-color, #fff);
    }
    .ghost {
      background: transparent;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 18%, transparent);
    }
    .ghost.danger {
      color: var(--error-color, #db4437);
    }
    .primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    button:disabled {
      opacity: 0.4;
      cursor: default;
    }

    .panel {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 14px;
      border-radius: 14px;
      background: var(--luna-soft);
    }
    .panel.muted .hint {
      color: var(--secondary-text-color);
    }
    .panel-title {
      font-weight: 600;
    }
    .hint {
      font-size: 13.5px;
      line-height: 1.45;
    }
    .times {
      gap: 16px;
    }
    .times label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .times input {
      font: inherit;
      font-size: 15px;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      color: var(--primary-text-color);
      background: var(--card-background-color, transparent);
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 18%, transparent);
      border-radius: 8px;
      padding: 6px 8px;
      min-height: 36px;
      color-scheme: light dark;
    }
    .times .fixed {
      font-size: 14px;
      color: var(--primary-text-color);
      padding: 8px 0;
    }
    .values {
      display: grid;
      grid-template-columns: 1fr 1.6fr 1fr;
      gap: 8px;
    }
    .value.active {
      background: var(--primary-text-color);
      color: var(--card-background-color, #fff);
    }
    .value.active.max {
      background: ${MAX_COLOR};
      color: #fff;
    }
    .value.temp {
      padding: 0;
      display: grid;
      grid-template-columns: 40px 1fr 40px;
      cursor: default;
    }
    .value.temp.active {
      background: ${HEAT_COLOR};
      color: #1a1a1a;
    }
    .value.temp button {
      all: unset;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-variant-numeric: tabular-nums;
    }
    .value.temp .reading {
      font-size: 15px;
      font-weight: 700;
    }
    .value.temp button:disabled {
      opacity: 0.35;
    }
    .error {
      padding: 10px 12px;
      border-radius: 10px;
      color: var(--error-color, #db4437);
      background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent);
      font-size: 13.5px;
    }
    .footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 4px;
    }
    .footer .primary,
    .footer .ghost {
      min-width: 110px;
    }
  `;
}
