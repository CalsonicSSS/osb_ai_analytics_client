'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react';
import { fetchOrderTrendData } from '@/utils/apiFunctions';
import { FilterState } from './index';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { format, parse } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cleanFilters } from '@/utils/helper';

interface TrendChartProps {
  filters: FilterState;
}

export function TrendChart({ filters }: TrendChartProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['orderTrend', filters],
    queryFn: () => fetchOrderTrendData(cleanFilters(filters)),
  });

  const [rangeIndices, setRangeIndices] = useState<[number, number]>([0, 100]);

  const { chartData, visibleData, metrics } = useMemo(() => {
    if (!data?.data || data.data.length === 0) {
      return {
        chartData: [],
        visibleData: [],
        metrics: {
          average: 0,
          totalChange: { percentage: 0, value: 0 },
          avgMonthlyChange: { percentage: 0, value: 0 },
        },
      };
    }

    const processedData = data.data.map((item: any) => ({
      ...item,
      totalOrderQty: Number(item.totalOrderQty),
      date: parse(item.yearMonth, 'yyyy-MM', new Date()),
    }));

    const startIdx = Math.floor((processedData.length - 1) * (rangeIndices[0] / 100));
    const endIdx = Math.floor((processedData.length - 1) * (rangeIndices[1] / 100));
    const visibleData = processedData.slice(startIdx, endIdx + 1);

    if (visibleData.length >= 1) {
      const average = visibleData.reduce((sum: number, item: { totalOrderQty: number; date: Date }) => sum + item.totalOrderQty, 0) / visibleData.length;

      const firstValue = visibleData[0].totalOrderQty;
      const lastValue = visibleData[visibleData.length - 1].totalOrderQty;
      const totalChangeValue = lastValue - firstValue;
      const totalChangePercentage = (totalChangeValue / firstValue) * 100;

      // Calculate monthly changes
      let monthlyChanges = [];
      for (let i = 1; i < visibleData.length; i++) {
        let changeValue = visibleData[i].totalOrderQty - visibleData[i - 1].totalOrderQty;
        let changePercentage = (changeValue / visibleData[i - 1].totalOrderQty) * 100;
        if (changePercentage === Infinity) {
          changePercentage = 100;
        }

        monthlyChanges.push({ value: changeValue, percentage: changePercentage });
      }

      const avgMonthlyChange =
        monthlyChanges.length > 0
          ? {
              value: monthlyChanges.reduce((sum, change) => sum + change.value, 0) / monthlyChanges.length,
              percentage: monthlyChanges.reduce((sum, change) => sum + change.percentage, 0) / monthlyChanges.length,
            }
          : { value: 0, percentage: 0 };

      return {
        chartData: processedData,
        visibleData,
        metrics: {
          average,
          totalChange: { percentage: totalChangePercentage, value: totalChangeValue },
          avgMonthlyChange,
        },
      };
    }

    return {
      chartData: processedData,
      visibleData,
      metrics: {
        average: 0,
        totalChange: { percentage: 0, value: 0 },
        avgMonthlyChange: { percentage: 0, value: 0 },
      },
    };
  }, [data, rangeIndices]);

  if (isLoading) return <TrendChartSkeleton />;
  if (isError) return <div className='text-red-500'>Error loading trend data</div>;

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card className='p-4'>
          <h4 className='text-sm font-medium text-gray-500'>Average Orders</h4>
          <p className='text-2xl font-bold'>{Math.round(metrics.average).toLocaleString()}</p>
        </Card>
        <Card className='p-4'>
          <h4 className='text-sm font-medium text-gray-500'>Avg Monthly Change</h4>
          <div className={`flex justify-between items-center`}>
            <p className={`${metrics.avgMonthlyChange.percentage >= 0 ? 'text-green-600' : 'text-red-600'} text-2xl font-bold`}>
              {metrics.avgMonthlyChange.percentage.toFixed(2)}%
            </p>
            <p className={`${metrics.avgMonthlyChange.value >= 0 ? 'text-green-600' : 'text-red-600'} text-md`}>
              {Math.round(metrics.avgMonthlyChange.value).toLocaleString()} units
            </p>
          </div>
        </Card>

        <Card className='p-4'>
          <h4 className='text-sm font-medium text-gray-500'>Total Period Change</h4>
          <div className={`${metrics.totalChange.percentage >= 0 ? 'text-green-600' : 'text-red-600'} flex justify-between items-center`}>
            <p className='text-2xl font-bold'>{metrics.totalChange.percentage.toFixed(2)}%</p>
            <p className='text-md'>{Math.round(metrics.totalChange.value).toLocaleString()} units</p>
          </div>
        </Card>
        <Card className='p-4'>
          <h4 className='text-sm font-medium text-gray-500'>Date Range</h4>
          <p className='text-sm font-medium'>
            {visibleData.length > 0 && (
              <>
                {format(visibleData[0].date, 'MMM yyyy')} - {format(visibleData[visibleData.length - 1].date, 'MMM yyyy')}
              </>
            )}
          </p>
        </Card>
      </div>

      {/* Date Range Slider */}
      <div className='px-4 py-2'>
        <div className='mb-2 flex justify-between text-sm text-gray-500'>
          {visibleData.length > 0 && (
            <>
              <span>{format(visibleData[0].date, 'MMM yyyy')}</span>
              <span>{format(visibleData[visibleData.length - 1].date, 'MMM yyyy')}</span>
            </>
          )}
        </div>
        <Slider value={rangeIndices} onValueChange={(values: [number, number]) => setRangeIndices(values)} min={0} max={100} step={1} minStepsBetweenThumbs={1} className='my-4' />
      </div>

      <div className='h-[400px]'>
        {visibleData.length > 0 && (
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={visibleData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='yearMonth' tickFormatter={(value) => format(parse(value, 'yyyy-MM', new Date()), 'MMM yyyy')} />
              <YAxis width={80} />
              <Tooltip formatter={(value: number) => value.toLocaleString()} labelFormatter={(label) => format(parse(label, 'yyyy-MM', new Date()), 'MMMM yyyy')} />
              <Line type='monotone' dataKey='totalOrderQty' stroke='#2563eb' strokeWidth={2} dot={true} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function TrendChartSkeleton() {
  return (
    <div className='space-y-6 animate-pulse'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className='p-4'>
            <div className='h-4 w-24 bg-gray-200 rounded mb-2' />
            <div className='h-8 w-32 bg-gray-200 rounded' />
          </Card>
        ))}
      </div>
      <div className='h-[400px] bg-gray-100 rounded' />
    </div>
  );
}
