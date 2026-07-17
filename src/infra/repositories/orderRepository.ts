import type Database from "better-sqlite3";
import { db as defaultDb } from "../database";
import OrderEntity from "../../domain/entities/orderEntity";

export class OrderRepository {
  private db: Database.Database;

  constructor(db?: Database.Database) {
    this.db = db ?? defaultDb;
  }

  public save(order: OrderEntity): OrderEntity {
    const insertOrder = this.db.prepare(`
      INSERT INTO orders (customer_name)
      VALUES (?)
    `);

    const insertItem = this.db.prepare(`
      INSERT INTO order_items (order_id, product_id, quantity)
      VALUES (?, ?, ?)
    `);

    const transaction = this.db.transaction(() => {
      const orderResult = insertOrder.run(order.customerName ?? null);
      const orderId = Number(orderResult.lastInsertRowid);

      for (const item of order.items) {
        insertItem.run(orderId, item.id, item.quantity);
      }

      return orderId;
    });

    return new OrderEntity(
      transaction(),
      order.customerName,
      order.items,
      new Date().toISOString(),
    );
  }
}
