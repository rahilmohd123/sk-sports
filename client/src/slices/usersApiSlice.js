import { apiSlice } from './apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({ url: '/api/auth/login', method: 'POST', body: data }),
    }),
    register: builder.mutation({
      query: (data) => ({ url: '/api/auth/register', method: 'POST', body: data }),
    }),
    logout: builder.mutation({
      query: () => ({ url: '/api/auth/logout', method: 'POST' }),
    }),
    getUserProfile: builder.query({
      query: () => ({ url: '/api/users/profile' }),
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({ url: '/api/users/profile', method: 'PUT', body: data }),
      invalidatesTags: ['User'],
    }),
    addAddress: builder.mutation({
      query: (address) => ({ url: '/api/users/addresses', method: 'POST', body: address }),
      invalidatesTags: ['User'],
    }),
    deleteAddress: builder.mutation({
      query: (addressId) => ({ url: `/api/users/addresses/${addressId}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),
    setDefaultAddress: builder.mutation({
      query: (addressId) => ({ url: `/api/users/addresses/${addressId}/default`, method: 'PUT' }),
      invalidatesTags: ['User'],
    }),
    getUserCart: builder.query({
      query: () => ({ url: '/api/users/cart' }),
      providesTags: ['Cart'],
    }),
    updateCart: builder.mutation({
      query: (data) => ({ url: '/api/users/cart', method: 'PUT', body: { cartItems: data } }),
      invalidatesTags: ['Cart'],
    }),
    syncCartOnLogin: builder.mutation({
      query: (cartItems) => ({ url: '/api/users/cart/sync', method: 'POST', body: { cartItems } }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useAddAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
  useGetUserCartQuery,
  useUpdateCartMutation,
  useSyncCartOnLoginMutation,
} = usersApiSlice;
