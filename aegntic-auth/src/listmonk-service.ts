import { ListmonkClient } from "./listmonk-client.js";

export class ListmonkService {
  private client?: ListmonkClient;
  private listIds?: { newsletter: number; updates: number };
  private mockMode: boolean;

  constructor() {
    this.mockMode = process.env.MOCK_EMAIL_SERVICE === "true";
    
    if (process.env.LISTMONK_URL && !this.mockMode) {
      if (!process.env.LISTMONK_USER || !process.env.LISTMONK_PASSWORD) {
        throw new Error("Listmonk credentials are required when LISTMONK_URL is set");
      }
      this.client = new ListmonkClient({
        baseUrl: process.env.LISTMONK_URL,
        username: process.env.LISTMONK_USER!,
        password: process.env.LISTMONK_PASSWORD!
      });
    }
  }

  async addSubscriber(data: {
    email: string;
    name: string;
    lists: string[];
    metadata?: Record<string, any>;
  }): Promise<void> {
    if (this.mockMode) {
      console.log("📧 MOCK: Adding subscriber to Listmonk");
      console.log(`  Email: ${data.email}`);
      console.log(`  Name: ${data.name}`);
      console.log(`  Lists: ${data.lists.join(", ")}`);
      return;
    }

    if (!this.client) {
      throw new Error("Listmonk is not configured");
    }

    try {
      // Ensure lists exist
      if (!this.listIds) {
        this.listIds = await this.client.ensureLists();
      }

      // Map list names to IDs
      const listNumbers: number[] = [];
      if (data.lists.includes("newsletter")) {
        listNumbers.push(this.listIds.newsletter);
      }
      if (data.lists.includes("product-updates")) {
        listNumbers.push(this.listIds.updates);
      }

      // Create subscriber
      await this.client.createSubscriber({
        email: data.email,
        name: data.name,
        status: "enabled",
        lists: listNumbers,
        attribs: {
          source: "aegntic-mcp",
          tier: data.metadata?.tier || "free",
          registered_at: new Date().toISOString(),
          ...data.metadata
        }
      });

      console.log(`✅ Added ${data.email} to Listmonk`);
    } catch {
      throw new Error("Newsletter enrollment failed");
    }
  }
}