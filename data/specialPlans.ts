import type { SubFrequency } from '@/types';

export interface SpecialPlanItem {
  productId: string;
  quantity: number;
}

export interface SpecialPlanDay {
  label: string;
  items: SpecialPlanItem[];
}

export interface SpecialPlan {
  id: string;
  name: string;
  category: 'gym' | 'hostel' | 'patient' | 'beauty' | 'women';
  tag?: string;
  icon: string;
  color: string;
  bgColor: string;
  image: string;
  description: string;
  benefits: string[];
  bestFor: string;
  healthTips: string[];
  frequencies: SubFrequency[];
  pricePerDay: number;
  targetGender?: ('male' | 'female' | 'other')[];
  targetLifestyle?: ('gym' | 'student' | 'working' | 'homemaker')[];
  targetGoals?: string[];
  dailyItems: SpecialPlanItem[];
  weeklyItems?: Record<string, SpecialPlanItem[]>; // Mon,Tue...
}

export const PLAN_CATEGORIES = [
  { key: 'all', label: 'All Plans', icon: 'view-grid' },
  { key: 'recommended', label: 'For You', icon: 'star-circle' },
  { key: 'gym', label: 'Gym & Fitness', icon: 'dumbbell' },
  { key: 'hostel', label: 'Hostel & Student', icon: 'school' },
  { key: 'women', label: "Women's Health", icon: 'human-female' },
  { key: 'patient', label: 'Health & Medical', icon: 'heart-pulse' },
  { key: 'beauty', label: 'Beauty & Skin', icon: 'face-woman-shimmer' },
] as const;

export const SPECIAL_PLANS: SpecialPlan[] = [
  // ─── GYM & FITNESS ───
  {
    id: 'gym_protein',
    name: 'Protein Power Plan',
    category: 'gym',
    tag: 'Popular',
    icon: 'dumbbell',
    color: '#E53935',
    bgColor: '#FFEBEE',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    description: 'High-protein foods for muscle building and recovery. Perfect for gym-goers.',
    benefits: ['High protein content', 'Supports muscle recovery', 'Rich in vitamins & minerals', 'Low fat options'],
    bestFor: 'Gym-goers, bodybuilders & fitness enthusiasts',
    healthTips: [
      'Sprouts & peanuts help rebuild muscle fibres after heavy workouts',
      'High protein intake reduces body fat % and builds lean muscle mass',
      'Regular intake improves stamina, endurance & workout performance',
      'Reduces post-workout soreness and speeds up recovery time',
    ],
    targetGender: ['male', 'female'],
    targetLifestyle: ['gym'],
    targetGoals: ['build_muscle', 'general_wellness'],
    frequencies: ['daily', 'weekly', 'monthly'],
    pricePerDay: 150,
    dailyItems: [
      { productId: '301', quantity: 1 }, // High Protein Salad
      { productId: '302', quantity: 1 }, // Protein Smoothie
      { productId: '303', quantity: 1 }, // Peanut Power Snack
      { productId: '101', quantity: 1 }, // Sprout Salad
    ],
    weeklyItems: {
      Mon: [{ productId: '301', quantity: 1 }, { productId: '302', quantity: 1 }, { productId: '2', quantity: 2 }],
      Tue: [{ productId: '303', quantity: 1 }, { productId: '101', quantity: 1 }, { productId: '306', quantity: 1 }],
      Wed: [{ productId: '301', quantity: 1 }, { productId: '305', quantity: 1 }, { productId: '11', quantity: 1 }],
      Thu: [{ productId: '302', quantity: 1 }, { productId: '304', quantity: 1 }, { productId: '2', quantity: 2 }],
      Fri: [{ productId: '301', quantity: 1 }, { productId: '303', quantity: 1 }, { productId: '306', quantity: 1 }],
      Sat: [{ productId: '305', quantity: 1 }, { productId: '101', quantity: 1 }, { productId: '102', quantity: 1 }],
    },
  },
  {
    id: 'gym_lean',
    name: 'Lean & Fit Plan',
    category: 'gym',
    icon: 'run-fast',
    color: '#FF6F00',
    bgColor: '#FFF3E0',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    description: 'Low-calorie, high-fiber foods for weight management and lean muscle.',
    benefits: ['Low calorie', 'High fiber', 'Supports fat loss', 'Keeps you full longer'],
    bestFor: 'Weight watchers, lean body goals & calorie-conscious users',
    healthTips: [
      'High fiber foods reduce belly fat and help in weight management',
      'Green smoothies detox your body and improve metabolism by 20%',
      'Cucumber & carrot sticks keep you full without adding calories',
      'Consistent intake helps reduce 2-3 kg per month naturally',
    ],
    targetGender: ['male', 'female'],
    targetLifestyle: ['gym'],
    targetGoals: ['lose_weight', 'build_muscle', 'general_wellness'],
    frequencies: ['daily', 'weekly', 'monthly'],
    pricePerDay: 130,
    dailyItems: [
      { productId: '304', quantity: 1 }, // Boiled Veggie Pack
      { productId: '103', quantity: 1 }, // Carrot Cucumber Sticks
      { productId: '105', quantity: 1 }, // Green Smoothie
      { productId: '202', quantity: 1 }, // High Fiber Veggie Pack
    ],
  },
  {
    id: 'gym_energy',
    name: 'Pre-Workout Energy',
    category: 'gym',
    icon: 'lightning-bolt',
    color: '#F57C00',
    bgColor: '#FFF8E1',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=400&q=80',
    description: 'Energy-boosting foods to fuel your workouts. Natural carbs and nutrients.',
    benefits: ['Natural energy boost', 'Complex carbohydrates', 'Quick absorption', 'Pre-workout fuel'],
    bestFor: 'Morning gym-goers & athletes needing pre-workout energy',
    healthTips: [
      'Banana before workout gives instant energy & prevents muscle cramps',
      'Oats provide slow-release energy that lasts throughout your session',
      'Natural carbs improve workout performance by 15-20%',
      'Reduces fatigue and helps you train longer without feeling tired',
    ],
    targetGender: ['male', 'female'],
    targetLifestyle: ['gym'],
    targetGoals: ['build_muscle', 'general_wellness'],
    frequencies: ['daily', 'weekly'],
    pricePerDay: 120,
    dailyItems: [
      { productId: '2', quantity: 2 },   // Banana
      { productId: '306', quantity: 1 }, // Energy Oats Bowl
      { productId: '305', quantity: 1 }, // Muscle Recovery Drink
      { productId: '108', quantity: 1 }, // Corn Cup
    ],
  },

  // ─── HOSTEL & STUDENT ───
  {
    id: 'hostel_budget',
    name: 'Budget Daily Pack',
    category: 'hostel',
    tag: 'Best Value',
    icon: 'cash',
    color: '#2E7D32',
    bgColor: '#E8F5E9',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
    description: 'Affordable daily fruits & veggies for hostel students. Fresh and budget-friendly.',
    benefits: ['Budget friendly', 'Daily essentials', 'Fresh & nutritious', 'Easy to prepare'],
    bestFor: 'Hostel students, PG residents & budget-conscious eaters',
    healthTips: [
      'Daily fresh fruits & veggies prevent hostel common issues like acidity & constipation',
      'Banana & cucumber keep you hydrated during long study hours',
      'Fresh vegetables improve concentration and memory for exams',
      'Saves money compared to outside food while staying 100% healthy',
    ],
    targetGender: ['male', 'female'],
    targetLifestyle: ['student'],
    targetGoals: ['general_wellness', 'improve_immunity'],
    frequencies: ['daily', 'weekly', 'monthly'],
    pricePerDay: 75,
    dailyItems: [
      { productId: '1', quantity: 1 },  // Tomato
      { productId: '4', quantity: 1 },  // Onion
      { productId: '2', quantity: 2 },  // Banana
      { productId: '20', quantity: 1 }, // Cucumber
    ],
    weeklyItems: {
      Mon: [{ productId: '1', quantity: 1 }, { productId: '4', quantity: 1 }, { productId: '2', quantity: 2 }],
      Tue: [{ productId: '7', quantity: 1 }, { productId: '10', quantity: 1 }, { productId: '11', quantity: 1 }],
      Wed: [{ productId: '1', quantity: 1 }, { productId: '13', quantity: 1 }, { productId: '2', quantity: 2 }],
      Thu: [{ productId: '30', quantity: 1 }, { productId: '4', quantity: 1 }, { productId: '8', quantity: 1 }],
      Fri: [{ productId: '22', quantity: 1 }, { productId: '19', quantity: 1 }, { productId: '2', quantity: 2 }],
      Sat: [{ productId: '102', quantity: 1 }, { productId: '104', quantity: 1 }],
    },
  },
  {
    id: 'hostel_snack',
    name: 'Student Snack Pack',
    category: 'hostel',
    icon: 'food-apple',
    color: '#1565C0',
    bgColor: '#E3F2FD',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80',
    description: 'Healthy snacks and juices for students. No junk food, all fresh!',
    benefits: ['Healthy snacking', 'Fresh juices', 'Brain food', 'No preservatives'],
    bestFor: 'College students, exam time snackers & health-aware youth',
    healthTips: [
      'Fresh orange juice boosts Vitamin C and keeps cold & flu away',
      'Corn & sprouts are brain foods that improve focus during study',
      'Replaces junk food cravings with healthy, tasty alternatives',
      'No preservatives means no stomach issues or food poisoning risk',
    ],
    targetGender: ['male', 'female'],
    targetLifestyle: ['student'],
    targetGoals: ['general_wellness', 'improve_immunity'],
    frequencies: ['daily', 'weekly'],
    pricePerDay: 90,
    dailyItems: [
      { productId: '102', quantity: 1 }, // Fruit Bowl
      { productId: '104', quantity: 1 }, // Fresh Orange Juice
      { productId: '108', quantity: 1 }, // Corn Cup
      { productId: '103', quantity: 1 }, // Carrot Cucumber Sticks
    ],
  },
  {
    id: 'hostel_beauty',
    name: 'Glow & Beauty Pack',
    category: 'beauty',
    tag: 'Trending',
    icon: 'face-woman-shimmer',
    color: '#AD1457',
    bgColor: '#FCE4EC',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80',
    description: 'Skin-friendly fruits and drinks for natural glow. Rich in Vitamin C & antioxidants.',
    benefits: ['Vitamin C rich', 'Antioxidant boost', 'Natural skin glow', 'Hydrating fruits'],
    bestFor: 'Women, beauty-conscious users & anyone wanting glowing skin',
    healthTips: [
      'Pomegranate juice clears acne, dark spots & gives natural glow in 2 weeks',
      'Papaya contains papain enzyme that removes dead skin cells & brightens face',
      'Orange & coconut water hydrate skin from inside — reduces dryness & wrinkles',
      'Mixed fruit smoothie is rich in Vitamin C which produces collagen for youthful skin',
    ],
    targetGender: ['female'],
    targetLifestyle: ['student', 'working', 'homemaker'],
    targetGoals: ['skin_care', 'general_wellness'],
    frequencies: ['daily', 'weekly', 'monthly'],
    pricePerDay: 110,
    dailyItems: [
      { productId: '61', quantity: 1 },  // Pomegranate
      { productId: '62', quantity: 1 },  // Papaya
      { productId: '8', quantity: 1 },   // Orange
      { productId: '107', quantity: 1 }, // Mixed Fruit Smoothie
      { productId: '405', quantity: 1 }, // Tender Coconut Water
    ],
  },

  // ─── HEALTH & PATIENT ───
  {
    id: 'patient_diabetic',
    name: 'Diabetic Friendly Plan',
    category: 'patient',
    tag: 'Doctor Recommended',
    icon: 'diabetes',
    color: '#1565C0',
    bgColor: '#E3F2FD',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    description: 'Low-sugar, high-fiber foods recommended for diabetes management.',
    benefits: ['Low glycemic index', 'Blood sugar friendly', 'High fiber', 'Doctor recommended'],
    bestFor: 'Diabetic patients, pre-diabetics & sugar-conscious users',
    healthTips: [
      'Bitter gourd (karela) naturally reduces blood sugar levels by 25%',
      'Low glycemic fruits prevent sugar spikes after meals',
      'High fiber veggies slow down glucose absorption — controls HbA1c',
      'Regular intake for 30 days shows visible improvement in fasting sugar levels',
    ],
    targetGender: ['male', 'female'],
    targetGoals: ['manage_diabetes', 'general_wellness'],
    frequencies: ['daily', 'weekly', 'monthly'],
    pricePerDay: 140,
    dailyItems: [
      { productId: '201', quantity: 1 }, // Low Sugar Fruit Pack
      { productId: '203', quantity: 1 }, // Diabetic Salad Bowl
      { productId: '202', quantity: 1 }, // High Fiber Veggie Pack
      { productId: '35', quantity: 1 },  // Bitter Gourd
    ],
    weeklyItems: {
      Mon: [{ productId: '201', quantity: 1 }, { productId: '203', quantity: 1 }, { productId: '35', quantity: 1 }],
      Tue: [{ productId: '202', quantity: 1 }, { productId: '10', quantity: 1 }, { productId: '34', quantity: 1 }],
      Wed: [{ productId: '201', quantity: 1 }, { productId: '36', quantity: 1 }, { productId: '203', quantity: 1 }],
      Thu: [{ productId: '202', quantity: 1 }, { productId: '35', quantity: 1 }, { productId: '7', quantity: 1 }],
      Fri: [{ productId: '203', quantity: 1 }, { productId: '33', quantity: 1 }, { productId: '201', quantity: 1 }],
      Sat: [{ productId: '202', quantity: 1 }, { productId: '205', quantity: 1 }],
    },
  },
  {
    id: 'patient_respiratory',
    name: 'Respiratory Health Plan',
    category: 'patient',
    icon: 'lungs',
    color: '#00897B',
    bgColor: '#E0F2F1',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
    description: 'Anti-inflammatory foods that support lung health. Good for asthma patients.',
    benefits: ['Anti-inflammatory', 'Supports lung health', 'Rich in antioxidants', 'Boosts immunity'],
    bestFor: 'Asthma patients, allergy sufferers & respiratory care',
    healthTips: [
      'Spinach & carrot reduce lung inflammation and ease breathing',
      'Orange (Vitamin C) strengthens airways and reduces asthma attacks',
      'Herbal wellness drinks clear mucus and improve oxygen flow',
      'Anti-inflammatory foods reduce wheezing episodes within 2-3 weeks',
    ],
    targetGender: ['male', 'female'],
    targetGoals: ['improve_immunity', 'general_wellness'],
    frequencies: ['daily', 'weekly', 'monthly'],
    pricePerDay: 135,
    dailyItems: [
      { productId: '204', quantity: 1 }, // Anti-Inflammatory Pack
      { productId: '10', quantity: 1 },  // Spinach
      { productId: '205', quantity: 1 }, // Herbal Wellness Drink
      { productId: '7', quantity: 1 },   // Carrot
      { productId: '8', quantity: 1 },   // Orange
    ],
  },
  {
    id: 'patient_heart',
    name: 'Heart Healthy Plan',
    category: 'patient',
    icon: 'heart',
    color: '#C62828',
    bgColor: '#FFEBEE',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    description: 'Heart-friendly foods low in sodium and rich in omega-3 and potassium.',
    benefits: ['Low sodium', 'Potassium rich', 'Supports heart health', 'Reduces cholesterol'],
    bestFor: 'Heart patients, BP patients & cholesterol-conscious users',
    healthTips: [
      'Beetroot naturally lowers blood pressure within 3 hours of eating',
      'Banana (potassium) regulates heartbeat and prevents BP spikes',
      'Spinach reduces bad cholesterol (LDL) and cleans blood vessels',
      'Green smoothie with these veggies reduces heart disease risk by 30%',
    ],
    targetGender: ['male', 'female'],
    targetGoals: ['heart_health', 'general_wellness'],
    frequencies: ['daily', 'weekly', 'monthly'],
    pricePerDay: 145,
    dailyItems: [
      { productId: '206', quantity: 1 }, // Heart-Healthy Veggie Mix
      { productId: '10', quantity: 1 },  // Spinach
      { productId: '33', quantity: 1 },  // Beetroot
      { productId: '2', quantity: 2 },   // Banana
      { productId: '105', quantity: 1 }, // Green Smoothie
    ],
  },
  {
    id: 'patient_immunity',
    name: 'Immunity Booster Plan',
    category: 'patient',
    tag: 'Recommended',
    icon: 'shield-check',
    color: '#7B1FA2',
    bgColor: '#F3E5F5',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80',
    description: 'Vitamin-rich foods to strengthen your immune system naturally.',
    benefits: ['Vitamin C & D rich', 'Boosts immunity', 'Natural antioxidants', 'Fights infections'],
    bestFor: 'Post-illness recovery, elderly & immunity-weak individuals',
    healthTips: [
      'Orange & pomegranate together give 200% daily Vitamin C — fights fever & cold',
      'Spinach iron content prevents anemia and increases energy levels',
      'Lemon mint cooler detoxes liver and flushes out toxins daily',
      'Regular intake builds strong immunity — users report 50% fewer sick days',
    ],
    targetGender: ['male', 'female'],
    targetGoals: ['improve_immunity', 'general_wellness'],
    frequencies: ['daily', 'weekly', 'monthly'],
    pricePerDay: 125,
    dailyItems: [
      { productId: '8', quantity: 2 },   // Orange
      { productId: '61', quantity: 1 },  // Pomegranate
      { productId: '10', quantity: 1 },  // Spinach
      { productId: '205', quantity: 1 }, // Herbal Wellness Drink
      { productId: '406', quantity: 1 }, // Lemon Mint Cooler
    ],
  },

  // ─── WOMEN'S HEALTH ───
  {
    id: 'women_period',
    name: 'Period Care Plan',
    category: 'women',
    tag: 'Essential',
    icon: 'heart-circle',
    color: '#E91E63',
    bgColor: '#FCE4EC',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=400&q=80',
    description: 'Iron-rich foods & anti-cramp nutrition to support you during menstrual days. Reduces pain & fatigue naturally.',
    benefits: ['Iron-rich foods', 'Reduces cramps & pain', 'Fights fatigue & weakness', 'Mood-boosting nutrients'],
    bestFor: 'Women during periods, girls with heavy flow & menstrual pain',
    healthTips: [
      'Spinach & beetroot increase iron levels — prevents period fatigue & dizziness',
      'Banana has magnesium that relaxes uterine muscles — reduces cramp pain by 40%',
      'Pomegranate juice increases hemoglobin — essential during heavy flow days',
      'Dates are natural iron supplements — eating 3-4 daily prevents anemia',
    ],
    targetGender: ['female'],
    targetLifestyle: ['student', 'working', 'homemaker'],
    targetGoals: ['period_care', 'general_wellness', 'improve_immunity'],
    frequencies: ['daily', 'weekly'],
    pricePerDay: 100,
    dailyItems: [
      { productId: '10', quantity: 1 },  // Spinach
      { productId: '33', quantity: 1 },  // Beetroot
      { productId: '2', quantity: 2 },   // Banana
      { productId: '61', quantity: 1 },  // Pomegranate
    ],
    weeklyItems: {
      Mon: [{ productId: '10', quantity: 1 }, { productId: '33', quantity: 1 }, { productId: '2', quantity: 2 }],
      Tue: [{ productId: '61', quantity: 1 }, { productId: '7', quantity: 1 }, { productId: '205', quantity: 1 }],
      Wed: [{ productId: '10', quantity: 1 }, { productId: '2', quantity: 2 }, { productId: '8', quantity: 1 }],
      Thu: [{ productId: '33', quantity: 1 }, { productId: '61', quantity: 1 }, { productId: '105', quantity: 1 }],
      Fri: [{ productId: '10', quantity: 1 }, { productId: '7', quantity: 1 }, { productId: '2', quantity: 2 }],
      Sat: [{ productId: '61', quantity: 1 }, { productId: '33', quantity: 1 }, { productId: '205', quantity: 1 }],
      Sun: [{ productId: '2', quantity: 2 }, { productId: '8', quantity: 2 }, { productId: '10', quantity: 1 }],
    },
  },
  {
    id: 'women_skin',
    name: 'Clear Skin & Glow Plan',
    category: 'women',
    tag: 'Trending',
    icon: 'face-woman-shimmer',
    color: '#FF7043',
    bgColor: '#FBE9E7',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80',
    description: 'Targeted nutrition to clear acne, reduce dark spots, and get naturally glowing skin from inside.',
    benefits: ['Clears acne & pimples', 'Reduces dark spots', 'Natural face glow', 'Anti-aging nutrients'],
    bestFor: 'Girls with acne, dark spots, dull skin & anyone wanting clear skin',
    healthTips: [
      'Papaya enzyme (papain) dissolves dead skin — clears acne scars in 3-4 weeks',
      'Cucumber water flushes toxins that cause pimples & dark circles',
      'Carrot beta-carotene repairs sun damage and evens out skin tone',
      'Pomegranate collagen boost reduces fine lines — visible results in 2 weeks',
    ],
    targetGender: ['female'],
    targetLifestyle: ['student', 'working', 'homemaker'],
    targetGoals: ['skin_care', 'general_wellness'],
    frequencies: ['daily', 'weekly', 'monthly'],
    pricePerDay: 115,
    dailyItems: [
      { productId: '62', quantity: 1 },  // Papaya
      { productId: '20', quantity: 1 },  // Cucumber
      { productId: '7', quantity: 1 },   // Carrot
      { productId: '61', quantity: 1 },  // Pomegranate
      { productId: '8', quantity: 1 },   // Orange
    ],
    weeklyItems: {
      Mon: [{ productId: '62', quantity: 1 }, { productId: '7', quantity: 1 }, { productId: '8', quantity: 1 }],
      Tue: [{ productId: '20', quantity: 1 }, { productId: '61', quantity: 1 }, { productId: '107', quantity: 1 }],
      Wed: [{ productId: '62', quantity: 1 }, { productId: '7', quantity: 1 }, { productId: '405', quantity: 1 }],
      Thu: [{ productId: '61', quantity: 1 }, { productId: '8', quantity: 1 }, { productId: '20', quantity: 1 }],
      Fri: [{ productId: '62', quantity: 1 }, { productId: '107', quantity: 1 }, { productId: '7', quantity: 1 }],
      Sat: [{ productId: '20', quantity: 1 }, { productId: '61', quantity: 1 }, { productId: '405', quantity: 1 }],
      Sun: [{ productId: '62', quantity: 1 }, { productId: '8', quantity: 2 }, { productId: '7', quantity: 1 }],
    },
  },
  {
    id: 'women_pregnancy',
    name: 'Pregnancy Nutrition Plan',
    category: 'women',
    tag: 'Doctor Approved',
    icon: 'baby-carriage',
    color: '#8E24AA',
    bgColor: '#F3E5F5',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    description: 'Essential nutrients for healthy pregnancy — folate, iron, calcium & vitamins for mother and baby.',
    benefits: ['Folate for baby brain development', 'Iron prevents pregnancy anemia', 'Calcium for bone growth', 'Natural vitamins & minerals'],
    bestFor: 'Pregnant women, expecting mothers & post-delivery recovery',
    healthTips: [
      'Spinach folate (B9) prevents neural tube defects in baby — critical in first trimester',
      'Beetroot iron prevents pregnancy anemia which affects 50% of Indian women',
      'Banana potassium reduces pregnancy leg cramps & morning sickness',
      'Orange Vitamin C helps absorb iron better — doubles the iron benefit',
    ],
    targetGender: ['female'],
    targetLifestyle: ['homemaker', 'working'],
    targetGoals: ['pregnancy', 'general_wellness', 'improve_immunity'],
    frequencies: ['daily', 'weekly', 'monthly'],
    pricePerDay: 160,
    dailyItems: [
      { productId: '10', quantity: 1 },  // Spinach (folate)
      { productId: '33', quantity: 1 },  // Beetroot (iron)
      { productId: '2', quantity: 2 },   // Banana (potassium)
      { productId: '8', quantity: 1 },   // Orange (Vitamin C)
      { productId: '7', quantity: 1 },   // Carrot (Vitamin A)
    ],
    weeklyItems: {
      Mon: [{ productId: '10', quantity: 1 }, { productId: '33', quantity: 1 }, { productId: '2', quantity: 2 }, { productId: '8', quantity: 1 }],
      Tue: [{ productId: '7', quantity: 1 }, { productId: '61', quantity: 1 }, { productId: '10', quantity: 1 }, { productId: '105', quantity: 1 }],
      Wed: [{ productId: '33', quantity: 1 }, { productId: '2', quantity: 2 }, { productId: '8', quantity: 1 }, { productId: '62', quantity: 1 }],
      Thu: [{ productId: '10', quantity: 1 }, { productId: '7', quantity: 1 }, { productId: '61', quantity: 1 }, { productId: '205', quantity: 1 }],
      Fri: [{ productId: '33', quantity: 1 }, { productId: '2', quantity: 2 }, { productId: '8', quantity: 1 }, { productId: '10', quantity: 1 }],
      Sat: [{ productId: '62', quantity: 1 }, { productId: '7', quantity: 1 }, { productId: '105', quantity: 1 }, { productId: '61', quantity: 1 }],
      Sun: [{ productId: '10', quantity: 1 }, { productId: '33', quantity: 1 }, { productId: '2', quantity: 2 }, { productId: '8', quantity: 1 }],
    },
  },
  {
    id: 'women_hair',
    name: 'Hair Growth & Strength Plan',
    category: 'women',
    icon: 'hair-dryer',
    color: '#5D4037',
    bgColor: '#EFEBE9',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
    description: 'Biotin, iron & protein-rich foods to stop hair fall, strengthen roots, and promote thick hair growth.',
    benefits: ['Stops hair fall', 'Strengthens hair roots', 'Promotes new growth', 'Adds natural shine'],
    bestFor: 'Women with hair fall, thinning hair, dry & damaged hair',
    healthTips: [
      'Spinach iron deficiency is the #1 cause of hair fall in women — this plan fixes it',
      'Carrot Vitamin A produces sebum that keeps scalp moisturized & prevents dandruff',
      'Banana biotin strengthens hair keratin — reduces breakage by 50%',
      'Amla (Indian gooseberry) has 20x more Vitamin C than orange — best for hair growth',
    ],
    targetGender: ['female'],
    targetLifestyle: ['student', 'working', 'homemaker'],
    targetGoals: ['hair_care', 'general_wellness', 'skin_care'],
    frequencies: ['daily', 'weekly', 'monthly'],
    pricePerDay: 105,
    dailyItems: [
      { productId: '10', quantity: 1 },  // Spinach
      { productId: '7', quantity: 1 },   // Carrot
      { productId: '2', quantity: 2 },   // Banana
      { productId: '8', quantity: 1 },   // Orange
    ],
  },
  {
    id: 'women_pcos',
    name: 'PCOS & Hormonal Balance',
    category: 'women',
    tag: 'Recommended',
    icon: 'medical-bag',
    color: '#00695C',
    bgColor: '#E0F2F1',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    description: 'Anti-inflammatory, low-GI foods that help manage PCOS symptoms and balance hormones naturally.',
    benefits: ['Balances hormones', 'Reduces inflammation', 'Controls insulin resistance', 'Manages weight gain'],
    bestFor: 'Women with PCOS, irregular periods & hormonal imbalance',
    healthTips: [
      'Low glycemic foods reduce insulin resistance — the root cause of PCOS',
      'Spinach & green veggies reduce androgen levels that cause acne & hair growth',
      'Anti-inflammatory foods reduce ovarian cysts size in 2-3 months',
      'Consistent diet plan helps regulate periods naturally without medication',
    ],
    targetGender: ['female'],
    targetGoals: ['period_care', 'lose_weight', 'general_wellness'],
    frequencies: ['daily', 'weekly', 'monthly'],
    pricePerDay: 130,
    dailyItems: [
      { productId: '10', quantity: 1 },  // Spinach
      { productId: '7', quantity: 1 },   // Carrot
      { productId: '33', quantity: 1 },  // Beetroot
      { productId: '202', quantity: 1 }, // High Fiber Veggie Pack
      { productId: '105', quantity: 1 }, // Green Smoothie
    ],
  },
];
