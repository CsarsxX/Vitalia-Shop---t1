export type Modality = 'oneblock' | 'lifesteal' | 'global';

export type ProductCategory = 'ranks' | 'rank_kits' | 'special_kits' | 'tools' | 'upgrades';

export interface MinecraftInventoryItem {
  id: string;
  name: string;
  count: number;
  iconType: 'sword' | 'pickaxe' | 'axe' | 'shovel' | 'helmet' | 'chestplate' | 'leggings' | 'boots' | 'golden_apple' | 'elytra' | 'potion' | 'block' | 'key' | 'totem' | 'book';
  material?: string;
  enchantments?: { name: string; level: string | number }[];
  lore?: string[];
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Product {
  id: string;
  name: string;
  tagline?: string;
  price: number | null; // null if pending configuration
  currency: 'USD';
  modality: Modality;
  category: ProductCategory;
  description: string;
  longDescription?: string;
  badge?: string;
  isPopular?: boolean;
  isFeatured?: boolean;
  isActive: boolean;
  // Specific rank properties
  rankLevel?: number; // 1 to 6
  hasFly?: boolean; // imperative: Imperium (level 3) onwards
  playerVaults?: number;
  homes?: number;
  commands?: string[];
  perks?: string[];
  kitIncludedName?: string;
  kitItems?: MinecraftInventoryItem[];
  // Specific tool / upgrade properties
  effectArea?: string; // e.g. "3x3"
  enchantments?: { name: string; level: string | number }[];
  toolType?: 'pickaxe' | 'axe' | 'pack' | 'island_upgrade';
  savingAmount?: number;
  includedProductIds?: string[]; // For bundle pack
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // e.g. 10 for 10% or 2 for $2
  validFrom: string;
  validUntil: string;
  maxUses: number;
  usedCount: number;
  minSpend?: number;
  applicableModality?: Modality;
  isActive: boolean;
  createdBy: string;
}

export type OrderPaymentStatus = 'pending' | 'notified' | 'under_review' | 'confirmed' | 'rejected' | 'cancelled';
export type OrderDeliveryStatus = 'pending' | 'delivering' | 'delivered' | 'failed';

export interface OrderTimelineEvent {
  step: string;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string; // e.g. "VT-84920"
  referenceCode: string; // e.g. "REF-784912"
  createdAt: string;
  mcUsername: string;
  email: string;
  modality: Modality;
  items: {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  totalPEN: number; // In soles
  paymentMethod: 'yape' | 'plin' | 'paypal';
  paymentStatus: OrderPaymentStatus;
  deliveryStatus: OrderDeliveryStatus;
  assignedAdmin?: string;
  internalNotes?: string;
  paymentProofUrl?: string;
  timeline: OrderTimelineEvent[];
}

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'SUPPORT' | 'AUDITOR';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  action: string;
  targetResource: string;
  details: string;
  result: 'success' | 'warning' | 'error';
}

export interface StoreSettings {
  storeName: string;
  maintenanceMode: boolean;
  serverIp: string;
  exchangeRateUSD_PEN: number; // 3.65
  paymentHolderName: string; // Milvan Bac
  yapePhone: string;
  plinPhone: string;
  paypalEnabled: boolean;
  paypalNotice: string;
  discordLink: string;
}
