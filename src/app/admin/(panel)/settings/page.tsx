import Image from "next/image";
import { saveSettings } from "@/actions/admin/settings";
import { ActionForm } from "@/components/admin/action-form";
import { TextAreaField, TextField, Toggle } from "@/components/admin/fields";
import { ImagePicker } from "@/components/admin/image-picker";
import { AdminPageHeader, Panel } from "@/components/admin/ui";
import { requirePageUser } from "@/lib/auth";
import { isEmailConfigured } from "@/lib/email";
import { getSiteSettings } from "@/lib/settings";
import { isCloudinaryConfigured } from "@/lib/upload";

export default async function SettingsPage() {
  await requirePageUser("ADMIN");
  const s = await getSiteSettings();
  const [a1, a2] = s.addresses;

  return (
    <>
      <AdminPageHeader title="Website settings" description="Business details used across the website, footer, contact page, WhatsApp buttons and SEO." />
      <div className="mb-6 flex flex-wrap gap-3 text-sm">
        <span className={`rounded-full px-4 py-2 font-semibold ${isEmailConfigured() ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}>
          Email notifications: {isEmailConfigured() ? "configured" : "not configured (set RESEND_API_KEY & EMAIL_FROM)"}
        </span>
        <span className={`rounded-full px-4 py-2 font-semibold ${isCloudinaryConfigured() ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}>
          Image storage: {isCloudinaryConfigured() ? "Cloudinary" : "local only (set Cloudinary keys for production)"}
        </span>
      </div>

      <ActionForm action={saveSettings} submitLabel="Save settings" className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-2">
          <Panel title="Business">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField name="businessName" label="Business name" required defaultValue={s.businessName} />
              <TextField name="established" label="Established (year)" type="number" required defaultValue={s.established} />
              <TextField name="tagline" label="Tagline" required defaultValue={s.tagline} className="sm:col-span-2" />
              <TextField name="experienceLabel" label="Experience label" required defaultValue={s.experienceLabel} hint="e.g. 45+" />
              <TextField name="announcement" label="Announcement bar" defaultValue={s.announcement} hint="Leave blank to hide" />
            </div>
          </Panel>

          <Panel title="Contact">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField name="phonePrimary" label="Primary phone" required defaultValue={s.phones.primary} />
              <TextField name="phoneSecondary" label="Secondary phone" defaultValue={s.phones.secondary} />
              <TextField name="phoneAdditional" label="Additional phone" defaultValue={s.phones.additional} />
              <TextField name="whatsappNumber" label="WhatsApp number" required defaultValue={s.whatsappNumber} hint="With country code, digits only" />
              <TextField name="email" label="Email" type="email" required defaultValue={s.email} className="sm:col-span-2" />
              <TextAreaField name="businessHours" label="Business hours (one line each)" rows={3} defaultValue={s.businessHours.join("\n")} className="sm:col-span-2" />
            </div>
          </Panel>

          {([1, 2] as const).map((n) => {
            const a = n === 1 ? a1 : a2;
            return (
              <Panel key={n} title={`Address ${n}`}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField name={`address${n}Label`} label="Label" defaultValue={a?.label} />
                  <TextField name={`address${n}Line1`} label="Address line 1" defaultValue={a?.line1} />
                  <TextField name={`address${n}Line2`} label="Address line 2" defaultValue={a?.line2} />
                  <TextField name={`address${n}City`} label="City" defaultValue={a?.city} />
                  <TextField name={`address${n}State`} label="State" defaultValue={a?.state} />
                  <TextField name={`address${n}Postal`} label="PIN code" defaultValue={a?.postalCode} />
                </div>
              </Panel>
            );
          })}

          <Panel title="Social media">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField name="facebook" label="Facebook URL" defaultValue={s.social.facebook} />
              <TextField name="instagram" label="Instagram URL" defaultValue={s.social.instagram} />
              <TextField name="youtube" label="YouTube URL" defaultValue={s.social.youtube} />
              <TextField name="linkedin" label="LinkedIn URL" defaultValue={s.social.linkedin} />
            </div>
          </Panel>

          <Panel title="Brand images">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-semibold text-deep">Logo</p>
                <div className="relative mb-3 h-16 w-16 overflow-hidden rounded-xl bg-cream">
                  <Image src={s.logoUrl} alt="Current logo" fill sizes="64px" unoptimized className="object-contain" />
                </div>
                <ImagePicker name="logo" label="Replace logo" />
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-deep">Homepage hero image</p>
                <div className="relative mb-3 aspect-video overflow-hidden rounded-xl bg-cream">
                  <Image src={s.heroImage} alt="Current hero image" fill sizes="240px" className="object-cover" />
                </div>
                <ImagePicker name="heroImage" label="Replace hero image" hint="Wide landscape photo, ideally a genuine orchard image" />
                <TextField name="heroImageAlt" label="Hero image alt text" defaultValue={s.heroImageAlt} className="mt-3" />
              </div>
            </div>
          </Panel>

          <Panel title="SEO defaults">
            <div className="space-y-4">
              <TextField name="seoDefaultTitle" label="Default title" required defaultValue={s.seo.defaultTitle} />
              <TextAreaField name="seoDefaultDescription" label="Default description" rows={3} defaultValue={s.seo.defaultDescription} />
              <TextAreaField name="seoKeywords" label="Keywords (comma separated)" rows={3} defaultValue={s.seo.keywords.join(", ")} />
            </div>
          </Panel>

          <Panel title="Display options">
            <div className="space-y-3">
              <Toggle name="showPrices" label="Show fixed prices on the website" hint="Products also need their own 'show price' switch on" defaultChecked={s.showPrices} />
              <Toggle name="showPlantationProcess" label="Show the 4-step plantation process on the homepage" hint="Turn off until the services involved are confirmed" defaultChecked={s.showPlantationProcess} />
            </div>
          </Panel>
        </div>
      </ActionForm>
    </>
  );
}
