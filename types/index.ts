export interface DashboardStats {
  totalRegistrations: number;
  pendingRegistrations: number;
  totalRevenue: number;
  registrationsByDate: { date: string; count: number }[];
  registrationsByEducation: { _count: { education: number }; education: string }[];
}

export interface Coupon {
  id: number;
  code: string;
  discountPercent: number;
  maxUses: number;
  currentUses: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
