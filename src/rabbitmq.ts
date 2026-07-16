import amqplib, { Channel, ChannelModel } from "amqplib";

export const queueName = "study.jobs";
export const rabbitUrl =
  process.env.RABBITMQ_URL ?? "amqp://guest:guest@localhost:5672";

export async function createConnection(): Promise<ChannelModel> {
  return amqplib.connect(rabbitUrl);
}

export async function createChannel(): Promise<{
  connection: ChannelModel;
  channel: Channel;
}> {
  const connection = await createConnection();
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, {
    durable: true,
  });

  return { connection, channel };
}
