export type CoinCondition = "Poor" | "Fair" | "Good" | "Very Good" | "Fine" | "Very Fine" | "Extremely Fine" | "Uncirculated" | "Proof";
export type RarityLevel = "Common" | "Scarce" | "Rare" | "Extremely Rare" | "Unique";

export interface Coin {
  id: string;
  title: string;
  category: "Coins" | "Banknotes" | "Ancient Coins" | "Silver Coins" | "Gold Coins" | string;
  country: string;
  year: number;
  metal: string;
  condition: CoinCondition | string;
  weight?: string;
  mint?: string;
  description?: string;
  price: number;
  rarity: RarityLevel | string;
  image: string;
  sellerId?: string;
  certification?: string;
}
