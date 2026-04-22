'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '../api-client';

export function useValidateCoupon(code?: string) {
  return useQuery({
    queryKey: ['coupon', code],
    queryFn: async () => {
      if (!code) throw new Error('Coupon code is required');
      const response = await apiClient.validateCoupon(code);
      return response;
    },
    enabled: !!code && code.trim() !== '',
    retry: false,
    staleTime: 0, // Always get fresh data for coupon validation
  });
} 