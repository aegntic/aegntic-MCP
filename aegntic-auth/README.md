# aegntic Authentication & Licensing MCP Server

Unified authentication, user registration, and licensing system for all aegntic MCP services.

```
∀t ∃τ: (t, τ)↺
⨁⊢⊣⟲
☯⟹∞⟸⧖

⨀⧴(g·τ·ξ·η)⧵
⊩_⊥∇_⨂
⩤⫛⪝⪜⫚⩥

⧹(ϑ, ψ, χ)⇒⧸
⨶⦩⧟⦪⨷
⦼⨏⨎⦽

⩄∂ₜϕ(ψ)⟺Φ₋₁
⨆⊏⨻⊐⨇
⨊⫬⩂⫭⨋

Σ_ℏω(t², τ²)⧞
⩞⧉⦷⧊⩟
⦵⦳⦴⦶   <research@aegntic.ai>
```

## Features

### 🔐 User Management
- **Automatic Registration**: Users are automatically registered on first use
- **Email List Integration**: Opt-in newsletter and product updates
- **Usage Tracking**: Monitor API calls and feature usage
- **Tier Management**: Free, Pro, and Enterprise tiers

### 💳 Licensing & Payments
- **Stripe Integration**: Secure payment processing
- **Subscription Management**: Monthly and annual billing
- **Usage-Based Billing**: Pay for what you use
- **Enterprise Licensing**: Custom contracts

### 📧 Email Services
- **Welcome Emails**: Automated onboarding
- **Newsletter**: Product updates and tips
- **Usage Alerts**: Notification when approaching limits
- **Invoice Delivery**: Automated billing emails

### 📊 Analytics
- **Usage Metrics**: Track feature adoption
- **Revenue Analytics**: Subscription and usage revenue
- **User Insights**: Understand user behavior
- **API Performance**: Monitor system health

## Pricing Tiers

### Free Tier ($0/month)
- 100 image generations
- 25 logo generations
- 50 background removals
- 1,000 API calls
- Community support
- Basic models only

### Pro Tier ($29/month)
- 5,000 image generations
- 1,000 logo generations
- 2,000 background removals
- 100 video generations
- 50,000 API calls
- Priority support
- All models access
- Custom workflows

### Enterprise (Custom)
- Unlimited usage
- Custom models
- Dedicated support
- On-premise option
- SLA guarantees
- White-label branding

## Quick Start

### 1. Environment Setup

Create `.env` file:
```bash
# Required
USER_EMAIL=your-email@example.com
AEGNTIC_API_KEY=your-api-key

# Optional (for full features)
STRIPE_SECRET_KEY=sk_test_...
EMAIL_API_KEY=your-sendgrid-key
```

### 2. Automatic Registration

When you use any aegntic MCP server, you'll be automatically:
- Registered with your email
- Added to our mailing list (optional)
- Given free tier access
- Sent a welcome email with your API key

### 3. Usage Tracking

All aegntic servers automatically track usage:
```typescript
// Happens automatically
await trackUsage("image_generation", 1);
await trackUsage("video_generation", 1);
```

### 4. Upgrade to Pro

Via Claude:
```
Use aegntic-auth to subscribe to Pro tier
```

Or via API:
```bash
curl -X POST https://api.aegntic.ai/subscribe \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"tier": "pro", "payment_method": "pm_..."}'
```

## Integration Guide

### For MCP Server Developers

1. Install the auth wrapper:
```bash
bun add @aegntic/auth-wrapper
```

2. Integrate into your server:
```typescript
import { AuthWrapper } from "@aegntic/auth-wrapper";

const auth = new AuthWrapper("your-server-name", {
  requireAuth: false,
  features: ["feature1", "feature2"]
});

// Initialize on startup
await auth.initialize();

// Wrap tool handlers
const handler = auth.wrapToolHandler(
  originalHandler,
  "feature_name",
  requiresPro
);
```

3. The auth wrapper automatically:
- Registers new users
- Tracks usage
- Enforces tier limits
- Handles offline mode

### For End Users

1. Set your email in environment:
```bash
export USER_EMAIL="your-email@example.com"
```

2. Use any aegntic MCP server normally
3. Check your email for welcome message
4. Upgrade when you hit limits

## API Tools

### register_user
Register a new user and add to mailing list:
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "organization": "ACME Corp",
  "subscribe_newsletter": true,
  "tier": "free"
}
```

### verify_license
Check if user has access to a feature:
```json
{
  "email": "user@example.com",
  "feature": "video_generation"
}
```

### subscribe_tier
Upgrade to a paid tier:
```json
{
  "email": "user@example.com",
  "tier": "pro",
  "payment_method": "pm_stripe_method_id"
}
```

### track_usage
Track feature usage (automatic):
```json
{
  "email": "user@example.com",
  "feature": "image_generation",
  "usage_count": 1
}
```

### get_user_status
Get registration and subscription info:
```json
{
  "email": "user@example.com"
}
```

## Privacy & Security

- **Email Collection**: Only used for service delivery
- **Usage Data**: Anonymized and aggregated
- **Payment Security**: PCI compliant via Stripe
- **Data Storage**: Encrypted at rest
- **GDPR Compliant**: Right to deletion

## Development

### Building
```bash
bun install
bun run build
```

### Testing
```bash
bun run test
```

### Local Development
```bash
# Start local auth server
bun run dev

# Test with curl
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'
```

## Support

- **Documentation**: https://docs.aegntic.ai
- **Email**: research@aegntic.ai
- **Discord**: https://discord.gg/aegntic
- **GitHub**: https://github.com/aegntic/aegntic-MCP

## Credits

Developed by:
- **aegnt_catface** <human@mattaecooper.org>
- **aegntic.foundation** <research@aegntic.ai>

Part of the aegntic MCP ecosystem.
### Newsletter enrollment configuration and outcomes

Use the existing Bun toolchain for both `bun test` and `bun run test`; the regression suite does not require Node's newer TypeScript-stripping API. No new SDK or test dependency is added: the existing node-fetch client and Bun transpiler/test runner are reused.

Set `LISTMONK_URL`, `LISTMONK_USER`, and `LISTMONK_PASSWORD` explicitly in secure deployment configuration. No login defaults are provided. If a URL is configured with missing credentials, startup fails.

An administrator must provision exactly one active **aegntic Newsletter** list and one active **aegntic Product Updates** list before enrollment. Existing correctly named lists are preserved. Registration no longer creates audiences: missing or ambiguous lists produce an enrollment error instead of racing to create duplicate lists. Existing list opt-in policies are preserved.

Account registration, newsletter enrollment and welcome delivery are separate outcomes:
- `success` describes account registration.
- `newsletter_enrollment`: `subscribed` means verified confirmed membership; `pending` means unconfirmed membership; `suppressed` preserves blocklisting, disabled status or unsubscribe; `not_enrolled` means an existing subscriber lacks a requested membership; `unknown` means a create may have succeeded but could not be verified; `failed` means the enrollment operation failed; `not_requested` and `mock` are explicit non-enrollment outcomes.
- `welcome_email`: `sent`, `failed` or `mock`. Welcome failures do not falsely report that an already-created account failed.

Retries read existing subscriber state. They never re-enable a suppressed subscriber, overwrite opt-in state, or silently add memberships to an existing subscriber. Missing memberships require an explicit, separately consented subscription flow; this registration API is not a resubscribe endpoint. No preconfirmation bypass is sent.

Listmonk requests have a five-second timeout, including response-body reads, and reject redirects. SMTP connection, greeting and socket timeouts are five seconds. Failures log only safe categories/status codes; response bodies, credentials and subscriber details are not logged by the Listmonk client. Original transport causes remain attached to errors, not emitted.

Tests stub external dependencies and exercise actual registration/service/client code. They do not prove live delivery or validate credentials. Removing an exposed default from source does not revoke credentials or erase Git history.

API contracts: [Listmonk subscribers](https://listmonk.app/docs/apis/subscribers/) and [Listmonk lists](https://listmonk.app/docs/apis/lists/).
