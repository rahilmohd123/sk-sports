import { apiSlice } from './apiSlice';

export const statsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/admin/stats',
      providesTags: ['Stats'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = statsApiSlice;
