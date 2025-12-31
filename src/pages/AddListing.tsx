import { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import { Input, Select, Textarea } from "../components/Input";
import { addListing } from "../lib/store";
import { useStore } from "../lib/useStore";
import type { Listing, ListingType } from "../lib/types";

function defaultImageForCategory(cat: Listing["category"]) {
  switch (cat) {
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

export default function AddListing() {
  const navigate = useNavigate();
  const s = useStore();
  const partners = s.partners;

  const [partnerId, setPartnerId] = useState(partners[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Listing["category"]>("Mixed");
  const [listingType, setListingType] = useState<ListingType>("free");
  const [quantity, setQuantity] = useState(10);
  const [priceEur, setPriceEur] = useState(3);
  const [windowsText, setWindowsText] = useState("10:00–12:00, 14:00–16:00");
  const [imageUrl, setImageUrl] = useState("");

  const pickupWindows = useMemo(
    () =>
      windowsText
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    [windowsText]
  );

  const canSubmit = useMemo(() => {
    if (!partnerId) return false;
    if (!title.trim()) return false;
    if (!description.trim()) return false;
    if (quantity <= 0) return false;
    if (pickupWindows.length === 0) return false;
    if (listingType === "discounted" && priceEur < 0) return false;
    return true;
  }, [partnerId, title, description, quantity, pickupWindows, listingType, priceEur]);

  if (partners.length === 0) {
    return (
      <Card className="p-8">
        <div className="font-bold text-slate-900">No partners yet</div>
        <div className="text-sm text-slate-600 mt-1">
          Register a partner first to add listings.
        </div>
        <div className="mt-4">
          <NavLink to="/partner-signup">
            <Button>Go to Partner Signup</Button>
          </NavLink>
        </div>
      </Card>
    );
  }

  const previewImg = imageUrl.trim() || defaultImageForCategory(category);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Add Listing</h2>
        <p className="text-sm text-slate-600 mt-1">
          Create a FREE surplus listing for recipients, or discounted near-expiry item for the public.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Badge tone="green">Daytime windows supported</Badge>
          <Badge tone="slate">Prediction will auto-pick best window</Badge>
        </div>

        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
          <div className="h-48 bg-slate-100 overflow-hidden">
            <img src={previewImg} alt="Listing preview" className="w-full h-full object-cover" />
          </div>
          <div className="p-3 text-xs text-slate-500">
            Example: <span className="font-semibold">/foods/sandwich.jpg</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-600 mb-1">Partner</div>
            <Select value={partnerId} onChange={(e) => setPartnerId(e.target.value)}>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.type})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-600 mb-1">Listing type</div>
            <Select value={listingType} onChange={(e) => setListingType(e.target.value as ListingType)}>
              <option value="free">FREE (Recipients)</option>
              <option value="discounted">Discounted (Public)</option>
            </Select>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-600 mb-1">Title</div>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Sandwiches & salads" />
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-600 mb-1">Description</div>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="What’s included? packaging? allergens? notes..." />
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-600 mb-1">Food Image URL</div>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="/foods/sandwich.jpg" />
          <div className="text-xs text-slate-500 mt-1">Leave empty to auto-use a category image.</div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-600 mb-1">Category</div>
            <Select value={category} onChange={(e) => setCategory(e.target.value as Listing["category"])}>
              <option value="Bakery">Bakery</option>
              <option value="Produce">Produce</option>
              <option value="Meals">Meals</option>
              <option value="Dairy">Dairy</option>
              <option value="Mixed">Mixed</option>
            </Select>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-600 mb-1">Quantity (portions)</div>
            <Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-600 mb-1">Price (€) if discounted</div>
            <Input
              type="number"
              min={0}
              value={priceEur}
              disabled={listingType !== "discounted"}
              onChange={(e) => setPriceEur(Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-600 mb-1">Pickup windows (comma-separated)</div>
          <Input value={windowsText} onChange={(e) => setWindowsText(e.target.value)} placeholder="10:00–12:00, 14:00–16:00" />
          <div className="text-xs text-slate-500 mt-1">
            Tip: multiple daytime windows is your differentiator vs end-of-day only.
          </div>
        </div>

        <Button
          type="button"
          className="w-full"
          disabled={!canSubmit}
          onClick={() => {
            if (!canSubmit) return;

            addListing({
              partnerId,
              title: title.trim(),
              description: description.trim(),
              category,
              listingType,
              quantity,
              priceEur: listingType === "discounted" ? priceEur : undefined,
              pickupWindows,
              imageUrl: imageUrl.trim() ? imageUrl.trim() : defaultImageForCategory(category),
            });

            navigate("/listings");
          }}
        >
          Publish Listing
        </Button>

        <NavLink to="/listings">
          <Button type="button" variant="outline" className="w-full">
            Cancel
          </Button>
        </NavLink>
      </Card>
    </div>
  );
}
