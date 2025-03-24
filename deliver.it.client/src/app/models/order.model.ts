import { Address } from "./address.model";

export interface Order {
  id: number;
  customerName: string;
  customerAddress: Address;
  phoneNumber: string;
  //foodItems: { orderId: number, foodId: number; quantity: number }[];
  restaurantId: number;
  orderFoods: { orderId: number, foodId: number; foodName: string; foodPrice: number; quantity: number, name?: string }[];
  claimedByName?: string;
  claimedBy?: string;
  status: string;
  totalPrice: number;
  selected?: boolean;
}
