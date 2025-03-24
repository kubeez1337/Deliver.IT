import { Address } from './address.model';

export interface RestaurantRequest {
  id?: number;
  name: string;
  address: Address;
  requestedBy?: string;
  isApproved?: boolean;
}
