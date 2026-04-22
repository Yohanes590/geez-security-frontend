'use client';

import { useMutation } from '@tanstack/react-query';
import apiClient from '@/app/lib/api-client';
import type { PaymentMethod, PaymentVerificationRequest } from '@/app/lib/types';

export function useVerifyPayment() {
  return useMutation({
    mutationFn: (data: PaymentVerificationRequest) => apiClient.post('/verify-payment', data),
    onError: (error) => {
      // console.error('Payment verification error:', error);
    },
  });
}

export function useExtractReceiptData() {
  return useMutation({
    mutationFn: async ({ 
      imageFile, 
      paymentMethod, 
      registrationId 
    }: { 
      imageFile: File; 
      paymentMethod: PaymentMethod; 
      registrationId?: number 
    }) => {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('paymentMethod', paymentMethod);
      if (registrationId) {
        formData.append('registrationId', String(registrationId));
      }

      const response = await apiClient.post('/extract-receipt-data', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onError: (error) => {
      // console.error('Receipt extraction error:', error);
    },
  });
} 