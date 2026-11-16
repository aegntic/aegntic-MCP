/** Signing keys must be supplied by deployment configuration, never source defaults. */
export function requireJwtSecret(value: unknown): string {
  if (typeof value !== "string" || Buffer.byteLength(value, "utf8") < 32 || value.trim() !== value) {
    throw new Error("JWT_SECRET must be explicitly configured with at least 32 bytes and no surrounding whitespace");
  }
  return value;
}
