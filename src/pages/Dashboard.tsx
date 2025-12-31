import { NavLink } from "react-router-dom";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import { resetToSeed } from "../lib/store";
import { useStore } from "../lib/useStore";
import type { Listing } from "../lib/types";

function fallbackImage(category: Listing["category"]) {
  switch (category) {
    case "Bakery":
      return "/foods/bakery.jpg";
    case "Produce":
      return "/foods/produce.jpg";
    case "Meals":
      return "/foods/meals.jpg";
    case "Dairy":
      return "/foods/dairy.jpg";
    default:
      return "/foods/mixed.jpg";
  }
}

export default function Dashboard() {
  const s = useStore();

  const totalListings = s.listings.length;
  const totalClaims = s.claims.length;
  const pickedUp = s.claims.filter((c) => c.status === "picked_up").length;

  const portionsRescued = s.listings.reduce((acc, l) => acc + (l.quantity || 0), 0);
  const co2KgAvoided = Math.round(portionsRescued * 0.7);

  const featured = [...s.listings].slice(0, 3);
  const heroImg = (featured[0]?.imageUrl || fallbackImage(featured[0]?.category ?? "Mixed")) || "/foods/mixed.jpg";

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="bg-gradient-to-b from-emerald-50 via-white to-transparent rounded-3xl border border-white/60 shadow-sm overflow-hidden">
        <div className="p-6 md:p-10 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <Badge tone="green" className="w-fit">Food rescue & redistribution</Badge>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              Predictable pickups. <br />
              <span className="text-emerald-600">Real impact.</span>
            </h1>

            <p className="text-slate-600 text-lg max-w-xl">
              ChirpyNosh tackles food waste and hunger by redistributing surplus food from
              verified partners to communities who need it most—at little to no cost—
              while offering affordable access to near-expiry food. Together, we advance
              SDG 2 (Zero Hunger) and SDG 12 (Responsible Consumption).
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <NavLink to="/listings"><Button className="rounded-full px-7 py-3">Go to Donation Hub →</Button></NavLink>
              <NavLink to="/recipient-signup"><Button variant="outline" className="rounded-full px-7 py-3">Register as Recipient</Button></NavLink>
              <NavLink to="/partner-signup"><Button variant="outline" className="rounded-full px-7 py-3">Become a Partner</Button></NavLink>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <Stat label="Listings" value={totalListings} />
              <Stat label="Claims" value={totalClaims} />
              <Stat label="Picked up" value={pickedUp} />
              <Stat label="Portions" value={portionsRescued} />
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-white/70">
              <img src={heroImg} alt="Featured food" className="w-full h-[420px] object-cover" />
            </div>

            <div className="absolute left-6 top-8 bg-white rounded-2xl shadow-lg border border-slate-100 p-4 w-56">
              <div className="font-extrabold text-slate-900">Daytime windows</div>
              <div className="text-sm text-slate-500 mt-1">Multiple pickup slots, not only late-night.</div>
            </div>

            <div className="absolute right-6 bottom-8 bg-white rounded-2xl shadow-lg border border-slate-100 p-4 w-64">
              <div className="font-extrabold text-slate-900">Transparent operations</div>
              <div className="text-sm text-slate-500 mt-1">Claim → pickup confirmation → notifications.</div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURED LISTINGS */}
      <div>
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">New listings</h2>
            <p className="text-slate-500 text-sm">Food with photos (MVP)</p>
          </div>
          <NavLink to="/listings" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            View all →
          </NavLink>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((l) => {
            const img = l.imageUrl || fallbackImage(l.category);
            const isFree = l.listingType === "free";

            return (
              <NavLink key={l.id} to={`/listings/${l.id}`} className="block">
                <Card className="overflow-hidden rounded-2xl border border-slate-100 hover:shadow-md transition">
                  <div className="h-40 bg-slate-100 overflow-hidden">
                    <img src={img} alt={l.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-extrabold text-slate-900 leading-snug">{l.title}</div>
                      <Badge tone={isFree ? "green" : "amber"}>
                        {isFree ? "FREE" : `€ ${l.priceEur ?? 0}`}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-600 mt-1 line-clamp-2">{l.description}</div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge tone="slate">{l.category}</Badge>
                      <Badge tone="slate">{l.quantity} portions</Badge>
                      {l.predictedWindow && <Badge tone="slate">Predicted: {l.predictedWindow}</Badge>}
                    </div>
                  </div>
                </Card>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* FEATURE CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="font-bold">Daytime pickup windows</div>
          <p className="text-sm text-slate-600 mt-2">
            Partners can offer multiple daytime and evening pickup slots for realistic access.
          </p>
        </Card>
        <Card className="p-6">
          <div className="font-bold">Structure & trust</div>
          <p className="text-sm text-slate-600 mt-2">
           Verified partners, verified recipients, clear pickup slots, and transparent
            tracking from listing to pickup.
          </p>
        </Card>
        <Card className="p-6">
          <div className="font-bold">Smart prioritization (MVP)</div>
          <p className="text-sm text-slate-600 mt-2">
            Simple rules help highlight optimal pickup times and reduce no-shows.
          </p>
        </Card>
      </div>

      {/* Impact + Reset */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="font-bold">Impact estimate</div>
          <div className="text-sm text-slate-600 mt-1">
            Approx CO₂ avoided: <span className="font-semibold">{co2KgAvoided} kg</span> (MVP placeholder factor)
          </div>
        </Card>

        <Card className="p-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="font-bold">Demo reset</div>
            <div className="text-sm text-slate-600">Reset back to seed data for clean demos.</div>
          </div>
          <Button
            variant="danger"
            onClick={() => resetToSeed()}
          >
            Reset Demo Data
          </Button>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-2xl font-extrabold text-slate-900">{value}</div>
    </div>
  );
}
