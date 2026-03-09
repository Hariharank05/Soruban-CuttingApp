import type { CutType, CutStyleMedia } from '@/types';

export interface CutTypeOption {
  id: CutType;
  label: string;
  icon: string;
  fee: number;
  description: string;
  media: CutStyleMedia;
}

export const CUT_TYPE_OPTIONS: CutTypeOption[] = [
  {
    id: 'small_pieces', label: 'Small Pieces', icon: 'knife', fee: 10,
    description: 'Finely chopped for curries & gravies',
    media: {
      image: 'https://images.unsplash.com/photo-1622205313162-be1d5712a43f?auto=format&fit=crop&w=400&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
  },
  {
    id: 'slices', label: 'Slices', icon: 'knife', fee: 10,
    description: 'Even slices for stir-fry & salads',
    media: {
      image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=400&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    },
  },
  {
    id: 'cubes', label: 'Cubes', icon: 'cube-outline', fee: 15,
    description: 'Uniform cubes for biryani & soups',
    media: {
      image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=400&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    },
  },
  {
    id: 'long_cuts', label: 'Long Cuts', icon: 'knife', fee: 10,
    description: 'Long strips for noodles & fries',
    media: {
      image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=400&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    },
  },
  {
    id: 'grated', label: 'Grated', icon: 'dots-grid', fee: 20,
    description: 'Finely grated for dosa batter & more',
    media: {
      image: 'https://images.unsplash.com/photo-1604497181015-76590d828681?auto=format&fit=crop&w=400&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    },
  },
];

export const WEIGHT_OPTIONS = [
  { grams: 250, label: '250g' },
  { grams: 500, label: '500g' },
  { grams: 750, label: '750g' },
  { grams: 1000, label: '1 kg' },
];

export function getCutFee(cutType?: CutType): number {
  if (!cutType) return 0;
  return CUT_TYPE_OPTIONS.find(c => c.id === cutType)?.fee ?? 0;
}

export function getCutLabel(cutType?: CutType): string {
  if (!cutType) return '';
  const option = CUT_TYPE_OPTIONS.find(c => c.id === cutType);
  return option ? option.label : '';
}

export function getCutMedia(cutType?: CutType): CutStyleMedia | undefined {
  if (!cutType) return undefined;
  return CUT_TYPE_OPTIONS.find(c => c.id === cutType)?.media;
}
