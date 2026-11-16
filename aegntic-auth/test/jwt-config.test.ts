import { describe, expect, test } from "bun:test";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import jwt from "jsonwebtoken";
import { requireJwtSecret } from "../src/jwt-config";
import { SupabaseAuthManager } from "../src/supabase-client";
import { AuthManager } from "../src/auth-manager";
import { StripeLicenseManager } from "../src/stripe-license-manager";

const key = () => randomBytes(32).toString("base64");
const makeManager = (secret: string) => new SupabaseAuthManager("https://example.invalid", "offline-test-key", secret);
const issue = (manager: SupabaseAuthManager) => (manager as unknown as { generateApiKey(email: string): string }).generateApiKey("security-test@example.invalid");
const withEnv = (values: Record<string, string | undefined>, fn: () => void) => {
  const previous = Object.fromEntries(Object.keys(values).map(k => [k, process.env[k]]));
  try {
    for (const [k,v] of Object.entries(values)) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }
    fn();
  } finally {
    for (const [k,v] of Object.entries(previous)) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }
  }
};

describe("explicit JWT signing configuration", () => {
  test("rejects missing, empty, short and padded values without echoing them", () => {
    for (const value of [undefined, null, "", "short-test-value", " ".repeat(40), " " + key(), key() + " "]) {
      expect(() => requireJwtSecret(value)).toThrow("JWT_SECRET must be explicitly configured");
      if (typeof value === "string" && value.length) {
        try { requireJwtSecret(value); } catch (error) { expect(String(error)).not.toContain(value); }
      }
    }
  });
  test("does not silently default the Supabase signer", () => {
    expect(() => makeManager(undefined as unknown as string)).toThrow("JWT_SECRET");
    const value = key(); expect(requireJwtSecret(value)).toBe(value);
  });
  test("tokens verify only with the configured key", () => {
    const secret = key(); const token = issue(makeManager(secret));
    expect((jwt.verify(token, secret, { algorithms: ["HS256"] }) as jwt.JwtPayload).email).toBe("security-test@example.invalid");
    expect(() => jwt.verify(token, key(), { algorithms: ["HS256"] })).toThrow();
  });
  test("iat uses seconds and expiration is one year, not milliseconds", () => {
    const secret = key(); const token = issue(makeManager(secret));
    const payload = jwt.verify(token, secret) as jwt.JwtPayload;
    expect(Math.abs(payload.iat! - Math.floor(Date.now()/1000))).toBeLessThan(5);
    expect(payload.exp! - payload.iat!).toBe(365.25 * 24 * 60 * 60);
    expect(() => jwt.verify(token, secret, { clockTimestamp: payload.exp! + 1 })).toThrow("jwt expired");
  });
  test("separate keys cannot validate each other's tokens", () => {
    const oldKey = key(), newKey = key();
    expect(() => jwt.verify(issue(makeManager(oldKey)), newKey)).toThrow();
    expect(() => jwt.verify(issue(makeManager(newKey)), oldKey)).toThrow();
  });
  test("legacy signer also fails closed, including mock mail mode", () => {
    withEnv({ JWT_SECRET: undefined, MOCK_EMAIL_SERVICE: "true" }, () => expect(() => new AuthManager()).toThrow("JWT_SECRET"));
    withEnv({ JWT_SECRET: key() }, () => expect(new AuthManager()).toBeInstanceOf(AuthManager));
  });
  test("Stripe fallback receives an explicit configured key even in mock mode", () => {
    withEnv({ JWT_SECRET: undefined, MOCK_PAYMENT_SERVICE: "true", SUPABASE_URL: "https://example.invalid", SUPABASE_ANON_KEY: "offline-test-key" }, () => expect(() => new StripeLicenseManager()).toThrow("JWT_SECRET"));
    withEnv({ JWT_SECRET: key(), MOCK_PAYMENT_SERVICE: "true", SUPABASE_URL: "https://example.invalid", SUPABASE_ANON_KEY: "offline-test-key" }, () => expect(new StripeLicenseManager()).toBeInstanceOf(StripeLicenseManager));
  });
  test("main entry point explicitly passes validated configuration", () => {
    const source = readFileSync(new URL("../src/index.ts", import.meta.url), "utf8");
    expect(source).toContain("new SupabaseAuthManager(SUPABASE_URL, SUPABASE_ANON_KEY, requireJwtSecret(process.env.JWT_SECRET))");
  });
});
