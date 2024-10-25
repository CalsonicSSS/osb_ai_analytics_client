// components/orders/OrderQtyAnalysis/FilterPanel.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFilterOptions } from '@/utils/apiFunctions';
import { FilterState } from './index';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface FilterPanelProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}

// Single category combobox component
function CategoryCombobox({ options, value, onChange, category }: { options: string[]; value: string | null; onChange: (value: string | null) => void; category: string }) {
  const [open, setOpen] = useState(false);

  // Format category label
  const formatLabel = (str: string) => {
    return str
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between'>
          {value || `Select ${formatLabel(category)}...`}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder={`Search ${formatLabel(category)}...`} />
          <CommandList>
            <CommandEmpty>No {category} found.</CommandEmpty>
            <CommandGroup>
              {/* Add "All" option */}
              <CommandItem
                value=''
                onSelect={() => {
                  onChange(null);
                  setOpen(false);
                }}
              >
                <Check className={cn('mr-2 h-4 w-4', value === null ? 'opacity-100' : 'opacity-0')} />
                All
              </CommandItem>
              {/* Map through category options */}
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => {
                    onChange(option === value ? null : option);
                    setOpen(false);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === option ? 'opacity-100' : 'opacity-0')} />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Loading skeleton component
function FilterPanelSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
      {[...Array(5)].map((_, i) => (
        <div key={i} className='space-y-2'>
          <Skeleton className='h-10 w-full' />
        </div>
      ))}
    </div>
  );
}

// Main FilterPanel component
export function FilterPanel({ filters, setFilters }: FilterPanelProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['filterOptions'],
    queryFn: fetchFilterOptions,
  });

  if (isLoading) return <FilterPanelSkeleton />;
  if (isError) return <div className='text-red-500'>Error loading filter options</div>;

  // Define categories and their corresponding data
  const categories = [
    { key: 'branch', options: data.data.branch || [] },
    { key: 'area', options: data.data.area || [] },
    { key: 'customer', options: data.data.customer || [] },
    { key: 'product_class', options: data.data.product_class || [] },
    { key: 'salesperson', options: data.data.salesperson || [] },
  ];

  const handleFilterChange = (category: keyof FilterState, value: string | null) => {
    setFilters({ ...filters, [category]: value });
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
      {categories.map(({ key, options }) => (
        <CategoryCombobox
          key={key}
          category={key}
          options={options}
          value={filters[key as keyof FilterState]}
          onChange={(value) => handleFilterChange(key as keyof FilterState, value)}
        />
      ))}
    </div>
  );
}
