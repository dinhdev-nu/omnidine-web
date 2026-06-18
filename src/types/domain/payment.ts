export type PaymentMethod =
  | 'cash'
  | 'credit_card'
  | 'banking_transfer'
  | 'qr_code'
  | 'momo'
  | 'zalopay'
  | 'vnpay'
  | 'shopeepay';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';

export interface Payment {
  id?: string;
  _id?: string;
  payment_number: string;
  order_id: string;
  restaurant_id: string;
  amount: number;
  cash_tendered?: number | null;
  change_amount?: number | null;
  currency?: string;
  method: PaymentMethod;
  status: PaymentStatus;
  reference_number?: string | null;
  idempotency_key?: string | null;
  processed_by?: string | null;
  processed_at?: string | null;
  expires_at?: string | null;
  failed_reason?: string | null;
  gateway_response?: unknown | null;
  refunded_amount?: number;
  refunded_at?: string | null;
  refund_reason?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePaymentPayload {
  method: PaymentMethod;
  amount: number;
  idempotency_key: string;
  cash_tendered?: number;
  reference_number?: string;
  return_url?: string;
  notes?: string;
}

export interface CreateCashPaymentPayload {
  method: 'cash';
  amount: number;
  cash_tendered: number;
  idempotency_key: string;
  notes?: string;
}

export interface CreatePaymentResponse {
  id: string;
  payment_number: string;
  order_id: string;
  amount: number;
  cash_tendered?: number | null;
  change_amount?: number | null;
  method: PaymentMethod;
  status: PaymentStatus;
  reference_number?: string | null;
  processed_by?: string | null;
  processed_at?: string | null;
  expires_at?: string | null;
  order_payment_status?: string;
  payment_url?: string | null;
  qr_code_url?: string | null;
  created_at?: string;
}

export interface ListPaymentsSummary {
  net_paid: number;
  total_refunded: number;
  remaining_amount: number;
  order_payment_status: string;
}

export interface ListPaymentsResponse {
  payments: Payment[];
  summary: ListPaymentsSummary;
}

export interface RefundPaymentPayload {
  refund_amount: number;
  refund_reason: string;
}

export interface RefundPaymentResponse {
  payment_id: string;
  refunded_amount: number;
  payment_status: PaymentStatus | string;
  refunded_at: string;
  order_payment_status: string;
  order_status?: string;
}

export type GetPaymentResponse = Payment
