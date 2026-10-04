/** Founder of Sleep Sanitation (the operator of this site). Same @id as on sleepsanitation.com. */
export const FOUNDER = {
  "@type": "Person",
  "@id": "https://sleepsanitation.com/matthew-brunken#person",
  name: "Matthew Brunken",
  url: "https://sleepsanitation.com/matthew-brunken",
  jobTitle: "Founder",
  worksFor: { "@id": "https://sleepsanitation.com/#business" },
  sameAs: [
    "https://matthewbrunken.me",
    "https://github.com/malexbrunken",
    "https://twitter.com/matthew_brunken",
  ],
} as const;

/** Phone number shown on every page. */
export const PHONE = { display: "(402) 512-5658", tel: "tel:+14025125658" } as const;
