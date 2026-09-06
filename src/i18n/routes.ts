export const LOCALES = ["en", "ko", "de", "vi", "zh-hant"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ko: "한국어",
  de: "Deutsch",
  vi: "Tiếng Việt",
  "zh-hant": "繁體中文",
};

/** BCP-47 tags used in hreflang / og:locale — note zh-hant maps to zh-Hant. */
export const LOCALE_HREFLANG: Record<Locale, string> = {
  en: "en",
  ko: "ko",
  de: "de",
  vi: "vi",
  "zh-hant": "zh-Hant",
};

export const LOCALE_OG: Record<Locale, string> = {
  en: "en_US",
  ko: "ko_KR",
  de: "de_DE",
  vi: "vi_VN",
  "zh-hant": "zh_TW",
};

/**
 * Canonical, locale-agnostic page identifiers. Every static page passes one of
 * these to <Seo>, <Header>, <Footer>, and <LanguageSwitcher>. Blog posts use
 * `blog:<translation-group-id>` (see BLOG_GROUPS below) — never the raw slug,
 * because slugs differ per locale (e.g. Vietnamese uses localized URLs, not
 * literal translations of the English path).
 */
export const PAGE_KEYS = {
  home: "home",
  review: "review",
  referralCode: "referralCode",
  fees: "fees",
  howToStart: "howToStart",
  faq: "faq",
  disclaimer: "disclaimer",
  blogIndex: "blogIndex",
} as const;

export type PageId = (typeof PAGE_KEYS)[keyof typeof PAGE_KEYS] | `blog:${string}`;

/**
 * Every real, published URL on the site, grouped by locale then page id.
 * A locale/page-id combination that's missing here simply doesn't have a
 * translation yet — resolveLocaleUrl() and navTargetUrl() both fall back
 * gracefully (see below) rather than ever pointing at a 404.
 *
 * Vietnamese intentionally uses localized slugs (/vi/danh-gia, not
 * /vi/review) rather than transliterating the English path — that's a
 * deliberate SEO/content decision from the Vietnamese content pack, not a
 * naming inconsistency.
 */
const LOCALE_PATHS: Record<Locale, Partial<Record<PageId, string>>> = {
  en: {
    home: "/",
    review: "/review",
    referralCode: "/referral-code",
    fees: "/fees",
    howToStart: "/how-to-start",
    faq: "/faq",
    disclaimer: "/disclaimer",
    blogIndex: "/blog",
    "blog:vs-traditional-exchanges": "/blog/fomo-vs-traditional-exchanges",
    "blog:how-to-trade": "/blog/how-to-trade-on-fomo-app-beginners-guide",
    "blog:is-fomo-safe": "/blog/is-fomo-safe-non-custodial-explained",
    "blog:social-trading-app": "/blog/what-to-look-for-in-a-social-trading-app",
    "blog:trading-fees": "/blog/fomo-trading-fees-spot-vs-perpetuals",
    "blog:series-b-sec": "/blog/fomo-75m-series-b-sec-ruling-explained",
    "blog:perpetuals-explained": "/blog/fomo-perpetuals-explained",
  },
  ko: {
    // Korean uses the same literal (English-word) path segments as English,
    // per the content pack — unlike Vietnamese, which uses localized slugs.
    home: "/ko/",
    review: "/ko/review",
    referralCode: "/ko/referral-code",
    fees: "/ko/fees",
    howToStart: "/ko/how-to-start",
    faq: "/ko/faq",
    disclaimer: "/ko/disclaimer",
    blogIndex: "/ko/blog",
    "blog:how-to-trade": "/ko/blog/fomo-app-cocho-gaideu",
    "blog:is-fomo-safe": "/ko/blog/fomo-anjeonhan-ga-non-custodial",
    "blog:social-trading-app": "/ko/blog/social-trading-app-seontaek-giojun",
    "blog:trading-fees": "/ko/blog/fomo-susuryo-spot-vs-perpetuals",
    "blog:series-b-sec": "/ko/blog/fomo-75m-tuja-yuchi-sec-cftc",
    "blog:perpetuals-explained": "/ko/blog/fomo-perpetuals-seolmyeong",
  },
  de: {
    // German/EU: Fomo is still not MiCA/CASP-licensed (unlike the other
    // locales' holds, the site owner explicitly chose to proceed anyway —
    // see the content tracker). Every /de page carries a prominent MiCA
    // disclosure in addition to the standard disclaimer (see de.json).
    home: "/de/",
    review: "/de/review",
    referralCode: "/de/referral-code",
    fees: "/de/fees",
    howToStart: "/de/how-to-start",
    faq: "/de/faq",
    disclaimer: "/de/disclaimer",
    blogIndex: "/de/blog",
    "blog:how-to-trade": "/de/blog/fomo-anfaenger-leitfaden",
    "blog:is-fomo-safe": "/de/blog/fomo-sicherheit-non-custodial",
    "blog:social-trading-app": "/de/blog/social-trading-app-auswahlkriterien",
    "blog:trading-fees": "/de/blog/fomo-gebuehren-spot-vs-perpetuals",
    "blog:series-b-sec": "/de/blog/fomo-75m-finanzierung-sec-cftc",
    "blog:perpetuals-explained": "/de/blog/fomo-perpetuals-erklaert",
  },
  vi: {
    home: "/vi/",
    review: "/vi/danh-gia",
    referralCode: "/vi/ma-gioi-thieu",
    fees: "/vi/phi-giao-dich",
    howToStart: "/vi/bat-dau",
    faq: "/vi/hoi-dap",
    disclaimer: "/vi/mien-tru",
    blogIndex: "/vi/blog",
    "blog:how-to-trade": "/vi/blog/huong-dan-giao-dich-fomo-cho-nguoi-moi",
    "blog:is-fomo-safe": "/vi/blog/fomo-co-an-toan-khong-kien-truc-non-custodial",
    "blog:social-trading-app": "/vi/blog/tieu-chi-chon-app-trading-social",
    "blog:trading-fees": "/vi/blog/phi-giao-dich-fomo-spot-va-perpetuals",
    "blog:series-b-sec": "/vi/blog/fomo-goi-von-75m-va-huong-dan-sec-cftc",
    "blog:perpetuals-explained": "/vi/blog/fomo-perpetuals-la-gi",
  },
  "zh-hant": {
    // Same convention as Korean — literal English-word path segments.
    home: "/zh-hant/",
    review: "/zh-hant/review",
    referralCode: "/zh-hant/referral-code",
    fees: "/zh-hant/fees",
    howToStart: "/zh-hant/how-to-start",
    faq: "/zh-hant/faq",
    disclaimer: "/zh-hant/disclaimer",
    blogIndex: "/zh-hant/blog",
    "blog:how-to-trade": "/zh-hant/blog/fomo-xinshou-jiaoxue",
    "blog:is-fomo-safe": "/zh-hant/blog/fomo-anquan-ma-feituoguan-jiegou",
    "blog:social-trading-app": "/zh-hant/blog/xuanze-social-trading-app-biaozhun",
    "blog:trading-fees": "/zh-hant/blog/fomo-shouxufei-xianhuo-vs-perpetuals",
    "blog:series-b-sec": "/zh-hant/blog/fomo-75m-rongzi-sec-cftc",
    "blog:perpetuals-explained": "/zh-hant/blog/fomo-perpetuals-shuoming",
  },
};

/** Direct lookup — no fallback. Use resolveLocaleUrl/navTargetUrl for link-building. */
function getPagePath(locale: Locale, pageId: PageId): string | undefined {
  return LOCALE_PATHS[locale][pageId];
}

export function hasTranslation(locale: Locale, pageId: PageId): boolean {
  return getPagePath(locale, pageId) !== undefined;
}

/** For hreflang alternates and the language switcher: the real translation, or that locale's homepage. */
export function resolveLocaleUrl(locale: Locale, pageId: PageId): string {
  return getPagePath(locale, pageId) ?? getPagePath(locale, PAGE_KEYS.home)!;
}

/** For in-page navigation (header/footer links): the real translation, or the English page — never bounces to the visitor's homepage mid-browse. */
export function navTargetUrl(locale: Locale, pageId: PageId): string {
  return getPagePath(locale, pageId) ?? getPagePath(DEFAULT_LOCALE, pageId) ?? getPagePath(DEFAULT_LOCALE, PAGE_KEYS.home)!;
}

export interface Alternate {
  locale: Locale;
  hreflang: string;
  url: string;
}

export function getAlternates(pageId: PageId): Alternate[] {
  return LOCALES.map((locale) => ({
    locale,
    hreflang: LOCALE_HREFLANG[locale],
    url: resolveLocaleUrl(locale, pageId),
  }));
}

export function getXDefaultUrl(pageId: PageId): string {
  return resolveLocaleUrl(DEFAULT_LOCALE, pageId);
}

/**
 * The current page's own canonical URL. Unlike resolveLocaleUrl, this never
 * falls back to the homepage — every page that calls <Seo> is, by
 * definition, a real registered page for its own locale.
 */
export function getOwnUrl(locale: Locale, pageId: PageId, fallbackPathname: string): string {
  return getPagePath(locale, pageId) ?? fallbackPathname;
}

/**
 * Blog translation groups: maps a stable topic id to each locale's slug for
 * that post. Vietnamese posts are original translations with their own
 * slugs, not transliterations — e.g. "how-to-trade" is
 * "how-to-trade-on-fomo-app-beginners-guide" in English but
 * "huong-dan-giao-dich-fomo-cho-nguoi-moi" in Vietnamese. A locale/topic
 * combination with no entry means that post hasn't been translated yet.
 */
const BLOG_GROUPS: Record<string, Partial<Record<Locale, string>>> = {
  "how-to-trade": {
    en: "how-to-trade-on-fomo-app-beginners-guide",
    vi: "huong-dan-giao-dich-fomo-cho-nguoi-moi",
    ko: "fomo-app-cocho-gaideu",
    "zh-hant": "fomo-xinshou-jiaoxue",
    de: "fomo-anfaenger-leitfaden",
  },
  "is-fomo-safe": {
    en: "is-fomo-safe-non-custodial-explained",
    vi: "fomo-co-an-toan-khong-kien-truc-non-custodial",
    ko: "fomo-anjeonhan-ga-non-custodial",
    "zh-hant": "fomo-anquan-ma-feituoguan-jiegou",
    de: "fomo-sicherheit-non-custodial",
  },
  "social-trading-app": {
    en: "what-to-look-for-in-a-social-trading-app",
    vi: "tieu-chi-chon-app-trading-social",
    ko: "social-trading-app-seontaek-giojun",
    "zh-hant": "xuanze-social-trading-app-biaozhun",
    de: "social-trading-app-auswahlkriterien",
  },
  "trading-fees": {
    en: "fomo-trading-fees-spot-vs-perpetuals",
    vi: "phi-giao-dich-fomo-spot-va-perpetuals",
    ko: "fomo-susuryo-spot-vs-perpetuals",
    "zh-hant": "fomo-shouxufei-xianhuo-vs-perpetuals",
    de: "fomo-gebuehren-spot-vs-perpetuals",
  },
  "series-b-sec": {
    en: "fomo-75m-series-b-sec-ruling-explained",
    vi: "fomo-goi-von-75m-va-huong-dan-sec-cftc",
    ko: "fomo-75m-tuja-yuchi-sec-cftc",
    "zh-hant": "fomo-75m-rongzi-sec-cftc",
    de: "fomo-75m-finanzierung-sec-cftc",
  },
  "perpetuals-explained": {
    en: "fomo-perpetuals-explained",
    vi: "fomo-perpetuals-la-gi",
    ko: "fomo-perpetuals-seolmyeong",
    "zh-hant": "fomo-perpetuals-shuoming",
    de: "fomo-perpetuals-erklaert",
  },
  // English-only for now — no translation yet, but still needs a BLOG_GROUPS
  // entry (not just a LOCALE_PATHS one) so getBlogPageId() finds it and
  // hreflang/canonical for "en" resolve to the post itself, not the homepage.
  "vs-traditional-exchanges": {
    en: "fomo-vs-traditional-exchanges",
  },
};

/**
 * Resolves a blog post's (locale, slug) to its PageId — the group id if it's
 * part of a known translation group, otherwise a synthetic per-locale key
 * (an English-only post, so it simply has no cross-locale alternates).
 */
export function getBlogPageId(locale: Locale, slug: string): PageId {
  for (const [groupId, slugs] of Object.entries(BLOG_GROUPS)) {
    if (slugs[locale] === slug) return `blog:${groupId}`;
  }
  return `blog:${locale}/${slug}`;
}
