import { defaultSiteSettings, type SiteSettings } from "@/config/site";

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Deep-merges stored settings over the defaults so new fields always have a value */
export function mergeSettings(stored: unknown): SiteSettings {
  if (!isObject(stored)) return defaultSiteSettings;
  const merge = (base: unknown, over: unknown): unknown => {
    if (Array.isArray(base)) return Array.isArray(over) ? over : base;
    if (isObject(base)) {
      const out: Record<string, unknown> = { ...base };
      if (isObject(over)) {
        for (const key of Object.keys(base)) {
          if (key in over) out[key] = merge(base[key], over[key]);
        }
      }
      return out;
    }
    if (over === undefined || over === null) return base;
    return typeof over === typeof base ? over : base;
  };
  return merge(defaultSiteSettings, stored) as SiteSettings;
}
