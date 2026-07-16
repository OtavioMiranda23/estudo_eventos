import { OrderEntity } from "../../domain/entities/order";
import { OrderRepository } from "../../infra/repositories/orderRepository";
import { orderRequest } from "../../api/order.routes";

class OrderService {
    constructor(private orderRepository: OrderRepository, private eventPublisher: ) {}
    public createOrder(order: orderRequest): OrderEntity {
        //montar a entidade
        const orderEntity = new OrderEntity(order.customerName, order.items);
        //salvar no banco de dados
        this.orderRepository.save(orderEntity);
        //disparar o evento de order created
    }
}