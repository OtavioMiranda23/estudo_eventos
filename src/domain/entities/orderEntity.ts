import OrderItem from "./orderItem";


export default class OrderEntity {
  public readonly id?: number;
  public readonly customerName?: string;
  public readonly items: OrderItem[];
  public readonly createdAt?: string;

  public constructor(
    id: number | undefined,
    customerName: string | undefined,
    items: OrderItem[],
    createdAt: string | undefined,
  ) {
    this.id = id;
    this.customerName = customerName;
    this.items = items;
    this.createdAt = createdAt;
  }

  public static create(
    customerName: string,
    items: OrderItem[],
  ): OrderEntity {
    return new OrderEntity(
      undefined,
      customerName,
      items,
      new Date().toISOString(),
    );
  }
}