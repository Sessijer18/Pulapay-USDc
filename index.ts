// Pulapay — Shared Types
// These types are shared between frontend and backend

export type Currency = 'XOF' | 'USD';

export type KycLevel = 'NONE' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3';

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'FEE';

export type TransactionStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REVERSED';

export type PaymentRail =
  | 'MTN_MOMO'
  | 'MOOV'
  | 'CELTIIS'
  | 'CARD'
  | 'USDC_TRON'
  | 'USDC_ETHEREUM'
  | 'INTERNAL';

// ─── API Response types ──────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    cursor?: string;
    hasMore?: boolean;
    total?: number;
  };
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  phone?: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  kycLevel: KycLevel;
  createdAt: string;
}

// ─── Wallet ──────────────────────────────────────────────────────────────────

export interface Wallet {
  id: string;
  userId: string;
  balanceCents: number; // integer — NEVER float
  currency: Currency;
}

// ─── Transaction ─────────────────────────────────────────────────────────────

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amountCents: number; // integer — NEVER float
  feeCents: number;
  currency: Currency;
  description?: string;
  senderId?: string;
  recipientId?: string;
  paymentRail?: PaymentRail;
  createdAt: string;
  completedAt?: string;
}

// ─── Send Money ──────────────────────────────────────────────────────────────

export interface SendMoneyRequest {
  amountCents: number;
  recipientPhone?: string;
  recipientUserId?: string;
  description?: string;
  idempotencyKey: string;
}

export interface SendMoneyResponse {
  transactionId: string;
  status: TransactionStatus;
  amountCents: number;
  feeCents: number;
}

// ─── Format helpers ──────────────────────────────────────────────────────────

/**
 * Format cents to display amount (e.g. 150000 → "1 500 FCFA")
 * Never use floating point for monetary values.
 */
export function formatAmount(cents: number, currency: Currency = 'XOF'): string {
  const amount = Math.floor(cents);
  if (currency === 'XOF') {
    return `${amount.toLocaleString('fr-FR')} FCFA`;
  }
  // USD: cents → dollars
  const dollars = amount / 100;
  return `$${dollars.toFixed(2)}`;
}
