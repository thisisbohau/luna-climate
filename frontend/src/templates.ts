/**
 * Live Jinja templates for card fields, rendered by Home Assistant.
 *
 * Any config value containing `{{` or `{%` is treated as a template and
 * subscribed through the `render_template` websocket command, the same
 * mechanism HA's own markdown card uses. Home Assistant re-renders and
 * pushes a new result whenever an entity the template reads changes, so
 * there is no polling here.
 */

import type { HomeAssistant } from "./types";

export function isTemplate(value: unknown): value is string {
  return typeof value === "string" && (value.includes("{{") || value.includes("{%"));
}

interface RenderResult {
  result?: unknown;
  error?: string;
}

interface Subscription {
  template: string;
  unsub: Promise<() => Promise<void>>;
}

export class TemplateRenderer {
  private subs = new Map<string, Subscription>();
  readonly results = new Map<string, string>();

  constructor(private readonly onChange: () => void) {}

  /**
   * Bring subscriptions in line with the current config. Only templates
   * that actually changed are re-subscribed.
   */
  sync(
    hass: HomeAssistant,
    fields: Record<string, unknown>,
    variables: Record<string, unknown>,
  ): void {
    const wanted = new Map<string, string>();
    for (const [key, value] of Object.entries(fields)) {
      if (isTemplate(value)) wanted.set(key, value);
    }

    for (const [key, sub] of this.subs) {
      if (wanted.get(key) !== sub.template) {
        this.drop(key);
      }
    }

    for (const [key, template] of wanted) {
      if (this.subs.has(key)) continue;
      const unsub = hass.connection
        .subscribeMessage<RenderResult>(
          (msg) => {
            if (msg.error !== undefined) {
              // eslint-disable-next-line no-console
              console.warn(`luna card template "${key}":`, msg.error);
              this.results.set(key, "");
            } else {
              const r = msg.result;
              this.results.set(
                key,
                r === null || r === undefined
                  ? ""
                  : typeof r === "object"
                    ? JSON.stringify(r)
                    : String(r),
              );
            }
            this.onChange();
          },
          {
            type: "render_template",
            template,
            variables,
            strict: true,
            report_errors: true,
          },
        )
        .catch((err: unknown) => {
          // eslint-disable-next-line no-console
          console.warn(`luna card template "${key}" failed:`, err);
          this.results.set(key, "");
          this.onChange();
          return async () => undefined;
        });
      this.subs.set(key, { template, unsub });
    }
  }

  /** The rendered value for a field, or the literal config value. */
  value(key: string, literal: unknown): string | undefined {
    if (isTemplate(literal)) return this.results.get(key);
    if (literal === undefined || literal === null) return undefined;
    return String(literal);
  }

  clear(): void {
    for (const key of [...this.subs.keys()]) this.drop(key);
  }

  private drop(key: string): void {
    const sub = this.subs.get(key);
    this.subs.delete(key);
    this.results.delete(key);
    sub?.unsub.then((unsub) => unsub()).catch(() => undefined);
  }
}
