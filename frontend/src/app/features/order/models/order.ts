import { Product } from "../../products/models/product";
import { User } from "../../auth/models/user";

export interface Item {
  _id: string;
  image: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  product: Product;
}

export interface PaymentResult {
  id: string; 
  status: string;
  update_time: string;
  email_address: string;
}
export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  lat: number;
  lng: number;
}

export interface Order {
  items: Item[];
  shippingAddress: ShippingAddress;
  user: User;

  _id: string;
  isPaid: boolean;
  paidAt: string;
  isDelivered: boolean;
  deliveredAt: string;
  
  paymentMethod: string;
  itemsCount: number;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
}
