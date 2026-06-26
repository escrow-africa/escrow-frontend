import { Ad, AdStatus, AdTheme, TargetAudience } from "@/types/ads";

const MOCK_ADS: Ad[] = [
  {
    id: "AD-001",
    title: "Premium UI Kit",
    description: "High quality React components for fintech apps. Includes comprehensive dashboard and mobile templates.",
    price: 202150,
    image: "/ad1.png",
    status: "ACTIVE",
    views: 1240,
    clicks: 85,
    placementSlot: "Search Feed Spotlight (Top Verification)",
    category: "Web Development",
    targetAudience: "All Visitors",
    startDate: "2026-06-17",
    endDate: "2026-06-26",
    dailyBudget: 5.00,
    totalBudget: 120000,
    spentBudget: 40040,
    badgeLabel: undefined,
    theme: "Neon Theme",
  },
  {
    id: "AD-002",
    title: "Logo Design Pack",
    description: "Custom logos for startups and tech brands. Standing out from competitors with clean vector formats.",
    price: 150550,
    image: "/ad2.png",
    status: "PAUSED",
    views: 520,
    clicks: 12,
    placementSlot: "Right Hand Side Widgets (Persistent Flow)",
    category: "Logo Design",
    targetAudience: "Talent Providers",
    startDate: "2026-06-17",
    endDate: "2026-06-26",
    dailyBudget: 5.00,
    totalBudget: 120000,
    spentBudget: 40040,
    badgeLabel: "Top Rated",
    theme: "Luxury Theme",
  },
  {
    id: "AD-003",
    title: "Cyber Security Audits",
    description: "Full-stack smart contract auditing and vulnerability scans for Web3 systems.",
    price: 202150,
    image: "/ad1.png", // fallback or placeholder from presets
    status: "OUT OF FUEL",
    views: 51,
    clicks: 17,
    placementSlot: "Sponsored Header Banners (Maximum Visibility)",
    category: "Software Development",
    targetAudience: "Hiring Managers",
    startDate: "2026-06-17",
    endDate: "2026-06-26",
    dailyBudget: 5.00,
    totalBudget: 120000,
    spentBudget: 0,
    badgeLabel: undefined,
    theme: "Cyberpunk Theme",
  },
];

export async function fetchAds(): Promise<Ad[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_ADS]), 120);
  });
}

export async function fetchAd(id: string): Promise<Ad | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const ad = MOCK_ADS.find((item) => item.id === id) ?? null;
      resolve(ad ? { ...ad } : null);
    }, 120);
  });
}

export interface CreateAdPayload {
  title: string;
  description: string;
  price: number;
  image?: string;
  placementSlot: string;
  category: string;
  targetAudience: TargetAudience;
  startDate: string;
  endDate: string;
  dailyBudget: number;
  totalBudget: number;
  badgeLabel?: string;
  theme: AdTheme;
}

export async function createAd(payload: CreateAdPayload): Promise<Ad> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = MOCK_ADS.length + 1;
      const id = `AD-00${index}`;
      const ad: Ad = {
        id,
        title: payload.title,
        description: payload.description,
        price: payload.price,
        image: payload.image || "/ad1.png",
        status: "ACTIVE",
        views: 0,
        clicks: 0,
        placementSlot: payload.placementSlot,
        category: payload.category,
        targetAudience: payload.targetAudience,
        startDate: payload.startDate,
        endDate: payload.endDate,
        dailyBudget: payload.dailyBudget,
        totalBudget: payload.totalBudget,
        spentBudget: 0,
        badgeLabel: payload.badgeLabel,
        theme: payload.theme,
      };

      MOCK_ADS.unshift(ad);
      resolve(ad);
    }, 200);
  });
}

export async function updateAd(id: string, payload: Partial<Ad>): Promise<Ad | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = MOCK_ADS.findIndex((item) => item.id === id);
      if (index === -1) {
        resolve(null);
        return;
      }
      
      const updated = {
        ...MOCK_ADS[index],
        ...payload,
      };
      MOCK_ADS[index] = updated;
      resolve({ ...updated });
    }, 150);
  });
}

export async function deleteAd(id: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = MOCK_ADS.findIndex((item) => item.id === id);
      if (index === -1) {
        resolve(false);
        return;
      }
      MOCK_ADS.splice(index, 1);
      resolve(true);
    }, 150);
  });
}

