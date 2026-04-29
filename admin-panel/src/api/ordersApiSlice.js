import { apiSlice } from './apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    deliverOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/deliver`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order', 'Stats'],
    }),
    payOrder: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/orders/${id}/pay`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Order', 'Stats'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useDeliverOrderMutation,
  usePayOrderMutation,
} = ordersApiSlice;
