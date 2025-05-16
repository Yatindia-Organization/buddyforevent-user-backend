// helpers/generateQRCode.ts
import QRCode from "qrcode";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export async function generateQRCode(
  link: string,
  fileName?: string
): Promise<string> {
  const filename = fileName ?? `${uuidv4()}.png`;
  const outputPath = path.join(__dirname, "../../../", "files/qr", filename);

  // Ensure the tmp directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  try {
    await QRCode.toFile(outputPath, link);
    return outputPath;
  } catch (err) {
    console.error("QR Code generation failed:", err);
    throw new Error("Failed to generate QR code");
  }
}

generateQRCode("https://www.youtube.com/");
