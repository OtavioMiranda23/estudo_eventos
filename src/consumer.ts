import { createChannel, queueName } from "./rabbitmq";

async function main(): Promise<void> {
  const { connection, channel } = await createChannel();

  channel.prefetch(1);

  await channel.consume(
    queueName,
    async (message) => {
      if (!message) {
        return;
      }

      try {
        const raw = message.content.toString("utf8");
        const data = JSON.parse(raw) as {
          id: number;
          content: string;
          createdAt: string;
        };

        console.log(
          `Recebido: ${data.id} - ${data.content} (${data.createdAt})`,
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

  console.log(`Consumindo fila ${queueName}. Ctrl+C para sair.`);

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
