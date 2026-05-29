import Link from "next/link";

interface EditAdPageProps {
  params: { id: string };
}

export default function EditAdPage({ params }: EditAdPageProps) {
  return (
    <div className="flex flex-col h-full fade-in pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F3D2E] mb-2">Edit Ad</h1>
        <p className="text-muted-foreground text-sm">
          Edit screen for ad ID: {params.id}
        </p>
      </div>
      <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">Ad editing tools will be added here soon.</p>
        <Link href="/dashboard/ads" className="mt-6 inline-flex items-center px-5 py-3 rounded-2xl bg-[#0F3D2E] text-white text-sm font-semibold hover:bg-[#123f30] transition-colors">
          Back to Ads
        </Link>
      </div>
    </div>
  );
}
