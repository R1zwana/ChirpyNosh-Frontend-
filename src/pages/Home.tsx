import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* HERO */}
      <section className="card overflow-hidden">
        <div className="grid gap-10 lg:grid-cols-2 p-8 sm:p-10">
          <div className="space-y-6">
            <div className="badge-green w-fit">
              <Heart size={14} /> Fighting food waste, feeding communities
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Save Food, <span className="text-brand-600">Share Hope</span>
            </h1>

            <p className="text-slate-600 leading-relaxed max-w-prose">
              Connect surplus food from restaurants and stores with those who need it most.
              Free meals for shelters, discounted near-expiry items for everyone.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/browse" className="btn-primary">
                Browse Food <ArrowRight size={16} />
              </Link>
              <Link to="/partner-signup" className="btn-outline">
                Become a Partner
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-4">
              <Stat value="50K+" label="Meals Saved" />
              <Stat value="200+" label="Partners" />
              <Stat value="80+" label="Shelters Served" />
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-slate-100 shadow-soft ring-1 ring-slate-200">
              <img
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=70"
                alt="Fresh produce"
              />
            </div>

            <div className="absolute left-6 top-8 card px-4 py-3 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-100 text-brand-800">
                <Heart size={18} />
              </span>
              <div>
                <div className="font-bold">Free Meals</div>
                <div className="text-sm text-slate-500">For shelters</div>
              </div>
            </div>

            <div className="absolute right-6 bottom-8 card px-4 py-3 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-100 text-amber-800">
                %
              </span>
              <div>
                <div className="font-bold">Up to 70% Off</div>
                <div className="text-sm text-slate-500">Near-expiry deals</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTIONS */}
      <section className="grid gap-6 md:grid-cols-3">
        <Feature title="List surplus food" desc="Partners add surplus items with pickup windows." />
        <Feature title="Claim or reserve" desc="Shelters claim free food; others reserve discounted." />
        <Feature title="Track impact" desc="Meals saved and CO₂ avoided – visible and shareable." />
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="card p-6 card-hover">
      <div className="font-bold text-slate-900">{title}</div>
      <div className="text-sm text-slate-600 mt-2">{desc}</div>
    </div>
  );
}
