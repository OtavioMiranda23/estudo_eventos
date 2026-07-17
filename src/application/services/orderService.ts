import OrderEntity  from "../../domain/entities/orderEntity";
import { OrderRepository } from "../../infra/repositories/orderRepository";
import { v4 as uuidv4 } from "uuid";
import Events from "../../events";
import { createOrderRequest } from "../../api/orderController";

export default class OrderService {
    constructor(private orderRepository: OrderRepository, private eventPublisher: Events) {
    }

    public async createOrder(order: createOrderRequest): Promise<OrderEntity> {
        const orderItems = order.items.map((item: { productId: string; name: string; quantity: number }) => {
            return {
                id: item.productId,
                name: item.name,
                quantity: item.quantity,
            };
        });
        const orderEntity = OrderEntity.create(order.customerName, orderItems);
        this.orderRepository.save(orderEntity);

        const uuid = uuidv4();
        const payloadEvent = JSON.stringify({
        eventId: uuid,
        eventType: "PedidoCriado",
        occurredAt: new Date().toISOString(),
        aggregateId: orderEntity.id,
        data: {
            pedidoId: orderEntity.id,
            customerName: orderEntity.customerName,
            itens: orderItems,
        },
        });
        const queues = ["order.created.payment", "order.created.inventory", "order.created.analytics"];
        await this.eventPublisher.publishOrderCreated(orderEntity, queues, payloadEvent);
        return orderEntity;
    }
}