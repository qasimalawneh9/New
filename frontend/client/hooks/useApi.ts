/**
 * Custom React Hooks for API calls
 *
 * These hooks provide a consistent interface for making API calls with loading states,
 * error handling, and caching. They integrate with React Query for optimal performance.
 *
 * Usage:
 * const { data: teachers, loading, error, refetch } = useTeachers();
 * const { mutate: createLesson, loading: creating } = useCreateLesson();
 */

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authService,
  userService,
  teacherService,
  studentService,
  lessonService,
  bookingService,
  reviewService,
  messageService,
  notificationService,
  teacherApplicationService,
  adminService,
} from "@/services/api";
import type {
  User,
  Teacher,
  Student,
  Lesson,
  Booking,
  Review,
  Message,
  Conversation,
  Notification,
  TeacherApplication,
  TeacherSearchFilters,
  LessonFilters,
  LoginRequest,
  RegisterRequest,
  CreateLessonRequest,
  SendMessageRequest,
  SubmitReviewRequest,
} from "@/types/api";

// Custom hook for API calls with loading and error states
function useApiCall<T, P extends any[] = []>(
  apiFunction: (
    ...args: P
  ) => Promise<{ success: boolean; data?: T; error?: string }>,
  dependencies: any[] = [],
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: P) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      if (result.success && result.data) {
        setData(result.data);
        return result.data;
      } else {
        setError(result.error || "Unknown error");
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  return { data, loading, error, execute };
}

// Authentication Hooks
export function useAuth() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.setQueryData(["user"], result.data?.user);
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterRequest) => authService.register(userData),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.setQueryData(["user"], result.data?.user);
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    loginLoading: loginMutation.isPending,
    registerLoading: registerMutation.isPending,
    loginError: loginMutation.error?.message,
    registerError: registerMutation.error?.message,
  };
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => authService.me().then((result) => result.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// User Profile Hooks
export function useUserProfile() {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => userService.getProfile().then((result) => result.data),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => userService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => userService.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

// Teacher Hooks
export function useTeachers(filters?: TeacherSearchFilters) {
  return useQuery({
    queryKey: ["teachers", filters],
    queryFn: () => teacherService.getAll(filters).then((result) => result.data),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useTeacher(id: string) {
  return useQuery({
    queryKey: ["teachers", id],
    queryFn: () => teacherService.getById(id).then((result) => result.data),
    enabled: !!id,
  });
}

export function useTeacherAvailability(id: string, date?: string) {
  return useQuery({
    queryKey: ["teachers", id, "availability", date],
    queryFn: () =>
      teacherService.getAvailability(id, date).then((result) => result.data),
    enabled: !!id,
  });
}

export function useUpdateTeacherProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<any>) => teacherService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useUpdateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => teacherService.updateAvailability(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
}

export function useTeacherStudents() {
  return useQuery({
    queryKey: ["teacher", "students"],
    queryFn: () => teacherService.getStudents().then((result) => result.data),
  });
}

export function useTeacherEarnings(period?: string) {
  return useQuery({
    queryKey: ["teacher", "earnings", period],
    queryFn: () =>
      teacherService.getEarnings(period).then((result) => result.data),
  });
}

export function useRequestPayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      amount,
      method,
    }: {
      amount: number;
      method: "bank" | "paypal";
    }) => teacherService.requestPayout(amount, method),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "earnings"] });
    },
  });
}

// Student Hooks
export function useUpdateStudentProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<any>) => studentService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useStudentTeachers() {
  return useQuery({
    queryKey: ["student", "teachers"],
    queryFn: () => studentService.getTeachers().then((result) => result.data),
  });
}

export function useFavoriteTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teacherId,
      action,
    }: {
      teacherId: string;
      action: "add" | "remove";
    }) =>
      action === "add"
        ? studentService.addToFavorites(teacherId)
        : studentService.removeFromFavorites(teacherId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "teachers"] });
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
}

export function useWalletBalance() {
  return useQuery({
    queryKey: ["student", "wallet", "balance"],
    queryFn: () =>
      studentService.getWalletBalance().then((result) => result.data),
  });
}

export function useTopUpWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => studentService.topUpWallet(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "wallet"] });
    },
  });
}

export function useWalletTransactions() {
  return useQuery({
    queryKey: ["student", "wallet", "transactions"],
    queryFn: () =>
      studentService.getWalletTransactions().then((result) => result.data),
  });
}

// Lesson Hooks
export function useLessons(filters?: LessonFilters) {
  return useQuery({
    queryKey: ["lessons", filters],
    queryFn: () => lessonService.getAll(filters).then((result) => result.data),
  });
}

export function useLesson(id: string) {
  return useQuery({
    queryKey: ["lessons", id],
    queryFn: () => lessonService.getById(id).then((result) => result.data),
    enabled: !!id,
  });
}

export function useCreateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLessonRequest) => lessonService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useUpdateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lesson> }) =>
      lessonService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
}

export function useCancelLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      lessonService.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
}

export function useRescheduleLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newDate }: { id: string; newDate: string }) =>
      lessonService.reschedule(id, newDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
}

export function useCompleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => lessonService.markComplete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
}

export function useLessonMeeting(id: string) {
  return useQuery({
    queryKey: ["lessons", id, "meeting"],
    queryFn: () =>
      lessonService.getMeetingInfo(id).then((result) => result.data),
    enabled: !!id,
    refetchInterval: 30000, // Refetch every 30 seconds during lesson
  });
}

// Booking Hooks
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => bookingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: () => bookingService.getById(id).then((result) => result.data),
    enabled: !!id,
  });
}

export function useMyBookings() {
  return useQuery({
    queryKey: ["bookings", "my"],
    queryFn: () => bookingService.getMyBookings().then((result) => result.data),
  });
}

export function useConfirmBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingService.confirm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      bookingService.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

// Review Hooks
export function useTeacherReviews(teacherId: string) {
  return useQuery({
    queryKey: ["reviews", "teacher", teacherId],
    queryFn: () =>
      reviewService.getForTeacher(teacherId).then((result) => result.data),
    enabled: !!teacherId,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitReviewRequest) => reviewService.submit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
}

// Message Hooks
export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      messageService.getConversations().then((result) => result.data),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: ["conversations", id],
    queryFn: () =>
      messageService.getConversation(id).then((result) => result.data),
    enabled: !!id,
    refetchInterval: 5000, // Refetch every 5 seconds for active conversation
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageRequest) => messageService.sendMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

// Notification Hooks
export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationService.getAll().then((result) => result.data),
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// Teacher Application Hooks
export function useSubmitTeacherApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => teacherApplicationService.submit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-application"] });
    },
  });
}

export function useTeacherApplicationStatus() {
  return useQuery({
    queryKey: ["teacher-application", "status"],
    queryFn: () =>
      teacherApplicationService.getStatus().then((result) => result.data),
  });
}

// Admin Hooks
export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => adminService.getStats().then((result) => result.data),
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useAdminUsers(page?: number) {
  return useQuery({
    queryKey: ["admin", "users", page],
    queryFn: () => adminService.getUsers(page).then((result) => result.data),
  });
}

export function useAdminTeachers(page?: number) {
  return useQuery({
    queryKey: ["admin", "teachers", page],
    queryFn: () => adminService.getTeachers(page).then((result) => result.data),
  });
}

export function useTeacherApplications(status?: string) {
  return useQuery({
    queryKey: ["admin", "teacher-applications", status],
    queryFn: () =>
      adminService.getTeacherApplications(status).then((result) => result.data),
  });
}

export function useApproveTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.approveTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "teacher-applications"],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "teachers"] });
    },
  });
}

export function useRejectTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminService.rejectTeacher(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "teacher-applications"],
      });
    },
  });
}

// Generic API call hook for one-off operations
export function useApiMutation<TData, TVariables>(
  mutationFn: (
    variables: TVariables,
  ) => Promise<{ success: boolean; data?: TData; error?: string }>,
  options?: {
    onSuccess?: (data: TData) => void;
    onError?: (error: string) => void;
    invalidateQueries?: string[][];
  },
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const result = await mutationFn(variables);
      if (!result.success) {
        throw new Error(result.error || "Unknown error");
      }
      return result.data;
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data!);
      options?.invalidateQueries?.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
    onError: (error: Error) => {
      options?.onError?.(error.message);
    },
  });
}

// Export the base useApiCall hook for custom implementations
export { useApiCall };
