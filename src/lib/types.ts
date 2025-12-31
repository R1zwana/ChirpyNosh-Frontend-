export type ListingType = "free" | "discounted";
export type PartnerType = "Restaurant" | "Supermarket" | "Bakery" | "Hotel" | "Shop";

export type Partner = {
  id: string;
  name: string;
  type: PartnerType;
  address: string;
  verified: boolean;
  createdAt: string;
};

export type Recipient = {
  id: string;
  orgName: string;
  address: string;
  capacity: number;
  verified: boolean;
  createdAt: string;
};

export type Listing = {
  id: string;
  partnerId: string;
  title: string;
  description: string;
  category: "Bakery" | "Produce" | "Meals" | "Dairy" | "Mixed";
  listingType: ListingType;
  quantity: number;
  priceEur?: number;
  pickupWindows: string[];
  predictedWindow?: string;
  imageUrl?: string;
  createdAt: string;
};

export type ClaimStatus = "claimed" | "picked_up" | "cancelled";

export type Claim = {
  id: string;
  listingId: string;
  claimedBy: "recipient" | "public";
  claimerName: string;
  pickupWindow: string;
  status: ClaimStatus;
  createdAt: string;
};

export type ExpirationItem = {
  id: string;
  item: string;
  expiresOn: string; // YYYY-MM-DD
  notes?: string;
  createdAt: string;
};


export type NotificationType =
  | "claim_created"
  | "pickup_confirmed"
  | "claim_cancelled"
  | "pickup_reminder"
  | "expiration_urgent";

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export type Store = {
  partners: Partner[];
  recipients: Recipient[];
  listings: Listing[];
  claims: Claim[];
  expirations: ExpirationItem[];
  notifications: AppNotification[];
};
