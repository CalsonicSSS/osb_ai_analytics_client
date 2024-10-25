import { BASE_URL } from '@/constant/urls';

export const fetchOrderStatusOverview = async () => {
  const response = await fetch(`${BASE_URL}/order_status_overview`);
  if (!response.ok) throw new Error('Failed to fetch order status overview');
  return response.json();
};

export const fetchFilterOptions = async () => {
  const response = await fetch(`${BASE_URL}/order_qty_filter_options`);
  if (!response.ok) throw new Error('Failed to fetch filter options');
  return response.json();
};

export const fetchOrderTrendData = async (params: Record<string, string>) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${BASE_URL}/order_qty_trend_data?${queryString}`);
  if (!response.ok) throw new Error('Failed to fetch order trend analysis');
  return response.json();
};

export const fetchOrderDetailTableData = async (params: Record<string, string>) => {
  console.log('fetchOrderDetailTableData runs');
  console.log('params: ', params);

  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${BASE_URL}/order_detail_table_data?${queryString}`);
  if (!response.ok) throw new Error('Failed to fetch order details');
  return response.json();
};

export const fetchTopOrderStockItems = async () => {
  const response = await fetch(`${BASE_URL}/top_order_stock_items`);
  if (!response.ok) throw new Error('Failed to fetch top stock items');
  return response.json();
};

export const fetchOrderByProductClass = async () => {
  const response = await fetch(`${BASE_URL}/order_by_product_class`);
  if (!response.ok) throw new Error('Failed to fetch product class distribution');
  return response.json();
};
