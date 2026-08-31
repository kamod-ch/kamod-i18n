import { describe, expect, it } from "vitest";
import { createI18n } from "../src";

const messages = {
  item: {
    one: "{count} item",
    other: "{count} items",
  },
  minute: {
    one: "{count} minute",
    few: "{count} minutes",
    many: "{count} minutes",
    other: "{count} minutes",
  },
} as const;

describe("pluralization", () => {
  it("uses Intl.PluralRules for English and German", () => {
    const i18n = createI18n({
      locale: "en",
      fallbackLocale: "en",
      messages: { en: messages, de: messages },
    });
    expect(i18n.t("item", { count: 1 })).toBe("1 item");
    expect(i18n.t("item", { count: 5 })).toBe("5 items");
  });

  it("supports locales with additional categories", () => {
    const i18n = createI18n({ locale: "ar", fallbackLocale: "ar", messages: { ar: messages } });
    expect(i18n.t("minute", { count: 3 })).toBe("3 minutes");
    expect(i18n.t("minute", { count: 11 })).toBe("11 minutes");
  });
});

describe("Intl formatting", () => {
  it("formats numbers and currency", () => {
    const i18n = createI18n({ locale: "en", fallbackLocale: "en", messages: { en: messages } });
    expect(i18n.number(12500)).toContain("12");
    expect(i18n.number(12840, { style: "currency", currency: "CHF" })).toContain("CHF");
  });

  it("formats dates, relative time, and lists", () => {
    const i18n = createI18n({ locale: "en", fallbackLocale: "en", messages: { en: messages } });
    expect(
      i18n.date(new Date("2024-01-02T00:00:00Z"), { timeZone: "UTC", year: "numeric" }),
    ).toContain("2024");
    expect(i18n.relativeTime(-2, "day")).toContain("2");
    expect(i18n.list(["Preact", "Otok", "Kamod"])).toContain("Preact");
  });
});
