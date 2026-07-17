import { beforeAll, afterAll, describe, it, expect } from "@jest/globals";
import type { Server } from "node:http";
import type express from "express";
import request from "supertest";
import { createTestApp } from "../helpers/setup";

let app: express.Express;
let server: Server;
let closeApp: () => Promise<void>;

beforeAll(async () => {
  const testApp = await createTestApp();
  app = testApp.app;
  server = testApp.server;
  closeApp = testApp.close;
});

afterAll(async () => {
  await closeApp();
});

describe("POST /orders (e2e)", () => {
  it("should create an order successfully and return 201", async () => {
    const response = await request(app)
      .post("/orders")
      .send({
        customerName: "John Doe",
        items: [
          { productId: "prod-1", name: "Product 1", quantity: 2 },
          { productId: "prod-2", name: "Product 2", quantity: 1 },
        ],
      })
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      customerName: "John Doe",
      createdAt: expect.any(String),
      items: [
        { id: "prod-1", name: "Product 1", quantity: 2 },
        { id: "prod-2", name: "Product 2", quantity: 1 },
      ],
    });
  });

  it("should return 400 when items array is empty", async () => {
    const response = await request(app)
      .post("/orders")
      .send({
        customerName: "John Doe",
        items: [],
      })
      .expect(400);

    expect(response.body).toMatchObject({
      message: "Items array is required and must not be empty",
    });
  });

  it("should return 400 when items field is missing", async () => {
    const response = await request(app)
      .post("/orders")
      .send({
        customerName: "John Doe",
      })
      .expect(400);

    expect(response.body).toMatchObject({
      message: "Items array is required and must not be empty",
    });
  });

  it("should create order with a single item", async () => {
    const response = await request(app)
      .post("/orders")
      .send({
        customerName: "Jane Doe",
        items: [{ productId: "prod-3", name: "Single Product", quantity: 5 }],
      })
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      customerName: "Jane Doe",
      items: [{ id: "prod-3", name: "Single Product", quantity: 5 }],
    });
  });
});
