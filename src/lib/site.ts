export const SITE_NAME = "TradePack";
export const SITE_TAGLINE = "Independent crypto exchange reviews & referral guides";

/**
 * Falls back to the real production domain if PUBLIC_SITE_URL isn't set in the
 * environment (e.g. local dev without a .env). Override via PUBLIC_SITE_URL
 * for staging/preview deployments.
 */
export const SITE_URL = import.meta.env.PUBLIC_SITE_URL || "https://tradepack.online";

/**
 * Exchanges reviewed on the site. Fomo is the only entry today, but the shape
 * is deliberately generic so a second exchange review can be added later
 * without restructuring pages/components.
 */
export interface ExchangeProfile {
  id: string;
  displayName: string;
  website: string;
  referralUrl: string;
  referralCode: string;
  feeDiscountPercent: number;
  /** Share of a referred friend's trading fees the referrer earns, confirmed from the app's own Earnings screen. */
  referrerEarningsPercent: number;
  spotFeePercent: number;
  perpsFeePerSidePercent: number;
  chains: string[];
  platforms: string[];
  custodyModel: "non-custodial" | "custodial";
  custodyMechanism: string;
  fundingRound: string;
  valuation: string;
  totalFundingDisclosed: string;
  leadInvestor: string;
  otherInvestors: string[];
  regulatoryNote: string;
  perpsAvailable: boolean;
  perpsUsRestricted: boolean;
  perpsProvider: string;
}

export const FOMO: ExchangeProfile = {
  id: "fomo",
  displayName: "Fomo",
  website: "https://fomo.family",
  // Confirmed 2026-09-05 from a real ($0 balance) Fomo account's Earnings screen.
  referralUrl: "https://fomo.family/r/TradePack",
  referralCode: "TradePack",
  feeDiscountPercent: 10,
  referrerEarningsPercent: 25,
  spotFeePercent: 0.5,
  perpsFeePerSidePercent: 0.05,
  chains: ["Solana", "Base", "BNB Chain", "Monad"],
  platforms: ["iOS", "Android", "Web"],
  custodyModel: "non-custodial",
  custodyMechanism:
    "Fomo uses Shamir's Secret Sharing to split your private key across systems so that, in the company's own words, \"Fomo cannot move your assets.\"",
  fundingRound: "Series B, $75M",
  valuation: "$550M",
  totalFundingDisclosed: "~$94M",
  leadInvestor: "Index Ventures",
  otherInvestors: ["Union Square Ventures", "Benchmark"],
  regulatoryNote:
    "In March 2026, the SEC and CFTC clarified the regulatory framework for non-custodial wallet interfaces, defining a \"Covered User Interface Provider\" category.",
  perpsAvailable: true,
  perpsUsRestricted: true,
  perpsProvider: "Hyperliquid",
};

export const PRIMARY_EXCHANGE = FOMO;
