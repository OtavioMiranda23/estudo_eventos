import crypto from "node:crypto";
import OrderEntity from "../../domain/entities/orderEntity";
import { OrderRepository } from "../../infra/repositories/orderRepository";
import Events from "../../infra/events";
import { createOrderRequest } from "../../api/orderController";

export default class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private eventPublisher: Events,
  ) {}

  public async createOrder(order: createOrderRequest): Promise<OrderEntity> {
    const orderItems = order.items.map(
      (item: { productId: string; name: string; quantity: number }) => {
        return {
          id: item.productId,
          name: item.name,
          quantity: item.quantity,
        };
      },
    );
    const orderEntity = OrderEntity.create(order.customerName, orderItems);
    const savedOrder = this.orderRepository.save(orderEntity);

    const uuid = crypto.randomUUID();
    const payloadEvent = JSON.stringify({
      eventId: uuid,
      eventType: "PedidoCriado",
      occurredAt: new Date().toISOString(),
      aggregateId: savedOrder.id,
      data: {
        pedidoId: savedOrder.id,
        customerName: savedOrder.customerName,
        itens: orderItems,
      },
    });
    const queues = [
      "order.created.payment",
      "order.created.inventory",
      "order.created.analytics",
    ];
    await this.eventPublisher.publishOrderCreated(
      savedOrder,
      queues,
      payloadEvent,
    );
    return savedOrder;
  }
}
