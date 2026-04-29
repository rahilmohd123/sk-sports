import { apiSlice } from './apiSlice';

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: '/api/categories',
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApiSlice;
