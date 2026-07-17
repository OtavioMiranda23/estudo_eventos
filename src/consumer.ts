import "dotenv/config";
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

  channel.prefetch(1);

  for (const queue of queues) {
    await channel.consume(
      queue,
      async (message) => {
        if (!message) {
          return;
        }

        try {
          const raw = message.content.toString("utf8");
          const data = JSON.parse(raw) as {
            eventId: string;
            eventType: string;
            occurredAt: string;
            aggregateId: number;
            data: Record<string, unknown>;
          };

          console.log(
            `[${queue}] Recebido: ${data.eventType} - ${JSON.stringify(data.data)}`,
          );

          await new Promise((resolve) => setTimeout(resolve, 1000));
          channel.ack(message);
        } catch (error) {
          console.error("Falha ao processar mensagem:", error);
          channel.nack(message, false, false);
        }
      },
      {
        noAck: false,
      },
    );
  }

  console.log(`Consumindo filas: ${queues.join(", ")}. Ctrl+C para sair.`);

  process.on("SIGINT", async () => {
    await channel.close();
    await connection.close();
    process.exit(0);
  });
}

main().catch((error: unknown) => {
  console.error("Erro no consumer:", error);
  process.exitCode = 1;
});
