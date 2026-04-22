export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  telegramUsername: string;
  education: string;
  experience: string;
}

export interface Course {
  id?: number;
  title: string;
  slug: string;
  description?: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
  instructorBio?: string;
  targetAudience?: string[];
  startDate?: string;
  endDate?: string;
  days?: string;
  time?: string;
  students?: string;
  rating?: string;
  duration?: string;
  level?: string;
}

export interface Coupon {
  id?: number;
  code: string;
  discountPercent: number;
  maxUses?: number;
  currentUses?: number;
  expiresAt?: string;
  isActive?: boolean;
}

export type PaymentPlan = "one-time" | "two-time" | "basic" | "silver" | "gold";
export type PaymentMethod = "cbe" | "telebirr";
export type RegistrationStatus = "PENDING" | "PAYMENT_VERIFIED" | "PAYMENT_FAILED" | "COMPLETED" | "CANCELLED";

export interface Registration {
  id?: number;
  userId?: number;
  courseId: string | number;
  courseTitle: string;
  coursePrice: number;
  finalPrice: number;
  paymentPlan: PaymentPlan;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  paymentLink?: string;
  couponCode?: string;
  certId?: string; // Certificate ID (e.g., "GTWSSSID10")
  certIssuedAt?: string; // Date when certificate was issued
  status?: RegistrationStatus;
  createdAt?: string;
  updatedAt?: string;
  user?: User;
  course?: Course;
  coupon?: Coupon;
  discounts?: Record<string, string>;
  extractedData?: Record<string, any>;
  receiptImageUrl?: string;
  receiptScreenshot?: File | null;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  registrationId: number;
  data: {
    id: number;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    course: {
      title: string;
      price: number;
    };
    finalPrice: number;
    status: RegistrationStatus;
    createdAt: string;
  };
}

export interface PaymentVerificationRequest {
  registrationId: number;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  extractedData?: {
    accountNumber?: string;
    amount?: number;
    transactionDate?: string;
    [key: string]: any;
  };
  allowFallback?: boolean;
}

export interface TelegramInvite {
  inviteLink: string;
  expiresAt: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  verificationResult: {
    isValid: boolean;
    message: string;
    verificationId: number;
    paymentMethod: PaymentMethod;
    referenceNumber: string;
    amount: number;
    transactionDate: string;
    fallbackUsed: boolean;
    verificationMethod: string;
    paymentProgress: number;
    isPaymentComplete: boolean;
    paymentStatusMessage: string;
    telegramInvite?: TelegramInvite;
    telegramMessage?: string;
    emailSent?: boolean;
    emailMessage?: string;
  };
}

export interface ReceiptDataResponse {
  success: boolean;
  data: {
    referenceNumber: string;
    amount: number;
    accountNumber?: string;
    recipient?: string;
    transactionDate: string;
    receiptImageUrl: string;
  };
}

export interface CouponValidationResponse {
  success: boolean;
  message: string;
  data?: {
    code: string;
    discountPercent: number;
  };
}

export interface CourseResponse {
  success: boolean;
  data: Course | Course[];
}

export interface CertificateVerificationResponse {
  success: boolean;
  data?: {
    certId: string;
    holder: string;
    course: string;
    issuedAt: string | null;
  };
  message?: string;
}
