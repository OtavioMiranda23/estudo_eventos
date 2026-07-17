import { db } from "../../database";
import   OrderEntity from "../../domain/entities/orderEntity";

export class OrderRepository {
  public save(order: OrderEntity): OrderEntity {
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
        insertItem.run(orderId, item.id, item.name, item.quantity);
      }

      return orderId;
    });

    return new OrderEntity(transaction(), order.customerName, order.items, new Date().toISOString());
  }
}
