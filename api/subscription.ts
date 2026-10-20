import { api } from "./axios";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  priceDisplay: string;
  description: string;
  benefits: string[];
  recommended: boolean;
}

export interface SubscriptionStatus {
  planId: string | null;
  planName: string;
  description: string;
  renewsOn: string | null;
  autoRenew: boolean;
}

const unwrap = (payload: unknown): unknown => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
};

const asStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "name" in item) {
        return String((item as { name: unknown }).name ?? "");
      }
      if (item && typeof item === "object" && "description" in item) {
        return String((item as { description: unknown }).description ?? "");
      }
      return String(item ?? "");
    })
    .filter(Boolean);
};

const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

const toPlanId = (raw: Record<string, unknown>, name: string) => {
  const preferred = raw.slug ?? raw.code ?? raw.planId ?? raw.key;
  if (preferred) return String(preferred);

  const rawId = String(raw.id ?? raw._id ?? "");
  if (rawId && !isUuid(rawId)) return rawId;

  const normalized = name.toLowerCase();
  if (normalized.includes("premium") || normalized.includes("enterprise")) return "premium";
  if (normalized.includes("pro")) return "pro";
  if (normalized.includes("free")) return "free";

  return rawId || normalized.replace(/\s+/g, "-");
};

export const mapPlan = (raw: Record<string, unknown>): SubscriptionPlan => {
  const price = Number(raw.price ?? raw.amount ?? raw.monthlyPrice ?? 0) || 0;
  const name = String(raw.name ?? raw.title ?? raw.tier ?? "Plan");
  const id = toPlanId(raw, name);

  return {
    id,
    name,
    price,
    priceDisplay: formatPrice(price),
    description: String(raw.description ?? raw.tagline ?? raw.summary ?? ""),
    benefits: asStringArray(raw.benefits ?? raw.features ?? raw.perks),
    recommended: Boolean(raw.recommended ?? raw.isRecommended ?? raw.popular),
  };
};

export const mapPlans = (payload: unknown): SubscriptionPlan[] => {
  const unwrapped = unwrap(payload);
  const list = Array.isArray(unwrapped)
    ? unwrapped
    : unwrapped && typeof unwrapped === "object"
      ? ((unwrapped as { plans?: unknown; items?: unknown }).plans
        ?? (unwrapped as { items?: unknown }).items
        ?? [])
      : [];

  if (!Array.isArray(list)) return [];
  return list
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map(mapPlan);
};

export const mapStatus = (payload: unknown): SubscriptionStatus => {
  const unwrapped = unwrap(payload);
  const root = (unwrapped && typeof unwrapped === "object" ? unwrapped : {}) as Record<string, unknown>;
  const planRaw = (root.plan ?? root.currentPlan ?? root.tier ?? root.subscription) as
    | Record<string, unknown>
    | string
    | undefined;

  const planObject = planRaw && typeof planRaw === "object" ? planRaw : null;
  const planName = String(
    root.planName
    ?? planObject?.name
    ?? planObject?.title
    ?? (typeof planRaw === "string" ? planRaw : undefined)
    ?? root.tier
    ?? ""
  );

  return {
    planId: String(
      root.planId
      ?? planObject?.slug
      ?? planObject?.code
      ?? planObject?.planId
      ?? planObject?.id
      ?? planObject?._id
      ?? (typeof planRaw === "string" ? planRaw : "")
    ) || null,
    planName,
    description: String(root.description ?? planObject?.description ?? ""),
    renewsOn: String(
      root.renewsOn
      ?? root.currentPeriodEnd
      ?? root.expiresAt
      ?? root.nextBillingDate
      ?? root.endDate
      ?? ""
    ) || null,
    autoRenew: Boolean(root.autoRenew ?? root.autoClears ?? true),
  };
};

export const subscriptionApi = {
  getPlans: async () => {
    const response = await api.get("/auth/subscription/plans");
    return mapPlans(response.data);
  },

  getStatus: async () => {
    const response = await api.get("/auth/subscription");
    return mapStatus(response.data);
  },

  upgrade: async (planId: string) => {
    const response = await api.post("/auth/subscription/upgrade", { planId });
    return response.data;
  },
};
