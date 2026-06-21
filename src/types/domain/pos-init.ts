// POS Init API Response Types

export interface PosUser {
  id: string; // ObjectId from user.sub
  system_role: 'user' | 'admin';
}

export interface PosStaff {
  _id: string;
  employee_code: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  position: 'manager' | 'cashier' | 'waiter' | 'kitchen' | 'delivery';
  permissions: {
    can_discount: boolean;
    can_cancel_order: boolean;
    can_process_payment: boolean;
    can_refund: boolean;
    can_view_reports: boolean;
    can_manage_tables: boolean;
    can_manage_menu: boolean;
  };
}

export interface PosRestaurant {
  _id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  address: string;
  phone: string | null;
  timezone: string;
  currency: string;
  tax_rate: number;
  service_charge_rate: number;
  accepts_online_orders: boolean;
}

export type BusinessRole = 'owner' | 'admin' | 'staff';

export interface PosInitData {
  user: PosUser;
  business_role: BusinessRole;
  current_staff: PosStaff | null;
  restaurant: PosRestaurant;
}
