/**
 * One place for the facts that appear in more than one place.
 *
 * The rule this file exists to enforce: if a sentence, a price or a legal
 * detail shows up on the site more than once, it is defined here and imported.
 * The copy said "from $4" for a while after the cheapest product had become
 * $4.90, and the social card still said "$1" — because the number lived in four
 * literals. One place to change is one place to be wrong.
 */

/**
 * The brand sentence, in two lengths, defined once.
 *
 * `tagline` is the short form for headings; `description` is the full sentence
 * used by the footer, the meta description and the structured data. A search
 * result, a shared card, the footer and the About page therefore all say the
 * same thing about what this shop is — the site previously described itself
 * four different ways, which reads as a shop that has not decided yet.
 */
const TAGLINE = "Ready-made resume templates, printables and menu templates";

const DESCRIPTION = `${TAGLINE} — pay once, own forever.`;

export const SITE = {
  name: "Kyno Studio",
  /** The registered entity. Not the same thing as the trading name. */
  legalName: "Kyno Technology Limited",
  /** Hong Kong company number, from the Certificate of Incorporation. */
  companyNumber: "80780298",
  /** Registered office, as printed on the Business Registration Certificate. */
  registeredAddress:
    "Unit 1603, 16/F, The L. Plaza, 367-375 Queen's Road Central, Sheung Wan, Hong Kong",
  domain: "kynocreative.com",
  url: "https://www.kynocreative.com",

  tagline: TAGLINE,
  description: DESCRIPTION,

  /**
   * Public-facing address: what buyers email and what is shown on the site.
   *
   * Still the operator's inbox, not support@kynocreative.com, because that
   * address cannot receive mail yet — the domain has no MX record and nothing
   * on the VPS listens on port 25, so mail to it bounces. This matters more
   * than it looks: `src/lib/email.ts` sets this as the Reply-To on every order
   * email, and /terms, /privacy and /license all tell buyers to write here (to
   * request a refund, or to exercise a data right). An address that is clean
   * and dead is worse than one that is ugly and read — a bounced refund
   * request is a chargeback.
   *
   * Unblock it by pointing the domain's mail at a forwarding rule
   * (support@ → the operator inbox) at the DNS provider; no mailbox or mail
   * server is needed for that. Then change this line.
   */
  contactEmail: process.env.CONTACT_EMAIL || "33429296@qq.com",
  fromEmail: process.env.RESEND_FROM_EMAIL || "Kyno Studio <noreply@kynocreative.com>",
  /**
   * Where the contact form and order notifications are delivered. Deliberately
   * separate from contactEmail: this is the inbox the operator actually reads,
   * and it must keep working even if the public address is not yet provisioned.
   */
  adminEmail: process.env.ADMIN_EMAIL || "33429296@qq.com",

  // The cheapest paid product. The hero and three meta descriptions all make
  // this claim. Update this whenever the lowest price changes.
  priceFrom: "$4.90",
} as const;

/** The site-wide meta description: the brand sentence plus the entry price. */
export const META_DESCRIPTION = `${DESCRIPTION} From ${SITE.priceFrom}.`;
