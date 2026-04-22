'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '../api-client';
import type { Course } from '../api-client';

export function useGetAllCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await apiClient.getAllCourses();
      return Array.isArray(response.data) ? response.data : [response.data];
    },
  });
}

export function useGetCourse(idOrSlug: string) {
  return useQuery({
    queryKey: ['course', idOrSlug],
    queryFn: async () => {
      const response = await apiClient.getCourse(idOrSlug);
      return response.data;
    },
    enabled: !!idOrSlug,
  });
} 