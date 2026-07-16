import { db } from "../../database";
import type { Order } from "../../domain/entities/order";

export class OrderRepository {
  public save(order: Order): number {
    const insertOrder = db.prepare(`
      INSERT INTO orders (customer_name)
      VALUES (?)
    `);

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, quantity)
      VALUES (?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      const orderResult = insertOrder.run(order.customerName ?? null);
      const orderId = Number(orderResult.lastInsertRowid);

      for (const item of order.items) {
        insertItem.run(orderId, item.productId, item.quantity);
      }

      return orderId;
    });

    return transaction();
  }
}
