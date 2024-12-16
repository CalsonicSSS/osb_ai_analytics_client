'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchOrderStatusOverview } from '@/utils/apiFunctions';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleIcon, AlertCircle } from 'lucide-react';
import { OrderStatus } from '@/types/responses';

export function OrderStatusOverview() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['orderStatusOverview'],
    queryFn: fetchOrderStatusOverview,
  });

  if (isLoading) {
    return <StatusCardsSkeleton />;
  }

  if (isError) {
    return <ErrorState />;
  }

  const statusColors: Record<string, string> = {
    '0': 'text-yellow-500 bg-yellow-50',
    '1': 'text-blue-500 bg-blue-50',
    '2': 'text-purple-500 bg-purple-50',
    '3': 'text-orange-500 bg-orange-50',
    '4': 'text-cyan-500 bg-cyan-50',
    '8': 'text-indigo-500 bg-indigo-50',
    '9': 'text-green-500 bg-green-50',
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {data?.data.map((status: OrderStatus) => (
        <Card key={status.statusCode} className='hover:shadow-lg transition-shadow'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <p className='text-sm font-medium leading-none'>{status.statusDesc}</p>
                <p className='text-3xl font-bold'>{status.count.toLocaleString()}</p>
              </div>
              <Badge variant='secondary' className={`${statusColors[status.statusCode]} px-2 py-1`}>
                {Number(status.percentage).toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Loading skeleton component
function StatusCardsSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {[...Array(8)].map((_, i) => (
        <Card key={i}>
          <CardContent className='pt-6'>
            <div className='space-y-3'>
              {/* Title skeleton */}
              <div className='h-2 w-24 bg-gray-200 rounded animate-pulse' />

              {/* Value and percentage skeleton container */}
              <div className='flex items-center justify-between'>
                {/* Large value skeleton */}
                <div className='h-6 w-40 bg-gray-200 rounded animate-pulse' />
                {/* Percentage badge skeleton */}
                <div className='h-4 w-12 bg-gray-200 rounded-full animate-pulse' />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Error state component
function ErrorState() {
  return (
    <Card className='bg-red-50 border-red-200'>
      <CardContent className='pt-6'>
        <div className='flex items-center gap-2 text-red-600'>
          <AlertCircle className='h-5 w-5' />
          <p>Failed to load order status data</p>
        </div>
      </CardContent>
    </Card>
  );
}
