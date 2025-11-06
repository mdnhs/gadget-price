export interface Product {
  id?: string;
  product_no: string;
  category_id?: string;
  category: string;
  brand_id?: string;
  brand: string;
  name: string;
  warranty_id?: string;
  warranty: string;
  dp_price: number;
  rp_price: number;
  map_price: number;
  mrp_price: number;
  url?: string;
}

export interface Filters {
  search: string;
  category: string;
  brand: string;
  warranty: string;
  minDpPrice: string;
  maxDpPrice: string;
  minRpPrice: string;
  maxRpPrice: string;
  sortBy: keyof Product;
  sortOrder: "asc" | "desc";
}
