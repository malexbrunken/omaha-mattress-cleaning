/** FAQPage JSON-LD from a visible FAQ list. Answers may contain simple HTML; schema gets plain text. */
export type Faq = { q: string; a: string };
export const stripHtml = (h: string) => h.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
export const faqLd = (faq: Faq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: stripHtml(f.q), acceptedAnswer: { "@type": "Answer", text: stripHtml(f.a) } })),
});
