export default class OrderItem {
     id: string;
     name: string;
     quantity: number;
     
     constructor(id: string, name: string, quantity: number) {
         this.id = id;
         this.name = name;
         this.quantity = quantity;
     }   
}