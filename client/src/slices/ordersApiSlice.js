import { apiSlice } from './apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: '/api/orders',
        method: 'POST',
        body: { ...order },
      }),
      invalidatesTags: ['Order'],
    }),
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `/api/orders/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `/api/orders/${orderId}/pay`,
        method: 'PUT',
        body: { ...details },
      }),
      invalidatesTags: ['Order'],
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: '/api/orders/myorders',
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Order'],
    }),
    createRazorpayOrder: builder.mutation({
      query: (amount) => ({
        url: '/api/payment/razorpay/order',
        method: 'POST',
        body: { amount },
      }),
    }),
    verifyRazorpayPayment: builder.mutation({
      query: (details) => ({
        url: '/api/payment/razorpay/verify',
        method: 'POST',
        body: { ...details },
      }),
    }),
    getRazorpayConfig: builder.query({
      query: () => ({
        url: '/api/payment/razorpay/config',
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetMyOrdersQuery,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  useGetRazorpayConfigQuery,
} = ordersApiSlice;
