// components/orders/OrderQtyAnalysis/index.tsx
'use client';

import { useState } from 'react';
import { FilterPanel } from './FilterPanel';
import { TrendChart } from './TrendChart';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderDetailsTable } from './OrderDetailsTable';

export interface FilterState {
  branch: string | null;
  area: string | null;
  customer: string | null;
  product_class: string | null;
  salesperson: string | null;
}

export function OrderQuantityAnalysis() {
  // State for filters
  const [filters, setFilters] = useState<FilterState>({
    branch: null,
    area: null,
    customer: null,
    product_class: null,
    salesperson: null,
  });

  const handleReset = () => {
    // Reset all filters to null
    setFilters({
      branch: null,
      area: null,
      customer: null,
      product_class: null,
      salesperson: null,
    });
  };

  return (
    <div>
      <Card className='p-6 mb-6'>
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-lg font-semibold'>Filters</h3>
          <Button variant='outline' size='sm' onClick={handleReset} className='flex items-center gap-2'>
            <RefreshCw className='h-4 w-4' />
            Reset Filters
          </Button>
        </div>
        <FilterPanel filters={filters} setFilters={setFilters} />
      </Card>

      <Tabs defaultValue='trend'>
        <TabsList>
          <TabsTrigger value='trend'>Trend Analysis</TabsTrigger>
          <TabsTrigger value='details'>Order Details</TabsTrigger>
        </TabsList>

        <TabsContent value='trend'>
          <Card className='p-6'>
            <TrendChart filters={filters} />
          </Card>
        </TabsContent>

        <TabsContent value='details'>
          <Card className='p-6'>
            <OrderDetailsTable filters={filters} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
