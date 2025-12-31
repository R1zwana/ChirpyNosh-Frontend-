import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import { Input, Select } from "../components/Input";
import { getStore } from "../lib/store";
import type { Listing } from "../lib/types";

type Sort = "newest" | "quantity_desc" | "price_asc";

export default function Listings() {
  const s = getStore();
  const partnersById = useMemo(() => new Map(s.partners.map((p) => [p.id, p])), [s.partners]);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState<"All" | Listing["category"]>("All");
  const [type, setType] = useState<"All" | Listing["listingType"]>("All");
  const [sort, setSort] = useState<Sort>("newest");

  const filtered = useMemo(() => {
    let items = [...s.listings];

    if (q.trim()) {
      const t = q.toLowerCase();
      items = items.filter((l) => {
        const partnerName = partnersById.get(l.partnerId)?.name?.toLowerCase() ?? "";
        return (
          l.title.toLowerCase().includes(t) ||
          l.description.toLowerCase().includes(t) ||
          partnerName.includes(t)
        );
      });
    }

    if (category !== "All") items = items.filter((l) => l.category === category);
    if (type !== "All") items = items.filter((l) => l.listingType === type);

    if (sort === "newest") items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sort === "quantity_desc") items.sort((a, b) => b.quantity - a.quantity);
    if (sort === "price_asc") items.sort((a, b) => (a.priceEur ?? 0) - (b.priceEur ?? 0));

    return items;
  }, [s.listings, partnersById, q, category, type, sort]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Donation Hub</h2>
          <p className="text-sm text-slate-600 mt-1">
            FREE surplus for verified recipients + discounted near-expiry items for the public.
          </p>
        </div>
        <NavLink to="/add-listing">
          <Button>Add Listing</Button>
        </NavLink>
      </div>

      <Card className="p-5">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="text-xs font-semibold text-slate-600 mb-1">Search</div>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search listing / partner / notes..." />
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-600 mb-1">Category</div>
            <Select value={category} onChange={(e) => setCategory(e.target.value as any)}>
              <option value="All">All</option>
              <option value="Bakery">Bakery</option>
              <option value="Produce">Produce</option>
              <option value="Meals">Meals</option>
              <option value="Dairy">Dairy</option>
              <option value="Mixed">Mixed</option>
            </Select>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-600 mb-1">Type</div>
            <Select value={type} onChange={(e) => setType(e.target.value as any)}>
              <option value="All">All</option>
              <option value="free">FREE (Recipients)</option>
              <option value="discounted">Discounted (Public)</option>
            </Select>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-600 mb-1">Sort</div>
            <Select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="newest">Newest</option>
              <option value="quantity_desc">Quantity (high → low)</option>
              <option value="price_asc">Price (low → high)</option>
            </Select>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((l) => {
          const partner = partnersById.get(l.partnerId);
          return (
            <Card key={l.id} className="p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-extrabold text-slate-900">{l.title}</div>
                  <div className="text-sm text-slate-500">{partner?.name ?? "Unknown partner"}</div>
                </div>
                {l.listingType === "free" ? (
                  <Badge tone="green">FREE</Badge>
                ) : (
                  <Badge tone="amber">€ {l.priceEur ?? 0}</Badge>
                )}
              </div>

              <p className="text-sm text-slate-600 mt-3 line-clamp-2">{l.description}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                <Badge>{l.category}</Badge>
                <Badge>{l.quantity} portions</Badge>
                {l.predictedWindow && <Badge tone="green">Pred: {l.predictedWindow}</Badge>}
              </div>

              <div className="mt-4 text-xs text-slate-500">
                Pickup windows: <span className="font-semibold">{l.pickupWindows.join(", ")}</span>
              </div>

              <div className="mt-5">
                <NavLink to={`/listings/${l.id}`}>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </NavLink>
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card className="p-10 text-center">
          <div className="font-bold text-slate-900">No listings found</div>
          <div className="text-sm text-slate-600 mt-1">Try changing filters or search terms.</div>
        </Card>
      )}
    </div>
  );
}
