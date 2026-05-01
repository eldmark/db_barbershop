export interface User {
  id_user?: number;
  name: string;
  email: string;
  password?: string;
  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface Role {
  id_role?: number;
  name: string;
}

export interface Permission {
  id_permission?: number;
  name: string;
}

export interface Employee {
  id_employee?: number;
  name: string;
  specialty?: string | null;
  salary: number;
}

export interface Category {
  id_category?: number;
  name: string;
}

export interface Supplier {
  id_supplier?: number;
  name: string;
  contact?: string | null;
}

export interface ServiceEntity {
  id_service?: number;
  name: string;
  price: number;
}

export interface Product {
  id_product?: number;
  name: string;
  price: number;
  stock: number;
  id_category: number;
  id_supplier: number;
}

export interface Reservation {
  id_reservation?: number;
  date: string;
  time: string;
  status: 'pending' | 'completed' | 'cancelled';
  id_user: number;
  id_employee: number;
  id_service: number;
  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface Sale {
  id_sale?: number;
  date: string;
  total?: number;
  id_user: number;
  id_employee: number;
  id_reservation?: number | null;
  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
  products?: SaleDetailProduct[];
}

export interface SaleDetailProduct {
  id_sale_detail_product?: number;
  id_sale: number;
  id_product: number;
  quantity: number;
  unit_price: number;
}

export interface SaleDetailService {
  id_sale_detail_service?: number;
  id_sale: number;
  id_service: number;
  quantity: number;
  unit_price: number;
}
