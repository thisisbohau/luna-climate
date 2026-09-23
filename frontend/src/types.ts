/**
 * The slice of Home Assistant's frontend object model the Luna cards use.
 * Kept deliberately small: everything here has been stable in HA for years.
 */

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

export interface HassEntityDisplay {
  entity_id: string;
  device_id?: string;
  translation_key?: string;
  platform?: string;
  name?: string | null;
  icon?: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities?: Record<string, HassEntityDisplay>;
  config: {
    time_zone: string;
    unit_system?: { temperature?: string };
  };
  locale?: { language?: string };
  language?: string;
  user?: { id: string; name: string; is_admin: boolean };
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: Record<string, unknown>,
  ): Promise<unknown>;
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  connection: {
    subscribeMessage<T>(
      callback: (msg: T) => void,
      msg: Record<string, unknown>,
    ): Promise<() => Promise<void>>;
  };
  formatEntityState?(stateObj: HassEntity, state?: string): string;
}

export type ActionName =
  | "more-info"
  | "toggle"
  | "perform-action"
  | "call-service"
  | "navigate"
  | "url"
  | "fire-dom-event"
  | "none";

export interface ActionConfig {
  action: ActionName;
  entity?: string;
  perform_action?: string;
  service?: string;
  data?: Record<string, unknown>;
  service_data?: Record<string, unknown>;
  target?: Record<string, unknown>;
  navigation_path?: string;
  navigation_replace?: boolean;
  url_path?: string;
  confirmation?: boolean | { text?: string };
}

export interface LovelaceCardConfig {
  type: string;
  [key: string]: unknown;
}

/** A schedule block exactly as the integration's websocket returns it. */
export interface ScheduleBlock {
  weekdays: number[];
  start: string;
  value: "off" | "max" | number;
}

export type TargetValue = "off" | "max" | number;
