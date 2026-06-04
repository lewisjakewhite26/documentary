import { categoryToFilePrefix } from './lib/supabase';

export type CategoryType = 'intro' | 'animal';

export type Category = {
  name: string;
  type: CategoryType;
};

/** Display title (e.g. "great white shark" → "Great White Shark"). */
export function formatCategoryTitle(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** URL slug for routes (e.g. "great white shark" → "great-white-shark"). */
export function categoryToSlug(name: string): string {
  return categoryToFilePrefix(name);
}

const animals: string[] = [
  'bald eagle',
  'cheetah',
  'crocodile',
  'dolphin',
  'elephant',
  'flamingo',
  'giraffe',
  'gorilla',
  'great white shark',
  'lion',
  'octopus',
  'orca',
  'penguin',
  'polar bear',
  'sea turtle',
  'wolf',
];

export const categories: Category[] = [
  { name: 'intro', type: 'intro' },
  ...animals.map((name) => ({ name, type: 'animal' as const })),
];

export const animalCategories = categories.filter((cat) => cat.type === 'animal');

export const categoryNames = categories.map((cat) => cat.name);

export function findCategoryBySlug(slug: string): Category | undefined {
  return categories.find((cat) => categoryToSlug(cat.name) === slug);
}
