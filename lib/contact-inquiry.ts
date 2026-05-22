export type ContactReplyChannel = "email" | "inApp";

export interface ContactReply {
  id?: string;
  body: string;
  channel?: ContactReplyChannel;
  createdAt?: string;
  createdByName?: string;
  /** @deprecated use createdAt */
  sentAt?: string;
  /** @deprecated use createdByName */
  sentBy?: { id?: string; name?: string; email?: string } | string | null;
}

export interface ContactInquiryLike {
  email?: string;
  title?: string | null;
  message?: string;
  firstName?: string;
  lastName?: string;
  source?: "imamEmail" | "appSupport";
  replies?: ContactReply[];
}

export function buildContactMailto(contact: ContactInquiryLike): string {
  const email = (contact.email || "").trim();
  if (!email) return "";

  const subject = contact.title?.trim()
    ? `Re: ${contact.title.trim()}`
    : contact.source === "imamEmail"
      ? "Re: Your question to Imam"
      : "Re: Your support message";

  const name = `${contact.firstName || ""} ${contact.lastName || ""}`.trim();
  const greeting = name ? `Assalamu Alaikum ${name},\n\n` : "Assalamu Alaikum,\n\n";
  const original = contact.message?.trim()
    ? `\n\n---\nOriginal message:\n${contact.message.trim()}`
    : "";

  const params = new URLSearchParams();
  params.set("subject", subject);
  params.set("body", `${greeting}${original}`);

  return `mailto:${encodeURIComponent(email)}?${params.toString()}`;
}

export function formatReplyAuthor(reply: ContactReply): string {
  if (reply.createdByName?.trim()) return reply.createdByName.trim();
  const sentBy = reply.sentBy;
  if (!sentBy) return "Admin";
  if (typeof sentBy === "string") return sentBy;
  return sentBy.name || sentBy.email || "Admin";
}

export function getReplyTimestamp(reply: ContactReply): string | undefined {
  return reply.createdAt || reply.sentAt;
}

export function sortRepliesNewestFirst(replies: ContactReply[] | undefined): ContactReply[] {
  if (!replies?.length) return [];
  return [...replies].sort((a, b) => {
    const ta = getReplyTimestamp(a) ? new Date(getReplyTimestamp(a)!).getTime() : 0;
    const tb = getReplyTimestamp(b) ? new Date(getReplyTimestamp(b)!).getTime() : 0;
    return tb - ta;
  });
}
