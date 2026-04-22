'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminLayoutComponent from '@/components/admin/admin-layout';
import type React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem('adminToken');
      if (!token && pathname !== '/geezadmin/login') {
        router.push('/geezadmin/login');
      }
    }
  }, [pathname, router, isClient]);

  if (!isClient) {
    return null; // Render nothing on the server to avoid flash of incorrect content
  }

  if (pathname === '/geezadmin/login') {
    return <>{children}</>;
  }

  // For protected pages, prevent layout flash if not authenticated
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return null; 
  }

  return <AdminLayoutComponent>{children}</AdminLayoutComponent>;
}
