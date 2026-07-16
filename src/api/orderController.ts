import { Router, type Request, type Response } from "express";
import { db } from "../database";
import { OrderEntity } from "../domain/entities/order";

export const orderRouter = Router();

export type orderRequest = {
  customerName?: string;
  items: Array<{ productId: string; quantity: number }>;
};
orderRouter.post("/orders", (request: Request, response: Response) => {
  const order = request.body as orderRequest;

  // Validate items array
  if (!order.items || order.items.length === 0) {
    return response
      .status(400)
      .json({ message: "Items array is required and must not be empty" });
  }

  return response.status(201).json({
    message: "Pedido recebido com sucesso",
    orderId,
    order,
  });
});
