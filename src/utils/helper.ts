import { FilterState } from '@/components/custom/orders/OrderQtyAnalysis/index';

// This function will clean the FilterState by removing null values
export const cleanFilters = (filters: FilterState): Record<string, string> => {
  const cleanedFilters: Record<string, string> = {};

  // Iterate through each key in the filters object and add to cleanedFilters if not null
  Object.keys(filters).forEach((key) => {
    const value = filters[key as keyof FilterState];
    if (value !== null) {
      cleanedFilters[key] = value as string; // We are sure it's a string here
    }
  });

  return cleanedFilters;
};
