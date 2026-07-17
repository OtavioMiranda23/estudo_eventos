import "dotenv/config";
import express from "express";
import { OrderController } from "./api/orderController";
import OrderService from "./application/services/orderService";
import { OrderRepository } from "./infra/repositories/orderRepository";
import Events from "./infra/events";
import RabbitMQConfig from "./infra/rabbitmq";

const queues = [
  "order.created.payment",
  "order.created.inventory",
  "order.created.analytics",
];

async function main(): Promise<void> {
  const rabbitUrl =
    process.env.RABBITMQ_URL ?? "amqp://guest:guest@localhost:5672";

  const rabbitConfig = new RabbitMQConfig(queues, rabbitUrl);
  const { channel, connection } = await rabbitConfig.createChannel();

  const eventPublisher = new Events(channel, connection);
  const orderRepository = new OrderRepository();
  const orderService = new OrderService(orderRepository, eventPublisher);
  const orderController = new OrderController(orderService);

  const app = express();
  app.use(express.json());
  app.use(orderController.router);

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

main().catch((error: unknown) => {
  console.error("Erro no server:", error);
  process.exitCode = 1;
});
