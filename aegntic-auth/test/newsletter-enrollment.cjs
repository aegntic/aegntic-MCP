const { stripTypeScriptTypes } = require("node:module");
const assert = require("node:assert/strict");
delete process.env.MOCK_EMAIL_SERVICE;
let calls = 0;
let fail = false;
class ListmonkClient {
  constructor(c) {}
  async ensureLists() {
    return { newsletter: 1, updates: 2 };
  }
  async createSubscriber(d) {
    calls++;
    assert.deepEqual(d.lists, [1, 2]);
    assert.ok(!("api_key" in d.attribs));
    if (fail) throw Error("upstream failed");
  }
}
const make = (source, deps, name) =>
  new Function(
    ...Object.keys(deps),
    stripTypeScriptTypes(source) + ";return " + name,
  )(...Object.values(deps));
const clean = (s) =>
  s.replace(/^import[\s\S]*?;\n/gm, "").replace(/^export /gm, "");
const ListmonkService = make(
  clean(
    require("node:fs").readFileSync(
      require("node:path").join(__dirname, "../src/listmonk-service.ts"),
      "utf8",
    ),
  ),
  { ListmonkClient },
  "ListmonkService",
);
const EmailService = make(
  clean(
    require("node:fs").readFileSync(
      require("node:path").join(__dirname, "../src/email-service.ts"),
      "utf8",
    ),
  ),
  {
    ListmonkService,
    nodemailer: {
      createTransport() {
        return { async sendMail() {} };
      },
    },
  },
  "EmailService",
);
let src = clean(
  require("node:fs").readFileSync(
    require("node:path").join(__dirname, "../src/index.ts"),
    "utf8",
  ),
)
  .replace(/^#!.*\n/, "")
  .replace(/const server = new AegnticAuthServer\(\);[\s\S]*$/, "");
class Server {
  setRequestHandler() {}
}
class SupabaseAuthManager {
  async registerUser() {
    return { id: "test", tier: "free", api_key: "test-key-not-real" };
  }
}
class LicenseManager {}
const authDeps = {
  Server,
  SupabaseAuthManager,
  LicenseManager,
  EmailService,
  ListToolsRequestSchema: {},
  CallToolRequestSchema: {},
  StdioServerTransport: class {},
  ErrorCode: {},
  McpError: Error,
};
const Auth = make(src, authDeps, "AegnticAuthServer");
(async () => {
  process.env.LISTMONK_URL = "https://example.invalid";
  process.env.LISTMONK_USER = "test";
  process.env.LISTMONK_PASSWORD = "test";
  delete process.env.MOCK_EMAIL_SERVICE;
  const auth = new Auth();
  auth.emailService.transporter = { async sendMail() {} };
  let r = JSON.parse(
    (
      await auth.handleRegisterUser({
        email: "test@example.invalid",
        name: "Test",
      })
    ).content[0].text,
  );
  assert.equal(r.success, true);
  assert.equal(r.newsletter_enrollment, "subscribed");
  assert.equal(calls, 1);
  fail = true;
  r = JSON.parse(
    (
      await auth.handleRegisterUser({
        email: "test@example.invalid",
        name: "Test",
      })
    ).content[0].text,
  );
  assert.equal(r.success, true);
  assert.equal(r.newsletter_enrollment, "failed");
  assert.match(r.message, /newsletter enrollment failed/);
  r = JSON.parse(
    (
      await auth.handleRegisterUser({
        email: "test@example.invalid",
        name: "Test",
        subscribe_newsletter: false,
      })
    ).content[0].text,
  );
  assert.equal(r.newsletter_enrollment, "not_requested");
  assert.equal(calls, 2);
  delete process.env.LISTMONK_URL;
  const noConfig = new Auth();
  noConfig.emailService.transporter = { async sendMail() {} };
  r = JSON.parse(
    (
      await noConfig.handleRegisterUser({
        email: "test@example.invalid",
        name: "Test",
      })
    ).content[0].text,
  );
  assert.equal(r.newsletter_enrollment, "failed");
  process.env.LISTMONK_URL = "https://example.invalid";
  delete process.env.LISTMONK_PASSWORD;
  assert.throws(() => new Auth(), /credentials are required/);
  process.env.MOCK_EMAIL_SERVICE = "true";
  const MockAuth = make(src, authDeps, "AegnticAuthServer");
  r = JSON.parse(
    (
      await new MockAuth().handleRegisterUser({
        email: "test@example.invalid",
        name: "Test",
      })
    ).content[0].text,
  );
  assert.equal(r.newsletter_enrollment, "mock");
  assert.equal(calls, 2);
  console.log(
    "PASS actual registration -> EmailService -> ListmonkService: success, upstream failure, opt-out, missing configuration, incomplete credentials, mock mode; no API key in subscriber metadata",
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
