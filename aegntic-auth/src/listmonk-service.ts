import { ListmonkClient, ListmonkError } from "./listmonk-client.js";
import type { EnrollmentOutcome } from "./listmonk-client.js";

export type MailingListName = "newsletter" | "product-updates";

export class ListmonkService {
  private client?: ListmonkClient;
  private listIds?: Promise<{ newsletter: number; updates: number }>;
  private mockMode: boolean;

  constructor() {
    this.mockMode = process.env.MOCK_EMAIL_SERVICE === "true";
    if (process.env.LISTMONK_URL && !this.mockMode) {
      if (!process.env.LISTMONK_USER || !process.env.LISTMONK_PASSWORD) {
        throw new ListmonkError("configuration");
      }
      this.client = new ListmonkClient({
        baseUrl: process.env.LISTMONK_URL,
        username: process.env.LISTMONK_USER,
        password: process.env.LISTMONK_PASSWORD,
      });
    }
  }

  async addSubscriber(data: {
    email: string;
    name: string;
    lists: MailingListName[];
    metadata?: Record<string, unknown>;
  }): Promise<EnrollmentOutcome | "mock"> {
    if (
      !Array.isArray(data.lists) ||
      data.lists.length === 0 ||
      data.lists.some(
        (list) => !["newsletter", "product-updates"].includes(list),
      )
    ) {
      throw new ListmonkError("invalid_lists");
    }
    if (this.mockMode) return "mock";
    if (!this.client) throw new ListmonkError("configuration");
    // Shared initialization avoids redundant concurrent reads; failures are retryable.
    if (!this.listIds) {
      this.listIds = this.client.ensureLists().catch((error) => {
        this.listIds = undefined;
        throw error;
      });
    }
    const ids = await this.listIds;
    const listNumbers = [
      ...new Set(
        data.lists.map((list) =>
          list === "newsletter" ? ids.newsletter : ids.updates,
        ),
      ),
    ];
    return this.client.createSubscriber({
      email: data.email,
      name: data.name,
      status: "enabled",
      lists: listNumbers,
      attribs: {
        source: "aegntic-mcp",
        tier: data.metadata?.tier || "free",
        registered_at: new Date().toISOString(),
        organization: data.metadata?.organization,
      },
    });
  }
}
