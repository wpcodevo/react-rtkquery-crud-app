import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IMutateNote, INote, INoteResponse } from "./types";
import NProgress from "nprogress";

export const noteAPI = createApi({
  reducerPath: "noteAPI",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api" }),
  tagTypes: ["Notes"],
  endpoints: (builder) => ({
    createNote: builder.mutation<INoteResponse, IMutateNote>({
      query(note) {
        return {
          url: "/notes/",
          method: "POST",
          credentials: "include",
          body: note,
        };
      },
      invalidatesTags: [{ type: "Notes", id: "LIST" }],
      transformResponse: (result: { note: INoteResponse }) => result.note,
      onQueryStarted(arg, api) {
        NProgress.start();
      },
    }),
    updateNote: builder.mutation<
      INoteResponse,
      { id: string; note: IMutateNote }
    >({
      query({ id, note }) {
        return {
          url: `/notes/${id}`,
          method: "PATCH",
          credentials: "include",
          body: note,
        };
      },
      invalidatesTags: (result, error, { id }) =>
        result
          ? [
              { type: "Notes", id },
              { type: "Notes", id: "LIST" },
            ]
          : [{ type: "Notes", id: "LIST" }],
      transformResponse: (response: { note: INoteResponse }) => response.note,
      onQueryStarted(arg, api) {
        NProgress.start();
      },
    }),
    getNote: builder.query<INoteResponse, string>({
      query(id) {
        return {
          url: `/notes/${id}`,
          credentials: "include",
        };
      },
      providesTags: (result, error, id) => [{ type: "Notes", id }],
    }),
    getAllNotes: builder.query<INote[], { page: number; limit: number }>({
      query({ page, limit }) {
        return {
          url: `/notes?page=${page}&limit=${limit}`,
          credentials: "include",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Notes" as const,
                id,
              })),
              { type: "Notes", id: "LIST" },
            ]
          : [{ type: "Notes", id: "LIST" }],
      transformResponse: (results: { notes: INote[] }) => results.notes,
      onQueryStarted(arg, api) {
        NProgress.start();
      },
      keepUnusedDataFor: 5,
    }),
    deleteNote: builder.mutation<INoteResponse, string>({
      query(id) {
        return {
          url: `/notes/${id}`,
          method: "DELETE",
          credentials: "include",
        };
      },
      invalidatesTags: [{ type: "Notes", id: "LIST" }],
      onQueryStarted(arg, api) {
        NProgress.start();
      },
    }),
  }),
});

export const {
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useUpdateNoteMutation,
  useGetAllNotesQuery,
} = noteAPI;
