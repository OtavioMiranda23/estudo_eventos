import { Router, type Request, type Response } from "express";
import OrderService from "../application/services/orderService";

export type createOrderRequest = {
  customerName: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
  }>;
};

export class OrderController {
  public readonly router: Router;

  constructor(private readonly orderService: OrderService) {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.router.post("/orders", this.create);
  }

  public async create(request: Request, response: Response,): Promise<Response> {
    const body = request.body as createOrderRequest;

    if (!body.items || body.items.length === 0) {
      return response.status(400).json({
        message: "Items array is required and must not be empty",
      });
    }

    const order = await this.orderService.createOrder({
      customerName: body.customerName,
      items: body.items,
    });

    return response.status(201).json({
      id: order.id,
      customerName: order.customerName,
      createdAt: order.createdAt,
      items: order.items,
    });
  };
}