import { Payment, PaymentQueryParams, PaymentsApiResponse, PaymentsResponse } from '@/types/payment';
import { api } from './api';

export async function getMyPayments(
  params?: PaymentQueryParams
): Promise<PaymentsResponse> {
  const response = await api.get<PaymentsApiResponse>('/patients/me/payments', {
    params: {
      page: params?.page || 1,
      limit: params?.limit || 10,
      status: params?.status,
      startDate: params?.startDate,
      endDate: params?.endDate,
    },
  });
  return {
    data: response.data.data,
    total: response.data.meta.totalItems,
  };
}

export async function getPaymentById(id: string): Promise<Payment> {
  const response = await api.get<{ data: Payment }>(`/patients/me/payments/${id}`);
  return response.data.data;
}

