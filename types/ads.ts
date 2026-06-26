export type AdStatus = "ACTIVE" | "PAUSED" | "OUT OF FUEL" | "OUT OF BUDGET";

export type AdTheme = "Standard Classic" | "Neon Theme" | "Luxury Theme" | "Cyberpunk Theme";

export type TargetAudience = "All Visitors" | "Talent Providers" | "Hiring Managers";

export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  status: AdStatus;
  views: number;
  clicks: number;
  
  // New campaign fields
  placementSlot: string;
  category: string;
  targetAudience: TargetAudience;
  startDate: string;
  endDate: string;
  dailyBudget: number;
  totalBudget: number;
  spentBudget: number;
  badgeLabel?: string;
  theme: AdTheme;
}

