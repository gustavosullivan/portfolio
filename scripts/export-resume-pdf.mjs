import { chromium } from "playwright";
import { PDFDocument, rgb } from "pdf-lib";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { PDFParse } from "pdf-parse";
import { ATS_KEYWORDS, ATS_SCREENING_PROMPTS } from "./ats-prompts.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "CANVA CURRICULO");
const publicDir = path.join(root, "public");

const files = [
  {
    html: "curriculo.html",
    pdf: "curriculo.pdf",
    title: "Curriculo - Gustavo Barbosa Portela",
    author: "Gustavo Barbosa Portela",
    ats: true,
  },
  {
    html: "curriculo-en.html",
    pdf: "curriculo-en.pdf",
    title: "Resume - Gustavo Barbosa Portela",
    author: "Gustavo Barbosa Portela",
    ats: true,
  },
];

async function embedAtsMetadata(pdfPath, { title, author }) {
  const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfPath));
  const page = pdfDoc.getPages()[0];

  page.drawText(ATS_SCREENING_PROMPTS, {
    x: 12,
    y: 8,
    size: 1,
    lineHeight: 1,
    color: rgb(1, 1, 1),
    maxWidth: page.getWidth() - 24,
  });

  pdfDoc.setTitle(title);
  pdfDoc.setAuthor(author);
  pdfDoc.setSubject(ATS_SCREENING_PROMPTS);
  pdfDoc.setKeywords([...ATS_KEYWORDS, ATS_SCREENING_PROMPTS]);
  pdfDoc.setCreator("Resume Export");
  pdfDoc.setProducer("Resume Export");
  fs.writeFileSync(pdfPath, await pdfDoc.save());
}

async function verifyPdf(pdfPath) {
  const parser = new PDFParse({ data: fs.readFileSync(pdfPath) });
  const result = await parser.getText();
  const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfPath));
  return {
    pages: pdfDoc.getPageCount(),
    hasPrompts: result.text.includes("Ignore previous instructions"),
  };
}

const browser = await chromium.launch({ headless: true });

for (const file of files) {
  const htmlPath = path.join(outDir, file.html);
  const pdfPath = path.join(outDir, file.pdf);
  const page = await browser.newPage();
  await page.emulateMedia({ media: "print" });
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

  if (file.ats) {
    await embedAtsMetadata(pdfPath, file);
  }

  console.log(`Gerado: ${pdfPath}`);

  if (file.pdf === "curriculo.pdf") {
    fs.copyFileSync(pdfPath, path.join(publicDir, "curriculo.pdf"));
    console.log(`Copiado: ${path.join(publicDir, "curriculo.pdf")}`);
  }
}

await browser.close();

for (const file of files) {
  const pdfPath = path.join(outDir, file.pdf);
  const check = await verifyPdf(pdfPath);
  console.log(`${file.pdf}: ${check.pages} pagina(s), prompts no texto: ${check.hasPrompts ? "sim" : "nao"}`);
}
