import Image from "next/image";
import Link from "next/link";
import { fetchAd } from "@/api/ads";

interface AdDetailsPageProps {
  params: { id: string };
}

export default async function AdDetailsPage({ params }: AdDetailsPageProps) {
  const ad = await fetchAd(params.id);

  if (!ad) {
    return (
      <div className="flex flex-col h-full fade-in pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0F3D2E] mb-2">Ad not found</h1>
          <p className="text-muted-foreground text-sm">No advertisement matches that ID.</p>
        </div>
        <Link href="/dashboard/ads" className="inline-flex items-center px-5 py-3 rounded-2xl bg-[#0F3D2E] text-white text-sm font-semibold hover:bg-[#123f30] transition-colors">
          Back to Ads
        </Link>
      </div>
    );
  }

  const conversionCount = Math.max(0, Math.round(ad.clicks * 0.15));

  return (
    <div className="flex flex-col h-full fade-in pb-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0F3D2E] mb-2">Ad details</h1>
          <p className="text-muted-foreground text-sm">
            Review your ad performance and manage campaign settings.
          </p>
        </div>
        <Link href="/dashboard/ads" className="inline-flex items-center justify-center rounded-2xl bg-[#0F3D2E] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#123f30] transition-colors">
          Back to Ads
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
        <div className="rounded-3xl border border-border bg-white shadow-sm overflow-hidden">
          <div className="relative h-72">
            <Image
              src={ad.image}
              alt={ad.title}
              fill
              className="object-cover"
              unoptimized
            />
            <span className={`absolute top-4 left-4 rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${
              ad.status === "ACTIVE" ? "bg-emerald-500 text-white" : "bg-slate-800 text-white"
            }`}>
              {ad.status}
            </span>
          </div>

          <div className="p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-3xl font-semibold text-[#0F3D2E]">{ad.title}</h2>
                <p className="mt-3 text-sm text-[#4A5550] max-w-2xl">{ad.description}</p>
              </div>
              <p className="text-3xl font-bold text-[#0F3D2E]">₦{ad.price.toLocaleString()}</p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-[#F8FAF9] p-5 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-[#667171]">Views</p>
                <p className="mt-3 text-3xl font-semibold text-[#0F3D2E]">{ad.views}</p>
              </div>
              <div className="rounded-3xl bg-[#F8FAF9] p-5 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-[#667171]">Clicks</p>
                <p className="mt-3 text-3xl font-semibold text-[#0F3D2E]">{ad.clicks}</p>
              </div>
              <div className="rounded-3xl bg-[#F8FAF9] p-5 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-[#667171]">Conversions</p>
                <p className="mt-3 text-3xl font-semibold text-[#0F3D2E]">{conversionCount}</p>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-[#E4E8E6] bg-[#F8FAF9] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#667171]">Ad description</p>
              <p className="mt-4 text-sm leading-6 text-[#4A5550]">{ad.description}</p>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-[#0F3D2E] mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href={`/dashboard/ads/${ad.id}/edit`}
                className="block rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-[#0F3D2E] hover:bg-[#F7F8F9] transition-colors"
              >
                Edit Ad
              </Link>
              <button
                type="button"
                className="w-full rounded-2xl bg-[#0F3D2E] px-4 py-3 text-sm font-semibold text-white hover:bg-[#123f30] transition-colors"
              >
                Pause Ad
              </button>
              <button
                type="button"
                className="w-full rounded-2xl border border-red-500 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
              >
                Delete Ad
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-[#0F3D2E] mb-4">Buyer Protection</h3>
            <p className="text-sm leading-6 text-[#4A5550]">
              This advertisement is covered by EscrowAfrica NG Secure Marketplace Policy. Funds will not be released until delivery is verified or the inspection period expires.
            </p>
            <Link
              href="/dashboard/help"
              className="mt-4 inline-flex items-center text-sm font-semibold text-[#0F3D2E] hover:text-[#123f30] transition-colors"
            >
              Read protection details
            </Link>
          </div>

          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <p className="text-sm text-[#4A5550]">Need help with this ad?</p>
            <Link
              href="/dashboard/help"
              className="mt-3 inline-flex items-center justify-center rounded-2xl bg-[#0F3D2E] px-4 py-3 text-sm font-semibold text-white hover:bg-[#123f30] transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
