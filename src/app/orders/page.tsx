'use client';

import { DownloadReportButton } from '@/components/custom/DownloadReport';
import { OrderQuantityAnalysis } from '@/components/custom/orders/OrderQtyAnalysis';
import { OrderStatusOverview } from '@/components/custom/orders/OrderStatusOverview';
import { ProductClassDistribution } from '@/components/custom/orders/ProductClassDistribution';
import { TopStockItems } from '@/components/custom/orders/TopStockItems';
// import { TopStockItems } from '@/components/orders/TopStockItems';
// import { ProductClassDistribution } from '@/components/orders/ProductClassDistribution';
import { Card } from '@/components/ui/card';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function OrdersPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className=''>
        <div className='space-y-6'>
          <div className='grid gap-6'>
            <div className='flex items-center '>
              <h2 className='text-xl font-semibold mr-5'>Your Order Analysis</h2>
              <DownloadReportButton />
            </div>

            {/* Order Status Overview Section */}
            <section>
              <h2 className='text-xl font-semibold mb-4'>Order Status Overview</h2>
              <OrderStatusOverview />
            </section>

            {/* Order Quantity Analysis Section */}
            <section>
              <Card className='p-6'>
                <h2 className='text-xl font-semibold mb-4'>Order Quantity Analysis</h2>
                <OrderQuantityAnalysis />
              </Card>
            </section>

            {/* Two Column Layout for Stock Items and Product Class */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              <div className='lg:col-span-2'>
                <Card className='p-6 h-full'>
                  <h2 className='text-xl font-semibold mb-4'>Top Ordered Stock Items</h2>
                  <TopStockItems />
                </Card>
              </div>
              <div className='lg:col-span-1'>
                <Card className='p-6 h-full'>
                  <h2 className='text-xl font-semibold mb-4'>Product Class Distribution</h2>
                  <ProductClassDistribution />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}
