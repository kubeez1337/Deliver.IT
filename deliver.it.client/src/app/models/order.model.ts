export interface Order {
  id: number;
  customerName: string;
  customerAddress: string;
  phoneNumber: string;
  //foodItems: { orderId: number, foodId: number; quantity: number }[];
  orderFoods: { orderId: number, foodId: number; quantity: number }[];
  
  totalPrice: number;
  selected?: boolean;
}
