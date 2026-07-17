import "dotenv/config";
import path from "node:path";
import fs from "node:fs";
import type Database from "better-sqlite3";
import express from "express";
import { OrderController } from "../../src/api/orderController";
import OrderService from "../../src/application/services/orderService";
import { OrderRepository } from "../../src/infra/repositories/orderRepository";
import { createDb } from "../../src/infra/database";
import type { Server } from "node:http";

const testDbPath = path.resolve(process.cwd(), "data", "test-orders.db");

export function createTestDb(): Database.Database {
  const dir = path.dirname(testDbPath);
  fs.mkdirSync(dir, { recursive: true });

  // Remove previous test db if exists
  try {
    fs.unlinkSync(testDbPath);
  } catch {
    // ignore if not exists
  }

  return createDb(testDbPath);
}

export function destroyTestDb(db: Database.Database): void {
  db.close();
  try {
    fs.unlinkSync(testDbPath);
  } catch {
    // ignore
  }
}

// Mock Events class to avoid needing a real RabbitMQ connection
class MockEvents {
  async publishOrderCreated(
    _orderEntity: unknown,
    _queues: string[],
    _payloadEvent: string,
  ): Promise<void> {
    // no-op mock
  }

  closeConnection(): void {
    // no-op mock
  }
}

export async function createTestApp(): Promise<{
  app: express.Express;
  server: Server;
  db: Database.Database;
  close: () => Promise<void>;
}> {
  const db = createTestDb();

  const orderRepository = new OrderRepository(db);
  const eventPublisher =
    new MockEvents() as unknown as import("../../src/infra/events").default;
  const orderService = new OrderService(orderRepository, eventPublisher);
  const orderController = new OrderController(orderService);

  const app = express();
  app.use(express.json());
  app.use(orderController.router);

  const server = app.listen(0); // random available port

  const close = async (): Promise<void> => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    destroyTestDb(db);
  };

  return { app, server, db, close };
}
