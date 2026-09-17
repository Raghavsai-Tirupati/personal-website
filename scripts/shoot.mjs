import { chromium } from "playwright";

// Usage: node scripts/shoot.mjs <path> <w> <h> <out> [fullPage] [waitMs]
const [, , path = "/", w = "1440", h = "900", out = "design/shots/shot.png", full = "false", waitMs = "700"] =
  process.argv;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: Number(w), height: Number(h) },
  deviceScaleFactor: 2,
});
await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle" });
await page.waitForTimeout(Number(waitMs));
await page.screenshot({ path: out, fullPage: full === "true" });
await browser.close();
console.log("shot ->", out);
