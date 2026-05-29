import Link from "next/link";

export default function CreateAdPage() {
  return (
    <div className="flex flex-col h-full fade-in pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F3D2E] mb-2">Create Ad</h1>
        <p className="text-muted-foreground text-sm">
          This page is reserved for the ad creation workflow.
        </p>
      </div>
      <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">The create ad form is coming soon.</p>
        <Link href="/dashboard/ads" className="mt-6 inline-flex items-center px-5 py-3 rounded-2xl bg-[#0F3D2E] text-white text-sm font-semibold hover:bg-[#123f30] transition-colors">
          Back to Ads
        </Link>
      </div>
    </div>
  );
}
