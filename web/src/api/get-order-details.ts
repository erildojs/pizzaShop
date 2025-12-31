import { api } from "@/lib/axios"

export interface GetOrderDetailsParams {
  orderId: string
}

export interface GetOrderDetailsResponse {
  id: string;
  status: 'pending' | 'canceled' | 'processing' | 'delivering' | 'delivered';
  totalInCents: number;
  createdAt: string;
  orderItems: {
    id: string;
    quantity: number;
    priceInCents: number;
    product: {
      name: string
    }
  }[];
  customer: {
    name: string;
    email: string;
    phone: string | null;
  }
}

export async function getOrderDetails({ orderId }: GetOrderDetailsParams) {
  const response = await api.get<GetOrderDetailsResponse>(`/orders/${orderId}`)//<> - simboliza o tipo de retorno
  return response.data
}