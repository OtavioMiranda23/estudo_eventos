import { OrderEntity } from "./domain/entities/order";
import { createChannel, queueName } from "./rabbitmq";

class EventAdapter {
  public async publish(orderEntity: OrderEntity): Promise<void> {
    const { connection, channel } = await createChannel();
    const payload = JSON.stringify({
      eventId: "4fcb0f36-4d8b-4c8d-88c7-d91e5e9e0d6d",
      eventType: "PedidoCriado",
      occurredAt: "2026-07-16T13:45:00Z",
      aggregateId: "pedido-123",

      data: {
        pedidoId: 123,
        clienteId: 45,
        valor: 250.0,
        itens: [
          {
            produtoId: 5,
            quantidade: 2,
          },
        ],
      },
    });

    //envia cada mensagem para a fila
    channel.sendToQueue(queueName, Buffer.from(payload), {
      persistent: true,
      contentType: "application/json",
    });

    //fecha fecha o canal e a conexão
    await channel.close();
    await connection.close();
  }
}

//cria o canal e a conexão com o rabbitmq

// recebe pedido criado => exchange => pagamento && estoque && analytics => pedido pago => exchange => nota fiscal && notificacao

//producer que envia o conteudo para a fila
