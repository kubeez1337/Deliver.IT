export interface Order {
  id: number;
  customerName: string;
  customerAddress: string;
  phoneNumber: string;
  //foodItems: { orderId: number, foodId: number; quantity: number }[];
  orderFoods: { orderId: number, foodId: number; quantity: number, name?: string }[];
  claimedByName?: string;
  claimedBy?: string;
  status: string;
  totalPrice: number;
  selected?: boolean;
}
