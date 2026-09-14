"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "./auth-context"
import { 
    getSpaces,
    getMyBookings,
    getAllBookings,
    getUsers,
    createBooking,
    cancelBooking,
    updateUserRole,
    createSpace,
    deleteSpace,
    type SpaceCreate,
    type BookingCreate
} from "./api"

export function useSpaces() {
    const { token } = useAuth();
    return useQuery({
        queryKey: ["spaces"],
        queryFn: () => getSpaces(token!),
        enabled: !!token
    });
}

export function useMyBookings() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["myBookings"],
    queryFn: () => getMyBookings(token!),
    enabled: !!token,
  });
}

export function useAllBookings() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["allBookings"],
    queryFn: () => getAllBookings(token!),
    enabled: !!token,
  });
}

export function useUsers() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(token!),
    enabled: !!token,
  });
}

export function useCreateBooking() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BookingCreate) => createBooking(token!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
    },
  });
}

export function useCancelBooking() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: number) => cancelBooking(token!, bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
    },
  });
}

export function useUpdateUserRole() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      updateUserRole(token!, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useCreateSpace() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SpaceCreate) => createSpace(token!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
    },
  });
}

export function useDeleteSpace() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (spaceId: number) => deleteSpace(token!, spaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
    },
  });
}