import type { DishPack, PackSize } from '@/types';

export const PACK_SIZES: PackSize[] = [
  { id: '250g', label: 'Small', serves: '2-3 people', weightGrams: 250, weightLabel: '250g' },
  { id: '500g', label: 'Medium', serves: '4-5 people', weightGrams: 500, weightLabel: '500g' },
  { id: '750g', label: 'Regular', serves: '6-8 people', weightGrams: 750, weightLabel: '750g' },
  { id: '1kg', label: 'Large', serves: '10+ people / Hotel', weightGrams: 1000, weightLabel: '1 kg' },
];

export const DEFAULT_PACK_SIZE = PACK_SIZES[1];

export const DISH_PACKS: DishPack[] = [
  {
    id: 'pack_sambar', name: 'Sambar Pack',
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=400&q=80',
    description: 'All vegetables needed for a delicious South Indian sambar',
    color: '#E8F5E9', tag: 'Popular', serves: '4-5 people', price: 120,
    items: [
      { productId: '1', quantity: 1 }, { productId: '4', quantity: 1 },
      { productId: '7', quantity: 1 }, { productId: '21', quantity: 1 },
      { productId: '32', quantity: 1 }, { productId: '13', quantity: 1 },
    ],
    cookingVideoUrl: 'https://youtube.com/shorts/-N-_H8iBZKw?si=5t2Khu4KbwS9JIqN',
    preparationSteps: [
      'Wash and cut all vegetables as per selected cut style',
      'Pressure cook toor dal with turmeric for 3-4 whistles',
      'Cook vegetables in tamarind water until soft',
      'Mix cooked dal with vegetables and add sambar powder',
      'Temper with mustard, curry leaves, and dried chillies',
    ],
    regionalVariants: [
      { id: 'sambar_traditional', name: 'Traditional Tamil Style', description: 'Classic Tamil Nadu sambar with tamarind base', spiceLevel: 'medium' },
      { id: 'sambar_kongu', name: 'Kongu Style', description: 'Western TN style with coconut and freshly ground masala', spiceLevel: 'mild', extraIngredients: ['Fresh coconut', 'Coriander seeds'] },
      { id: 'sambar_hotel', name: 'Hotel Style', description: 'Restaurant-style rich and aromatic sambar', spiceLevel: 'spicy', extraIngredients: ['Sambar onions', 'Ghee'] },
    ],
  },
  {
    id: 'pack_biryani', name: 'Biryani Veggie Pack',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
    description: 'Fresh vegetables for a flavorful biryani preparation',
    color: '#E8F5E9', tag: 'Best Seller', serves: '4-5 people', price: 110,
    items: [
      { productId: '1', quantity: 1 }, { productId: '4', quantity: 1 },
      { productId: '7', quantity: 1 }, { productId: '13', quantity: 1 },
      { productId: '19', quantity: 1 }, { productId: '22', quantity: 1 },
    ],
    cookingVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    preparationSteps: [
      'Soak basmati rice for 30 minutes',
      'Fry onions until golden, add ginger-garlic paste',
      'Add vegetables and biryani masala, cook for 5 mins',
      'Layer rice and vegetables in a pot',
      'Dum cook on low heat for 20-25 minutes',
    ],
    regionalVariants: [
      { id: 'biryani_hyderabadi', name: 'Hyderabadi Style', description: 'Rich, layered dum biryani with aromatic spices', spiceLevel: 'spicy' },
      { id: 'biryani_lucknowi', name: 'Lucknowi Style', description: 'Mild, fragrant biryani cooked in aromatic stock', spiceLevel: 'mild', extraIngredients: ['Saffron', 'Rose water'] },
    ],
  },
  {
    id: 'pack_fish_gravy', name: 'Fish Gravy Pack',
    image: 'https://media.istockphoto.com/id/1495119149/photo/spicy-and-hot-fish-curry-in-a-clay-pot-isolated.jpg?s=612x612&w=0&k=20&c=Q7M1IEjTsg1d_1kebn5Nr8dwTcEfY8Qhi7uU3k7JSVg=',
    description: 'Essential vegetables for a tasty fish curry gravy',
    color: '#E3F2FD', serves: '3-4 people', price: 90,
    items: [
      { productId: '1', quantity: 1 }, { productId: '4', quantity: 1 },
      { productId: '19', quantity: 1 }, { productId: '10', quantity: 1 },
    ],
    cookingVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    preparationSteps: [
      'Grind coconut with fennel and chilli for masala paste',
      'Saute onions and tomatoes until soft',
      'Add masala paste and cook until oil separates',
      'Add water and bring to a boil',
      'Add fish pieces and simmer for 10-12 minutes',
    ],
  },
  {
    id: 'pack_mutton_gravy', name: 'Mutton Gravy Pack',
    image: 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=400&q=80',
    description: 'Vegetables & aromatics for rich mutton curry',
    color: '#FCE4EC', serves: '4-5 people', price: 100,
    items: [
      { productId: '1', quantity: 1 }, { productId: '4', quantity: 2 },
      { productId: '13', quantity: 1 }, { productId: '7', quantity: 1 },
    ],
    cookingVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    preparationSteps: [
      'Marinate mutton with yogurt, turmeric, and chilli powder',
      'Fry onions until deep golden brown',
      'Add tomatoes, ginger-garlic paste, and spices',
      'Add marinated mutton and cook on low heat',
      'Pressure cook until tender, garnish with coriander',
    ],
    regionalVariants: [
      { id: 'mutton_madurai', name: 'Madurai Style', description: 'Fiery and spicy Madurai-style mutton with extra chillies', spiceLevel: 'spicy', extraIngredients: ['Dried chillies', 'Fennel seeds'] },
      { id: 'mutton_cbe', name: 'Coimbatore Style', description: 'Mild and coconut-based gravy, Kongu Nadu special', spiceLevel: 'mild', extraIngredients: ['Fresh coconut', 'Poppy seeds'] },
      { id: 'mutton_chettinad', name: 'Chettinad Style', description: 'Aromatic Chettinad masala with star anise and kalpasi', spiceLevel: 'spicy', extraIngredients: ['Star anise', 'Kalpasi', 'Marathi mokku'] },
    ],
  },
  {
    id: 'pack_poriyal', name: 'Poriyal Mix Pack',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    description: 'Assorted vegetables for South Indian stir-fry dishes',
    color: '#F1F8E9', serves: '3-4 people', price: 95,
    items: [
      { productId: '19', quantity: 1 }, { productId: '7', quantity: 1 },
      { productId: '22', quantity: 1 }, { productId: '30', quantity: 1 },
    ],
    preparationSteps: [
      'Chop all vegetables as per selected cut style',
      'Heat oil, add mustard seeds, urad dal, curry leaves',
      'Add vegetables, turmeric, salt and a splash of water',
      'Cover and cook on medium heat for 8-10 minutes',
      'Add freshly grated coconut and mix well',
    ],
  },
  {
    id: 'pack_fruit_salad', name: 'Fruit Salad Pack',
    image: 'https://plus.unsplash.com/premium_photo-1664478279991-832059d65835?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnJ1aXQlMjBzYWxhZHxlbnwwfHwwfHx8MA%3D%3D',
    description: 'Fresh seasonal fruits for a healthy fruit salad',
    color: '#FFF8E1', tag: 'Healthy', serves: '3-4 people', price: 180,
    items: [
      { productId: '11', quantity: 1 }, { productId: '2', quantity: 1 },
      { productId: '8', quantity: 1 }, { productId: '23', quantity: 1 },
      { productId: '24', quantity: 1 }, { productId: '61', quantity: 1 },
    ],
    preparationSteps: [
      'Wash all fruits thoroughly',
      'Cut fruits into bite-sized pieces',
      'Mix gently in a large bowl',
      'Add honey or chaat masala as per preference',
      'Serve chilled for best taste',
    ],
  },
  {
    id: 'pack_fruit_juice', name: 'Juice Fruits Pack',
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=400&q=80',
    description: 'Best fruits for fresh homemade juices & smoothies',
    color: '#E8EAF6', serves: '4-5 glasses', price: 160,
    items: [
      { productId: '8', quantity: 2 }, { productId: '25', quantity: 1 },
      { productId: '23', quantity: 1 }, { productId: '61', quantity: 1 },
    ],
    preparationSteps: [
      'Peel and deseed all fruits',
      'Cut into chunks suitable for blending',
      'Blend with water or milk as preferred',
      'Strain if needed for smooth juice',
      'Serve fresh - do not store for long',
    ],
  },
];
