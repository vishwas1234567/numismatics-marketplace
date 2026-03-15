import { Coin } from "./coin";

export type UserRole = "buyer" | "seller" | "both";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type CollectionItem = Coin & {
  isForSale: boolean;
};
