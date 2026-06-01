import { Ad } from "@/types/ads";

const MOCK_ADS: Ad[] = [
  {
    id: "1",
    title: "Premium UI Kit",
    description: "High quality React components for fintech apps.",
    price: 202150,
    image: "/ad1.png",
    status: "ACTIVE",
    views: 1240,
    clicks: 85,
  },
  {
    id: "2",
    title: "Logo Design Pack",
    description: "Custom logos for startups and tech brands.",
    price: 150550,
    image: "/ad2.png",
    status: "PAUSED",
    views: 520,
    clicks: 12,
  },
];

export async function fetchAds(): Promise<Ad[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_ADS), 120);
  });
}

export async function fetchAd(id: string): Promise<Ad | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const ad = MOCK_ADS.find((item) => item.id === id) ?? null;
      resolve(ad);
    }, 120);
  });
}

export interface CreateAdPayload {
  title: string;
  description: string;
  price: number;
  image?: string;
}

export async function createAd(payload: CreateAdPayload): Promise<Ad> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const ad: Ad = {
        id: `${Date.now()}`,
        title: payload.title,
        description: payload.description,
        price: payload.price,
        image: payload.image || "/ad1.png",
        status: "ACTIVE",
        views: 0,
        clicks: 0,
      };

      MOCK_ADS.unshift(ad);
      resolve(ad);
    }, 200);
  });
}
