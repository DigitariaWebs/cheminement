import crypto from "crypto";

/**
 * AES-256-GCM at rest for Stripe payment method references (`pm_...`) stored in MongoDB.
 *
 * PCI-DSS: full card numbers, CVV, etc. must never touch our database — Stripe Elements
 * tokenizes them. This layer encrypts the opaque Stripe IDs we persist (defense in depth).
 *
 * Set FIELD_ENCRYPTION_KEY to 32 raw bytes encoded as base64, e.g.:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
 *
 * If the key is missing, values are stored in plaintext (development only — set the key in production).
 */

const PREFIX = "v1.";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

let cachedKey: Buffer | null | undefined;

function getKey(): Buffer | null {
  if (cachedKey !== undefined) {
    return cachedKey;
  }
  const b64 = process.env.FIELD_ENCRYPTION_KEY;
  if (!b64) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[field-encryption] FIELD_ENCRYPTION_KEY is not set — payment method references are stored without application-level encryption.",
      );
    }
    cachedKey = null;
    return cachedKey;
  }
  const buf = Buffer.from(b64, "base64");
  if (buf.length !== 32) {
    console.error(
      "[field-encryption] FIELD_ENCRYPTION_KEY must decode to exactly 32 bytes (AES-256).",
    );
    cachedKey = null;
    return cachedKey;
  }
  cachedKey = buf;
  return cachedKey;
}

/**
 * Encrypt a Stripe payment method id (or other short secret ref) for MongoDB storage.
 */
export function encryptPaymentMethodReference(plain: string | undefined): string | undefined {
  if (plain === undefined || plain === "") {
    return plain;
  }
  const key = getKey();
  if (!key) {
    return plain;
  }
  if (plain.startsWith(PREFIX)) {
    return plain;
  }
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plain, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  const packed = Buffer.concat([iv, tag, encrypted]).toString("base64url");
  return `${PREFIX}${packed}`;
}

/**
 * Decrypt a stored value for use with Stripe APIs. Plaintext legacy values pass through.
 */
export function decryptPaymentMethodReference(
  stored: string | undefined,
): string | undefined {
  if (stored === undefined || stored === "") {
    return stored;
  }
  if (!stored.startsWith(PREFIX)) {
    return stored;
  }
  const key = getKey();
  if (!key) {
    console.error(
      "[field-encryption] Cannot decrypt payment method reference: FIELD_ENCRYPTION_KEY missing.",
    );
    return stored;
  }
  try {
    const packed = Buffer.from(stored.slice(PREFIX.length), "base64url");
    const iv = packed.subarray(0, IV_LENGTH);
    const tag = packed.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const enc = packed.subarray(IV_LENGTH + TAG_LENGTH);
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(enc), decipher.final()]).toString(
      "utf8",
    );
  } catch (e) {
    console.error("[field-encryption] Decrypt failed:", e);
    return stored;
  }
}
