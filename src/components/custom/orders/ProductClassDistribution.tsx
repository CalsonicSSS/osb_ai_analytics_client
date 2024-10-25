// components/custom/orders/ProductClassDistribution.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchOrderByProductClass } from '@/utils/apiFunctions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useState } from 'react';
import { ProductClassDistributionOutput } from '@/types/responses';

const COLORS = [
  '#0ea5e9', // sky-500
  '#6366f1', // indigo-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#f43f5e', // rose-500
  '#64748b', // slate-500
];

export function ProductClassDistribution() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['productClassDistribution'],
    queryFn: fetchOrderByProductClass,
  });

  if (isError) {
    return <div className='text-red-500 p-4'>Error loading product class distribution</div>;
  }

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card className='p-3 bg-white shadow-lg'>
          <div className='space-y-1'>
            <p className='font-medium'>{data.label}</p>
            <p className='text-sm text-gray-500'>Orders: {data.value.toLocaleString()}</p>
            <p className='text-sm text-gray-500'>{data.percentage.toFixed(1)}% of total</p>
          </div>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className='space-y-4'>
      {isLoading ? (
        <DistributionSkeleton />
      ) : (
        <div className='space-y-6'>
          {/* Chart Section */}
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie data={data?.data} cx='50%' cy='50%' innerRadius={60} outerRadius={80} paddingAngle={2} dataKey='value' onMouseEnter={onPieEnter} onMouseLeave={onPieLeave}>
                  {data?.data.map((entry: ProductClassDistributionOutput, index: number) => (
                    <Cell key={entry.id} fill={COLORS[index % COLORS.length]} strokeWidth={activeIndex === index ? 2 : 1} stroke='#fff' />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend and Stats */}
          <div className='space-y-4'>
            {/* Summary Stats */}
            <div className='grid grid-cols-2 gap-4'>
              <Card className='p-4'>
                <p className='text-sm text-gray-500'>Total Orders</p>
                <p className='text-2xl font-bold'>{data?.data.reduce((sum: number, item: ProductClassDistributionOutput) => sum + item.value, 0).toLocaleString()}</p>
              </Card>
              <Card className='p-4'>
                <p className='text-sm text-gray-500'>Product Classes</p>
                <p className='text-2xl font-bold'>{data?.data.length}</p>
              </Card>
            </div>

            {/* Legend with details */}
            <div className='space-y-2'>
              {data?.data.map((item: ProductClassDistributionOutput, index: number) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg transition-colors ${activeIndex === index ? 'bg-gray-50' : ''}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-3 h-3 rounded-full' style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <div>
                        <p className='font-medium'>{item.label}</p>
                        <p className='text-sm text-gray-500'>{item.value.toLocaleString()} orders</p>
                      </div>
                    </div>
                    <Badge variant='secondary' className='bg-gray-100'>
                      {item.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Percentage Verification */}
          <div className='text-sm text-gray-500 text-right'>Total: {data?.totalPercentage.toFixed(1)}%</div>
        </div>
      )}
    </div>
  );
}

function DistributionSkeleton() {
  return (
    <div className='space-y-6'>
      {/* Chart Skeleton */}
      <div className='h-[300px] bg-gray-100 rounded-lg animate-pulse' />

      {/* Stats Skeleton */}
      <div className='grid grid-cols-2 gap-4'>
        {[...Array(2)].map((_, i) => (
          <Card key={i} className='p-4'>
            <Skeleton className='h-4 w-24 mb-2' />
            <Skeleton className='h-8 w-32' />
          </Card>
        ))}
      </div>

      {/* Legend Skeleton */}
      <div className='space-y-2'>
        {[...Array(5)].map((_, i) => (
          <div key={i} className='p-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <Skeleton className='w-3 h-3 rounded-full' />
                <div>
                  <Skeleton className='h-4 w-32 mb-1' />
                  <Skeleton className='h-3 w-24' />
                </div>
              </div>
              <Skeleton className='h-6 w-16' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
