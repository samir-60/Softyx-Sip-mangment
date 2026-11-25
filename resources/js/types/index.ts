export interface FoodProduct {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  effective_price: number;
  promotional_price: number | null;
  image: string | null;
  has_3d: boolean;
  has_options: boolean;
  options?: Record<string, number> | null;
  category_id: number | null;
  is_featured: boolean;
  status?: 'draft' | 'published' | 'archived';
  is_available?: boolean;
  sort_order?: number;
  deleted_at?: string | null;
  category?: { id: number; name: string } | null;
}

export interface ClothingProduct {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  display_price: number | null;
  promotional_price: number | null;
  image: string | null;
  sizes: string[];
  colours: string[];
  category: string | null;
  category_id?: number | null;
  external_store_url?: string | null;
  external_store_name?: string;
  redirect_enabled?: boolean;
  fallback_redirect_enabled?: boolean;
  status?: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  has_redirect: boolean;
  redirect_url: string;
  sort_order?: number;
  deleted_at?: string | null;
}

export interface LiveSoftyxProduct {
  id: string;
  name: string;
  category: string;
  description: string | null;
  image: string | null;
  price: number | null;
  compare_price?: number | null;
  currency: string;
  sizes: string[];
  colours: string[];
  stock?: number;
  url: string;
  in_stock: boolean;
}

export interface Category {
  id: number;
  type: 'food' | 'clothing';
  name: string;
  slug: string;
  sort_order?: number;
  is_active?: boolean;
  food_products_count?: number;
  clothing_products_count?: number;
}

export interface RestaurantTable {
  id: number;
  name: string;
  capacity?: number | null;
  is_active?: boolean;
}

export interface OrderItem {
  id: number;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  options: Record<string, string | number> | null;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone?: string | null;
  table_name?: string | null;
  table?: RestaurantTable | null;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  payment_method?: string | null;
  subtotal: number;
  discount_amount: number;
  total: number;
  notes?: string | null;
  prep_minutes?: number;
  prep_ends_at?: string | null;
  spin_reward?: {
    index: number;
    label: string;
    target: 'food' | 'clothing';
    code: string;
  } | null;
  created_at: string;
  items: OrderItem[];
}

export interface QrCodeItem {
  id: number;
  uuid: string;
  type: 'menu' | 'food' | 'table';
  label: string;
  target_url: string;
  image_path: string | null;
  food_product?: { id: number; name: string } | null;
  table?: { id: number; name: string } | null;
}

export interface PromotionItem {
  id: number;
  name: string;
  code: string | null;
  type: 'percentage' | 'fixed' | 'bogo' | 'combo';
  value: number;
  applies_to: 'all' | 'category' | 'product';
  minimum_order: number | null;
  usage_limit: number | null;
  usage_count: number;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at?: string | null;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  auth: { user: AuthUser };
  flash?: { success?: string; error?: string };
};
