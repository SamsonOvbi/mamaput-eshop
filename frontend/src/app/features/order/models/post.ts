import { Article } from "../../products/models/article";
import { User } from "../../auth/models/user";

export interface Item {
  _id: string;
  image: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  article: Article;
}

export interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}

export interface Post {
  articless: Article[];
  user: User;
  _id: string;
}
