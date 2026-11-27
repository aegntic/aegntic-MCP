import fetch from "node-fetch";

export interface ListmonkConfig {
  baseUrl: string;
  username: string;
  password: string;
  timeoutMs?: number;
}

export type EnrollmentOutcome =
  "subscribed" | "pending" | "suppressed" | "not_enrolled" | "unknown";
export type ListmonkFailureCode =
  | "configuration"
  | "invalid_lists"
  | "list_configuration"
  | "http"
  | "timeout"
  | "transport"
  | "invalid_response";

export class ListmonkError extends Error {
  constructor(
    public readonly code: ListmonkFailureCode,
    public readonly status?: number,
    options?: ErrorOptions,
  ) {
    super(`Listmonk ${code}`, options);
    this.name = "ListmonkError";
  }
}

// Do not log response bodies, addresses, credentials, or transport error messages.
export function describeListmonkFailure(error: unknown): string {
  return error instanceof ListmonkError
    ? `${error.code}${error.status ? `:${error.status}` : ""}`
    : "internal";
}

export interface Subscriber {
  email: string;
  name: string;
  status: "enabled" | "disabled" | "blocklisted";
  lists: number[];
  attribs?: Record<string, unknown>;
}

export class ListmonkClient {
  private authHeader: string;
  private timeoutMs: number;

  constructor(private config: ListmonkConfig) {
    this.authHeader = `Basic ${Buffer.from(`${config.username}:${config.password}`).toString("base64")}`;
    this.timeoutMs = config.timeoutMs ?? 5000;
    if (
      !Number.isFinite(this.timeoutMs) ||
      this.timeoutMs <= 0 ||
      this.timeoutMs > 30000
    ) {
      throw new ListmonkError("configuration");
    }
  }

  private async request(
    path: string,
    method = "GET",
    body?: unknown,
  ): Promise<any> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await fetch(`${this.config.baseUrl}${path}`, {
        method,
        signal: controller.signal,
        redirect: "error",
        headers: {
          Authorization: this.authHeader,
          "Content-Type": "application/json",
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
      if (!response.ok) throw new ListmonkError("http", response.status);
      try {
        return await response.json();
      } catch (error) {
        if (controller.signal.aborted) throw error;
        throw new ListmonkError("invalid_response", undefined, {
          cause: error,
        });
      }
    } catch (error) {
      if (controller.signal.aborted)
        throw new ListmonkError("timeout", undefined, { cause: error });
      if (error instanceof ListmonkError) throw error;
      throw new ListmonkError("transport", undefined, { cause: error });
    } finally {
      clearTimeout(timer);
    }
  }

  private results(payload: any): any[] {
    const results = payload?.data?.results;
    if (!Array.isArray(results)) throw new ListmonkError("invalid_response");
    return results;
  }

  // Audiences must be provisioned once by an administrator, not raced by signups.
  async ensureLists(): Promise<{ newsletter: number; updates: number }> {
    const lists = this.results(await this.request("/api/lists?per_page=all"));
    const idFor = (name: string): number => {
      const matches = lists.filter(
        (list) => list.name === name && list.status !== "archived",
      );
      if (
        matches.length !== 1 ||
        !Number.isSafeInteger(matches[0].id) ||
        matches[0].id <= 0
      ) {
        throw new ListmonkError("list_configuration");
      }
      return matches[0].id;
    };
    return {
      newsletter: idFor("aegntic Newsletter"),
      updates: idFor("aegntic Product Updates"),
    };
  }

  private async findSubscriber(email: string): Promise<any | undefined> {
    const normalized = email.trim().toLowerCase();
    const query = `lower(subscribers.email) = '${normalized.replace(/'/g, "''")}'`;
    const params = new URLSearchParams({ query, per_page: "2" });
    const results = this.results(
      await this.request(`/api/subscribers?${params}`),
    );
    const matches = results.filter(
      (subscriber) =>
        typeof subscriber.email === "string" &&
        subscriber.email.toLowerCase() === normalized,
    );
    if (matches.length > 1) throw new ListmonkError("invalid_response");
    return matches[0];
  }

  private outcome(record: any, ids: number[]): EnrollmentOutcome {
    if (record.status === "blocklisted" || record.status === "disabled")
      return "suppressed";
    if (record.status !== "enabled" || !Array.isArray(record.lists))
      throw new ListmonkError("invalid_response");
    const memberships = ids.map((id) =>
      record.lists.find((list: any) => list.id === id),
    );
    if (
      memberships.some((list) => list?.subscription_status === "unsubscribed")
    )
      return "suppressed";
    if (memberships.some((list) => !list)) return "not_enrolled";
    if (memberships.every((list) => list.subscription_status === "confirmed"))
      return "subscribed";
    if (
      memberships.every((list) =>
        ["confirmed", "unconfirmed"].includes(list.subscription_status),
      )
    )
      return "pending";
    throw new ListmonkError("invalid_response");
  }

  async createSubscriber(subscriber: Subscriber): Promise<EnrollmentOutcome> {
    const existing = await this.findSubscriber(subscriber.email);
    // Never overwrite suppression, opt-in status, or existing memberships on retry.
    if (existing) return this.outcome(existing, subscriber.lists);
    try {
      await this.request("/api/subscribers", "POST", subscriber);
    } catch (error) {
      // A duplicate race or lost response can happen after the server stored the record.
      const stored = await this.findSubscriber(subscriber.email).catch(
        () => undefined,
      );
      if (stored) return this.outcome(stored, subscriber.lists);
      if (
        error instanceof ListmonkError &&
        ["timeout", "transport", "invalid_response"].includes(error.code)
      )
        return "unknown";
      throw error;
    }
    const stored = await this.findSubscriber(subscriber.email).catch(
      () => undefined,
    );
    if (!stored) return "unknown";
    return this.outcome(stored, subscriber.lists);
  }

  async sendTransactionalEmail(data: {
    subscriber_email: string;
    template_id: number;
    data?: Record<string, unknown>;
  }): Promise<any> {
    return this.request("/api/tx", "POST", data);
  }
}
