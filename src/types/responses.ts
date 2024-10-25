export interface OrderStatus {
  count: number;
  percentage: string;
  statusCode: string;
  statusDesc: string;
}

export interface FilterOptions {
  branches: string[];
  areas: string[];
  customers: string[];
  productClasses: string[];
  salespersons: string[];
}

export interface OrderTrend {
  yearMonth: string;
  totalOrderQty: number;
}

export interface OrderDetail {
  area: string;
  backOrderQty: number;
  branch: string;
  customerID: string;
  customerName: string;
  invoice: string;
  lineType: string;
  masterAccount: string;
  orderDate: string;
  orderQty: number;
  productClass: string;
  salespersonID: string;
  shipQty: number;
  shippingAddress: string;
  shortName: string;
  sorID: string;
  sorLine: number;
  stockCode: string;
  stockDesc: string;
}

export interface PriceHistory {
  dateChanged: string;
  newPrice: number;
  oldPrice: number;
  priceCode: string;
  timeChanged: number;
}

export interface StockItem {
  description: string;
  priceDetails: string;
  productClass: string;
  stockCode: string;
  supplier: string;
  totalOrderQty: number;
  totalQtyOnHand: number;
  warehouseDetails: string;
  priceHistory: PriceHistory[];
}

export interface ProductClassDistributionOutput {
  id: string;
  label: string;
  percentage: number;
  value: number;
}
