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
      image: 'https://media.istockphoto.com/id/2249938416/photo/diced-bell-peppers-in-three-colors-pizza-toppings-hd-stock-photo.webp?a=1&b=1&s=612x612&w=0&k=20&c=JPOMHkiFknVzVR1wH1Byglt-owU6KrwDti0rWT50giE=',
      videoUrl: 'https://media.tenor.com/Bg-Cx0qPzu0AAAAM/chopping-ingredients-tommy-g.gif',
    },
  },
  {
    id: 'slices', label: 'Slices', icon: 'knife', fee: 10,
    description: 'Even slices for stir-fry & salads',
    media: {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp1lhK5cvi8am617xdzRjbYlPlYhcc1bVSQg&s',
      videoUrl: 'https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUyajllMTBiOWg2MGN0ZDB0ZHdyNHc5NWpucnk3Z3Npa2p4OHpmdG9veCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Gcy9nYydfSMhbKQJ8u/200.gif',
    },
  },
  {
    id: 'cubes', label: 'Cubes', icon: 'cube-outline', fee: 15,
    description: 'Uniform cubes for biryani & soups',
    media: {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5ezD-KS6iwuiBmghKqB8W4rvTlp1JOB6KL4TSS2YXKQ&s',
      videoUrl: 'https://youtube.com/shorts/jSLK4Xm8NDE?si=---BQGV1EHLl8vHA',
    },
  },
  {
    id: 'long_cuts', label: 'Long Cuts', icon: 'knife', fee: 10,
    description: 'Long strips for noodles & fries',
    media: {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzjZO-U546wb1z9xNy9UauhZef5_PalkHyBCtpgEZ0ag&s',
      videoUrl: 'https://youtube.com/shorts/H9RjKD4koyU?si=Sd20lGDOyvYW8wDE',
    },
  },
  {
    id: 'grated', label: 'Grated', icon: 'dots-grid', fee: 20,
    description: 'Finely grated for dosa batter & more',
    media: {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiCjNUcnt_Ld-3fDMGTtN1kjCSsBRSOFOCKA&s',
      videoUrl: 'https://youtube.com/shorts/O_EPSDecgSY?si=X24D7-77-zka5YSO',
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
