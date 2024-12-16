// components/custom/orders/TopStockItems/index.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTopOrderStockItems } from '@/utils/apiFunctions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Package2, TrendingUp, BarChart3, DollarSign } from 'lucide-react';
import { StockItem } from '@/types/responses';

export function TopStockItems() {
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['topStockItems'],
    queryFn: fetchTopOrderStockItems,
  });

  if (isError) {
    return <div className='text-red-500 p-4'>Error loading top stock items</div>;
  }

  const handleRowClick = (item: StockItem) => {
    setSelectedItem(item);
    setSheetOpen(true);
  };

  return (
    <div className='space-y-4'>
      {/* Stats Overview */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
        {!isLoading && data?.data && (
          <>
            <StatsCard title='Total Order Quantity' value={data.data.reduce((sum: number, item: StockItem) => sum + item.totalOrderQty, 0).toLocaleString()} icon={Package2} />
            <StatsCard
              title='Average Order Size'
              value={Math.round(data.data.reduce((sum: number, item: StockItem) => sum + item.totalOrderQty, 0) / data.data.length).toLocaleString()}
              icon={TrendingUp}
            />
            <StatsCard title='Total Stock Class counts' value={new Set(data.data.map((item: StockItem) => item.productClass)).size.toString()} icon={BarChart3} />
            <StatsCard
              title='Price Update counts'
              value={data.data.reduce((sum: number, item: StockItem) => sum + (item.priceHistory?.length || 0), 0).toString()}
              icon={DollarSign}
            />
          </>
        )}
      </div>

      <div className='rounded-md border h-[800px] flex flex-col'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[200px]'>Stock Code</TableHead>
              <TableHead className='w-[250px]'>Description</TableHead>
              <TableHead className='text-right'>Total Orders</TableHead>
              <TableHead className='text-right'>On Hand</TableHead>
              <TableHead>Product Class</TableHead>
              <TableHead>Current Prices</TableHead>
              <TableHead>Stock Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableLoadingSkeleton />
            ) : (
              data?.data.map((item: StockItem) => (
                <TableRow key={item.stockCode} className='cursor-pointer hover:bg-gray-50' onClick={() => handleRowClick(item)}>
                  <TableCell className='font-medium'>
                    <div className='space-y-1'>
                      <div>{item.stockCode}</div>
                      <div className='text-sm text-gray-500'>Supplier: {item.supplier}</div>
                    </div>
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className='text-right font-medium'>{item.totalOrderQty.toLocaleString()}</TableCell>
                  <TableCell className='text-right'>{item.totalQtyOnHand.toLocaleString()}</TableCell>
                  <TableCell>{item.productClass}</TableCell>
                  <TableCell>
                    <div className='space-y-1'>
                      {item.priceDetails.split(', ').map((price, index) => (
                        <div key={index} className='text-sm'>
                          {price}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StockStatusBadge onHand={item.totalQtyOnHand} ordered={item.totalOrderQty} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Price History Drawer */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className='sm:max-w-xl flex flex-col h-full'>
          {' '}
          {/* Make SheetContent flex and full height */}
          <SheetHeader>
            <SheetTitle>Price History - {selectedItem?.stockCode}</SheetTitle>
          </SheetHeader>
          {/* Wrapper for scrollable content */}
          <div className='flex-1 overflow-y-auto mt-6'>
            <div className='space-y-4'>
              {/* Info Cards Grid */}
              <div className='grid grid-cols-2 gap-4'>
                <InfoCard label='Stock Code' value={selectedItem?.stockCode} />
                <InfoCard label='Product Class' value={selectedItem?.productClass} />
                <InfoCard label='Total Orders' value={selectedItem?.totalOrderQty.toLocaleString()} />
                <InfoCard label='On Hand' value={selectedItem?.totalQtyOnHand.toLocaleString()} />
              </div>

              {/* Price History Section */}
              <div className='mt-6'>
                <h4 className='text-sm font-medium mb-4'>Price Change History</h4>
                <div className='space-y-3'>
                  {selectedItem?.priceHistory
                    .filter((history) => history.priceCode)
                    .sort((a, b) => new Date(b.dateChanged).getTime() - new Date(a.dateChanged).getTime())
                    .map((history, index) => (
                      <Card key={index} className='p-3'>
                        <div className='flex justify-between items-center'>
                          <div>
                            <div className='font-medium'>Price Code: {history.priceCode}</div>
                            <div className='text-sm text-gray-500'>{format(new Date(history.dateChanged), 'MMM dd, yyyy')}</div>
                          </div>
                          <div className='text-right'>
                            <div className='text-sm text-gray-500'>Old: ${history.oldPrice.toFixed(2)}</div>
                            <div className='font-medium text-green-600'>New: ${history.newPrice.toFixed(2)}</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Helper Components
function StatsCard({ title, value, icon: Icon }: { title: string; value: string; icon: any }) {
  return (
    <Card className='p-4'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm text-gray-500'>{title}</p>
          <p className='text-2xl font-bold'>{value}</p>
        </div>
        <Icon className='h-8 w-8 text-gray-400' />
      </div>
    </Card>
  );
}

function InfoCard({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className='p-3 bg-gray-50 rounded-lg'>
      <div className='text-sm text-gray-500'>{label}</div>
      <div className='font-medium'>{value}</div>
    </div>
  );
}

function StockStatusBadge({ onHand, ordered }: { onHand: number; ordered: number }) {
  const ratio = onHand / ordered;
  if (ratio > 0.5) {
    return <Badge className='bg-green-100 text-green-800'>Well Stocked</Badge>;
  }
  if (ratio > 0.2) {
    return <Badge className='bg-yellow-100 text-yellow-800'>Medium Stock</Badge>;
  }
  return <Badge className='bg-red-100 text-red-800'>Low Stock</Badge>;
}

function TableLoadingSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i}>
          {[...Array(7)].map((_, j) => (
            <TableCell key={j}>
              <Skeleton className='h-4 w-[100px]' />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
