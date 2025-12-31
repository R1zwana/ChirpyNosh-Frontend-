import { useMemo, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import { Input, Select } from "../components/Input";
import { addClaim, deleteListing, updateClaimStatus } from "../lib/store";

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

export default function ListingDetail() {
  const { id } = useParams();
  const s = useStore();

  const listing = s.listings.find((l) => l.id === id);
  const partner = s.partners.find((p) => p.id === listing?.partnerId);

  const [claimerName, setClaimerName] = useState("");
  const [claimedBy, setClaimedBy] = useState<"recipient" | "public">("recipient");
  const [pickupWindow, setPickupWindow] = useState(listing?.pickupWindows?.[0] ?? "");
  const [doneClaim, setDoneClaim] = useState(false);

  const myClaims = useMemo(() => s.claims.filter((c) => c.listingId === id), [s.claims, id]);
  //const pickedUpExists = myClaims.some((x) => x.status === "picked_up");


  if (!listing) {
    return (
      <Card className="p-10 text-center">
        <div className="font-bold">Listing not found</div>
        <div className="mt-4">
          <NavLink to="/listings">
            <Button variant="outline">Back</Button>
          </NavLink>
        </div>
      </Card>
    );
  }

  const isFree = listing.listingType === "free";
  const img = listing.imageUrl || fallbackImage(listing.category);

  return (
    <div className="space-y-6">
      {/* ✅ Image */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
        <img src={img} alt={listing.title} className="w-full h-72 object-cover" />
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">{listing.title}</h2>
          <div className="text-sm text-slate-600 mt-1">
            {partner?.name ?? "Unknown partner"} • {partner?.address ?? ""} • Category:{" "}
            <span className="font-semibold">{listing.category}</span>
          </div>
        </div>

        {isFree ? (
          <Badge tone="green">FREE (Recipients)</Badge>
        ) : (
          <Badge tone="amber">€ {listing.priceEur ?? 0}</Badge>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="font-bold text-slate-900">Pickup windows</div>
          <div className="text-sm text-slate-600 mt-2">{listing.pickupWindows.join(", ")}</div>

          {listing.predictedWindow && (
            <div className="mt-3">
              <Badge tone="green">Predicted best window: {listing.predictedWindow}</Badge>
              <div className="text-xs text-slate-500 mt-1">(MVP: rule-based heuristic; future: ML forecast)</div>
            </div>
          )}

          <div className="mt-6">
            <div className="font-bold text-slate-900">Description</div>
            <p className="text-sm text-slate-600 mt-2">{listing.description}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="slate">{listing.quantity} portions</Badge>
            <Badge tone="slate">{listing.category}</Badge>
            {partner?.verified && <Badge tone="green">Partner verified</Badge>}
          </div>
        </Card>

        <Card className="p-6">
          <div className="font-bold text-slate-900">Claim / Reserve</div>
          <div className="text-sm text-slate-600 mt-1">
            {isFree
              ? "FREE listings are reserved for verified recipients."
              : "Discounted listings can be reserved by the public."}
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="text-xs font-semibold text-slate-600 mb-1">Claiming as</div>
              <Select value={claimedBy} onChange={(e) => setClaimedBy(e.target.value as any)} disabled={isFree}>
                <option value="recipient">Recipient (NGO/Shelter)</option>
                <option value="public">Public</option>
              </Select>
              {isFree && <div className="text-xs text-slate-500 mt-1">Locked to recipient for FREE surplus.</div>}
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-600 mb-1">Name (org/person)</div>
              <Input value={claimerName} onChange={(e) => setClaimerName(e.target.value)} placeholder="e.g., Hope Shelter / Alex" />
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-600 mb-1">Pickup window</div>
              <Select value={pickupWindow} onChange={(e) => setPickupWindow(e.target.value)}>
                {listing.pickupWindows.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </Select>
            </div>

            <Button
              className="w-full"
              onClick={() => {
                if (!claimerName.trim()) return;
                addClaim({
                  listingId: listing.id,
                  claimedBy: isFree ? "recipient" : claimedBy,
                  claimerName: claimerName.trim(),
                  pickupWindow,
                });
                setDoneClaim(true);
              }}
            >
              {isFree ? "Claim (Recipient)" : "Reserve"}
            </Button>

            {doneClaim && (
              <div className="text-sm text-emerald-700 font-semibold">
                Saved! Scroll down to confirm pickup when completed.
              </div>
            )}

            <NavLink to="/listings">
              <Button variant="outline" className="w-full">
                Back to Donation Hub
              </Button>
            </NavLink>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="font-bold text-slate-900">Claims log (audit trail)</div>
        <div className="text-sm text-slate-600 mt-1">our target: trust + operations + accountability.</div>

        <div className="mt-4 space-y-3">
          {myClaims.length === 0 ? (
            <div className="text-sm text-slate-600">No claims yet.</div>
          ) : (
            myClaims.map((c) => (
              <div
                key={c.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-slate-200 rounded-lg p-4 bg-slate-50"
              >
                <div>
                  <div className="font-semibold text-slate-900">
                    {c.claimerName} • <span className="text-slate-600">{c.claimedBy}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Window: <span className="font-semibold">{c.pickupWindow}</span> • Status:{" "}
                    <span className="font-semibold">{c.status}</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
  <Button
    variant="outline"
    onClick={() => updateClaimStatus(c.id, "picked_up")}
    disabled={c.status !== "claimed"}
  >
    Mark picked up
  </Button>

  <Button
    variant="danger"
    onClick={() => updateClaimStatus(c.id, "cancelled")}
    disabled={c.status !== "claimed"}
  >
    Cancel
  </Button>

  {/* ✅ Show delete only after pickup */}
  {myClaims.some((x) => x.status === "picked_up") && (
    <Button
      variant="danger"
      onClick={() => {
        if (confirm("Delete this listing? This will remove it from Donation Hub.")) {
          deleteListing(listing.id);
        }
      }}
    >
      Delete listing
    </Button>
  )}
</div>

              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

