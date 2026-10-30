import { site } from "./site";

// Enable each channel only after the owner provides its destination.
export const contactChannels = [
  { id: "youtube", label: "유튜브", href: null },
  { id: "community", label: "카페·커뮤니티", href: null },
  { id: "link", label: "외부 링크", href: null },
  { id: "email", label: "이메일 문의", href: site.supportHref },
  { id: "rss", label: "RSS", href: null },
  { id: "instagram", label: "인스타그램", href: null },
  { id: "threads", label: "스레드", href: null },
] as const;

export type ContactChannelId = (typeof contactChannels)[number]["id"];
