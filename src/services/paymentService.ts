import { authenticatedFetch } from "@/lib/api";
type PaymentTimeframeUI = "all" | "week" | "month" | "quarter";
export interface Payment {
  transactionId: string;
  reference: string;
  churchName: string;
  plan: string;
  amount: number;
  paymentMethod?: string;
  status: string;
  date: string;
}

export interface PaymentResponse {
  data: Payment[];
  pagination: {
    page: number;
    limit: number;
    itemCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface PaymentStats {
  totalRevenue: number;
  pendingCount: number;
  pendingAmount: number;
  successRate: number;
  failedCount: number;
  totalCount: number;
}

export async function fetchPayments({
  page = 1,
  limit = 20,
  plan,
  status,
  timeframe,
}: {
  page?: number;
  limit?: number;
  plan?: string;
  status?: string;
  timeframe?: PaymentTimeframeUI;
}): Promise<PaymentResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (plan && plan !== "All Plans") {
    params.append("plan", plan.toUpperCase());
  }

  if (status && status !== "All Statuses") {
    params.append("status", status.toUpperCase());
  }

  if (timeframe && timeframe !== "all") {
    params.append("timeframe", timeframe);
  }

  return authenticatedFetch<PaymentResponse>(`/payment?${params}`, {
    method: "GET",
  });
}

export async function fetchPaymentStats(timeframe?: string) {
  const params = new URLSearchParams();

  if (timeframe && timeframe !== "all") {
    params.append("timeframe", timeframe);
  }

  return authenticatedFetch<PaymentStats>(
    `/payment/stats?${params.toString()}`,
    {
      method: "GET",
    },
  );
}

export async function verifyPayment(reference: string, provider: string) {
  return authenticatedFetch(`/payment/verify`, {
    method: "POST",
    body: JSON.stringify({ reference, provider }),
  });
}
