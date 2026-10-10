"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as libraryApi from "@/lib/api/library";

const keys = [
  "library-dashboard",
  "library-categories",
  "library-shelves",
  "library-books",
  "library-copies",
  "library-members",
  "library-loans",
  "library-fines",
  "library-reservations",
];
function useLibraryMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] })),
  });
}

export const useLibraryDashboard = () =>
  useQuery({
    queryKey: ["library-dashboard"],
    queryFn: libraryApi.getLibraryDashboard,
  });
export const useLibraryCategories = () =>
  useQuery({
    queryKey: ["library-categories"],
    queryFn: libraryApi.getLibraryCategories,
  });
export const useCreateLibraryCategory = () =>
  useLibraryMutation(libraryApi.createLibraryCategory);
export const useLibraryShelves = () =>
  useQuery({
    queryKey: ["library-shelves"],
    queryFn: libraryApi.getLibraryShelves,
  });
export const useCreateLibraryShelf = () =>
  useLibraryMutation(libraryApi.createLibraryShelf);
export const useLibraryBooks = (params = {}) =>
  useQuery({
    queryKey: ["library-books", params],
    queryFn: () => libraryApi.getLibraryBooks(params),
  });
export const useCreateLibraryBook = () =>
  useLibraryMutation(libraryApi.createLibraryBook);
export const useLibraryCopies = (params = {}) =>
  useQuery({
    queryKey: ["library-copies", params],
    queryFn: () => libraryApi.getLibraryCopies(params),
  });
export const useCreateLibraryCopy = () =>
  useLibraryMutation(libraryApi.createLibraryCopy);
export const useLibraryMembers = (params = {}) =>
  useQuery({
    queryKey: ["library-members", params],
    queryFn: () => libraryApi.getLibraryMembers(params),
  });
export const useLibraryPeopleLookup = () =>
  useQuery({
    queryKey: ["library-people"],
    queryFn: libraryApi.getLibraryPeopleLookup,
  });
export const useCreateLibraryMember = () =>
  useLibraryMutation(libraryApi.createLibraryMember);
export const useLibraryLoans = (params = {}) =>
  useQuery({
    queryKey: ["library-loans", params],
    queryFn: () => libraryApi.getLibraryLoans(params),
  });
export const useCreateLibraryLoan = () =>
  useLibraryMutation(libraryApi.createLibraryLoan);
export const useReturnLibraryLoan = () =>
  useLibraryMutation(libraryApi.returnLibraryLoan);
export const useRenewLibraryLoan = () =>
  useLibraryMutation(libraryApi.renewLibraryLoan);
export const useMarkLibraryLoanLost = () =>
  useLibraryMutation(libraryApi.markLibraryLoanLost);
export const useLibraryFines = () =>
  useQuery({
    queryKey: ["library-fines"],
    queryFn: libraryApi.getLibraryFines,
  });
export const usePayLibraryFine = () =>
  useLibraryMutation(libraryApi.payLibraryFine);
export const useWaiveLibraryFine = () =>
  useLibraryMutation(libraryApi.waiveLibraryFine);
export const useLibraryReservations = () =>
  useQuery({
    queryKey: ["library-reservations"],
    queryFn: libraryApi.getLibraryReservations,
  });
export const useCreateLibraryReservation = () =>
  useLibraryMutation(libraryApi.createLibraryReservation);
