'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FilterState } from './index';
import { fetchOrderDetailTableData } from '@/utils/apiFunctions';
import { cleanFilters } from '@/utils/helper';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderDetail } from '@/types/responses';

interface OrderDetailsTableProps {
  filters: FilterState;
}

export function OrderDetailsTable({ filters }: OrderDetailsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 50;

  const queryParams = {
    ...cleanFilters(filters),
    page: currentPage.toString(),
    per_page: perPage.toString(),
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['orderDetails', queryParams],
    queryFn: () => fetchOrderDetailTableData(queryParams),
    // placeholderData: (previousData) => previousData,
  });

  const renderPagination = () => {
    if (!data?.pagination) return null;

    const { totalPages, page } = data.pagination;
    const visiblePages: (number | 'ellipsis')[] = [];

    visiblePages.push(1);
    if (page > 3) {
      visiblePages.push('ellipsis');
    }
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      if (!visiblePages.includes(i)) {
        visiblePages.push(i);
      }
    }
    if (page < totalPages - 2) {
      visiblePages.push('ellipsis');
    }
    if (totalPages > 1) {
      visiblePages.push(totalPages);
    }

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>

          {visiblePages.map((pageNum, index) =>
            pageNum === 'ellipsis' ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={pageNum}>
                <PaginationLink onClick={() => setCurrentPage(pageNum)} isActive={currentPage === pageNum}>
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage((prev) => Math.min(data.pagination.totalPages, prev + 1))}
              className={currentPage === data.pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  if (isError) {
    return <div className='text-red-500 p-4'>Error loading order details</div>;
  }

  return (
    <div className='space-y-4 h-[calc(100vh-300px)] flex flex-col overflow-hidden'>
      <div className='flex-1 min-h-0 rounded-md border overflow-hidden'>
        <div className='h-full flex flex-col'>
          {/* Fixed width table header */}
          <div className='flex-shrink-0 border-b'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[180px] bg-white'>Order Info</TableHead>
                  <TableHead className='w-[220px] bg-white'>Customer</TableHead>
                  <TableHead className='w-[270px] bg-white'>Stock Item</TableHead>
                  <TableHead className='w-[170px] bg-white'>Branch/Area</TableHead>
                  <TableHead className='w-[210px] bg-white'>Address</TableHead>
                  <TableHead className='w-[140px] bg-white'>Quantities</TableHead>
                  <TableHead className='w-[140px] bg-white'>Shipping Status</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>

          {/* Scrollable table body with matching column widths */}
          <div className='flex-1 overflow-auto'>
            <Table>
              <TableBody>
                {isLoading ? (
                  <TableLoadingSkeleton />
                ) : (
                  data?.data.map((order: OrderDetail) => (
                    <TableRow key={`${order.sorID}-${order.sorLine}`}>
                      <TableCell className='w-[200px]'>
                        <div className='space-y-1'>
                          <div className='font-medium'>#{order.sorID}</div>
                          <div className='text-sm text-gray-500'>{order.orderDate}</div>
                          {order.invoice && <div className='text-sm text-gray-500'>INV: {order.invoice}</div>}
                        </div>
                      </TableCell>
                      <TableCell className='w-[250px]'>
                        <div className='space-y-1'>
                          <div className='font-medium'>{order.customerName}</div>
                          <div className='text-sm text-gray-500'>ID: {order.customerID}</div>
                          <div className='text-sm text-gray-500'>{order.shortName}</div>
                        </div>
                      </TableCell>
                      <TableCell className='w-[250px]'>
                        <div className='space-y-1'>
                          <div className='font-medium'>{order.stockCode}</div>
                          <div className='text-sm text-gray-500'>{order.stockDesc}</div>
                          <div className='text-sm text-gray-500'>Class: {order.productClass}</div>
                        </div>
                      </TableCell>
                      <TableCell className='w-[150px]'>
                        <div className='space-y-1'>
                          <div className='font-medium'>Branch: {order.branch}</div>
                          <div className='text-sm text-gray-500'>Area: {order.area}</div>
                        </div>
                      </TableCell>
                      <TableCell className='w-[300px]'>
                        <div className='space-y-1'>
                          <div className='text-sm text-gray-500'>{order.shippingAddress}</div>
                        </div>
                      </TableCell>
                      <TableCell className='w-[150px]'>
                        <div className='space-y-1'>
                          <div className='font-medium'>Order: {order.orderQty}</div>
                          <div className='text-sm text-gray-500'>Ship: {order.shipQty}</div>
                          {order.backOrderQty > 0 && <div className='text-sm text-yellow-600'>Back: {order.backOrderQty}</div>}
                        </div>
                      </TableCell>
                      <TableCell className='w-[120px]'>
                        <OrderStatusBadge shipQty={order.shipQty} orderQty={order.orderQty} backOrderQty={order.backOrderQty} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination section */}
      {!isLoading && data?.pagination && (
        <div className='flex flex-col sm:flex-row gap-4 items-center justify-between bg-white py-2'>
          <div className='text-sm text-gray-500'>
            Showing {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, data.pagination.totalCount)} of {data.pagination.totalCount} entries
          </div>
          {renderPagination()}
        </div>
      )}
    </div>
  );
}

function OrderStatusBadge({ shipQty, orderQty, backOrderQty }: { shipQty: number; orderQty: number; backOrderQty: number }) {
  if (shipQty === orderQty) {
    return <Badge className='bg-green-100 text-green-800'>Completed</Badge>;
  }
  if (backOrderQty > 0) {
    return <Badge className='bg-yellow-100 text-yellow-800'>Back Order</Badge>;
  }
  return <Badge className='bg-blue-100 text-blue-800'>In Progress</Badge>;
}

function TableLoadingSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i}>
          <TableCell className='w-[200px]'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-[150px]' />
              <Skeleton className='h-4 w-[100px]' />
            </div>
          </TableCell>
          <TableCell className='w-[250px]'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-[200px]' />
              <Skeleton className='h-4 w-[150px]' />
            </div>
          </TableCell>
          <TableCell className='w-[250px]'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-[200px]' />
              <Skeleton className='h-4 w-[150px]' />
            </div>
          </TableCell>
          <TableCell className='w-[150px]'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-[100px]' />
              <Skeleton className='h-4 w-[80px]' />
            </div>
          </TableCell>
          <TableCell className='w-[300px]'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-[250px]' />
            </div>
          </TableCell>
          <TableCell className='w-[150px]'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-[100px]' />
              <Skeleton className='h-4 w-[80px]' />
            </div>
          </TableCell>
          <TableCell className='w-[120px]'>
            <Skeleton className='h-6 w-[100px]' />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
