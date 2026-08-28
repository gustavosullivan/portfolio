import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "CANVA CURRICULO");

const files = [
  { html: "curriculo.html", pdf: "curriculo.pdf" },
  { html: "curriculo-en.html", pdf: "curriculo-en.pdf" },
];

const browser = await chromium.launch({ headless: true });

for (const file of files) {
  const htmlPath = path.join(outDir, file.html);
  const pdfPath = path.join(outDir, file.pdf);
  const page = await browser.newPage();
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    pageRanges: "1",
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  await page.close();
  console.log(`Gerado: ${pdfPath}`);
}

await browser.close();
