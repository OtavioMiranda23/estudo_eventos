import { OrderEntity } from "./domain/entities/order";
import { createChannel, queueName } from "./rabbitmq";
import { v4 as uuidv4 } from "uuid";

class EventAdapter {
  public async publish(orderEntity: OrderEntity): Promise<void> {
    const { connection, channel } = await createChannel();
    const uuid = uuidv4();
    const payload = JSON.stringify({
      eventId: uuid,
      eventType: "PedidoCriado",
      occurredAt: new Date().toISOString(),
      aggregateId: orderEntity.id,
      data: {
        pedidoId: orderEntity.id,
        customerName: orderEntity.customerName,
        totalAmount: orderEntity.totalAmount, //TODO: calcular o total do pedido
        itens: [
          {
            productName: "Produto 1",
            quantidade: 2,
            amount: 100.0,
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
