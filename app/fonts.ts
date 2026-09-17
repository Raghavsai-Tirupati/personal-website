import localFont from "next/font/local";

// Chrome UI font: Google Sans Flex (SIL OFL). Variable weight axis only.
export const chromeFont = localFont({
  src: [{ path: "./fonts/GoogleSansFlex-latin.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-chrome-src",
  display: "swap",
  fallback: ["Google Sans", "Roboto", "Arial", "sans-serif"],
});

// Document body font: Lato (the font on the real résumé).
export const bodyFont = localFont({
  src: [
    { path: "./fonts/Lato-400-latin.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Lato-400i-latin.woff2", weight: "400", style: "italic" },
    { path: "./fonts/Lato-700-latin.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-body-src",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});
