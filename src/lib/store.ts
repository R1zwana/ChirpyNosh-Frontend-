import type {
  AppNotification,
  Claim,
  ExpirationItem,
  Listing,
  Partner,
  Recipient,
  Store,
} from "./types";

const KEY = "chirpynosh_store_v1";
const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16);
const nowISO = () => new Date().toISOString();


const listeners = new Set<() => void>();


export function subscribeStore(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function emitStoreChange() {
  listeners.forEach((fn) => fn());
}

const seed: Store = {
  partners: [
    {
      id: "p1",
      name: "GreenBite Bakery",
      type: "Bakery",
      address: "Central District",
      verified: true,
      createdAt: nowISO(),
    },
    {
      id: "p2",
      name: "CityFresh Market",
      type: "Supermarket",
      address: "North Avenue",
      verified: true,
      createdAt: nowISO(),
    },
  ],
  recipients: [
    {
      id: "r1",
      orgName: "Hope Shelter",
      address: "Old Town",
      capacity: 60,
      verified: true,
      createdAt: nowISO(),
    },
  ],
  listings: [
    {
      id: "l1",
      partnerId: "p1",
      title: "Fresh Bakery Packs",
      description: "Assorted bread and pastries, packed and ready.",
      category: "Bakery",
      listingType: "free",
      quantity: 20,
      pickupWindows: ["10:00–12:00", "14:00–16:00"],
      predictedWindow: "14:00–16:00",
      imageUrl: "/foods/bakery.jpg",
      createdAt: nowISO(),
    },
    {
      id: "l2",
      partnerId: "p2",
      title: "Near-expiry Produce Box",
      description: "Mixed fruits and veggies. Great for smoothies & cooking.",
      category: "Produce",
      listingType: "discounted",
      quantity: 12,
      priceEur: 3,
      pickupWindows: ["12:00–18:00"],
      predictedWindow: "12:00–18:00",
      imageUrl: "/foods/produce.jpg",
      createdAt: nowISO(),
    },
  ],
  claims: [],
  expirations: [],
  notifications: [],
};

export function getStore(): Store {
  const raw = localStorage.getItem(KEY);
  if (!raw) return seed;

  try {
    const parsed = JSON.parse(raw) as Store;
    if (!parsed.listings || !parsed.partners) return seed;
    if (!parsed.notifications) parsed.notifications = [];
    return parsed;
  } catch {
    return seed;
  }
}

export function setStore(s: Store) {
  localStorage.setItem(KEY, JSON.stringify(s));
  emitStoreChange();
}

export function resetToSeed() {
  setStore(seed);
}

/** ✅ notifications helpers */
export function addNotification(
  input: Omit<AppNotification, "id" | "createdAt" | "read">
) {
  const s = getStore();
  const n: AppNotification = {
    ...input,
    id: uid(),
    createdAt: nowISO(),
    read: false,
  };
  s.notifications.unshift(n);
  setStore(s);
  return n;
}

export function markNotificationRead(id: string) {
  const s = getStore();
  const n = s.notifications.find((x) => x.id === id);
  if (n) n.read = true;
  setStore(s);
}

/** partners */
export function addPartner(input: Omit<Partner, "id" | "createdAt">) {
  const s = getStore();
  const partner: Partner = { ...input, id: uid(), createdAt: nowISO() };
  s.partners.unshift(partner);
  setStore(s);
  return partner;
}

export function addRecipient(input: Omit<Recipient, "id" | "createdAt">) {
  const s = getStore();
  const recipient: Recipient = { ...input, id: uid(), createdAt: nowISO() };
  s.recipients.unshift(recipient);
  setStore(s);
  return recipient;
}

/** prediction */
function predictWindow(pickupWindows: string[]) {
  if (pickupWindows.length === 0) return undefined;
  return pickupWindows[pickupWindows.length - 1];
}

export function addListing(
  input: Omit<Listing, "id" | "createdAt" | "predictedWindow">
) {
  const s = getStore();
  const listing: Listing = {
    ...input,
    id: uid(),
    createdAt: nowISO(),
    predictedWindow: predictWindow(input.pickupWindows),
  };
  s.listings.unshift(listing);
  setStore(s);
  return listing;
}


export function addClaim(input: Omit<Claim, "id" | "createdAt" | "status">) {
  const s = getStore();

  const claim: Claim = {
    ...input,
    id: uid(),
    status: "claimed",
    createdAt: nowISO(),
  };
  s.claims.unshift(claim);

  s.notifications.unshift({
    id: uid(),
    type: "claim_created",
    title: "Food claimed",
    message: `${input.claimerName} claimed a listing for ${input.pickupWindow}`,
    createdAt: nowISO(),
    read: false,
  });

  setStore(s);
  return claim;
}

export function updateClaimStatus(claimId: string, status: Claim["status"]) {
  const s = getStore();
  const c = s.claims.find((x) => x.id === claimId);
  if (!c) return;

  c.status = status;

  if (status === "picked_up") {
    s.notifications.unshift({
      id: uid(),
      type: "pickup_confirmed",
      title: "Pickup completed",
      message: `Pickup confirmed for window ${c.pickupWindow}. Great job reducing waste!`,
      createdAt: nowISO(),
      read: false,
    });
  }

  if (status === "cancelled") {
    s.notifications.unshift({
      id: uid(),
      type: "claim_cancelled",
      title: "Claim cancelled",
      message: `A claim was cancelled for window ${c.pickupWindow}.`,
      createdAt: nowISO(),
      read: false,
    });
  }

  setStore(s);
}

/** expirations */
export function addExpirationItem(
  input: Omit<ExpirationItem, "id" | "createdAt">
) {
  const s = getStore();
  const item: ExpirationItem = { ...input, id: uid(), createdAt: nowISO() };
  s.expirations.unshift(item);
  setStore(s);
  return item;
}

export function deleteExpirationItem(id: string) {
  const s = getStore();
  s.expirations = s.expirations.filter((x) => x.id !== id);
  setStore(s);
}
export function deleteListing(listingId: string) {
  const s = getStore();

  // Remove listing
  s.listings = s.listings.filter((l) => l.id !== listingId);

  // Optional: also remove claims tied to this listing (recommended for clean MVP)
  s.claims = s.claims.filter((c) => c.listingId !== listingId);

  // Optional: notify
  s.notifications.unshift({
    id: uid(),
    type: "claim_cancelled", // reuse existing type to avoid adding new type
    title: "Listing removed",
    message: "A listing was removed after pickup / cleanup.",
    createdAt: nowISO(),
    read: false,
  });

  setStore(s);
}
