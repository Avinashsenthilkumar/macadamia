/**
 * Default business information.
 *
 * These values are the starting point only. Every field here can be overridden from
 * Admin → Website Settings (stored in the WebsiteSetting table under the key "site").
 * Items marked CONFIRM must be verified by Ganesh Nursery before launch.
 */

export type Address = {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  mapsQuery: string;
};

export type SiteSettings = {
  businessName: string;
  shortName: string;
  tagline: string;
  announcement: string;
  logoUrl: string;
  heroImage: string;
  heroImageAlt: string;
  established: number;
  experienceLabel: string;
  phones: { primary: string; secondary: string; additional: string };
  whatsappNumber: string;
  email: string;
  addresses: Address[];
  businessHours: string[];
  social: { facebook: string; instagram: string; youtube: string; linkedin: string };
  relatedSites: { label: string; url: string }[];
  seo: { defaultTitle: string; titleTemplate: string; defaultDescription: string; keywords: string[] };
  /** Global switch; individual products also have their own showPrice flag */
  showPrices: boolean;
  /** Show the 4-step plantation process on the homepage (turn off until services are confirmed) */
  showPlantationProcess: boolean;
};

export const defaultSiteSettings: SiteSettings = {
  businessName: "Ganesh Nursery",
  shortName: "Ganesh Nursery",
  tagline: "Grow Today. Harvest Tomorrow. Build a Greener Future.",
  announcement: "Macadamia plant & plantation enquiries are open — talk to our team on WhatsApp.",
  logoUrl: "/logo/ganesh-nursery-mark.svg",
  // Illustrative orchard image — CONFIRM: replace with a genuine Ganesh Nursery orchard photo when available
  heroImage: "/images/orchard/macadamia-tree-orchard.webp",
  heroImageAlt: "Mature macadamia tree in an orchard",
  established: 1980,
  experienceLabel: "45+",
  phones: {
    primary: "+91 99431 19955",
    secondary: "+91 86808 88018",
    additional: "+91 99432 59955",
  },
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919943119955",
  email: "care@ganeshnursery.com",
  addresses: [
    {
      label: "Main office",
      line1: "Natchathira Nagar",
      city: "Thanjavur",
      state: "Tamil Nadu",
      postalCode: "613007",
      mapsQuery: "Ganesh Nursery, Natchathira Nagar, Thanjavur, Tamil Nadu 613007",
    },
    {
      label: "Nursery",
      line1: "Block 1, Gandharvakottai",
      city: "Pudukkottai",
      state: "Tamil Nadu",
      postalCode: "613301",
      mapsQuery: "Gandharvakottai, Pudukkottai, Tamil Nadu 613301",
    },
  ],
  // CONFIRM: business hours
  businessHours: ["Monday – Saturday: 9:00 AM – 6:00 PM", "Sunday: By appointment"],
  social: { facebook: "", instagram: "", youtube: "", linkedin: "" },
  relatedSites: [
    { label: "ganeshnursery.co.in", url: "https://ganeshnursery.co.in/" },
    { label: "indiansandal.com", url: "https://indiansandal.com/" },
  ],
  seo: {
    defaultTitle: "Macadamia Plants & Saplings in India | Ganesh Nursery, Thanjavur",
    titleTemplate: "%s | Ganesh Nursery",
    defaultDescription:
      "Ganesh Nursery, Thanjavur — nursery experience since 1980. Explore macadamia nut plants, macadamia saplings, cultivation guidance and plantation support for farmers across India.",
    keywords: [
      "macadamia plants in India",
      "macadamia nut plants",
      "macadamia saplings",
      "macadamia nursery",
      "macadamia plantation",
      "macadamia farming in Tamil Nadu",
      "macadamia plants in Thanjavur",
      "Ganesh Nursery macadamia plants",
    ],
  },
  showPrices: false,
  showPlantationProcess: true,
};

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/macadamia-plants", label: "Macadamia Plants" },
  { href: "/cultivation-guide", label: "Cultivation Guide" },
  { href: "/plantation-services", label: "Plantation Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerNav = {
  explore: [
    { href: "/why-macadamia", label: "Why Macadamia?" },
    { href: "/macadamia-plants", label: "Macadamia Plants" },
    { href: "/cultivation-guide", label: "Cultivation Guide" },
    { href: "/plantation-services", label: "Plantation Services" },
  ],
  company: [
    { href: "/about", label: "About Ganesh Nursery" },
    { href: "/gallery", label: "Gallery" },
    { href: "/blog", label: "Knowledge Centre" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Use" },
  ],
};
