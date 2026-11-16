const { test } = require("bun:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const transpiler = new Bun.Transpiler({ loader: "ts" });
const source = (file) =>
  fs
    .readFileSync(path.join(__dirname, "../src", file), "utf8")
    .replace(/^#!.*\n/, "")
    .replace(/^import[\s\S]*?;\n/gm, "")
    .replace(/^export /gm, "");
const make = (text, deps, result) =>
  new Function(
    ...Object.keys(deps),
    transpiler.transformSync(text) + ";return " + result,
  )(...Object.values(deps));
const clientSource = source("listmonk-client.ts");
const response = (data) => ({ ok: true, status: 200, json: async () => data });
const record = (status = "enabled", subscription = "confirmed") => ({
  id: 1,
  email: "test@example.invalid",
  status,
  lists: [1, 2].map((id) => ({ id, subscription_status: subscription })),
});
const subscriber = {
  email: "test@example.invalid",
  name: "Test",
  status: "enabled",
  lists: [1, 2],
};
const buildClient = (fetch, timeoutMs = 30) => {
  const api = make(
    clientSource,
    { fetch },
    "({ListmonkClient,ListmonkError,describeListmonkFailure})",
  );
  return {
    ...api,
    client: new api.ListmonkClient({
      baseUrl: "https://example.invalid",
      username: "test",
      password: "test",
      timeoutMs,
    }),
  };
};
const withEnv = async (run) => {
  const keys = [
    "MOCK_EMAIL_SERVICE",
    "LISTMONK_URL",
    "LISTMONK_USER",
    "LISTMONK_PASSWORD",
  ];
  const original = Object.fromEntries(
    keys.map((key) => [key, process.env[key]]),
  );
  delete process.env.MOCK_EMAIL_SERVICE;
  Object.assign(process.env, {
    LISTMONK_URL: "https://example.invalid",
    LISTMONK_USER: "test",
    LISTMONK_PASSWORD: "test",
  });
  try {
    await run();
  } finally {
    for (const key of keys) {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    }
  }
};

test("actual registration through both service layers reports partial outcomes", () =>
  withEnv(async () => {
    let enrollment = "subscribed",
      calls = 0,
      mailFails = false;
    const api = buildClient(async () => {
      throw Error("No live requests");
    });
    class StubClient {
      async ensureLists() {
        return { newsletter: 1, updates: 2 };
      }
      async createSubscriber(data) {
        calls++;
        assert.deepEqual(data.lists, [1, 2]);
        assert.ok(!("api_key" in data.attribs));
        if (enrollment === "failed") throw new api.ListmonkError("timeout");
        return enrollment;
      }
    }
    const ListmonkService = make(
      source("listmonk-service.ts"),
      { ListmonkClient: StubClient, ListmonkError: api.ListmonkError },
      "ListmonkService",
    );
    const EmailService = make(
      source("email-service.ts"),
      {
        ListmonkService,
        nodemailer: {
          createTransport() {
            return {};
          },
        },
      },
      "EmailService",
    );
    class Server {
      setRequestHandler() {}
    }
    class SupabaseAuthManager {
      async registerUser() {
        return { id: "test", tier: "free", api_key: "test-only-key" };
      }
    }
    const deps = {
      Server,
      SupabaseAuthManager,
      LicenseManager: class {},
      EmailService,
      describeListmonkFailure: api.describeListmonkFailure,
      ListToolsRequestSchema: {},
      CallToolRequestSchema: {},
      StdioServerTransport: class {},
      ErrorCode: {},
      McpError: Error,
    };
    const authSource = source("index.ts").replace(
      /const server = new AegnticAuthServer\(\);[\s\S]*$/,
      "",
    );
    const Auth = make(authSource, deps, "AegnticAuthServer");
    const auth = new Auth();
    auth.emailService.transporter = {
      async sendMail() {
        if (mailFails) throw Error("private upstream text");
      },
    };
    const run = async (args = {}) =>
      JSON.parse(
        (
          await auth.handleRegisterUser({
            email: subscriber.email,
            name: "Test",
            ...args,
          })
        ).content[0].text,
      );
    let result = await run();
    assert.equal(result.newsletter_enrollment, "subscribed");
    assert.equal(result.welcome_email, "sent");
    enrollment = "failed";
    result = await run();
    assert.equal(result.success, true);
    assert.equal(result.newsletter_enrollment, "failed");
    enrollment = "suppressed";
    result = await run();
    assert.equal(result.newsletter_enrollment, "suppressed");
    enrollment = "pending";
    result = await run();
    assert.equal(result.newsletter_enrollment, "pending");
    enrollment = "subscribed";
    mailFails = true;
    result = await run();
    assert.equal(result.success, true);
    assert.equal(result.welcome_email, "failed");
    const before = calls;
    result = await run({ subscribe_newsletter: false });
    assert.equal(result.newsletter_enrollment, "not_requested");
    assert.equal(calls, before);
    delete process.env.LISTMONK_URL;
    const unconfigured = new Auth();
    unconfigured.emailService.transporter = { async sendMail() {} };
    result = JSON.parse(
      (
        await unconfigured.handleRegisterUser({
          email: subscriber.email,
          name: "Test",
        })
      ).content[0].text,
    );
    assert.equal(result.newsletter_enrollment, "failed");
    process.env.LISTMONK_URL = "https://example.invalid";
    delete process.env.LISTMONK_PASSWORD;
    assert.throws(() => new Auth(), /configuration/);
    process.env.MOCK_EMAIL_SERVICE = "true";
    const MockAuth = make(authSource, deps, "AegnticAuthServer");
    result = JSON.parse(
      (
        await new MockAuth().handleRegisterUser({
          email: subscriber.email,
          name: "Test",
        })
      ).content[0].text,
    );
    assert.equal(result.newsletter_enrollment, "mock");
    assert.equal(result.welcome_email, "mock");
  }));

test("actual client bounds stalled connection and stalled response body", async () => {
  for (const bodyStall of [false, true]) {
    const { client } = buildClient(async (_url, options) => {
      const wait = () =>
        new Promise((_resolve, reject) =>
          options.signal.addEventListener(
            "abort",
            () => reject(Error("aborted")),
            { once: true },
          ),
        );
      return bodyStall ? { ok: true, json: wait } : wait();
    }, 15);
    const started = Date.now();
    await assert.rejects(
      client.ensureLists(),
      (error) => error.code === "timeout",
    );
    assert.ok(Date.now() - started < 500);
  }
});

test("list discovery uses paginated API envelope and never creates audiences", async () => {
  let writes = 0;
  const { client } = buildClient(async (_url, options) => {
    if (options.method !== "GET") writes++;
    return response({
      data: {
        results: [
          { id: 1, name: "aegntic Newsletter", status: "active" },
          { id: 2, name: "aegntic Product Updates", status: "active" },
        ],
      },
    });
  });
  assert.deepEqual(await client.ensureLists(), { newsletter: 1, updates: 2 });
  assert.equal(writes, 0);
  for (const results of [
    [],
    [
      { id: 1, name: "aegntic Newsletter" },
      { id: 2, name: "aegntic Newsletter" },
    ],
  ]) {
    const { client } = buildClient(async () => response({ data: { results } }));
    await assert.rejects(
      client.ensureLists(),
      (error) => error.code === "list_configuration",
    );
  }
});

test("duplicates, suppression, unconfirmed and missing memberships are read-only", async () => {
  const cases = [
    [record(), "subscribed"],
    [record("blocklisted"), "suppressed"],
    [record("disabled"), "suppressed"],
    [record("enabled", "unsubscribed"), "suppressed"],
    [record("enabled", "unconfirmed"), "pending"],
    [{ ...record(), lists: [] }, "not_enrolled"],
  ];
  for (const [stored, expected] of cases) {
    let reads = 0;
    const { client } = buildClient(async (_url, options) => {
      assert.equal(options.method, "GET");
      reads++;
      return response({ data: { results: [stored] } });
    });
    assert.equal(await client.createSubscriber(subscriber), expected);
    assert.equal(reads, 1);
  }
});

test("create success and lost responses are reconciled without repeating writes", async () => {
  for (const loseResponse of [false, true]) {
    let stored = false,
      posts = 0;
    const { client } = buildClient(async (_url, options) => {
      if (options.method === "POST") {
        posts++;
        stored = true;
        if (loseResponse) throw Error("response lost");
        return response({ data: { id: 1 } });
      }
      return response({ data: { results: stored ? [record()] : [] } });
    });
    assert.equal(await client.createSubscriber(subscriber), "subscribed");
    assert.equal(await client.createSubscriber(subscriber), "subscribed");
    assert.equal(posts, 1);
  }
});

test("errors preserve safe diagnostic codes without reading sensitive error bodies", async () => {
  const { client, describeListmonkFailure } = buildClient(async () => ({
    ok: false,
    status: 401,
    text() {
      throw Error("body must not be read");
    },
  }));
  try {
    await client.ensureLists();
    assert.fail("expected rejection");
  } catch (error) {
    assert.equal(describeListmonkFailure(error), "http:401");
  }
});

test("service rejects invalid lists and shares list initialization", () =>
  withEnv(async () => {
    let initializations = 0;
    const api = buildClient(async () => {});
    class StubClient {
      async ensureLists() {
        initializations++;
        await new Promise((resolve) => setTimeout(resolve, 5));
        return { newsletter: 1, updates: 2 };
      }
      async createSubscriber() {
        return "subscribed";
      }
    }
    const Service = make(
      source("listmonk-service.ts"),
      { ListmonkClient: StubClient, ListmonkError: api.ListmonkError },
      "ListmonkService",
    );
    const service = new Service();
    for (const lists of [[], ["misspelled"]])
      await assert.rejects(
        service.addSubscriber({ ...subscriber, lists }),
        (error) => error.code === "invalid_lists",
      );
    assert.equal(initializations, 0);
    await Promise.all([
      service.addSubscriber({ ...subscriber, lists: ["newsletter"] }),
      service.addSubscriber({ ...subscriber, lists: ["newsletter"] }),
    ]);
    assert.equal(initializations, 1);
  }));

test("uncertain create outcome is not reported as verified enrollment", async () => {
  let created = false;
  const { client } = buildClient(async (_url, options) => {
    if (options.method === "POST") {
      created = true;
      throw Error("connection lost");
    }
    if (created) throw Error("lookup unavailable");
    return response({ data: { results: [] } });
  });
  assert.equal(await client.createSubscriber(subscriber), "unknown");
});
