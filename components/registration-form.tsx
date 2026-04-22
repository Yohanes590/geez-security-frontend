"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fallbackCourses } from "@/app/course/[courseId]/page";
import { CourseStatus } from '@/app/api-frontend/fetch-discount';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
  Loader2,
  Upload,
  CheckCircle,
  Clock,
  Copy,
  Check,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRegister } from "@/app/lib/hooks/use-registration";
import {
  useExtractReceiptData,
  useVerifyPayment,
} from "@/app/lib/hooks/use-payment";
import { useValidateCoupon } from "@/app/lib/hooks/use-coupon";
import { useParams } from "next/navigation";
import { DiscountFunction } from "@/app/api-frontend/fetch-discount";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://geez-reg-back.onrender.com/api";

/** One-time payment: percent off t he listed course price */
const ONE_TIME_PAYMENT_DISCOUNT_PERCENT = 10;




interface RegistrationFormProps {
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  theme: any;
}

interface FormData {
  // Basic Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  telegramUsername: string;

  // Educational Background
  education: string;
  experience: string;

  // Payment Information
  paymentPlan: string;
  paymentMethod: string;

  // Payment Confirmation
  referenceNumber: string;
  receiptScreenshot: File | null;
  receiptImageUrl?: string;
  paymentLink: string;

  // Coupon
  couponCode: string;
}

export function RegistrationForm({
  courseId,
  courseTitle,
  coursePrice,
  theme,
}: RegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    telegramUsername: "",
    education: "",
    experience: "",
    paymentPlan: "",
    paymentMethod: "",
    referenceNumber: "",
    receiptScreenshot: null,
    paymentLink: "",
    couponCode: "",
  });

  const [extractedData, setExtractedData] = useState<any>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionConfidence, setExtractionConfidence] = useState(0);

  const [discounts, setDiscounts] = useState<any>(null)
  useEffect(() => {
    const DiscountFetch = async () => {
      const Discounts = await DiscountFunction();
      setDiscounts(Discounts)
    }
    DiscountFetch()
  }, [])

  const { toast } = useToast();
  const totalSteps = 4;
  const params = useParams();
  const courseid = params.courseId as string;
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Registration / course intake end: April 26, 6:00 PM UTC+3 (Ethiopia)
  const endDate = new Date("2026-04-26T18:00:00+03:00").getTime();

  // Update countdown timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = endDate - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        };
      } else {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
    };

    // Initialize timer
    setTimeLeft(calculateTimeLeft());

    // Update timer every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clean up on unmount
    return () => clearInterval(timer);
  }, [endDate]);

  // Bank account information
  const bankAccounts = {
    cbe: {
      name: "Commercial Bank of Ethiopia",
      accountNumber: "1000524838439",
      accountName: "NATAN HAILU BEYENE",
      logo: "/cbe.png",
    },
    telebirr: {
      name: "TeleBirr",
      accountNumber: "0920047396",
      accountName: "Bayush Desaleng",
      logo: "/telebirr.png",
    },
    awash: {
      name: "Awash Bank",
      accountNumber: "013350418639900",
      accountName: "NATAN HAILU BEYENE",
      logo: "/awash.png",
    },
    abyssinia: {
      name: "Bank of Abyssinia",
      accountNumber: "137846168",
      accountName: "Natan Hailu Beyene",
      logo: "/abyssinia.png",
    },
  };

  // Initialize React Query hooks
  const registerMutation = useRegister();
  const extractReceiptMutation = useExtractReceiptData();
  const verifyPaymentMutation = useVerifyPayment();

  // Function to copy account number to clipboard
  const copyToClipboard = (text: string, bank: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAccount(bank);
      toast({
        title: "Copied!",
        description: "Account number copied to clipboard",
      });
      setTimeout(() => setCopiedAccount(null), 3000);
    });
  };

  // Calculate discounted price (considering both payment plan and coupon)
  const getDisplayPrice = () => {
    // Start with original price
    let finalPrice = coursePrice;
    let discountText = "";

    // Apply payment plan discount
    if (formData.paymentPlan === "one-time") {
      finalPrice = Math.round(
        (finalPrice * (100 - ONE_TIME_PAYMENT_DISCOUNT_PERCENT)) / 100,
      );
      discountText = ` (${ONE_TIME_PAYMENT_DISCOUNT_PERCENT}% off)`;
    } else if (formData.paymentPlan === "two-time") {
      // For two-time payment, we don't discount but show payment installments
      const installmentAmount = Math.round(coursePrice / 2);
      return `${coursePrice} Birr (2 payments of ${installmentAmount}(minumum) Birr)`;
    }

    // Apply coupon discount if valid
    if (couponDiscount > 0) {
      const couponAmount = Math.round((finalPrice * couponDiscount) / 100);
      finalPrice -= couponAmount;
      discountText =
        couponDiscount > 0
          ? `(${ONE_TIME_PAYMENT_DISCOUNT_PERCENT}% off + ${couponDiscount}% off with coupon)`
          : "";
    }

    return `${finalPrice} Birr${discountText}`;
  };

  const updateFormData = (
    field: keyof FormData,
    value: string | File | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validate Ethiopian phone numbers when phone field is updated
    if (field === "phone") {
      validateEthiopianPhoneNumber(value as string);
    }

    // Validate coupon code when updated
    if (field === "couponCode") {
      validateCoupon(value as string);
    }
  };

  // Validate that phone number contains only digits
  const validateEthiopianPhoneNumber = (phoneNumber: string) => {
    // Remove all spaces and special characters
    const cleanNumber = phoneNumber.replace(/\s+/g, "").replace(/[-()+]/g, "");

    // Check if it contains only digits
    const isValid = /^\d*$/.test(cleanNumber);

    if (!isValid && cleanNumber.length > 0) {
      setPhoneError("Please enter a valid phone number (digits only)");
    } else {
      setPhoneError(null);
    }

    return isValid || cleanNumber.length === 0; // Empty is also valid (for now)
  };

  // Validate coupon codes
  const validateCoupon = async (code: string) => {
    // Reset previous coupon state
    setCouponError(null);
    setCouponSuccess(null);
    setCouponDiscount(0);

    // If empty, just clear states
    if (!code) return;

    try {
      // Call the API to validate the coupon
      const response = await fetch(`${API_BASE_URL}/coupons/${code}/validate`);
      const result = await response.json();

      if (result.success && result.data) {
        const discount = result.data.discountPercent;
        setCouponDiscount(discount);
        setCouponError(null);
        setCouponSuccess(`Coupon applied! You get ${discount}% off.`);
      } else {
        setCouponError(null);
        setCouponError(result.message || "Invalid coupon code");
      }
    } catch (error) {
      // console.error("Coupon validation error:", error);
      setCouponError("Error validating coupon. Please try again.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      updateFormData("receiptScreenshot", file);

      // Auto-extract data from the uploaded receipt
      extractReceiptData(file);

      // Reset the input to allow selecting the same file again
      e.target.value = "";
    }
  };

  const extractReceiptData = async (file: File) => {
    if (!formData.paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method before uploading receipt",
        variant: "destructive",
      });
      return;
    }

    setIsExtracting(true);

    try {
      // Use React Query mutation for extraction
      const result = await extractReceiptMutation.mutateAsync({
        imageFile: file,
        paymentMethod: formData.paymentMethod as any,
      });

      if (result.success && result.data) {
        setExtractedData(result.data);
        // Estimate confidence based on data completeness
        const confidence =
          result.data.referenceNumber && result.data.amount ? 80 : 50;
        setExtractionConfidence(confidence);

        // Auto-fill the reference number if extracted successfully
        // if (result.data.referenceNumber) {
        // updateFormData("referenceNumber", result.data.referenceNumber)
        updateFormData("receiptImageUrl", result.data.receiptImageUrl);
        // toast({
        //   title: "Receipt Processed Successfully",
        //   description: `Reference number extracted: ${result.data.referenceNumber}`,
        // })
        // }
      } else {
        toast({
          title: "Extraction Failed",
          description: "Could not extract data from receipt",
          variant: "destructive",
        });
      }
    } catch (error) {
      // console.error("Receipt extraction error:", error)
      toast({
        title: "Processing Error",
        description: "Failed to process receipt image",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };
  // console.log("extractedData",extractedData)

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        // Check for phone validation along with required fields
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phone &&
          validateEthiopianPhoneNumber(formData.phone) &&
          formData.telegramUsername
        );
      case 2:
        return !!(formData.education && formData.experience);
      case 3:
        return !!(
          formData.paymentPlan &&
          formData.paymentMethod
        );
      case 4:
        // Allow submission if at least one payment verification method is provided
        return !!(
          formData.referenceNumber ||
          formData.receiptScreenshot ||
          formData.paymentLink
        );
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };
  // console.log("ci",courseId)

  const handleSubmit = async () => {
    const FetchStatus = await CourseStatus();
    const closedCourseIds = FetchStatus;
    if (closedCourseIds.includes(courseid)) {
      toast({
        title: "Registration Closed",
        description: "Registration for this course is currently closed.",
        variant: "destructive",
      });
      return;
    }

    if (isExtracting) {
      toast({
        title: "Processing Receipt",
        description:
          "Please wait while we process your receipt. The form cannot be submitted during this process.",
        variant: "default",
      });
      return;
    }

    if (!validateStep(4)) {
      toast({
        title: "Incomplete Information",
        description:
          "Please provide at least one payment verification method (Receipt Screenshot, or Payment Link).",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate final price with discounts
      let finalPrice = coursePrice;
      if (formData.paymentPlan === "one-time") {
        finalPrice = Math.round(
          (finalPrice * (100 - ONE_TIME_PAYMENT_DISCOUNT_PERCENT)) / 100,
        );
      }
      if (couponDiscount > 0) {
        const couponAmount = Math.round((finalPrice * couponDiscount) / 100);
        finalPrice -= couponAmount;
      }

      // Log submission data to console
      // console.log('Form submission data:', {
      //   ...formData,
      //   courseId:"1",
      //   courseTitle,
      //   coursePrice,
      //   finalPrice,
      //   discounts: {
      //     paymentPlan: formData.paymentPlan === "one-time" ? "25%" : "None",
      //     coupon: couponDiscount > 0 ? `${couponDiscount}%` : "None",
      //   },
      //   timestamp: new Date().toISOString(),
      //   receiptScreenshot: formData.receiptScreenshot ? "File provided" : null
      // })

      // Store user data in localStorage for verification
      // localStorage.setItem(
      //   "registrationData",
      //   JSON.stringify({
      //     ...formData,
      //     courseId,
      //     courseTitle,
      //     coursePrice,
      //     finalPrice,
      //     discounts: {
      //       paymentPlan: formData.paymentPlan === "one-time" ? "25%" : "None",
      //       coupon: couponDiscount > 0 ? `${couponDiscount}%` : "None",
      //     },
      //     timestamp: new Date().toISOString(),
      //   }),
      // )

      // Submit to API using React Query mutation
      const registrationResult = await registerMutation.mutateAsync({
        ...formData,
        courseId: courseId === "gtwss" ? "2" : courseId === "gtcrt" ? "3" : "1",
        courseTitle,
        coursePrice,
        finalPrice: finalPrice,
        paymentPlan: formData.paymentPlan as any,
        paymentMethod: formData.paymentMethod as any,
        discounts: {
          paymentPlan:
            formData.paymentPlan === "one-time"
              ? `${ONE_TIME_PAYMENT_DISCOUNT_PERCENT}%`
              : "None",
          coupon: couponDiscount > 0 ? `${couponDiscount}%` : "None",
        },
        extractedData, // Include extracted receipt data
      });

      // Trigger payment verification if we have extracted data
      if (extractedData && extractedData.referenceNumber && false) {
        // try {``
        //   const verificationResult = await verifyPaymentMutation.mutateAsync({
        //     registrationId: registrationResult.registrationId,
        //     paymentMethod: formData.paymentMethod as any,
        //     referenceNumber: formData.referenceNumber,
        //     extractedData,
        //     allowFallback: true
        //   });
        //   if (verificationResult.success && verificationResult.verificationResult?.isValid) {
        //     toast({
        //       title: "Registration & Payment Verified!",
        //       description:
        //         "Your registration and payment have been automatically verified. You'll receive confirmation via email shortly.",
        //     })
        //   } else {
        //     toast({
        //       title: "Registration Submitted!",
        //       description:
        //         "Your registration has been submitted. Payment verification is in progress and you'll be notified once complete.",
        //     })
        //   }
        // } catch (verificationError) {
        //   console.error("Verification error:", verificationError)
        //   toast({
        //     title: "Registration Submitted!",
        //     description:
        //       "Your registration has been submitted successfully. We'll verify your payment and contact you soon.",
        //   })
        // }
      } else {
        toast({
          title: "Registration Submitted!",
          description:
            "Your registration has been submitted successfully. We'll verify your payment and contact you soon.",
        });
      }

      // Mark registration as complete
      setIsRegistrationComplete(true);

      // No need to reset form since we'll display a success message
    } catch (error) {
      // console.error("Registration error:", error)

      // Calculate price for error logging
      let finalPrice = coursePrice;
      if (formData.paymentPlan === "one-time") {
        finalPrice = Math.round(
          (finalPrice * (100 - ONE_TIME_PAYMENT_DISCOUNT_PERCENT)) / 100,
        );
      }
      if (couponDiscount > 0 && formData.paymentPlan === "one-time") {
        const couponAmount = Math.round((finalPrice * couponDiscount) / 100);
        finalPrice -= couponAmount;
      }

      // Also log the submission data in case of error
      // console.log('Form data that failed to submit:', {
      //   ...formData,
      //   courseId,
      //   courseTitle,
      //   coursePrice,
      //   finalPrice,
      //   discounts: {
      //     paymentPlan: formData.paymentPlan === "one-time" ? "25%" : "None",
      //     coupon: couponDiscount > 0 ? `${couponDiscount}%` : "None",
      //   },
      //   discounts: {
      //     paymentPlan: formData.paymentPlan === "one-time" ? "25%" : "None",
      //     coupon: couponDiscount > 0 ? `${couponDiscount}%` : "None",
      //   },
      //   timestamp: new Date().toISOString(),
      //   receiptScreenshot: formData.receiptScreenshot ? "File provided" : null
      // })
      console.log("registration failed", error);

      toast({
        title: "Registration Failed",
        description:
          axios.isAxiosError(error) && error.response
            ? error.response.data.message
            : "An error occurred during registration. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3
              className={`text-lg font-cyber ${theme.text ? "text-white" : "text-white"} mb-4`}
            >
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  placeholder="John"
                  className={`input-cyber ${theme.border} placeholder:text-gray-500`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  placeholder="Doe"
                  className={`input-cyber ${theme.border} placeholder:text-gray-500`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                placeholder="johndoe@example.com"
                className={`input-cyber ${theme.border} placeholder:text-gray-500`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  placeholder="+251 91 234 5678"
                  className={`input-cyber ${theme.border} placeholder:text-gray-500 ${phoneError ? "border-red-500" : ""}`}
                />
                {phoneError && (
                  <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="telegramUsername"
                  className="text-white font-medium"
                >
                  Telegram Username
                </Label>
                <Input
                  id="telegramUsername"
                  value={formData.telegramUsername}
                  onChange={(e) =>
                    updateFormData("telegramUsername", e.target.value)
                  }
                  placeholder="@username"
                  className={`input-cyber ${theme.border} placeholder:text-gray-500`}
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3
              className={`text-lg font-cyber ${theme.text ? "text-white" : "text-white"} mb-4`}
            >
              Educational Background
            </h3>
            <div>
              <Label htmlFor="education">Highest Education Level *</Label>
              <Select
                onValueChange={(value) => updateFormData("education", value)}
              >
                <SelectTrigger className={`input-cyber ${theme.border}`}>
                  <SelectValue placeholder="Select your education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                  <SelectItem value="master">Master's Degree</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="experience">
                Years of Professional Experience *
              </Label>
              <Select
                onValueChange={(value) => updateFormData("experience", value)}
              >
                <SelectTrigger className={`input-cyber ${theme.border}`}>
                  <SelectValue placeholder="Select your experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="0-1">0-1 years</SelectItem>
                  <SelectItem value="1-3">1-3 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5+">5+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3
              className={`text-lg font-cyber ${theme.text ? "text-white" : "text-white"} mb-4`}
            >
              Payment Information
            </h3>
            <div>
              <Label htmlFor="paymentPlan" className="mb-3 block">
                Payment Plan *
              </Label>


              <div className={`grid grid-cols-1 ${courseId === 'gtcrt' ? 'md:grid-cols-3' : courseId === 'gtwss' ? 'md:flex md:justify-center ' : 'md:grid-cols-2'} gap-4`}>
                {
                  courseid === "gtcrt" ? (
                    fallbackCourses.gtcrt.price_options.map((options, index) => {
                      const mappedValue = options.label.toLowerCase();
                      const isSelected = formData.paymentPlan === mappedValue;

                      return (
                        <div
                          onClick={() =>
                            updateFormData("paymentPlan", mappedValue.toLowerCase())
                          }
                          key={index}>
                          <div
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${isSelected
                              ? `${options.label === "Basic" ? `border-green-500 bg-green-500/10` : options.label === "Silver" ? `border-gray-500 bg-gray-500/10` : `border-yellow-500 bg-yellow-500/10`}`
                              : options.label === "Basic"
                                ? "border-green-500 hover:border-green-700"
                                : options.label === "Silver"
                                  ? "border-gray-500 hover:border-gray-700"
                                  : "border-yellow-500 hover:border-yellow-700"
                              }`}
                          >
                            <h3 className={`font-cyber text-2xl font-bold ${options.label == "Basic" ? "text-green-500" : options.label === "Silver" ? "text-gray-500" : "text-yellow-500"} text-center`}>
                              {options.label}
                            </h3>
                            {/* border-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}] bg-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]/10 */}
                            <div className="flex items-center justify-center gap-3 mt-2">
                              {(courseId === "gtcrt"
                                ? discounts?.GTCRTDiscount
                                : courseId === "gtst"
                                  ? discounts?.GTSTDiscount
                                  : courseId === "gtwss"
                                    ? discounts?.GTWSSDiscount
                                    : 0) > 0 && (
                                  <span className="text-xl text-gray-400 line-through font-cyber">
                                    {options.amount} Birr
                                  </span>
                                )}
                              <p
                                className={`text-3xl font-cyber ${options.label === "Basic"
                                  ? "text-green-700"
                                  : options.label === "Silver"
                                    ? "text-gray-500"
                                    : "text-yellow-500"
                                  }`}
                              >
                                {Math.round(
                                  (options.amount *
                                    (100 -
                                      (courseId === "gtcrt"
                                        ? discounts?.GTCRTDiscount || 0
                                        : courseId === "gtst"
                                          ? discounts?.GTSTDiscount || 0
                                          : courseId === "gtwss"
                                            ? discounts?.GTWSSDiscount || 0
                                            : 0))) /
                                  100
                                )}{" "}
                                Birr
                              </p>
                            </div>

                            <div className="space-y-2 mt-4">
                              {options.features.map((feature, i) => (
                                <div key={i} className="flex items-start">
                                  <CheckCircle className={`h-5 w-5 ${options.label === 'Basic' ? 'text-green-700' : options.label === 'Silver' ? 'text-gray-500' : 'text-yellow-500'} mt-0.5 mr-2 flex-shrink-0`} />
                                  <span className="text-sm text-gray-300">
                                    {feature}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : courseId == 'gtwss' ? (<>

                    <div
                      className={`border rounded-lg w-[60%] p-4 cursor-pointer transition-all ${formData.paymentPlan === "one-time"
                        ? `border-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}] bg-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]/10`
                        : "border-gray-700 hover:border-gray-500"
                        }`}
                      onClick={() => updateFormData("paymentPlan", "one-time")}
                    >
                      <div className="text-center mb-3">
                        <h3 className="font-cyber text-2xl text-white text-center">
                          Standard
                        </h3>
                        <div className="flex justify-center items-center pl-[10px] gap-3 mt-2">
                          {(courseId === "gtwss"
                            ? discounts?.GTCRTDiscount
                            : courseId === "gtwss"
                              ? discounts?.GTSTDiscount
                              : courseId === "gtwss"
                                ? discounts?.GTWSSDiscount
                                : 0) > 0 && (
                              <span className="text-xl text-gray-400 line-through font-cyber">
                                {coursePrice} Birr
                              </span>
                            )}
                          <p
                            className={`text-3xl font-cyber text-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]`}
                          >
                            {Math.round(
                              (coursePrice *
                                (100 -
                                  (courseId === "gtwss"
                                    ? discounts?.GTCRTDiscount || 0
                                    : courseId === "gtwss"
                                      ? discounts?.GTSTDiscount || 0
                                      : courseId === "gtwss"
                                        ? discounts?.GTWSSDiscount || 0
                                        : 0))) /
                              100
                            )}{" "}
                            Birr
                          </p>
                        </div>
                        <div
                          className={`mt-1 inline-block bg-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]/20 text-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}] px-2 py-0.5 rounded text-xs font-medium`}
                        >
                          {
                            courseId === "gtwss" ? (
                              <>
                                {!discounts?.GTCRTDiscount
                                  ? "No Discount"
                                  : `${discounts.GTCRTDiscount}% Discount`}
                              </>
                            ) : courseId === "gtwss" ? (
                              <>
                                {!discounts?.GTSTDiscount
                                  ? "No Discount"
                                  : `${discounts.GTSTDiscount}% Discount`}
                              </>
                            ) : courseId === "gtwss" ? (
                              <>
                                {!discounts?.GTWSSDiscount
                                  ? "No Discount"
                                  : `${discounts.GTWSSDiscount}% Discount`}
                              </>
                            ) : (
                              "No Discount"
                            )
                          }
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#02EF56] mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-300">
                            {courseid === "gtst"
                              ? "Full 4-Month Course Access"
                              : "Lifetime Lab Access"}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#02EF56] mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-300">
                            Lifetime Course Video Access
                          </span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#02EF56] mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-300">
                            Lifetime Learning Module Access
                          </span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#02EF56] mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-300">
                            Lifetime Learning Community Access
                          </span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#02EF56] mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-300">
                            Private Access to Mentors(For Certified Students)
                          </span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#02EF56] mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-300">
                            One-Time Payment, Full Access Guaranteed
                          </span>
                        </div>
                      </div>
                    </div>

                  </>) : (
                    <>
                      {/* One-Time Payment Option for other courses */}
                      <div
                        className={`border rounded-lg w-[100%] p-4 cursor-pointer transition-all ${formData.paymentPlan === "one-time"
                          ? `border-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}] bg-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]/10`
                          : "border-gray-700 hover:border-gray-500"
                          }`}
                        onClick={() => updateFormData("paymentPlan", "one-time")}
                      >
                        <div className="text-center mb-3">
                          <h3 className="font-cyber text-white text-lg">
                            Pay once and unlock full access
                          </h3>
                          <div className="flex items-center justify-center gap-3 mt-2">
                            <span className="text-xl text-gray-400 line-through font-cyber">
                              {coursePrice} Birr
                            </span>
                            <p
                              className={`text-3xl font-cyber text-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]`}
                            >
                              {
                                Math.round(
                                  (coursePrice *
                                    (100 -
                                      (courseId === "gtcrt"
                                        ? discounts?.GTCRTDiscount || 0
                                        : courseId === "gtst"
                                          ? discounts?.GTSTDiscount || 0
                                          : courseId === "gtwss"
                                            ? discounts?.GTWSSDiscount || 0
                                            : 0))) /
                                  100
                                )
                              }{" "}
                              Birr
                            </p>
                          </div>
                          <div
                            className={`mt-1 inline-block bg-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]/20 text-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}] px-2 py-0.5 rounded text-xs font-medium`}
                          >
                            {
                              courseId === "gtcrt" ? (
                                <>
                                  {!discounts?.GTCRTDiscount
                                    ? "No Discount"
                                    : `${discounts.GTCRTDiscount}% Discount`}
                                </>
                              ) : courseId === "gtst" ? (
                                <>
                                  {!discounts?.GTSTDiscount
                                    ? "No Discount"
                                    : `${discounts.GTSTDiscount}% Discount`}
                                </>
                              ) : courseId === "gtwss" ? (
                                <>
                                  {!discounts?.GTWSSDiscount
                                    ? "No Discount"
                                    : `${discounts.GTWSSDiscount}% Discount`}
                                </>
                              ) : (
                                "No Discount"
                              )
                            }
                          </div>
                        </div>
                        <div className="space-y-2 mt-4">
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-[#02EF56] mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-300">
                              {courseid === "gtst"
                                ? "Full 4-Month Course Access"
                                : "Full 3-Month Course Access"}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-[#02EF56] mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-300">
                              Lifetime Class Record Access
                            </span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-[#02EF56] mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-300">
                              Lifetime Learning Module Access
                            </span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-[#02EF56] mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-300">
                              Lifetime Learning Community Access
                            </span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-[#02EF56] mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-300">
                              Private Access to Mentors
                            </span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-[#02EF56] mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-300">
                              One-Time Payment, Full Access Guaranteed
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Two-Time Payment Option for other courses */}
                      <div
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${formData.paymentPlan === "two-time"
                          ? `border-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}] bg-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]/10`
                          : "border-gray-700 hover:border-gray-500"
                          }`}
                        onClick={() => updateFormData("paymentPlan", "two-time")}
                      >
                        <div className="text-center mb-3">
                          <h3 className="font-cyber text-white text-lg">
                            Pay in two parts with limited features
                          </h3>
                          <p
                            className={`text-2xl font-cyber text-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}] mt-2`}
                          >
                            {coursePrice} Birr (each {Math.round(coursePrice / 2)} Birr)
                          </p>
                          <div className="mt-1 inline-block bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs font-medium">
                            No Discount
                          </div>
                        </div>
                        <div className="space-y-2 mt-4">
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-[#02EF56] mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-300">
                              {courseid === "gtst"
                                ? "2-Month Access Per Payment"
                                : "1.5-Month Access Per Payment"}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-[#02EF56] mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-300">
                              Private Access to Mentors
                            </span>
                          </div>
                          <div className="flex items-start">
                            <X className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-300">
                              Classroom Access Only While Paid
                            </span>
                          </div>
                          <div className="flex items-start">
                            <X className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-300">
                              Module Access Only While Paid
                            </span>
                          </div>
                          <div className="flex items-start">
                            <X className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-300">
                              Community Access Only While Paid
                            </span>
                          </div>
                          <div className="flex items-start">
                            <X className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-300">
                              Removed if Second Payment Not Made
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )
                }
              </div>




            </div>
            <div>
              <Label htmlFor="paymentMethod" className="mb-2 block">
                Payment Method *
              </Label>
              <Select
                onValueChange={(value) =>
                  updateFormData("paymentMethod", value)
                }
              >
                <SelectTrigger className={`input-cyber ${theme.border}`}>
                  <SelectValue placeholder="Select a payment method" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(bankAccounts).map(([key, bank]) => (
                    <SelectItem key={key} value={key}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formData.paymentMethod && (
              <div
                className={`border border-dashed border-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]/50 rounded-md p-4 bg-black/50`}
              >
                <div className="flex items-center mb-3">
                  <Image
                    src={
                      bankAccounts[
                        formData.paymentMethod as keyof typeof bankAccounts
                      ].logo
                    }
                    alt={`${bankAccounts[formData.paymentMethod as keyof typeof bankAccounts].name} logo`}
                    width={32}
                    height={32}
                    className="mr-3"
                  />
                  <h4 className="text-white font-semibold">
                    {
                      bankAccounts[
                        formData.paymentMethod as keyof typeof bankAccounts
                      ].name
                    }
                  </h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-gray-400 text-xs">Account Name:</p>
                      <p
                        className={`text-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}] font-mono text-sm ml-2`}
                      >
                        {
                          bankAccounts[
                            formData.paymentMethod as keyof typeof bankAccounts
                          ]?.accountName
                        }
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`h-6 w-6 p-0 text-gray-400 hover:text-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}] hover:bg-transparent`}
                      onClick={() =>
                        copyToClipboard(
                          bankAccounts[
                            formData.paymentMethod as keyof typeof bankAccounts
                          ]?.accountName,
                          `${formData.paymentMethod}-name`,
                        )
                      }
                    >
                      {copiedAccount === `${formData.paymentMethod}-name` ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-gray-400 text-xs">Account Number:</p>
                      <p
                        className={`text-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}] font-mono text-sm ml-2`}
                      >
                        {
                          bankAccounts[
                            formData.paymentMethod as keyof typeof bankAccounts
                          ]?.accountNumber
                        }
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`h-6 w-6 p-0 text-gray-400 hover:text-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}] hover:bg-transparent`}
                      onClick={() =>
                        copyToClipboard(
                          bankAccounts[
                            formData.paymentMethod as keyof typeof bankAccounts
                          ]?.accountNumber,
                          formData.paymentMethod,
                        )
                      }
                    >
                      {copiedAccount === formData.paymentMethod ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="couponCode">Coupon Code (optional)</Label>
              <Input
                id="couponCode"
                value={formData.couponCode}
                onChange={(e) => updateFormData("couponCode", e.target.value)}
                placeholder="Enter coupon code if you have one"
                className={`input-cyber ${theme.border} ${couponError ? "border-red-500" : couponSuccess ? "border-green-500" : ""}`}
              />
              {couponError && (
                <p className="text-red-500 text-xs mt-1">{couponError}</p>
              )}
              {couponSuccess && (
                <p className="text-green-500 text-xs mt-1">{couponSuccess}</p>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3
              className={`text-lg font-cyber ${theme.text ? "text-white" : "text-white"} mb-4`}
            >
              Payment Confirmation
            </h3>
            <div className="bg-blue-300 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-slate-800 mb-2">
                Payment Verification:
              </h4>
              <p className="text-sm text-slate-700">
                To complete your registration, please provide evidence of your
                payment. You can jupload a screenshot of your receipt, or
                provide a payment link.
              </p>
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="referenceNumber">Transaction Reference Number</Label>
              <Input
                id="referenceNumber"
                value={formData.referenceNumber}
                onChange={(e) => updateFormData("referenceNumber", e.target.value)}
                placeholder="e.g., FT2123456789"
                className={`input-cyber ${theme.border} placeholder:text-gray-400`}
              />
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="receiptUpload">Upload Payment Receipt</Label>
              <div
                className={`border border-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]/30 rounded-md p-4 bg-black/50`}
              >
                <div className="flex items-center justify-center w-full">
                  {formData.receiptScreenshot ? (
                    <div className="text-center">
                      <div
                        className={`flex items-center justify-center mb-2 text-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]`}
                      >
                        <CheckCircle className="h-6 w-6 mr-2" />
                        <span>Receipt uploaded</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">
                        {formData.receiptScreenshot.name}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className={`border-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]/30  hover:bg-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]/10 text-sm text-black`}
                        onClick={() =>
                          updateFormData("receiptScreenshot", null)
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label
                      htmlFor="receiptUpload"
                      className="flex flex-col items-center justify-center w-full cursor-pointer"
                    >
                      <Upload
                        className={`h-8 w-8 text-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}] mb-2`}
                      />
                      <span className="text-gray-300 mb-1">
                        Drop file here or click to upload
                      </span>
                      <span className="text-gray-500 text-xs">
                        (Max size: 5MB, Formats: JPG, PNG, PDF)
                      </span>
                      <input
                        id="receiptUpload"
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                      />
                      {isExtracting && (
                        <Loader2
                          className={`h-5 w-5 animate-spin text-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}] mt-2`}
                        />
                      )}
                    </label>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentLink">Payment Confirmation Link</Label>
              <Input
                id="paymentLink"
                value={formData.paymentLink}
                onChange={(e) => updateFormData("paymentLink", e.target.value)}
                placeholder="e.g., https://payment-provider.com/confirmation/abc123"
                className={`input-cyber ${theme.border} placeholder:text-gray-400`}
              />
            </div>
            {formData.couponCode && (
              <div
                className={`p-3 border border-dashed border-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]/50 rounded-md bg-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]/10 text-sm text-white`}
              >
                <strong>Coupon applied:</strong> {formData.couponCode}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };
  // console.log("theme",theme.primary)
  return (
    <section className="py-12 relative">
      <div className={`${courseId == 'gtcrt' ? "max-w-7xl" : "max-w-4xl"} mx-auto px-4 sm:px-6 lg:px-8`}>
        <Card
          className={`card-cyber hover-lift border border-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]/30 overflow-hidden`}
        >
          <CardHeader className="pb-2">
            <CardTitle
              className={`text-2xl font-cyber ${theme.text ? "text-white" : "text-white"}`}
            >
              {isRegistrationComplete
                ? "REGISTRATION COMPLETE"
                : "COURSE REGISTRATION"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isRegistrationComplete ? (
              <div className="py-8 text-center">
                <div className="w-20 h-20 bg-[#02EF56]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-[#02EF56]" />
                </div>

                <h2 className="text-2xl font-cyber text-white mb-4">
                  Registration Successful!
                </h2>

                <div className="max-w-2xl mx-auto">
                  <p className="text-gray-300 mb-6">
                    Thank you for registering for{" "}
                    <span className="text-[#02EF56] font-medium">
                      {courseTitle}
                    </span>
                    . Your payment is being verified.
                  </p>

                  <div className="bg-[#02EF56]/10 border border-[#02EF56]/30 rounded-lg p-6 mb-6">
                    <h3 className="text-white text-lg font-cyber mb-3">
                      Next Steps:
                    </h3>
                    <ol className="text-left space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="bg-[#02EF56]/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[#02EF56] text-sm font-bold">
                            1
                          </span>
                        </div>
                        <p className="text-gray-300">
                          <span className="font-medium text-white">
                            Check your email within the next 3 hours.
                          </span>{" "}
                          We'll send you confirmation of your registration with
                          important course details after we verify your payment.
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-[#02EF56]/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[#02EF56] text-sm font-bold">
                            2
                          </span>
                        </div>
                        <p className="text-gray-300">
                          <span className="font-medium text-white">
                            Join our Telegram group.
                          </span>{" "}
                          Your email will include a one-time link to join our
                          private Telegram group, which will{" "}
                          <span className="text-[#02EF56]">
                            expire in 72 hours
                          </span>
                          .
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-[#02EF56]/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[#02EF56] text-sm font-bold">
                            3
                          </span>
                        </div>
                        <p className="text-gray-300">
                          <span className="font-medium text-white">
                            Prepare for your journey.
                          </span>{" "}
                          Get ready for an exciting learning experience in
                          cybersecurity with Geez Security.
                        </p>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
                    <h4 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#02EF56]"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 16v-4"></path>
                        <path d="M12 8h.01"></path>
                      </svg>
                      Having issues?
                    </h4>
                    <p className="text-gray-300 text-sm mb-2">
                      If you don't receive an email within 3 hours or encounter
                      any problems, please contact us:
                    </p>
                    <div className="flex flex-col space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-[#02EF56]"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <span className="text-white">
                          Phone:{" "}
                          <a
                            href="tel:+251953537820"
                            className="text-[#02EF56] hover:underline"
                          >
                            +251 953 537 820
                          </a>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-[#02EF56]"
                        >
                          <rect
                            x="2"
                            y="4"
                            width="20"
                            height="16"
                            rx="2"
                          ></rect>
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </svg>
                        <span className="text-white">
                          Email:{" "}
                          <a
                            href="mailto:info@geezsecurity.com"
                            className="text-[#02EF56] hover:underline"
                          >
                            info@geezsecurity.com
                          </a>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-[#02EF56]"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <span className="text-white">
                          Telegram:{" "}
                          <a
                            href="https://t.me/geezsecsupport"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#02EF56] hover:underline"
                          >
                            @geezsecsupport
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button asChild className="btn-cyber font-cyber">
                    <a href="/">RETURN TO HOME</a>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="relative mb-6">
                  <div className="h-1.5 bg-black/40 w-full rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}] rounded-full neon-glow transition-all`}
                      style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1.5 font-cyber">
                    <span
                      className={
                        currentStep >= 1
                          ? `text-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]`
                          : ""
                      }
                    >
                      BASIC INFO
                    </span>
                    <span
                      className={
                        currentStep >= 2
                          ? `text-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]`
                          : ""
                      }
                    >
                      BACKGROUND
                    </span>
                    <span
                      className={
                        currentStep >= 3
                          ? `text-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]`
                          : ""
                      }
                    >
                      PAYMENT
                    </span>
                    <span
                      className={
                        currentStep >= 4
                          ? `text-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]`
                          : ""
                      }
                    >
                      CONFIRMATION
                    </span>
                  </div>
                </div>
                <form>{renderStep()}</form>
                <div className="flex justify-between mt-8">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      className={`border-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]/30 text-gray-300 font-cyber btn-cyber ${theme.button}`}
                      onClick={prevStep}
                    >
                      PREVIOUS
                    </Button>
                  )}
                  {currentStep < totalSteps ? (
                    <Button
                      className={`btn-cyber ml-auto font-cyber ${theme.button}`}
                      onClick={nextStep}
                    >
                      NEXT STEP
                    </Button>
                  ) : (
                    <Button
                      className={`btn-cyber ml-auto font-cyber ${theme.button}`}
                      onClick={handleSubmit}
                      disabled={isSubmitting || isExtracting}
                    >
                      {isSubmitting || isExtracting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "SUBMIT REGISTRATION"
                      )}
                    </Button>
                  )}
                </div>
                <div
                  className={`border-t border-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]/20 mt-8 pt-4 flex justify-between items-center`}
                >
                  <div>
                    <h4 className="text-white font-cyber mb-1">
                      {courseTitle}
                    </h4>
                    {/* <div className="flex items-center text-gray-400 text-sm">
                      <Clock
                        color={
                          theme.name === "gtst" ? theme.primary : "#FF6B00"
                        }
                        className={`h-3 w-3 text-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}] mr-1`}
                      />
                      <span>Registration ends in: </span>
                      <div className="ml-1 flex space-x-1 text-white">
                        <div
                          className={`text-xs bg-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]/10 border border-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]/30 rounded px-1.5 py-0.5 font-mono`}
                        >
                          {timeLeft.days.toString().padStart(2, "0")}d
                        </div>
                        <div
                          className={`text-xs bg-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]/10 border border-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]/30 rounded px-1.5 py-0.5 font-mono`}
                        >
                          {timeLeft.hours.toString().padStart(2, "0")}h
                        </div>
                        <div
                          className={`text-xs bg-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]/10 border border-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]/30 rounded px-1.5 py-0.5 font-mono`}
                        >
                          {timeLeft.minutes.toString().padStart(2, "0")}m
                        </div>
                      </div>
                    </div> */}
                  </div>
                  {/* footer discount */}
                  <div
                    className={`text-sm sm:text-xl font-cyber text-[${theme.name === "gtst" ? theme.primary : "#FF6B00"}]`}
                  >
                    {courseId === "gtwss" ? discounts?.GTWSSDiscount : courseId === "gtst" ? discounts?.GTSTDiscount : discounts?.gtcrt}% Off
                    {/* {getDisplayPrice()} */}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}