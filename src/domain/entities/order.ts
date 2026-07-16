export type OrderItem = {
  productId: string;
  quantity: number;
};

export class OrderEntity {
  public readonly id?: number;
  public readonly customerName?: string;
  public readonly items: OrderItem[];
  public readonly createdAt?: string;

  constructor(
    customerName: string | undefined,
    items: OrderItem[],
    id?: number,
    createdAt?: string,
  ) {
    this.id = id;
    this.customerName = customerName;
    this.items = items;
    this.createdAt = createdAt;
  }
}
