/**
 * Luna Climate cards. Served by the integration and loaded automatically,
 * so no manual dashboard resource is needed.
 */

import { LunaBadgeCard } from "./badge-card";
import { LunaBoostBadge } from "./boost-badge";
import { LunaZoneCard } from "./zone-card";
import { LunaZoneCompactCard } from "./zone-compact-card";
import { LunaScheduleEditor } from "./schedule-editor";
import { LunaZoneDialog, openZoneDialog } from "./zone-dialog";
import type { HomeAssistant } from "./types";

const VERSION = "0.5.0";

function define(name: string, ctor: CustomElementConstructor): void {
  if (!customElements.get(name)) customElements.define(name, ctor);
}

define("luna-zone-card", LunaZoneCard);
define("luna-zone-compact-card", LunaZoneCompactCard);
define("luna-badge-card", LunaBadgeCard);
define("luna-boost-badge", LunaBoostBadge);
define("luna-schedule-editor", LunaScheduleEditor);
define("luna-zone-dialog", LunaZoneDialog);

/**
 * The "Schedule & details" button on a zone's device page. Home Assistant
 * runs the press on the server; the integration then tells the presser's
 * browser, through this subscription, to open the zone's detail view.
 * Held once per page load, on whatever page the bundle is loaded.
 */
function listenForDetailsButton(): void {
  let subscribed = false;
  const attempt = () => {
    if (subscribed) return;
    const hass = (document.querySelector("home-assistant") as (HTMLElement & { hass?: HomeAssistant }) | null)?.hass;
    if (!hass?.connection) return;
    subscribed = true;
    window.clearInterval(timer);
    hass.connection
      .subscribeMessage<{ entity_id?: string }>(
        (msg) => {
          if (msg.entity_id && document.visibilityState === "visible") openZoneDialog(msg.entity_id);
        },
        { type: "luna_climate/subscribe_ui" },
      )
      .catch(() => {
        // Integration not set up (yet): nothing to listen for.
      });
  };
  const timer = window.setInterval(attempt, 1000);
  attempt();
}
listenForDetailsButton();

interface CustomCardEntry {
  type: string;
  name: string;
  description: string;
  preview?: boolean;
  documentationURL?: string;
}

const w = window as unknown as { customCards?: CustomCardEntry[] };
w.customCards = w.customCards ?? [];
for (const card of [
  {
    type: "luna-zone-card",
    name: "Luna zone",
    description: "Dial, schedule strip and boost buttons for one Luna Climate zone.",
    preview: true,
  },
  {
    type: "luna-zone-compact-card",
    name: "Luna zone (compact)",
    description: "Mode, temperature and humidity over the schedule strip, without the dial.",
    preview: true,
  },
  {
    type: "luna-boost-badge",
    name: "Luna boost badge",
    description: "Compact pill for a Luna zone. Tap to boost, tap again to cancel.",
    preview: true,
  },
  {
    type: "luna-badge-card",
    name: "Luna badge",
    description: "General-purpose pill for any entity, with templates, a progress ring and an indicator dot.",
    preview: true,
  },
]) {
  if (!w.customCards.some((c) => c.type === card.type)) w.customCards.push(card);
}

// eslint-disable-next-line no-console
console.info(`%c LUNA CLIMATE %c ${VERSION} `, "background:#ff8100;color:#111;font-weight:700", "color:#ff8100");
