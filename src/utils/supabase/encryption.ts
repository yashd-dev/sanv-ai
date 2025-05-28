import crypto from "crypto";
import zlib from "zlib";

const algorithm = "aes-256-cbc";
const secretKey = process.env.MESSAGE_ENCRYPTION_KEY!;
const key = Buffer.from(secretKey, "hex"); // 32 bytes hex string

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  // Compress with gzip
  const compressed = zlib.gzipSync(text);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(compressed);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("base64") + ":" + encrypted.toString("base64");
}

export function decrypt(encrypted: string): string {
  const [ivB64, encryptedB64] = encrypted.split(":");
  const iv = Buffer.from(ivB64, "base64");
  const encryptedText = Buffer.from(encryptedB64, "base64");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  // Decompress with gunzip
  return zlib.gunzipSync(decrypted).toString("utf8");
}
