import OrderEntity from "../domain/entities/orderEntity";

export default class Events {
  channel: any;
  connection: any;
  constructor(channel: any, connection: any) {
    this.channel = channel;
    this.connection = connection;
  }

  public async publishOrderCreated(
    orderEntity: OrderEntity,
    queues: string[],
    payloadEvent: string,
  ): Promise<void> {
    //envia cada mensagem para a fila
    for await (const queue of queues) {
      this.channel.sendToQueue(queue, Buffer.from(payloadEvent), {
        persistent: true,
        contentType: "application/json",
      });
    }
  }

  public closeConnection(): void {
    if (this.channel) {
      this.channel.close();
    }
    if (this.connection) {
      this.connection.close();
    }
  }
}

//cria o canal e a conexão com o rabbitmq

// recebe pedido criado => exchange => pagamento && estoque && analytics => pedido pago => exchange => nota fiscal && notificacao

//producer que envia o conteudo para a fila
