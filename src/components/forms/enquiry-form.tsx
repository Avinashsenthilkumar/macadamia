"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import { submitEnquiry } from "@/actions/enquiry";
import { Button, ArrowSlide, buttonClasses } from "@/components/ui/button";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/form";
import { WhatsAppIcon } from "@/components/layout/whatsapp-float";
import { enquiryTypeLabels, enquiryTypes, indianStates, type EnquiryTypeKey } from "@/lib/labels";
import { enquiryFormSchema, type EnquiryFormValues } from "@/lib/validations/enquiry";
import { whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type Props = {
  whatsappNumber: string;
  defaultType?: EnquiryTypeKey;
  productId?: string;
  productName?: string;
  serviceId?: string;
  serviceName?: string;
  source?: string;
  compact?: boolean;
  /** When provided, visitors can choose which service they are enquiring about */
  serviceOptions?: { id: string; title: string }[];
};

export function EnquiryForm({ whatsappNumber, defaultType = "GENERAL", productId, productName, serviceId, serviceName, source = "contact", compact = false, serviceOptions }: Props) {
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const defaultMessage = productName
    ? `I am interested in ${productName}. Please share availability, specifications and pricing.`
    : serviceName
      ? `I would like to know more about your ${serviceName.toLowerCase()} service.`
      : "";

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquiryFormSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      state: "Tamil Nadu",
      district: "",
      location: "",
      landArea: "",
      plantsRequired: "",
      enquiryType: defaultType,
      message: defaultMessage,
      productId: productId ?? "",
      serviceId: serviceId ?? "",
      source,
      website: "",
      startedAt: "",
    },
  });

  useEffect(() => {
    setValue("startedAt", String(Date.now()));
  }, [setValue]);

  const onSubmit = (values: EnquiryFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const res = await submitEnquiry(values);
      if (res.ok) {
        setReference(res.reference);
        reset({ ...values, fullName: "", phone: "", email: "", message: defaultMessage, plantsRequired: "", landArea: "", location: "", district: "" });
      } else {
        setServerError(res.error);
        if (res.fieldErrors) {
          for (const [field, message] of Object.entries(res.fieldErrors)) {
            setError(field as keyof EnquiryFormValues, { message });
          }
        }
      }
    });
  };

  const whatsappHref = () => {
    const v = getValues();
    const lines = [
      `Hello Ganesh Nursery, ${v.message || "I would like to make an enquiry."}`,
      v.fullName && `Name: ${v.fullName}`,
      v.enquiryType && `Enquiry: ${enquiryTypeLabels[v.enquiryType]}`,
      productName && `Product: ${productName}`,
      (v.district || v.state) && `Location: ${[v.location, v.district, v.state].filter(Boolean).join(", ")}`,
      v.landArea && `Land area: ${v.landArea}`,
      v.plantsRequired && `Plants required: ${v.plantsRequired}`,
    ].filter(Boolean);
    return whatsappLink(whatsappNumber, lines.join("\n"));
  };

  const field = (name: keyof EnquiryFormValues) => ({
    id: `enq-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `enq-${name}-error` : undefined,
  });

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {reference ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="flex flex-col items-center rounded-3xl bg-forest px-6 py-14 text-center text-ivory"
            role="status"
            aria-live="polite"
          >
            <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}>
              <CheckCircle2 className="h-16 w-16 text-sage" />
            </motion.div>
            <h3 className="mt-6 font-display text-3xl">Thank you — we&apos;ve received your enquiry.</h3>
            <p className="mt-3 max-w-md text-ivory/75">
              Your reference number is <strong className="text-ivory">{reference}</strong>. Our team will contact you soon.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={whatsappLink(whatsappNumber, `Hello Ganesh Nursery, I just submitted enquiry ${reference} on your website.`)} target="_blank" rel="noopener noreferrer" className={buttonClasses({ variant: "whatsapp" })}>
                <WhatsAppIcon className="h-5 w-5" /> Follow up on WhatsApp
              </a>
              <Button variant="outline-light" onClick={() => setReference(null)}>
                <RotateCcw className="h-4 w-4" /> Send another enquiry
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            {/* Honeypot — hidden from people, tempting for bots */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="enq-website">Website</label>
              <input id="enq-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
            </div>
            <input type="hidden" {...register("startedAt")} />
            <input type="hidden" {...register("productId")} />
            {!serviceOptions?.length ? <input type="hidden" {...register("serviceId")} /> : null}
            <input type="hidden" {...register("source")} />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="enq-fullName" required>Full name</Label>
                <Input {...field("fullName")} autoComplete="name" placeholder="Your name" {...register("fullName")} />
                <FieldError id="enq-fullName-error" message={errors.fullName?.message} />
              </div>
              <div>
                <Label htmlFor="enq-phone" required>Mobile number</Label>
                <Input {...field("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" {...register("phone")} />
                <FieldError id="enq-phone-error" message={errors.phone?.message} />
              </div>
              <div>
                <Label htmlFor="enq-email">Email</Label>
                <Input {...field("email")} type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />
                <FieldError id="enq-email-error" message={errors.email?.message} />
              </div>
              <div>
                <Label htmlFor="enq-enquiryType" required>Enquiry type</Label>
                <Select {...field("enquiryType")} {...register("enquiryType")}>
                  {enquiryTypes.map((t) => (
                    <option key={t} value={t}>
                      {enquiryTypeLabels[t]}
                    </option>
                  ))}
                </Select>
                <FieldError id="enq-enquiryType-error" message={errors.enquiryType?.message} />
              </div>
            </div>

            {serviceOptions?.length ? (
              <div>
                <Label htmlFor="enq-serviceId">Service of interest</Label>
                <Select {...field("serviceId")} {...register("serviceId")}>
                  <option value="">Not sure yet / general</option>
                  {serviceOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </Select>
              </div>
            ) : null}

            {!compact ? (
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <Label htmlFor="enq-state">State</Label>
                  <Select {...field("state")} autoComplete="address-level1" {...register("state")}>
                    <option value="">Select state</option>
                    {indianStates.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="enq-district">District</Label>
                  <Input {...field("district")} placeholder="e.g. Thanjavur" {...register("district")} />
                  <FieldError id="enq-district-error" message={errors.district?.message} />
                </div>
                <div>
                  <Label htmlFor="enq-location">Village / town</Label>
                  <Input {...field("location")} autoComplete="address-level2" placeholder="Your location" {...register("location")} />
                  <FieldError id="enq-location-error" message={errors.location?.message} />
                </div>
              </div>
            ) : null}

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="enq-landArea">Land area</Label>
                <Input {...field("landArea")} placeholder="e.g. 2 acres" {...register("landArea")} />
                <FieldError id="enq-landArea-error" message={errors.landArea?.message} />
              </div>
              <div>
                <Label htmlFor="enq-plantsRequired">Number of plants required</Label>
                <Input {...field("plantsRequired")} inputMode="numeric" placeholder="e.g. 200" {...register("plantsRequired")} />
                <FieldError id="enq-plantsRequired-error" message={errors.plantsRequired?.message} />
              </div>
            </div>

            <div>
              <Label htmlFor="enq-message" required>Message</Label>
              <Textarea {...field("message")} rows={compact ? 3 : 5} placeholder="Tell us about your land, water source, timeline and questions." {...register("message")} />
              <FieldError id="enq-message-error" message={errors.message?.message} />
            </div>

            <AnimatePresence>
              {serverError ? (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
                  {serverError}
                </motion.p>
              ) : null}
            </AnimatePresence>

            <div className={cn("flex flex-col gap-3 pt-1 sm:flex-row sm:items-center")}>
              <Button type="submit" size="lg" disabled={pending} className="sm:min-w-56">
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    Send enquiry <ArrowSlide />
                  </>
                )}
              </Button>
              <Button variant="whatsapp" size="lg" onClick={() => window.open(whatsappHref(), "_blank", "noopener,noreferrer")}>
                <WhatsAppIcon className="h-5 w-5" /> Send via WhatsApp instead
              </Button>
            </div>
            <p className="text-xs text-ink/55">
              We use your details only to respond to this enquiry. See our{" "}
              <Link href="/privacy-policy" className="underline underline-offset-2">privacy policy</Link>.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
