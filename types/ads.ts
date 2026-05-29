export type AdStatus = "ACTIVE" | "PAUSED";

export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  status: AdStatus;
  views: number;
  clicks: number;
}
