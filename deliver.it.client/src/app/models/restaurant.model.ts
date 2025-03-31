import { Address } from './address.model';
import { User } from './user.model';

export interface Restaurant {
  id: number;
  name: string;
  address: Address;
  managers: User[];
}
