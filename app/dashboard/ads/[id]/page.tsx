import Link from "next/link";

interface AdDetailsPageProps {
  params: { id: string };
}

export default function AdDetailsPage({ params }: AdDetailsPageProps) {
  return (
    <div className="flex flex-col h-full fade-in pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F3D2E] mb-2">Ad details</h1>
        <p className="text-muted-foreground text-sm">
          Details for ad ID: {params.id}
        </p>
      </div>
      <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">Ad insights and reporting will be available here soon.</p>
        <Link href="/dashboard/ads" className="mt-6 inline-flex items-center px-5 py-3 rounded-2xl bg-[#0F3D2E] text-white text-sm font-semibold hover:bg-[#123f30] transition-colors">
          Back to Ads
        </Link>
      </div>
    </div>
  );
}
