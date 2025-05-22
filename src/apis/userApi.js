import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../utils/axios.util';

console.log('DEBUG VITE_BASE_API:', import.meta.env.VITE_BASE_API);
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: axiosBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_API,
  }),

  tagTypes: ['User'],
  endpoints: (builder) => ({
    // getUsers: builder.query({
    //   query: () => '/users',
    //   credentials: true,
    //   providesTags: (result) =>
    //     result
    //       ? [...result.map(({ id }) => ({ type: 'User', id })), { type: 'User', id: 'LIST' }]
    //       : [{ type: 'User', id: 'LIST' }],
    // }),
    getUsers: builder.query({
      query: () => ({
        url: '/users',
        method: 'GET',
        credentials: true,
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'User', id })), { type: 'User', id: 'LIST' }]
          : [{ type: 'User', id: 'LIST' }],
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `/users/${id}/admin`,
        method: 'GET',
        credentials: true,
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    getCurrentUser: builder.mutation({
      query: () => ({
        url: '/users/current',
        method: 'GET',
        credentials: true,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'GET',
        credentials: true,
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: '/users/login',
        method: 'POST',
        data,
        credentials: true,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/users/logout',
        method: 'POST',
        credentials: true,
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: '/users/register',
        method: 'POST',
        data,
      }),
    }),

    addUser: builder.mutation({
      query: (data) => ({
        url: '/users',
        method: 'POST',
        data,
        credentials: true,
      }),
    }),
    // updateUser: builder.mutation({
    //   query: ({ id, data }) => ({
    //     url: `/users`,
    //     method: 'PATCH',
    //     data: { id, ...data },
    //     credentials: true,
    //   }),
    // }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users`,
        method: 'PATCH',
        data: { id, ...data },
        credentials: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/delete/${id}`, // ✅ đúng với route BE
        method: 'DELETE',
        credentials: true,
      }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id: 'LIST' }],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetCurrentUserMutation,
  useRefreshTokenMutation,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useLogoutMutation,
} = userApi;
