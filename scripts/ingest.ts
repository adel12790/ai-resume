import fs from "fs";
import path from "path";
import pdf from "pdf-parse";

async function main() {
  const pdfPath = path.join(process.cwd(), "public/me/linkedin.pdf");
  const summaryPath = path.join(process.cwd(), "public/me/summary.txt");

  console.log(`Reading PDF from ${pdfPath}...`);
  let pdfContent = "";
  if (fs.existsSync(pdfPath)) {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdf(pdfBuffer);
    pdfContent = pdfData.text;
  } else {
    console.log("PDF not found, skipping.");
  }

  console.log(`Reading summary from ${summaryPath}...`);
  const summary = fs.readFileSync(summaryPath, "utf8");

  const outputPath = path.join(process.cwd(), "lib/resume.ts");
  console.log(`Writing to ${outputPath}...`);
  
  fs.writeFileSync(outputPath, `
export const LINKEDIN = ${JSON.stringify(pdfContent)};
export const SUMMARY = ${JSON.stringify(summary)};
`);
  console.log("Done!");
}

main().catch(console.error);
