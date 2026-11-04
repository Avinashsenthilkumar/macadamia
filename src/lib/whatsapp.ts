export const whatsappMessages = {
  general: "Hello Ganesh Nursery, I would like to know more about your nursery and macadamia plants.",
  plant:
    "Hello Ganesh Nursery, I am interested in macadamia plants. Please share the available varieties, plant specifications and pricing.",
  bulk: "Hello Ganesh Nursery, I would like to enquire about a bulk order of macadamia saplings. Please share availability, specifications and a quotation.",
  consultation:
    "Hello Ganesh Nursery, I am planning a macadamia plantation and would like a consultation. Please let me know how we can proceed.",
} as const;

export type WhatsAppPreset = keyof typeof whatsappMessages;

export function whatsappLink(number: string, message: string) {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function productWhatsAppMessage(productName: string) {
  return `Hello Ganesh Nursery, I am interested in "${productName}". Please share availability, plant specifications and pricing.`;
}
