import { Coin } from "./coin";

export interface User {
  id: string;
  name: string;
  email: string;
}

export type CollectionItem = Coin & {
  isForSale: boolean;
};
