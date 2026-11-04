import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { defaultSiteSettings, type SiteSettings } from "@/config/site";
import { mergeSettings } from "@/lib/settings-merge";

export const SITE_SETTINGS_KEY = "site";

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const row = await db.websiteSetting.findUnique({ where: { key: SITE_SETTINGS_KEY } });
    return mergeSettings(row?.value);
  } catch (error) {
    console.error("[settings] falling back to defaults:", error instanceof Error ? error.message : error);
    return defaultSiteSettings;
  }
});
