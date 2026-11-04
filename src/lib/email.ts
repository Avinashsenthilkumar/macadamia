import "server-only";

type Mail = { to: string | string[]; subject: string; html: string; text: string; replyTo?: string };

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

/** Sends via the Resend REST API. Returns false (never throws) so enquiries still succeed if email fails. */
export async function sendEmail(mail: Mail): Promise<boolean> {
  if (!isEmailConfigured()) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: Array.isArray(mail.to) ? mail.to : [mail.to],
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        reply_to: mail.replyTo,
      }),
    });
    if (!res.ok) console.error("[email] Resend error", res.status, await res.text());
    return res.ok;
  } catch (error) {
    console.error("[email] send failed:", error instanceof Error ? error.message : error);
    return false;
  }
}

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function emailLayout(title: string, bodyHtml: string) {
  return `<!doctype html><html><body style="margin:0;background:#F7F5ED;font-family:Arial,sans-serif;color:#252A25">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:16px;overflow:hidden">
  <tr><td style="background:#173F2A;color:#F7F5ED;padding:24px 32px;font-family:Georgia,serif;font-size:22px">Ganesh Nursery</td></tr>
  <tr><td style="padding:32px"><h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 16px;color:#173F2A">${escapeHtml(title)}</h1>${bodyHtml}</td></tr>
  <tr><td style="padding:16px 32px;background:#EEE9DB;font-size:12px;color:#5b5f57">Ganesh Nursery · Natchathira Nagar, Thanjavur, Tamil Nadu 613007</td></tr>
  </table></td></tr></table></body></html>`;
}
