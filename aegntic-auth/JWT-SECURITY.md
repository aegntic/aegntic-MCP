# JWT signing configuration

The auth service requires `JWT_SECRET` before startup. Supply it through the deployment's secret store. Generate a unique cryptographically random value with at least 32 random bytes, encoded as base64. Never put a real value in source, tests, example files, command logs or subscriber metadata.

The constructor rejects missing, short or whitespace-padded configuration. Length validation is not an entropy guarantee: operators must generate randomness, not use a long phrase. Mock email/payment modes do not bypass signing configuration. Offline tests generate ephemeral random keys and never contact a live service.

## Deployment warning

This change deliberately fails startup if the deployment has not configured the secret. Configure each identified issuer and verifier before rollout. This PR does not deploy, rotate production credentials, invalidate existing API keys, or prove a live consumer exists.

If an issuer has used the public source default, treat its keys as compromised. Coordinate replacing the signing key, rejecting tokens signed with the former key, and reissuing affected API keys. Do not retain an acceptance window for a publicly known key. Identify consumers before changing them to avoid silently breaking clients. Do not confuse this application's key with a Supabase project's JWT configuration.

## Checks

- `bun run test`: isolated configuration, signing, wrong-key rejection, expiry and mock-mode regression tests.
- `bun run build`: package bundle check.
- `bun run oxlint src/jwt-config.ts src/supabase-client.ts src/index.ts src/stripe-license-manager.ts src/auth-manager.ts test/jwt-config.test.ts`: changed-source lint.
- No typecheck script exists. `npm exec --yes --package=typescript@5 -- tsc --noEmit` checks the existing configuration; baseline errors must be distinguished from new diagnostics.
