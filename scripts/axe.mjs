import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const base = "http://localhost:3100";
const routes = ["/", "/acsi", "/iris", "/brinks"];
const browser = await chromium.launch();
let total = 0;

for (const route of routes) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(base + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const violations = results.violations.filter((v) => v.impact !== "minor");
  total += violations.length;
  console.log(`\n=== ${route} : ${violations.length} violation(s) ===`);
  for (const v of violations) {
    console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`);
    console.log(`     ${v.nodes[0]?.target?.join(" ")}`);
  }
  await context.close();
}
await browser.close();
console.log(`\nTOTAL non-minor violations: ${total}`);
