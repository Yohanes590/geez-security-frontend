'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/app/lib/api-client';
import type { Registration } from '@/app/lib/types';

export function useRegister() {
  return useMutation({
    mutationFn: (data: Registration) => apiClient.post('/register', data),
    onError: (error) => {
      // console.error('Registration error:', error);
    },
  });
}

export function useGetRegistration(id?: number | string) {
  return useQuery({
    queryKey: ['registration', id],
    queryFn: async () => {
      if (!id) throw new Error('Registration ID is required');
      const response = await apiClient.get(`/register/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useGetRegistrationsByEmail(email?: string) {
  return useQuery({
    queryKey: ['registrations', email],
    queryFn: async () => {
      if (!email) throw new Error('Email is required');
      const response = await apiClient.get(`/register?email=${email}`);
      return response.data;
    },
    enabled: !!email,
  });
} 