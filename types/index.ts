export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  discount?: string;
  category: string;
  subcategory?: string;
  description?: string;
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  healthBenefits?: string[];
  targetAudience?: string[];
}

export type CutType = 'small_pieces' | 'slices' | 'cubes' | 'long_cuts' | 'grated';

export interface CutStyleMedia {
  image: string;
  videoUrl?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedWeight?: number;
  cutType?: CutType;
  specialInstructions?: string;
}

export interface DeliverySlot {
  id: string;
  label: string;
  sub: string;
  icon: string;
}

export interface ScheduledDelivery {
  type: 'now' | 'scheduled';
  date?: string;
  timeSlot?: string;
}

export type OrderType = 'delivery' | 'pickup';

export interface Order {
  id: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  subtotal: number;
  cuttingCharges: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  orderType?: OrderType;
  deliverySlot: string;
  scheduledDelivery?: ScheduledDelivery;
  deliveryAddress: string;
  createdAt: string;
  estimatedDelivery?: string;
  timeline?: OrderTimeline[];
  specialNote?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  unit: string;
  selectedWeight?: number;
  cutType?: CutType;
  specialInstructions?: string;
}

export type OrderStatus = 'placed' | 'confirmed' | 'cutting' | 'quality_check' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderTimeline {
  status: string;
  time: string;
  description: string;
  completed: boolean;
}

export interface DishPackItem {
  productId: string;
  quantity: number;
}

export interface PackSize {
  id: string;
  label: string;
  serves: string;
  weightGrams: number;
  weightLabel: string;
}

export interface RegionalVariant {
  id: string;
  name: string;
  description: string;
  spiceLevel: 'mild' | 'medium' | 'spicy';
  extraIngredients?: string[];
}

export interface DishPack {
  id: string;
  name: string;
  image: string;
  description: string;
  color: string;
  tag?: string;
  items: DishPackItem[];
  serves: string;
  price: number;
  cookingVideoUrl?: string;
  preparationSteps?: string[];
  regionalVariants?: RegionalVariant[];
}
