import { Restaurant } from "./restaurant.model";

export interface Food {
  id: number;
  name: string;
  price: number;
  quantity: number;
  picturePath?: string;
  restaurantId: number;
  restaurant?: Restaurant;
}
