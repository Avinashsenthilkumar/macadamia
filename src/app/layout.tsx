import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SITE_URL, defaultSiteSettings } from "@/config/site";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultSiteSettings.seo.defaultTitle,
    template: defaultSiteSettings.seo.titleTemplate,
  },
  description: defaultSiteSettings.seo.defaultDescription,
  keywords: defaultSiteSettings.seo.keywords,
  applicationName: "Ganesh Nursery",
  authors: [{ name: "Ganesh Nursery" }],
  formatDetection: { telephone: false },
  openGraph: {
    siteName: "Ganesh Nursery",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/images/site/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#173F2A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${playfair.variable} ${manrope.variable}`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
