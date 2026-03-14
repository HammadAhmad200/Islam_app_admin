// Blog Types
export interface Blog {
  _id: string;
  caption: string;
  createdAt: string;
  date: string;
  status: "Published" | "Draft";
  externalLink?: string;
  image?: string;
  video?: string;
  audio?: string;
}

// Donation Types
export interface Donation {
  id: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  createdAt: string;
  status: "Completed" | "Pending" | "Failed";
  type: "Regular" | "Emergency" | "Zakat";
  invoiceLink: string;
}

// Masjid Types
export interface PrayerTime {
  azanTime: string;
  iqamaTime: string;
}

export interface JummahTime {
  _id: string;
  khutbahTime: string;
  salahTime: string;
}

export interface Masjid {
  _id: string;
  masjidName: string;
  address: string;
  fajr: PrayerTime;
  dhuhr: PrayerTime;
  asr: PrayerTime;
  maghrib: PrayerTime;
  isha: PrayerTime;
  jummah: JummahTime[];
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  lastLogin?: string;
}

// Subscription Types
export interface SubscriptionPackage {
  id: string;
  object: string;
  active: boolean;
  attributes: any[];
  created: number;
  default_price: string | null;
  description: string | null;
  images: string[];
  livemode: boolean;
  marketing_features: any[];
  metadata: Record<string, string>;
  name: string;
  package_dimensions: any | null;
  shippable: boolean | null;
  statement_descriptor: string | null;
  tax_code: string | null;
  type: string;
  unit_label: string | null;
  updated: number;
  url: string | null;
  prices: {
    id: string;
    object: string;
    active: boolean;
    billing_scheme: string;
    created: number;
    currency: string;
    custom_unit_amount: any | null;
    livemode: boolean;
    lookup_key: string | null;
    metadata: Record<string, string>;
    nickname: string | null;
    product: string;
    recurring: {
      aggregate_usage: string | null;
      interval: "day" | "week" | "month" | "year";
      interval_count: number;
      meter: string | null;
      trial_period_days: number | null;
      usage_type: string;
    };
    tax_behavior: string;
    tiers_mode: string | null;
    transform_quantity: any | null;
    type: string;
    unit_amount: number;
    unit_amount_decimal: string;
  }[];
}

export interface UserSubscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  packageId: string;
  packageName: string;
  startDate: number;
  endDate: number;
  status: "active" | "Expired" | "Cancelled";
  autoRenew: boolean;
}

export interface Analytics {
  blogs: number;
  blogsLastMonth: number;
  donations: number;
  donationsLastMonth: number;
  donationTrends: any[];
  masjids: number;
  masjidsLastMonth: number;

  activeUsers: number;
  activeUsersLastMonth: number;
}
