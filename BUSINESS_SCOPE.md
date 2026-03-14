# Chopify — Business Scope & Technical Documentation

**Project Name:** Chopify (SorubanCuttingApp)
**Version:** 1.0.0
**Date:** March 2026
**Organization:** Soruban Retail

---

## Table of Contents

1. Executive Summary
2. Business Overview
3. Target Audience & Market
4. Product Offerings
5. App Architecture
6. Authentication Flow
7. Screens & Features
8. Order Lifecycle & Workflow
9. Subscription Model
10. Pricing & Revenue Model
11. Data Architecture
12. Technical Stack
13. Feature Matrix
14. Security Considerations
15. Scalability & Future Roadmap
16. Appendix

---

## 1. Executive Summary

Chopify is a hyperlocal fresh-cut delivery mobile application that allows customers to order pre-cut vegetables, fruits, dish packs, healthy foods, salads, drinks, and diet-based products — delivered fresh to their doorstep.

Core Value Proposition: Customers save time on daily food preparation by receiving hygienically cut produce in their preferred cut style (slices, cubes, grated, etc.), with subscription options for recurring daily, weekly, or monthly deliveries.

---

## 2. Business Overview

### 2.1 Problem Statement

- Working professionals and families spend 30–60 minutes daily on vegetable/fruit cutting and preparation
- Inconsistent cut sizes affect cooking quality and time
- Bulk buying leads to wastage; daily market visits are time-consuming
- No existing platform offers customizable cut styles with doorstep delivery

### 2.2 Solution

Chopify provides:
- On-demand fresh cutting with 5 professional cut styles
- Pre-assembled dish packs for popular regional recipes (Sambar, Biryani, Poriyal, etc.)
- Flexible subscriptions (daily/weekly/monthly) with automatic delivery scheduling
- Real-time order tracking from cutting to doorstep delivery
- Health-conscious options including salads, juice packs, and diet-based products

### 2.3 Business Model

Revenue Streams:
- Product Sales (vegetables, fruits, herbs, specialty items)
- Cutting Charges (per cut type: ₹10 – ₹20 per item)
- Delivery Fees (₹25 standard, reduced for subscribers)
- Dish Pack Premiums (curated bundles with markup)
- Subscription Recurring Revenue (daily/weekly/monthly lock-in)

---

## 3. Target Audience & Market

### 3.1 Primary Target Segments

| Segment | Profile | Key Need |
|---------|---------|----------|
| Working Professionals | Age 25–45, dual-income households | Time-saving, daily convenience |
| Home Cooks | Traditional cooking enthusiasts | Consistent cuts, recipe-ready packs |
| Health-Conscious | Fitness & diet followers | Fresh salads, measured portions, diet packs |
| Senior Citizens | Age 60+, limited mobility | Doorstep delivery, ease of use |
| Hostel/PG Residents | Students, bachelors | Small portions, ready-to-cook packs |

### 3.2 Geographic Focus

- Initial Launch: South Indian cities (Tamil Nadu, Karnataka, Andhra Pradesh)
- Cuisine Focus: Tamil, Kongu, Chettinad, Hyderabadi, Lucknowi regional styles
- Delivery Radius: Hyperlocal (5–10 km per store hub)

---

## 4. Product Offerings

### 4.1 Product Categories

| Category | Examples | Unit |
|----------|----------|------|
| Vegetables | Tomato, Onion, Carrot, Spinach, Potato, Capsicum, Beetroot, Cucumber, Brinjal, Beans, Cabbage, Cauliflower | per kg |
| Fruits | Banana, Apple, Orange, Watermelon, Grapes, Papaya, Mango, Pineapple | per kg |
| Herbs & Leafy Greens | Coriander, Mint, Curry Leaves, Spinach, Fenugreek | per bunch |
| Specialty Items | Ginger, Garlic, Green Chillies, Coconut | per unit/kg |

### 4.2 Cut Types & Pricing

| Cut Style | Charge | Description | Best For |
|-----------|--------|-------------|----------|
| Small Pieces | ₹10 | Finely chopped, uniform small cuts | Curries, gravies, sambar |
| Slices | ₹10 | Even thickness slices | Stir-fry, salads, sandwiches |
| Cubes | ₹15 | Uniform cube-shaped pieces | Biryani, soups, pulao |
| Long Cuts | ₹10 | Elongated strips / julienne | Noodles, French fries, stir-fry |
| Grated | ₹20 | Finely grated / shredded | Dosa batter, paratha stuffing, salads |

Each cut type includes:
- Visual reference image
- Video / GIF demonstration (Tenor GIF or YouTube)
- Recommended use cases

### 4.3 Weight Options

| Weight | Typical Use Case |
|--------|-----------------|
| 250g | Single serving / garnish |
| 500g | Small family (2–3 people) |
| 750g | Medium family (3–4 people) |
| 1kg | Large family / bulk cooking |

### 4.4 Dish Packs (Pre-Assembled Bundles)

| Pack Name | Price | Contents | Regional Variants |
|-----------|-------|----------|-------------------|
| Sambar Pack | ₹120 | Drumstick, Brinjal, Tomato, Onion, Carrot, Beans | Tamil, Kongu, Hotel Style |
| Biryani Veggie Pack | ₹110 | Potato, Carrot, Beans, Tomato, Onion, Mint, Coriander | Hyderabadi, Lucknowi |
| Fish Gravy Pack | ₹90 | Tomato, Onion, Ginger, Garlic, Green Chilli, Curry Leaves | Standard |
| Mutton Gravy Pack | ₹100 | Onion, Tomato, Ginger-Garlic, Fennel, Coriander | Madurai, Coimbatore, Chettinad |
| Poriyal Mix Pack | ₹95 | Beans, Carrot, Cabbage, Coconut | Standard |
| Fruit Salad Pack | ₹180 | Apple, Banana, Grapes, Pomegranate, Papaya | Standard |
| Juice Fruits Pack | ₹160 | Orange, Watermelon, Mango, Pineapple | Standard |

Each dish pack includes:
- Pack size options (S / M / L / XL with gram weights)
- Step-by-step preparation instructions
- Cooking video URL
- Regional spice level variants

---

## 5. App Architecture

### 5.1 High-Level Architecture

```
Presentation Layer (Screens / UI)
  ├── Authentication Group (5 screens)
  ├── Tab Navigation (5 tabs)
  └── Feature Screens (11 screens)

State Management Layer (React Context API)
  ├── AuthContext   → User session & authentication
  ├── CartContext   → Cart items, quantities, fees
  ├── OrderContext  → Order creation & history
  └── ScrollContext → Animated tab bar behavior

Data Layer
  ├── AsyncStorage  → Local persistence
  ├── Static JSON   → Products, delivery slots
  └── Static TS     → Cut types, dish packs
```

### 5.2 Navigation Architecture (Expo Router — File-Based Routing)

```
/ (Root Stack)
├── /(auth) — Authentication Stack Group
│   ├── index        → Auth entry point
│   ├── login        → Phone-based login
│   ├── register     → New user registration
│   ├── otp          → OTP verification
│   └── onboarding   → First-time onboarding slides
│
├── /(tabs) — Bottom Tab Navigator (Main App)
│   ├── index        → Home (tab 1)
│   ├── packs        → Dish Packs (tab 2)
│   ├── cart         → Shopping Cart (floating button, tab 3)
│   ├── orders       → Order History (tab 4)
│   └── profile      → User Profile (tab 5)
│
├── /product-detail     → Product detail with cut & weight selection
├── /dish-pack-detail   → Dish pack detail with variants
├── /browse             → Category browsing & search
├── /search             → Full-text search results
├── /checkout           → Checkout with subscription options
├── /order-detail       → Order tracking with timeline
├── /addresses          → Saved delivery addresses
├── /edit-profile       → Profile editing with image picker
├── /notifications      → Notification center
├── /wallet             → Wallet & transaction history
├── /favorites          → Bookmarked products
├── /help               → FAQ & customer support
└── /about              → App info & company details
```

### 5.3 State Management

AuthContext
- State: user, isLoading, isAuthenticated
- Actions: login(), loginByPhone(), logout(), updateUser()
- Storage: @user, @json_users (AsyncStorage)

CartContext
- State: cartItems[]
- Actions: addToCart(), removeFromCart(), updateQuantity(), updateCutType(), updateInstructions(), clearCart()
- Computed: getSubtotal(), getCuttingTotal(), getItemCount()
- Feature: Intelligent merging (same product + same cut type + same weight = merge)
- Storage: @cutting_cart (AsyncStorage)

OrderContext
- State: orders[]
- Actions: createOrder(), refreshOrders()
- Feature: Auto-generates 7-step timeline
- Feature: Auto-incremental order IDs (CUT1001, CUT1002, ...)
- Feature: Subscription & discount support
- Storage: @cutting_orders (AsyncStorage)

ScrollContext
- State: scrollY (Reanimated shared value)
- Feature: Hides tab bar on scroll down
- Uses: react-native-reanimated

---

## 6. Authentication Flow

```
App Launch
  ├── No session found
  │     ├── First time user
  │     │     → Onboarding (3 slides) → Register (name + phone) → OTP (6-digit) → Home
  │     └── Returning user
  │           → Login (phone) → OTP → Home
  └── Session found (@user in AsyncStorage)
        → Auto-login → Home
```

Details:
- Phone-based registration (name + phone number required, email optional)
- 6-digit OTP verification
- Session persistence via AsyncStorage (@user key)
- User database stored in @json_users for phone lookup
- Profile includes: name, phone, email (optional), address, avatar

---

## 7. Screens & Features

### 7.1 Home Screen

| Section | Description |
|---------|-------------|
| Animated Search Bar | Rotating placeholder text showcasing searchable categories |
| Hero Banner | Promotional carousel with offers and highlights |
| Category Grid | Visual tiles for Vegetables, Fruits, Dish Packs, Salads, etc. |
| Offer Carousel | Horizontal scrollable discount/promotion cards |
| Popular Products | Grid of trending products with ratings and quick-add button |

### 7.2 Product Browsing & Search

- Browse Screen: Category-filtered grid view with sort options
- Search Screen: Full-text search across product names, categories, and tags
- Product Detail Screen:
  - Product image with discount badge
  - Price with original price strikethrough (if discounted)
  - Weight selector (250g / 500g / 750g / 1kg)
  - Cut style selector with visual previews (image + GIF/video modal)
  - Health benefits section
  - Customer reviews and ratings
  - Special instructions text input
  - Add to cart button

### 7.3 Dish Packs

- Packs List: Card-based browsable list of all dish packs
- Pack Detail Screen:
  - Pack name, description, image
  - Included ingredients list
  - Size options (S / M / L / XL) with gram weights and prices
  - Regional variants with spice level indicators
  - Step-by-step preparation instructions
  - Cooking video (YouTube embedded via WebView)
  - Add to cart with selected size

### 7.4 Shopping Cart

| Feature | Description |
|---------|-------------|
| Item List | All cart items with quantities, weights, cut types |
| Quantity Controls | Increment / decrement with minimum 1 |
| Cut Type Display | Badge showing selected cut style per item |
| Special Instructions | Per-item custom notes visible |
| Price Breakdown | Subtotal + cutting charges + delivery fee |
| Intelligent Merging | Same product with same cut type & weight auto-merges |
| Persistent Storage | Cart survives app restart (AsyncStorage) |
| Floating Cart Button | Always visible on Home and Browse screens with item count |

### 7.5 Checkout

```
Cart → Checkout Screen
  ├── Order Type Toggle: Delivery / Pickup
  ├── Delivery Address (saved addresses or enter new)
  ├── Delivery Slot Selection:
  │     ├── ASAP (30–45 min)
  │     ├── Morning (8 AM – 10 AM)
  │     ├── Afternoon (12 PM – 2 PM)
  │     ├── Evening (5 PM – 7 PM)
  │     └── Tomorrow Morning (8 AM – 10 AM)
  ├── Scheduled Delivery (optional):
  │     ├── Date picker (next 7 days)
  │     └── Time slot selector (7 options)
  ├── Subscription Toggle (optional):
  │     ├── Frequency: Daily / Weekly / Monthly
  │     ├── Weekly: Select day of week (Mon–Sun)
  │     ├── Monthly: Select dates (1, 5, 10, 15, 20, 25)
  │     ├── Start date picker
  │     ├── Preferred time slot
  │     ├── Savings badge (10% / 15% / 20%)
  │     └── Subscription summary card
  ├── Coupon Code Input
  ├── Bill Summary:
  │     ├── Item Subtotal
  │     ├── Cutting Charges
  │     ├── Delivery Fee (strikethrough if subscription discount)
  │     ├── Coupon Discount
  │     └── Grand Total
  └── Button: "Place Order" / "Subscribe & Order"
```

### 7.6 Order Tracking

Orders List Screen:
- Chronological list of all past and active orders
- Status badge with color coding per order
- Subscription badge (orange label with frequency) for subscription orders
- Order total and item count

Order Detail Screen:
- Current status banner with color coding
- Subscription info card (frequency, day/dates, time, status)
- Visual timeline with 7 stages (completed dots, pending dots, connecting lines, timestamps)
- Complete item list with cut type badges
- Bill breakdown
- Estimated delivery time

### 7.7 User Profile

| Section | Description |
|---------|-------------|
| Profile Header | Avatar, name, member since date, edit button |
| Quick Stats | Total orders count, active subscriptions count, wallet balance |
| My Subscriptions | Active subscription cards showing frequency, schedule, per-delivery cost |
| Menu Options | Orders, Addresses, Wallet, Favorites, Notifications, Help, About |

### 7.8 Additional Screens

| Screen | Purpose |
|--------|---------|
| Addresses | Add, edit, delete saved delivery addresses |
| Edit Profile | Update name, email, phone, avatar (image picker) |
| Wallet | Balance display, transaction history |
| Favorites | Bookmarked / saved products |
| Notifications | Order status updates and promotional alerts |
| Help | FAQ section and customer support contact |
| About | App version, company details |

### 7.9 Complete Screen Inventory

| # | Screen | Route |
|---|--------|-------|
| 1 | Onboarding | /(auth)/onboarding |
| 2 | Login | /(auth)/login |
| 3 | Register | /(auth)/register |
| 4 | OTP Verification | /(auth)/otp |
| 5 | Home | /(tabs)/ |
| 6 | Dish Packs | /(tabs)/packs |
| 7 | Cart | /(tabs)/cart |
| 8 | Orders | /(tabs)/orders |
| 9 | Profile | /(tabs)/profile |
| 10 | Product Detail | /product-detail |
| 11 | Dish Pack Detail | /dish-pack-detail |
| 12 | Browse | /browse |
| 13 | Search | /search |
| 14 | Checkout | /checkout |
| 15 | Order Detail | /order-detail |
| 16 | Addresses | /addresses |
| 17 | Edit Profile | /edit-profile |
| 18 | Wallet | /wallet |
| 19 | Favorites | /favorites |
| 20 | Notifications | /notifications |
| 21 | Help | /help |
| 22 | About | /about |

Total: 22 screens

---

## 8. Order Lifecycle & Workflow

### 8.1 Order Pipeline

```
placed (Order submitted, awaiting confirmation)
  → confirmed (Shop accepted the order)
    → cutting (Items being cut per specifications)
      → quality_check (Cut quality & freshness verified)
        → packed (Items packed, ready for pickup)
          → out_for_delivery (Driver picked up, en route)
            → delivered (Customer received the order)

Any status can also transition to → cancelled
```

### 8.2 Order Status Definitions

| Status | Code | Description |
|--------|------|-------------|
| New Order | placed | Customer has placed order, awaiting shop review |
| Confirmed | confirmed | Shop accepted and queued for processing |
| Cutting | cutting | Items being cut as per selected cut styles |
| Quality Check | quality_check | Cut items inspected for quality and accuracy |
| Packed | packed | Items packed in hygienic packaging |
| Out for Delivery | out_for_delivery | Driver en route to customer |
| Delivered | delivered | Customer received the order |
| Cancelled | cancelled | Order rejected or cancelled |

### 8.3 Auto-Generated Timeline

When an order is placed, the system generates a 7-step timeline:

| Step | Label | Description | Initial State |
|------|-------|-------------|---------------|
| 1 | Order Placed | Your order has been placed | Completed (with timestamp) |
| 2 | Confirmed | Shop has confirmed your order | Pending |
| 3 | Cutting Started | Your items are being freshly cut | Pending |
| 4 | Quality Check | Checking cut quality & freshness | Pending |
| 5 | Packed | Order packed & ready for delivery | Pending |
| 6 | Out for Delivery | Your order is on the way | Pending |
| 7 | Delivered | Order delivered successfully | Pending |

As the order progresses, completed steps are marked with timestamps.

---

## 9. Subscription Model

### 9.1 Subscription Frequencies

| Frequency | Schedule | Delivery Discount | What Customer Selects |
|-----------|----------|--------------------|-----------------------|
| Daily | Every day | 10% off delivery fee | Start date + preferred time |
| Weekly | Once per week | 15% off delivery fee | Day of week + start date + preferred time |
| Monthly | Selected dates each month | 20% off delivery fee | Dates (1, 5, 10, 15, 20, 25) + start date + preferred time |

### 9.2 Subscription Time Slots

| Slot | Time Range |
|------|------------|
| Early Morning | 6:00 AM – 8:00 AM |
| Morning | 8:00 AM – 10:00 AM |
| Late Morning | 10:00 AM – 12:00 PM |
| Afternoon | 12:00 PM – 2:00 PM |
| Evening | 4:00 PM – 6:00 PM |
| Late Evening | 6:00 PM – 8:00 PM |

### 9.3 Subscription Data Model

```
Subscription:
  - frequency: 'daily' | 'weekly' | 'monthly'
  - preferredTime: string (e.g., "8:00 AM – 10:00 AM")
  - startDate: string (ISO date)
  - weeklyDay: string (optional, e.g., "Monday" — weekly only)
  - monthlyDates: number[] (optional, e.g., [1, 15] — monthly only)
  - status: 'active' | 'paused' | 'cancelled'
```

### 9.4 Where Subscriptions Are Visible

| Location | What's Shown |
|----------|-------------|
| Checkout | Frequency selector, day/date picker, time slot, savings badge, summary card |
| Orders List | Orange subscription badge with frequency label |
| Order Detail | Subscription info card (frequency, schedule, time, status) |
| Profile | "My Subscriptions" section with active subscription cards |

---

## 10. Pricing & Revenue Model

### 10.1 Price Components

| Component | Calculation | Example |
|-----------|-------------|---------|
| Product Price | Base price x weight multiplier | Tomato ₹40/kg x 0.5kg = ₹20 |
| Cutting Charge | Fixed per cut type per item | Cubes = ₹15 |
| Delivery Fee | Standard flat fee | ₹25 |
| Subscription Discount | % off delivery fee | Daily: ₹25 x 0.9 = ₹22.50 |
| Coupon Discount | Flat or percentage off total | FRESH50 = ₹50 off |

### 10.2 Bill Summary Structure

```
Item Subtotal ................... ₹XXX.XX
Cutting Charges ................ + ₹XX.XX
Delivery Fee ................... + ₹25.00
Coupon Discount ................ - ₹XX.XX
————————————————————————————————————————
Grand Total ..................... ₹XXX.XX
```

---

## 11. Data Architecture

### 11.1 Core Data Models

User: id, name, phone, email (optional), address (optional), avatar (optional)

Product: id, name, price, originalPrice, unit, image, discount, category, subcategory, description, inStock, rating, reviewCount, tags, healthBenefits, targetAudience

CartItem (extends Product): quantity, selectedWeight, cutType, specialInstructions

CutType: 'small_pieces' | 'slices' | 'cubes' | 'long_cuts' | 'grated'

Order: id, items[], status, total, subtotal, cuttingCharges, deliveryFee, discount, couponCode, orderType, deliverySlot, scheduledDelivery, deliveryAddress, createdAt, estimatedDelivery, timeline[], specialNote, subscription

OrderItem: id, name, image, price, quantity, unit, selectedWeight, cutType, specialInstructions

OrderStatus: 'placed' | 'confirmed' | 'cutting' | 'quality_check' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled'

OrderTimeline: status, time, description, completed

DishPack: id, name, subtitle, description, image, cookingVideo, items[], sizes[], prepSteps[], regionalVariants[]

PackSize: label (S/M/L/XL), weight, price, serves

RegionalVariant: name, style, spiceLevel

### 11.2 Local Storage Keys

| Key | Data Stored |
|-----|-------------|
| @user | Current logged-in user profile |
| @json_users | All registered users (for phone lookup) |
| @cutting_cart | Current cart items |
| @cutting_orders | All orders (past & active) |

### 11.3 Order ID Generation

- Format: CUT + 4-digit number (e.g., CUT1001, CUT1002, CUT1003)
- Auto-incremental based on highest existing order ID
- Starts from CUT1001 if no orders exist

### 11.4 Static Data Sources

| File | Contents |
|------|----------|
| data/products.json | Full product catalog with categories, prices, health benefits, ratings |
| data/dishPacks.ts | 7 dish packs with sizes, variants, prep steps, cooking videos |
| data/cutTypes.ts | 5 cut types with names, fees, descriptions, images, video URLs |
| data/deliverySlots.json | 5 delivery time slots with labels and icons |

---

## 12. Technical Stack

### 12.1 Framework & Runtime

| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.81.5 | Cross-platform mobile framework |
| Expo | SDK 54 | Managed workflow, build & deploy tooling |
| Expo Router | 6.0.23 | File-based navigation (similar to Next.js) |
| React | 19.1.0 | UI component library |
| TypeScript | 5.9.2 | Static type checking (strict mode) |

### 12.2 Key Dependencies

| Package | Purpose |
|---------|---------|
| @react-native-async-storage/async-storage | Local data persistence |
| expo-linear-gradient | Gradient backgrounds and headers |
| expo-image-picker | Profile photo selection from gallery/camera |
| expo-av | Video playback for cut style demonstrations |
| react-native-webview | YouTube video embedding for cooking videos |
| react-native-reanimated | Smooth animations (tab bar hide/show) |
| react-native-gesture-handler | Touch gesture handling |
| react-native-safe-area-context | Safe area insets for notch devices |
| react-native-screens | Native screen container management |
| @expo/vector-icons | MaterialCommunityIcons icon set |
| expo-haptics | Tactile/vibration feedback on interactions |

### 12.3 Project Structure

```
SorubanCuttingApp/
├── app/
│   ├── (auth)/          — login, register, otp, onboarding (5 files + layout)
│   ├── (tabs)/          — home, packs, cart, orders, profile (5 files + layout)
│   ├── product-detail.tsx
│   ├── dish-pack-detail.tsx
│   ├── browse.tsx
│   ├── search.tsx
│   ├── checkout.tsx
│   ├── order-detail.tsx
│   ├── addresses.tsx
│   ├── edit-profile.tsx
│   ├── notifications.tsx
│   ├── wallet.tsx
│   ├── favorites.tsx
│   ├── help.tsx
│   ├── about.tsx
│   └── _layout.tsx       (Root layout)
├── context/              — AuthContext, CartContext, OrderContext, ScrollContext
├── data/                 — products.json, dishPacks.ts, cutTypes.ts, deliverySlots.json
├── types/                — index.ts (all TypeScript interfaces)
├── src/utils/            — theme.ts, localJsonStorage.ts
├── src/components/       — AnimatedSearchPlaceholder.tsx
├── assets/               — icon.png, splash-icon.png, favicon.png, android icons
├── package.json
├── tsconfig.json
└── app.json
```

### 12.4 Build & Run Commands

```
npm install                    — Install dependencies
npx expo start                 — Start development server
npx expo start --android       — Launch on Android device/emulator
npx expo start --ios           — Launch on iOS simulator (macOS only)
```

### 12.5 Environment Requirements

| Requirement | Version |
|-------------|---------|
| Node.js | 18+ |
| npm | 9+ |
| Expo CLI | Latest |
| Android Studio | For Android builds |
| Xcode | For iOS builds (macOS only) |

---

## 13. Feature Matrix

| # | Feature | Status |
|---|---------|--------|
| 1 | Phone Authentication (OTP) | Implemented |
| 2 | Onboarding (3-slide intro) | Implemented |
| 3 | Product Browsing (category grid) | Implemented |
| 4 | Full-Text Search | Implemented |
| 5 | Cut Style Selection (5 types with preview) | Implemented |
| 6 | Weight Selection (250g–1kg) | Implemented |
| 7 | Special Cutting Instructions | Implemented |
| 8 | Shopping Cart (persistent, intelligent merge) | Implemented |
| 9 | Floating Cart Button | Implemented |
| 10 | Dish Packs (7 curated bundles) | Implemented |
| 11 | Regional Recipe Variants | Implemented |
| 12 | Delivery Slots (5 preset + scheduled) | Implemented |
| 13 | Subscription Orders (daily/weekly/monthly) | Implemented |
| 14 | Coupon/Discount Code | Implemented |
| 15 | Order Placement (full checkout) | Implemented |
| 16 | Order Tracking (7-stage timeline) | Implemented |
| 17 | Order History | Implemented |
| 18 | User Profile (edit, avatar, stats) | Implemented |
| 19 | Saved Addresses | Implemented |
| 20 | Favorites / Bookmarks | Implemented |
| 21 | Notifications Center | Implemented |
| 22 | Animated Tab Bar (hides on scroll) | Implemented |
| 23 | Health Benefits Display | Implemented |
| 24 | Cooking Videos (YouTube embed) | Implemented |
| 25 | Cut Demo Videos (GIF/video) | Implemented |
| 26 | Wallet | Placeholder |
| 27 | Payment Integration (Razorpay/Stripe/UPI) | Planned |
| 28 | Push Notifications (FCM) | Planned |
| 29 | Live GPS Tracking | Planned |
| 30 | Ratings & Reviews | Planned |

---

## 14. Security Considerations

### 14.1 Current State (MVP)

| Area | Current Implementation |
|------|----------------------|
| Authentication | Local AsyncStorage session (simulated OTP) |
| Data Storage | Unencrypted AsyncStorage |
| API Communication | No external API (all local data) |
| Payment | No payment integration |
| Input Validation | Client-side only |

### 14.2 Production Security Requirements

| Area | Required Implementation |
|------|------------------------|
| Authentication | Firebase Auth / JWT with real SMS OTP (Twilio/MSG91) |
| Data Storage | Encrypted AsyncStorage + server-side database |
| API Security | HTTPS + API keys + request signing + rate limiting |
| Payment | PCI-compliant gateway (Razorpay/Stripe) |
| Input Validation | Server-side sanitization and validation |
| Access Control | Role-based (customer vs admin) |
| Data Privacy | GDPR / Indian DPDP Act compliance |

---

## 15. Scalability & Future Roadmap

### Phase 2 — Production Readiness

| Feature | Priority |
|---------|----------|
| Backend API (Firebase / Supabase / custom REST) | High |
| Payment Gateway (Razorpay / Stripe / UPI) | High |
| Push Notifications (FCM) | High |
| Real SMS OTP (Twilio / MSG91) | High |
| Live GPS Delivery Tracking | High |

### Phase 3 — Enhanced Features

| Feature | Priority |
|---------|----------|
| Rating & Reviews | Medium |
| Referral Program | Medium |
| Multi-language (Tamil, Telugu, Hindi, Kannada) | Medium |
| Promo Engine (coupons, flash sales, combos) | Medium |
| Loyalty Points | Medium |
| Diet Plans (weekly meal prep subscriptions) | Medium |

### Phase 4 — Platform Scale

| Feature | Description |
|---------|-------------|
| Web App | React / Next.js customer portal |
| Multi-Store | Support multiple shop locations |
| Inventory Management | Real-time stock tracking |
| Analytics Dashboard | Sales trends, peak hours |
| Corporate Orders | Bulk ordering for offices |
| AI Recommendations | Personalized product suggestions |
| Voice Ordering | Regional language voice commands |
| Dark Mode | System-aware theme switching |

---

## 16. Appendix

### A. Color Scheme

| Token | Color | Usage |
|-------|-------|-------|
| Primary | #4CAF50 | Buttons, active states, accents |
| Primary Light | #81C784 | Hover states, soft highlights |
| Primary Dark | #388E3C | Headers, emphasis |
| Accent | #FFA726 | Warnings, promotions, subscriptions |
| Background | #F9FAFB | Page background |
| Background Soft | #E8F5E9 | Subtle green highlights |
| Surface | #FFFFFF | Cards, modals |
| Text Primary | #1A1A2E | Headings, body text |
| Text Secondary | #6B7280 | Subtitles, descriptions |
| Text Muted | #9CA3AF | Hints, timestamps |

### B. Order Status Colors

| Status | Background | Text Color |
|--------|------------|------------|
| Placed | #FFF3E0 | #E65100 |
| Confirmed | #E3F2FD | #0277BD |
| Cutting | #FCE4EC | #C62828 |
| Quality Check | #F3E5F5 | #6A1B9A |
| Packed | #E0F7FA | #00838F |
| Out for Delivery | #E8F5E9 | #2E7D32 |
| Delivered | #E8F5E9 | #1B5E20 |
| Cancelled | #FFEBEE | #D32F2F |

### C. Delivery Slots

| ID | Label | Time Window | Type |
|----|-------|-------------|------|
| 1 | ASAP | 30–45 minutes | Instant |
| 2 | Morning | 8:00 AM – 10:00 AM | Scheduled |
| 3 | Afternoon | 12:00 PM – 2:00 PM | Scheduled |
| 4 | Evening | 5:00 PM – 7:00 PM | Scheduled |
| 5 | Tomorrow Morning | 8:00 AM – 10:00 AM | Next Day |

### D. Design System Tokens

| Token | Value |
|-------|-------|
| Spacing xs | 4px |
| Spacing sm | 8px |
| Spacing md | 12px |
| Spacing base | 16px |
| Spacing lg | 20px |
| Spacing xl | 24px |
| Spacing xxl | 32px |
| Spacing xxxl | 48px |
| Radius sm | 6px |
| Radius md | 10px |
| Radius lg | 16px |
| Radius xl | 24px |
| Radius full | 999px |
| Shadow sm | elevation 2, opacity 0.08 |
| Shadow md | elevation 4, opacity 0.12 |
| Shadow lg | elevation 8, opacity 0.16 |

---

Document Prepared By: Development Team
Last Updated: March 2026
Version: 1.0.0
Status: MVP Complete — Ready for Phase 2 Planning
