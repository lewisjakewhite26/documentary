export type CategoryType = 'intro' | 'animal' | 'environment';

export type Category = {
  name: string;
  type: CategoryType;
};

/** Display title for a row (e.g. "great white shark" → "Great White Shark"). */
export function formatCategoryTitle(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const animals: string[] = [
  'bald eagle',
  'cheetah',
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

/** Habitat / scene folders in Supabase (previously grouped into Intro). */
const environments: string[] = [
  'african savanna',
  'arctic tundra',
  'coral reef',
  'forest floor',
  'mountain landscape',
  'storm clouds',
  'tropical rainforest',
  'underwater ocean',
];

export const categories: Category[] = [
  { name: 'intro', type: 'intro' },
  ...animals.map((name) => ({ name, type: 'animal' as const })),
  ...environments.map((name) => ({ name, type: 'environment' as const })),
];

export const categoryNames = categories.map((cat) => cat.name);
