import amqplib, { Channel, ChannelModel } from "amqplib";
// pagamento && estoque && analytics
// export const queuePayment = "order.created.payment";
// export const queueInventory = "order.created.inventory";
// export const queueAnalytics = "order.created.analytics";
// const rabbitUrl =
//      process.env.RABBITMQ_URL ?? "amqp://guest:guest@localhost:5672";

class RabbitMQConfig {
  private queues: string[];
  private rabbitUrl: string;
  public connection: amqplib.ChannelModel | undefined;
  public channel: amqplib.Channel | undefined;
  constructor(queues: string[], rabbitUrl: string) {
    this.queues = queues;
    this.rabbitUrl = rabbitUrl;
  }
  
  async createConnection(rabbitUrl: string): Promise<ChannelModel> {
    return await amqplib.connect(rabbitUrl);
}

  async createChannel(): Promise<{
    connection: ChannelModel;
    channel: Channel;
  }> {
      const connection = await this.createConnection(this.rabbitUrl);
      const channel = await connection.createChannel();
      for await (const queue of this.queues) {
        await channel.assertQueue(queue, {
          durable: true,
        });
      }
      this.connection = connection;
      this.channel = channel;
      return { connection, channel };
}
}