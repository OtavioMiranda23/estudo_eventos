# RabbitMQ Study Project

Projeto mínimo em Node.js + TypeScript para aprender RabbitMQ com a lib `amqplib`.

## O que tem aqui

- `src/producer.ts`: publica mensagens em uma fila
- `src/consumer.ts`: consome mensagens da mesma fila
- `src/rabbitmq.ts`: helper de conexão e declaração da fila
- `docker-compose.yml`: sobe o RabbitMQ com painel web

## Como usar

1. Suba o RabbitMQ:

```bash
docker compose up -d
```

2. Instale as dependências:

```bash
npm install
```

3. Rode o consumidor em um terminal:

```bash
npm run start:consumer
```

4. Rode o produtor em outro terminal:

```bash
npm run start:producer
```

O painel do RabbitMQ fica em `http://localhost:15672` com `guest / guest`.

## Conceitos mostrados

- conexão com o broker
- declaração de fila com `assertQueue`
- publicação com `sendToQueue`
- consumo com `consume`
- ack manual com `channel.ack`
