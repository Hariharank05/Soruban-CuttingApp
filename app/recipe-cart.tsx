import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar,
  TextInput, Modal, Alert, Animated as RNAnimated, KeyboardAvoidingView, Platform,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/src/utils/theme';
import { useThemedStyles } from '@/src/utils/useThemedStyles';
import { useCart } from '@/context/CartContext';
import { COMMUNITY_RECIPES } from '@/data/recipes';
import { DISH_PACKS } from '@/data/dishPacks';
import { CUT_TYPE_OPTIONS } from '@/data/cutTypes';
import productsData from '@/data/products.json';
import type { CutType } from '@/types';

/* ─── Recipe Database with product mappings & cut types ─── */
interface RecipeItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  unit: string;
  baseQty: number; // quantity for base servings
  cutType: CutType;
  ingredientLabel: string;
}

interface Recipe {
  id: string;
  title: string;
  image: string;
  description: string;
  category: 'south_indian' | 'north_indian' | 'salad' | 'juice' | 'snack' | 'chinese';
  baseServings: number;
  cookTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  items: RecipeItem[];
  steps: string[];
  tips: string[];
  videoUrl?: string;
  packId?: string;
}

const getProduct = (id: string) => productsData.find(p => p.id === id);

const RECIPES: Recipe[] = [
  {
    id: 'r_sambar', title: 'Sambar', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=400&q=80',
    description: 'Classic South Indian lentil stew with vegetables', category: 'south_indian', baseServings: 4, cookTime: '45 min', difficulty: 'Medium', packId: 'pack_sambar',
    items: [
      { productId: '1', name: 'Tomato', image: getProduct('1')?.image || '', price: getProduct('1')?.price || 40, unit: '1 kg', baseQty: 1, cutType: 'small_pieces', ingredientLabel: '2 medium tomatoes' },
      { productId: '4', name: 'Onion', image: getProduct('4')?.image || '', price: getProduct('4')?.price || 30, unit: '1 kg', baseQty: 1, cutType: 'small_pieces', ingredientLabel: '1 large onion' },
      { productId: '7', name: 'Carrot', image: getProduct('7')?.image || '', price: getProduct('7')?.price || 45, unit: '500g', baseQty: 1, cutType: 'cubes', ingredientLabel: '1 medium carrot' },
      { productId: '21', name: 'Drumstick', image: getProduct('21')?.image || '', price: getProduct('21')?.price || 35, unit: '250g', baseQty: 1, cutType: 'long_cuts', ingredientLabel: '2 drumsticks' },
      { productId: '13', name: 'Brinjal', image: getProduct('13')?.image || '', price: getProduct('13')?.price || 30, unit: '500g', baseQty: 1, cutType: 'cubes', ingredientLabel: '2 small brinjals' },
    ],
    steps: ['Pressure cook toor dal with turmeric', 'Cook vegetables in tamarind water', 'Mix dal and vegetables', 'Add sambar powder and salt', 'Temper with mustard & curry leaves'],
    tips: ['Use fresh drumstick for best flavor', 'Add jaggery for slight sweetness', 'Sambar tastes better the next day'],
  },
  {
    id: 'r_biryani', title: 'Vegetable Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
    description: 'Fragrant basmati rice layered with spiced vegetables', category: 'south_indian', baseServings: 5, cookTime: '60 min', difficulty: 'Hard', packId: 'pack_biryani',
    items: [
      { productId: '1', name: 'Tomato', image: getProduct('1')?.image || '', price: getProduct('1')?.price || 40, unit: '1 kg', baseQty: 1, cutType: 'slices', ingredientLabel: '2 tomatoes' },
      { productId: '4', name: 'Onion', image: getProduct('4')?.image || '', price: getProduct('4')?.price || 30, unit: '1 kg', baseQty: 2, cutType: 'slices', ingredientLabel: '3 large onions' },
      { productId: '7', name: 'Carrot', image: getProduct('7')?.image || '', price: getProduct('7')?.price || 45, unit: '500g', baseQty: 1, cutType: 'cubes', ingredientLabel: '1 carrot' },
      { productId: '13', name: 'Brinjal', image: getProduct('13')?.image || '', price: getProduct('13')?.price || 30, unit: '500g', baseQty: 1, cutType: 'cubes', ingredientLabel: '1 brinjal' },
      { productId: '19', name: 'Beans', image: getProduct('19')?.image || '', price: getProduct('19')?.price || 40, unit: '250g', baseQty: 1, cutType: 'small_pieces', ingredientLabel: '100g beans' },
      { productId: '22', name: 'Cauliflower', image: getProduct('22')?.image || '', price: getProduct('22')?.price || 35, unit: '1 piece', baseQty: 1, cutType: 'small_pieces', ingredientLabel: '½ cauliflower' },
    ],
    steps: ['Soak basmati rice 30 mins', 'Fry onions golden brown', 'Add vegetables and spices', 'Layer rice and vegetables', 'Dum cook 20 mins on low heat'],
    tips: ['Use aged basmati for best results', 'Add saffron soaked in warm milk', 'Seal lid with dough for proper dum'],
  },
  {
    id: 'r_poriyal', title: 'Mixed Veg Poriyal', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80',
    description: 'Healthy Tamil Nadu style dry vegetable stir-fry', category: 'south_indian', baseServings: 3, cookTime: '25 min', difficulty: 'Easy', packId: 'pack_poriyal',
    items: [
      { productId: '19', name: 'Beans', image: getProduct('19')?.image || '', price: getProduct('19')?.price || 40, unit: '250g', baseQty: 1, cutType: 'small_pieces', ingredientLabel: '100g beans' },
      { productId: '7', name: 'Carrot', image: getProduct('7')?.image || '', price: getProduct('7')?.price || 45, unit: '500g', baseQty: 1, cutType: 'small_pieces', ingredientLabel: '1 carrot' },
      { productId: '22', name: 'Cauliflower', image: getProduct('22')?.image || '', price: getProduct('22')?.price || 35, unit: '1 piece', baseQty: 1, cutType: 'small_pieces', ingredientLabel: '½ cauliflower' },
      { productId: '30', name: 'Cabbage', image: getProduct('30')?.image || '', price: getProduct('30')?.price || 20, unit: '1 piece', baseQty: 1, cutType: 'slices', ingredientLabel: '¼ cabbage' },
    ],
    steps: ['Chop all vegetables uniformly', 'Temper mustard and urad dal', 'Add vegetables with splash of water', 'Cook until tender but crunchy', 'Add grated coconut and mix'],
    tips: ['Don\'t overcook — keep veggies crunchy', 'Fresh coconut makes a big difference'],
  },
  {
    id: 'r_fruit_salad', title: 'Fruit Salad Bowl', image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=400&q=80',
    description: 'Refreshing seasonal fruit mix with honey-lime dressing', category: 'salad', baseServings: 2, cookTime: '10 min', difficulty: 'Easy', packId: 'pack_fruit_salad',
    items: [
      { productId: '11', name: 'Apple', image: getProduct('11')?.image || '', price: getProduct('11')?.price || 120, unit: '1 kg', baseQty: 1, cutType: 'cubes', ingredientLabel: '1 apple' },
      { productId: '2', name: 'Banana', image: getProduct('2')?.image || '', price: getProduct('2')?.price || 40, unit: '1 dozen', baseQty: 1, cutType: 'slices', ingredientLabel: '2 bananas' },
      { productId: '8', name: 'Orange', image: getProduct('8')?.image || '', price: getProduct('8')?.price || 60, unit: '1 kg', baseQty: 1, cutType: 'small_pieces', ingredientLabel: '2 oranges' },
      { productId: '61', name: 'Pomegranate', image: getProduct('61')?.image || '', price: getProduct('61')?.price || 80, unit: '1 piece', baseQty: 1, cutType: 'small_pieces', ingredientLabel: '1 pomegranate' },
    ],
    steps: ['Wash and cut all fruits', 'Mix honey, lime juice, and mint', 'Toss fruits with dressing', 'Chill 10 mins before serving'],
    tips: ['Use chilled fruits', 'Add chaat masala for a tangy twist'],
  },
  {
    id: 'r_rasam', title: 'Pepper Rasam', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=400&q=80',
    description: 'Spicy South Indian pepper soup — great for cold & immunity', category: 'south_indian', baseServings: 4, cookTime: '20 min', difficulty: 'Easy',
    items: [
      { productId: '1', name: 'Tomato', image: getProduct('1')?.image || '', price: getProduct('1')?.price || 40, unit: '1 kg', baseQty: 1, cutType: 'small_pieces', ingredientLabel: '3 ripe tomatoes' },
      { productId: '4', name: 'Onion', image: getProduct('4')?.image || '', price: getProduct('4')?.price || 30, unit: '1 kg', baseQty: 1, cutType: 'small_pieces', ingredientLabel: '1 small onion' },
    ],
    steps: ['Boil tomatoes and mash', 'Add tamarind water and rasam powder', 'Boil until frothy', 'Temper with mustard, pepper, curry leaves'],
    tips: ['Use very ripe tomatoes', 'Add crushed garlic for extra punch'],
  },
  {
    id: 'r_gobi_manchurian', title: 'Gobi Manchurian', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80',
    description: 'Crispy cauliflower in spicy Indo-Chinese sauce', category: 'chinese', baseServings: 3, cookTime: '30 min', difficulty: 'Medium',
    items: [
      { productId: '22', name: 'Cauliflower', image: getProduct('22')?.image || '', price: getProduct('22')?.price || 35, unit: '1 piece', baseQty: 1, cutType: 'small_pieces', ingredientLabel: '1 medium cauliflower' },
      { productId: '4', name: 'Onion', image: getProduct('4')?.image || '', price: getProduct('4')?.price || 30, unit: '1 kg', baseQty: 1, cutType: 'cubes', ingredientLabel: '1 onion' },
      { productId: '1', name: 'Tomato', image: getProduct('1')?.image || '', price: getProduct('1')?.price || 40, unit: '1 kg', baseQty: 1, cutType: 'cubes', ingredientLabel: '1 tomato' },
      { productId: '7', name: 'Carrot', image: getProduct('7')?.image || '', price: getProduct('7')?.price || 45, unit: '500g', baseQty: 1, cutType: 'cubes', ingredientLabel: '1 carrot' },
    ],
    steps: ['Cut cauliflower into florets', 'Coat with batter and deep fry', 'Stir-fry onion, tomato, carrot', 'Add sauces (soy, chilli, tomato)', 'Toss fried cauliflower in sauce'],
    tips: ['Double fry cauliflower for extra crunch', 'Add cornstarch slurry to thicken sauce'],
  },
  {
    id: 'r_green_smoothie', title: 'Green Detox Smoothie', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80',
    description: 'Nutrient-packed green smoothie for energy & detox', category: 'juice', baseServings: 2, cookTime: '5 min', difficulty: 'Easy',
    items: [
      { productId: '10', name: 'Spinach', image: getProduct('10')?.image || '', price: getProduct('10')?.price || 25, unit: '250g', baseQty: 1, cutType: 'small_pieces', ingredientLabel: '1 bunch spinach' },
      { productId: '2', name: 'Banana', image: getProduct('2')?.image || '', price: getProduct('2')?.price || 40, unit: '1 dozen', baseQty: 1, cutType: 'slices', ingredientLabel: '1 banana' },
      { productId: '11', name: 'Apple', image: getProduct('11')?.image || '', price: getProduct('11')?.price || 120, unit: '1 kg', baseQty: 1, cutType: 'cubes', ingredientLabel: '1 apple' },
    ],
    steps: ['Wash spinach thoroughly', 'Add spinach, banana, apple to blender', 'Add water or milk', 'Blend until smooth'],
    tips: ['Add chia seeds for extra nutrition', 'Use frozen banana for thicker smoothie'],
  },
  {
    id: 'r_beetroot_juice', title: 'Beetroot Carrot Juice', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80',
    description: 'Iron-rich juice for energy and glowing skin', category: 'juice', baseServings: 2, cookTime: '5 min', difficulty: 'Easy',
    items: [
      { productId: '33', name: 'Beetroot', image: getProduct('33')?.image || '', price: getProduct('33')?.price || 30, unit: '500g', baseQty: 1, cutType: 'cubes', ingredientLabel: '1 medium beetroot' },
      { productId: '7', name: 'Carrot', image: getProduct('7')?.image || '', price: getProduct('7')?.price || 45, unit: '500g', baseQty: 1, cutType: 'cubes', ingredientLabel: '2 carrots' },
      { productId: '8', name: 'Orange', image: getProduct('8')?.image || '', price: getProduct('8')?.price || 60, unit: '1 kg', baseQty: 1, cutType: 'small_pieces', ingredientLabel: '1 orange' },
    ],
    steps: ['Wash and peel beetroot & carrot', 'Cut into small pieces', 'Add to juicer with orange', 'Serve fresh with ice'],
    tips: ['Add ginger for extra kick', 'Drink immediately for max nutrition'],
  },
];

const CATEGORIES = [
  { key: 'all', label: 'All', icon: 'food-fork-drink' },
  { key: 'south_indian', label: 'South Indian', icon: 'pot-steam' },
  { key: 'chinese', label: 'Chinese', icon: 'noodles' },
  { key: 'salad', label: 'Salad', icon: 'leaf' },
  { key: 'juice', label: 'Juice', icon: 'cup' },
];

const DIFFICULTY_COLOR: Record<string, string> = { Easy: '#388E3C', Medium: '#E65100', Hard: '#C62828' };

/* ─── Ask/Voice suggestions ─── */
const ASK_SUGGESTIONS = [
  'I want to make sambar for 6 people',
  'Fruit salad for kids party',
  'Quick evening snack for 4',
  'Healthy juice for gym',
  'Biryani for 8 people',
  'Something easy under 15 mins',
];

function matchRecipeFromQuery(query: string): { recipe: Recipe; servings: number } | null {
  const q = query.toLowerCase();
  // Try to extract servings
  const servingsMatch = q.match(/(\d+)\s*(people|person|servings|members|guests)/);
  const servings = servingsMatch ? parseInt(servingsMatch[1]) : 0;

  // Match recipes by keywords
  for (const recipe of RECIPES) {
    const title = recipe.title.toLowerCase();
    const desc = recipe.description.toLowerCase();
    const cats = recipe.category;
    if (q.includes(title.split(' ')[0].toLowerCase()) || q.includes(title.toLowerCase())) {
      return { recipe, servings: servings || recipe.baseServings };
    }
  }
  // Keyword matching
  if (q.includes('sambar') || q.includes('sambhar')) return { recipe: RECIPES[0], servings: servings || 4 };
  if (q.includes('biryani') || q.includes('biriyani')) return { recipe: RECIPES[1], servings: servings || 5 };
  if (q.includes('poriyal') || q.includes('stir fry') || q.includes('stir-fry')) return { recipe: RECIPES[2], servings: servings || 3 };
  if (q.includes('fruit salad') || q.includes('salad')) return { recipe: RECIPES[3], servings: servings || 2 };
  if (q.includes('rasam') || q.includes('soup')) return { recipe: RECIPES[4], servings: servings || 4 };
  if (q.includes('gobi') || q.includes('manchurian') || q.includes('chinese')) return { recipe: RECIPES[5], servings: servings || 3 };
  if (q.includes('smoothie') || q.includes('green')) return { recipe: RECIPES[6], servings: servings || 2 };
  if (q.includes('juice') || q.includes('beetroot')) return { recipe: RECIPES[7], servings: servings || 2 };
  if (q.includes('snack') || q.includes('quick') || q.includes('easy')) return { recipe: RECIPES[2], servings: servings || 3 };
  return null;
}

/* ─── Screen ─── */
export default function RecipeCartScreen() {
  const router = useRouter();
  const themed = useThemedStyles();
  const { addToCart } = useCart();

  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [servings, setServings] = useState(4);
  const [showAsk, setShowAsk] = useState(false);
  const [askQuery, setAskQuery] = useState('');
  const [askResult, setAskResult] = useState<{ recipe: Recipe; servings: number } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;

  // Pulse animation for microphone
  useEffect(() => {
    if (isListening) {
      const pulse = RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(pulseAnim, { toValue: 1.3, duration: 600, useNativeDriver: true }),
          RNAnimated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening]);

  const filteredRecipes = useMemo(() => {
    if (activeCategory === 'all') return RECIPES;
    return RECIPES.filter(r => r.category === activeCategory);
  }, [activeCategory]);

  const servingMultiplier = selectedRecipe ? servings / selectedRecipe.baseServings : 1;

  const totalPrice = useMemo(() => {
    if (!selectedRecipe) return 0;
    return selectedRecipe.items.reduce((sum, item) => sum + item.price * Math.ceil(item.baseQty * servingMultiplier), 0);
  }, [selectedRecipe, servingMultiplier]);

  const handleAddAllToCart = useCallback(() => {
    if (!selectedRecipe) return;
    selectedRecipe.items.forEach(item => {
      const product = productsData.find(p => p.id === item.productId);
      if (product) {
        addToCart(product as any, Math.ceil(item.baseQty * servingMultiplier), undefined, item.cutType);
      }
    });
    Alert.alert(
      'Added to Cart!',
      `${selectedRecipe.items.length} items for "${selectedRecipe.title}" (${servings} servings) added with correct cut types.`,
      [
        { text: 'Continue', style: 'cancel' },
        { text: 'Go to Cart', onPress: () => router.push('/(tabs)/cart') },
      ]
    );
  }, [selectedRecipe, servings, servingMultiplier, addToCart, router]);

  const handleAskSubmit = useCallback(() => {
    if (!askQuery.trim()) return;
    const result = matchRecipeFromQuery(askQuery);
    if (result) {
      setAskResult(result);
    } else {
      Alert.alert('No Match', 'Sorry, I couldn\'t find a recipe for that. Try "sambar for 4 people" or "fruit salad".');
    }
  }, [askQuery]);

  const handleAskSelect = useCallback(() => {
    if (askResult) {
      setSelectedRecipe(askResult.recipe);
      setServings(askResult.servings);
      setShowAsk(false);
      setAskQuery('');
      setAskResult(null);
    }
  }, [askResult]);

  const simulateVoice = useCallback(() => {
    setIsListening(true);
    // Simulate voice recognition with a demo phrase after 2 seconds
    setTimeout(() => {
      setIsListening(false);
      const demo = ASK_SUGGESTIONS[Math.floor(Math.random() * ASK_SUGGESTIONS.length)];
      setAskQuery(demo);
      const result = matchRecipeFromQuery(demo);
      if (result) setAskResult(result);
    }, 2000);
  }, []);

  // ─── Recipe Detail View ───
  if (selectedRecipe) {
    return (
      <SafeAreaView style={[styles.safe, themed.safeArea]} edges={['bottom']}>
        <StatusBar barStyle="light-content" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Hero Image */}
          <View style={styles.heroWrap}>
            <Image source={{ uri: selectedRecipe.image }} style={styles.heroImage} resizeMode="cover" />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.heroOverlay}>
              <TouchableOpacity style={styles.heroBack} onPress={() => setSelectedRecipe(null)}>
                <Icon name="arrow-left" size={22} color="#FFF" />
              </TouchableOpacity>
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>{selectedRecipe.title}</Text>
                <Text style={styles.heroDesc}>{selectedRecipe.description}</Text>
                <View style={styles.heroBadges}>
                  <View style={styles.heroBadge}><Icon name="clock-outline" size={12} color="#FFF" /><Text style={styles.heroBadgeText}>{selectedRecipe.cookTime}</Text></View>
                  <View style={[styles.heroBadge, { backgroundColor: DIFFICULTY_COLOR[selectedRecipe.difficulty] }]}><Text style={styles.heroBadgeText}>{selectedRecipe.difficulty}</Text></View>
                  <View style={styles.heroBadge}><Icon name="account-group" size={12} color="#FFF" /><Text style={styles.heroBadgeText}>{selectedRecipe.baseServings} servings</Text></View>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.detailContent}>
            {/* Servings Adjuster */}
            <View style={[styles.servingsCard, themed.card]}>
              <Text style={[styles.servingsLabel, themed.textPrimary]}>How many people?</Text>
              <View style={styles.servingsRow}>
                {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                  <TouchableOpacity
                    key={n}
                    style={[styles.servingChip, servings === n && styles.servingChipActive]}
                    onPress={() => setServings(n)}
                  >
                    <Text style={[styles.servingChipText, servings === n && styles.servingChipTextActive]}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {servings !== selectedRecipe.baseServings && (
                <View style={styles.servingsNote}>
                  <Icon name="information" size={14} color="#1565C0" />
                  <Text style={styles.servingsNoteText}>Quantities adjusted for {servings} people (recipe is for {selectedRecipe.baseServings})</Text>
                </View>
              )}
            </View>

            {/* Ingredients with Cut Types */}
            <Text style={[styles.sectionTitle, themed.textPrimary]}>Ingredients & Cut Style</Text>
            {selectedRecipe.items.map((item, idx) => {
              const adjQty = Math.ceil(item.baseQty * servingMultiplier);
              const cutOpt = CUT_TYPE_OPTIONS.find(c => c.id === item.cutType);
              return (
                <View key={idx} style={[styles.ingredientCard, themed.card]}>
                  <Image source={{ uri: item.image }} style={styles.ingredientImage} resizeMode="cover" />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.ingredientName, themed.textPrimary]}>{item.name}</Text>
                    <Text style={styles.ingredientLabel}>{item.ingredientLabel}{adjQty > 1 ? ` × ${adjQty}` : ''}</Text>
                    <View style={styles.ingredientMeta}>
                      <View style={styles.cutBadge}>
                        <Icon name={(cutOpt?.icon || 'knife') as any} size={11} color={COLORS.primary} />
                        <Text style={styles.cutBadgeText}>{cutOpt?.label || item.cutType}</Text>
                      </View>
                      <Text style={styles.ingredientPrice}>{'\u20B9'}{item.price * adjQty}</Text>
                    </View>
                  </View>
                  {cutOpt?.media.image && (
                    <Image source={{ uri: cutOpt.media.image }} style={styles.cutPreviewThumb} resizeMode="cover" />
                  )}
                </View>
              );
            })}

            {/* Cooking Steps */}
            <Text style={[styles.sectionTitle, themed.textPrimary]}>Cooking Steps</Text>
            <View style={[styles.stepsCard, themed.card]}>
              {selectedRecipe.steps.map((step, i) => (
                <View key={i} style={styles.stepRow}>
                  <View style={styles.stepNum}><Text style={styles.stepNumText}>{i + 1}</Text></View>
                  <Text style={[styles.stepText, themed.textPrimary]}>{step}</Text>
                </View>
              ))}
            </View>

            {/* Tips */}
            {selectedRecipe.tips.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, themed.textPrimary]}>Chef Tips</Text>
                <View style={[styles.tipsCard, themed.card]}>
                  {selectedRecipe.tips.map((tip, i) => (
                    <View key={i} style={styles.tipRow}>
                      <Icon name="lightbulb-on" size={14} color="#FF9800" />
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            <View style={{ height: 100 }} />
          </View>
        </ScrollView>

        {/* Bottom Add All Bar */}
        <View style={[styles.addAllBar, { backgroundColor: themed.colors.card }]}>
          <View>
            <Text style={[styles.addAllTotal, themed.textPrimary]}>{'\u20B9'}{totalPrice}</Text>
            <Text style={styles.addAllSub}>{selectedRecipe.items.length} items · {servings} servings</Text>
          </View>
          <TouchableOpacity style={styles.addAllBtn} onPress={handleAddAllToCart} activeOpacity={0.8}>
            <Icon name="cart-plus" size={20} color="#FFF" />
            <Text style={styles.addAllBtnText}>Add All to Cart</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Recipe List View ───
  return (
    <SafeAreaView style={[styles.safe, themed.safeArea]} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <LinearGradient colors={themed.headerGradient} style={styles.header}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
              <Icon name="arrow-left" size={22} color={themed.colors.text.primary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, themed.textPrimary]}>Recipe to Cart</Text>
            <TouchableOpacity style={styles.headerBtn} onPress={() => setShowAsk(true)}>
              <Icon name="microphone" size={22} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Ask Banner */}
      <TouchableOpacity style={styles.askBanner} onPress={() => setShowAsk(true)} activeOpacity={0.85}>
        <LinearGradient colors={['#1565C0', '#1E88E5']} style={styles.askBannerGrad}>
          <View style={styles.askBannerIcon}>
            <Icon name="microphone" size={24} color="#FFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.askBannerTitle}>Ask Chopify</Text>
            <Text style={styles.askBannerDesc}>Say "Sambar for 6 people" and we'll prepare your cart</Text>
          </View>
          <Icon name="chevron-right" size={20} color="rgba(255,255,255,0.7)" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Category Filters */}
      <View style={styles.catContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.catChip, isActive && styles.catChipActive]}
                onPress={() => setActiveCategory(cat.key)}
              >
                <Icon name={cat.icon as any} size={14} color={isActive ? '#FFF' : COLORS.text.secondary} />
                <Text style={[styles.catChipText, isActive && styles.catChipTextActive]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Recipe Cards */}
      <ScrollView contentContainerStyle={styles.recipeList} showsVerticalScrollIndicator={false}>
        {filteredRecipes.map(recipe => (
          <TouchableOpacity
            key={recipe.id}
            style={[styles.recipeCard, themed.card]}
            onPress={() => { setSelectedRecipe(recipe); setServings(recipe.baseServings); }}
            activeOpacity={0.85}
          >
            <Image source={{ uri: recipe.image }} style={styles.recipeImage} resizeMode="cover" />
            <View style={styles.recipeBody}>
              <Text style={[styles.recipeName, themed.textPrimary]}>{recipe.title}</Text>
              <Text style={styles.recipeDesc} numberOfLines={1}>{recipe.description}</Text>
              <View style={styles.recipeMeta}>
                <View style={styles.recipeMetaItem}>
                  <Icon name="clock-outline" size={12} color={COLORS.text.muted} />
                  <Text style={styles.recipeMetaText}>{recipe.cookTime}</Text>
                </View>
                <View style={styles.recipeMetaItem}>
                  <Icon name="account-group" size={12} color={COLORS.text.muted} />
                  <Text style={styles.recipeMetaText}>{recipe.baseServings} servings</Text>
                </View>
                <View style={[styles.diffBadge, { backgroundColor: DIFFICULTY_COLOR[recipe.difficulty] + '20' }]}>
                  <Text style={[styles.diffText, { color: DIFFICULTY_COLOR[recipe.difficulty] }]}>{recipe.difficulty}</Text>
                </View>
              </View>
              <View style={styles.recipeItems}>
                {recipe.items.slice(0, 4).map((item, i) => (
                  <Image key={i} source={{ uri: item.image }} style={styles.recipeItemThumb} resizeMode="cover" />
                ))}
                {recipe.items.length > 4 && (
                  <View style={styles.recipeItemMore}>
                    <Text style={styles.recipeItemMoreText}>+{recipe.items.length - 4}</Text>
                  </View>
                )}
                <View style={{ flex: 1 }} />
                <Text style={styles.recipePrice}>{'\u20B9'}{recipe.items.reduce((s, i) => s + i.price, 0)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Ask Modal */}
      <Modal visible={showAsk} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.safe, themed.safeArea]} edges={['top']}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <View style={[styles.askHeader, { backgroundColor: themed.colors.card }]}>
              <TouchableOpacity onPress={() => { setShowAsk(false); setAskQuery(''); setAskResult(null); }}>
                <Icon name="close" size={24} color={themed.colors.text.primary} />
              </TouchableOpacity>
              <Text style={[styles.askHeaderTitle, themed.textPrimary]}>Ask Chopify</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.askContent}>
              {/* Mic Button */}
              <View style={styles.askMicSection}>
                <RNAnimated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <TouchableOpacity
                    style={[styles.askMicBtn, isListening && styles.askMicBtnActive]}
                    onPress={simulateVoice}
                    activeOpacity={0.8}
                  >
                    <Icon name="microphone" size={36} color="#FFF" />
                  </TouchableOpacity>
                </RNAnimated.View>
                <Text style={[styles.askMicLabel, themed.textPrimary]}>
                  {isListening ? 'Listening...' : 'Tap to speak'}
                </Text>
                <Text style={styles.askMicHint}>Or type below what you want to cook</Text>
              </View>

              {/* Text Input */}
              <View style={[styles.askInputRow, { backgroundColor: themed.colors.card }]}>
                <TextInput
                  style={[styles.askInput, themed.textPrimary]}
                  placeholder='e.g. "Sambar for 6 people"'
                  placeholderTextColor={COLORS.text.muted}
                  value={askQuery}
                  onChangeText={setAskQuery}
                  onSubmitEditing={handleAskSubmit}
                  returnKeyType="search"
                />
                <TouchableOpacity style={styles.askSendBtn} onPress={handleAskSubmit}>
                  <Icon name="send" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>

              {/* Result */}
              {askResult && (
                <View style={[styles.askResultCard, themed.card]}>
                  <Image source={{ uri: askResult.recipe.image }} style={styles.askResultImage} resizeMode="cover" />
                  <View style={styles.askResultBody}>
                    <Text style={[styles.askResultTitle, themed.textPrimary]}>{askResult.recipe.title}</Text>
                    <Text style={styles.askResultMeta}>{askResult.servings} servings · {askResult.recipe.items.length} items · {askResult.recipe.cookTime}</Text>
                    <Text style={styles.askResultPrice}>{'\u20B9'}{askResult.recipe.items.reduce((s, i) => s + i.price * Math.ceil(i.baseQty * (askResult.servings / askResult.recipe.baseServings)), 0)}</Text>
                  </View>
                  <TouchableOpacity style={styles.askResultBtn} onPress={handleAskSelect}>
                    <Text style={styles.askResultBtnText}>Select</Text>
                    <Icon name="chevron-right" size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Suggestions */}
              {!askResult && (
                <>
                  <Text style={[styles.askSugTitle, themed.textPrimary]}>Try saying...</Text>
                  {ASK_SUGGESTIONS.map((sug, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[styles.askSugChip, themed.card]}
                      onPress={() => { setAskQuery(sug); const r = matchRecipeFromQuery(sug); if (r) setAskResult(r); }}
                    >
                      <Icon name="microphone" size={16} color={COLORS.primary} />
                      <Text style={[styles.askSugText, themed.textPrimary]}>"{sug}"</Text>
                      <Icon name="chevron-right" size={16} color={COLORS.text.muted} />
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.base, paddingBottom: SPACING.sm },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: SPACING.sm },
  headerBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },

  /* Ask Banner */
  askBanner: { marginHorizontal: SPACING.base, marginTop: SPACING.xs, borderRadius: RADIUS.lg, overflow: 'hidden' },
  askBannerGrad: { flexDirection: 'row', alignItems: 'center', padding: SPACING.sm, paddingHorizontal: SPACING.md, gap: SPACING.md },
  askBannerIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  askBannerTitle: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  askBannerDesc: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2 },

  /* Category Filter */
  catContainer: { height: 52, marginTop: 4 },
  catScroll: { paddingHorizontal: SPACING.base, paddingVertical: 8, gap: 8, alignItems: 'center' },
  catChip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 16, height: 36, borderRadius: RADIUS.full, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catChipText: { fontSize: 12, fontWeight: '600', color: COLORS.text.secondary },
  catChipTextActive: { color: '#FFF' },

  /* Recipe List */
  recipeList: { paddingHorizontal: SPACING.base, paddingBottom: 40, gap: 10 },
  recipeCard: { borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOW.sm },
  recipeImage: { width: '100%', height: 130 },
  recipeBody: { paddingVertical: 10, paddingHorizontal: SPACING.md },
  recipeName: { fontSize: 15, fontWeight: '800' },
  recipeDesc: { fontSize: 12, color: COLORS.text.secondary, marginTop: 2 },
  recipeMeta: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  recipeMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  recipeMetaText: { fontSize: 11, color: COLORS.text.muted },
  diffBadge: { borderRadius: RADIUS.sm, paddingHorizontal: 8, paddingVertical: 2 },
  diffText: { fontSize: 10, fontWeight: '700' },
  recipeItems: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  recipeItemThumb: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: '#FFF' },
  recipeItemMore: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center' },
  recipeItemMoreText: { fontSize: 9, fontWeight: '700', color: COLORS.primary },
  recipePrice: { fontSize: 15, fontWeight: '800', color: COLORS.primary },

  /* Hero (Recipe Detail) */
  heroWrap: { width: '100%', height: 260, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', padding: SPACING.base },
  heroBack: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  heroContent: { marginBottom: SPACING.sm },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  heroDesc: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  heroBadges: { flexDirection: 'row', gap: 8, marginTop: 8 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 4 },
  heroBadgeText: { fontSize: 11, fontWeight: '600', color: '#FFF' },

  /* Detail Content */
  detailContent: { padding: SPACING.base },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginTop: SPACING.lg, marginBottom: SPACING.sm },

  /* Servings */
  servingsCard: { borderRadius: RADIUS.lg, padding: SPACING.base, ...SHADOW.sm },
  servingsLabel: { fontSize: 14, fontWeight: '700', marginBottom: SPACING.sm },
  servingsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  servingChip: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  servingChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  servingChipText: { fontSize: 15, fontWeight: '700', color: COLORS.text.secondary },
  servingChipTextActive: { color: '#FFF' },
  servingsNote: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: SPACING.sm, backgroundColor: '#E3F2FD', borderRadius: RADIUS.sm, padding: SPACING.sm },
  servingsNoteText: { fontSize: 11, color: '#1565C0', flex: 1 },

  /* Ingredient Card */
  ingredientCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm },
  ingredientImage: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#E8F5E9' },
  ingredientName: { fontSize: 14, fontWeight: '700' },
  ingredientLabel: { fontSize: 11, color: COLORS.text.muted, marginTop: 1 },
  ingredientMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  cutBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#E8F5E9', borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 3 },
  cutBadgeText: { fontSize: 10, fontWeight: '700', color: COLORS.primary },
  ingredientPrice: { fontSize: 13, fontWeight: '800', color: COLORS.primary },
  cutPreviewThumb: { width: 40, height: 40, borderRadius: 8, borderWidth: 1, borderColor: '#E8F5E9' },

  /* Steps */
  stepsCard: { borderRadius: RADIUS.lg, padding: SPACING.base, ...SHADOW.sm },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md, marginBottom: SPACING.md },
  stepNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  stepNumText: { fontSize: 12, fontWeight: '800', color: '#FFF' },
  stepText: { flex: 1, fontSize: 13, lineHeight: 19 },

  /* Tips */
  tipsCard: { borderRadius: RADIUS.lg, padding: SPACING.base, backgroundColor: '#FFF8E1', ...SHADOW.sm },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  tipText: { flex: 1, fontSize: 12, color: '#5D4037', lineHeight: 17 },

  /* Bottom Add All Bar */
  addAllBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.base, paddingVertical: SPACING.md,
    borderTopWidth: 1, borderTopColor: COLORS.border, ...SHADOW.floating,
  },
  addAllTotal: { fontSize: 20, fontWeight: '800' },
  addAllSub: { fontSize: 11, color: COLORS.text.muted, marginTop: 1 },
  addAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, paddingHorizontal: 20, paddingVertical: 14 },
  addAllBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },

  /* Ask Modal */
  askHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.base, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  askHeaderTitle: { fontSize: 18, fontWeight: '800' },
  askContent: { padding: SPACING.base, paddingBottom: 40 },
  askMicSection: { alignItems: 'center', paddingVertical: SPACING.xl },
  askMicBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', ...SHADOW.md },
  askMicBtnActive: { backgroundColor: '#E53935' },
  askMicLabel: { fontSize: 16, fontWeight: '700', marginTop: SPACING.md },
  askMicHint: { fontSize: 12, color: COLORS.text.muted, marginTop: 4 },
  askInputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, paddingLeft: SPACING.md, marginTop: SPACING.md, ...SHADOW.sm },
  askInput: { flex: 1, fontSize: 14, paddingVertical: 14 },
  askSendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', margin: 4 },
  askResultCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, borderRadius: RADIUS.lg, padding: SPACING.md, marginTop: SPACING.lg, borderWidth: 2, borderColor: COLORS.primary, ...SHADOW.sm },
  askResultImage: { width: 60, height: 60, borderRadius: RADIUS.md },
  askResultBody: { flex: 1 },
  askResultTitle: { fontSize: 15, fontWeight: '800' },
  askResultMeta: { fontSize: 11, color: COLORS.text.muted, marginTop: 2 },
  askResultPrice: { fontSize: 15, fontWeight: '800', color: COLORS.primary, marginTop: 2 },
  askResultBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, paddingHorizontal: 16, paddingVertical: 10 },
  askResultBtnText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  askSugTitle: { fontSize: 15, fontWeight: '800', marginTop: SPACING.xl, marginBottom: SPACING.sm },
  askSugChip: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm },
  askSugText: { flex: 1, fontSize: 13, fontWeight: '500' },
});
