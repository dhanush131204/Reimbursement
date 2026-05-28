import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token && token !== 'undefined' && token !== 'null') {
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
      invalidatesTags: ['User'],
    }),
    getUsers: builder.query({
      query: () => '/api/auth/users',
      providesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/auth/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: '/api/auth/profile',
        method: 'PUT',
        body: profileData,
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
      query: ({ id, ...patch }) => ({
        url: `/api/claims/${id}/status`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Claim'],
    }),
    deleteClaim: builder.mutation({
      query: (id) => ({
        url: `/api/claims/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Claim'],
    }),
    createRazorpayOrder: builder.mutation({
      query: (claimIds) => ({
        url: '/api/payments/razorpay/order',
        method: 'POST',
        body: { claimIds },
      }),
    }),
    verifyRazorpayPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/api/payments/razorpay/verify',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Claim'],
    }),
    uploadFile: builder.mutation({
      query: (formData) => ({
        url: '/api/upload',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUpdateProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetClaimsQuery,
  useCreateClaimMutation,
  useUpdateClaimStatusMutation,
  useUploadFileMutation,
  useDeleteClaimMutation,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
} = apiSlice;
