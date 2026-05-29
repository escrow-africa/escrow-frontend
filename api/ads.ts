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
