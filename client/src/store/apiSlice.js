import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Claim'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: '/api/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    getClaims: builder.query({
      query: () => '/api/claims',
      providesTags: ['Claim'],
    }),
    createClaim: builder.mutation({
      query: (claimData) => ({
        url: '/api/claims',
        method: 'POST',
        body: claimData,
      }),
      invalidatesTags: ['Claim'],
    }),
    updateClaimStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/claims/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Claim'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetClaimsQuery,
  useCreateClaimMutation,
  useUpdateClaimStatusMutation,
} = apiSlice;
