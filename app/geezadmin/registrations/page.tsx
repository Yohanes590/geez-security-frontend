'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/app/lib/api-client';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Trash2, ChevronDown, Calendar, X } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton";
import type { Registration, Course } from '@/app/lib/types';

const AdminRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState('all');
  const [fromDate, setFromDate] = useState(''); // For round filtering
  const [verifying, setVerifying] = useState<Record<number, boolean>>({});
  const [deleting, setDeleting] = useState<Record<number, boolean>>({});
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [registrationToDelete, setRegistrationToDelete] = useState<Registration | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Fetch registrations when filters change
  const fetchRegistrations = async (courseId?: string, dateFrom?: string) => {
    try {
      const params = new URLSearchParams();
      if (courseId && courseId !== 'all') params.set('courseId', courseId);
      if (dateFrom) params.set('fromDate', dateFrom);
      
      const url = params.toString() 
        ? `/admin/registrations?${params.toString()}`
        : '/admin/registrations';
        
      const response = await apiClient.get(url);
      setRegistrations(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/geezadmin/login');
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load registrations.",
        });
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/geezadmin/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [regsResponse, coursesResponse] = await Promise.all([
          apiClient.get('/admin/registrations'),
          apiClient.get('/courses') 
        ]);
        setRegistrations(Array.isArray(regsResponse.data.data) ? regsResponse.data.data : []);
        const courseData = Array.isArray(coursesResponse.data.data) ? coursesResponse.data.data : [];
        setCourses(courseData);

        const defaultCourse = courseData.find((c: Course) => c.title === "Geez Tech Security Tester (GTST)");
        if (defaultCourse) {
          setSelectedCourse(defaultCourse.id.toString());
        }

      } catch (err: any) {
        if (err.response?.status === 401) {
          router.push('/geezadmin/login');
        } else {
          setError('Failed to fetch data.');
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load registration or course data.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, toast]);
  
  // Refetch when date filter changes
  useEffect(() => {
    if (!loading) {
      fetchRegistrations(selectedCourse, fromDate);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate]);

  const handleVerify = async (id: number) => {
    if (!window.confirm('Are you sure you want to verify this registration?')) {
      return;
    }

    setVerifying(prev => ({ ...prev, [id]: true }));
    try {
      const response = await apiClient.post(`/admin/registrations/${id}/verify`);
      setRegistrations(prev =>
        prev.map(reg => (reg.id === id ? { ...reg, status: 'PAYMENT_VERIFIED' } : reg))
      );
      toast({
        title: "Success",
        description: response.data.message || "Registration verified successfully.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: err.response?.data?.message || "An error occurred.",
      });
    } finally {
      setVerifying(prev => ({ ...prev, [id]: false }));
    }
  };

  const openDeleteDialog = (registration: Registration) => {
    setRegistrationToDelete(registration);
    setDeleteDialogOpen(true);
  };

  const handleDeleteRegistration = async () => {
    if (!registrationToDelete) return;

    const registrationId = registrationToDelete.id;
    setDeleting(prev => ({ ...prev, [registrationId]: true }));

    try {
      await apiClient.delete(`/admin/registrations/${registrationId}`);
      setRegistrations(prev => prev.filter(reg => reg.id !== registrationId));
      toast({ title: 'Success', description: 'Registration deleted successfully.' });
      setDeleteDialogOpen(false);
      setRegistrationToDelete(null);
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: err.response?.data?.message || 'An error occurred.',
      });
    } finally {
      setDeleting(prev => ({ ...prev, [registrationId]: false }));
    }
  };


  const filteredRegistrations = useMemo(() => {
    if (!registrations) return [];
    // console.log("regs ", )
    const filtered = registrations.filter(reg => {
      const statusMatch = selectedStatus === 'all' || reg.status === selectedStatus;
      const courseMatch = selectedCourse === 'all' || reg.course?.id?.toString() === selectedCourse;
      const paymentPlanMatch = selectedPaymentPlan === 'all' || reg.paymentPlan === selectedPaymentPlan;
      return statusMatch && courseMatch && paymentPlanMatch;
    });

    return filtered.sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [registrations, selectedStatus, selectedCourse, selectedPaymentPlan]);

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  return (
    <>
      <Card className="card-cyber">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-geez-green">Registration Management</CardTitle>
              <CardDescription className="text-gray-400">View and manage course registrations.</CardDescription>
            </div>
          </div>
          
          {/* Round Date Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-geez-green/20">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-geez-green" />
              <span className="text-sm text-gray-300 font-medium">Filter by Round:</span>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-gray-900 border border-geez-green/50 rounded-md py-1.5 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-geez-green focus:border-geez-green [color-scheme:dark]"
                placeholder="Select start date"
              />
              {fromDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFromDate('')}
                  className="text-gray-400 hover:text-white hover:bg-gray-700 p-1 h-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            {fromDate && (
              <span className="text-xs text-geez-green">
                Showing registrations from {new Date(fromDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg border-geez-green/20">
            {loading ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-b-geez-green/20">
                    <TableHead className="text-geez-green">User</TableHead>
                    <TableHead className="text-geez-green">Course</TableHead>
                    <TableHead className="text-geez-green">Status</TableHead>
                    <TableHead className="text-geez-green">Payment Plan</TableHead>
                    <TableHead className="text-geez-green">Coupon</TableHead>
                    <TableHead className="text-geez-green">Payment</TableHead>
                    <TableHead className="text-geez-green">Receipt</TableHead>
                    <TableHead className="text-geez-green">Date</TableHead>
                    <TableHead className="text-geez-green">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-b-geez-green/10">
                      <TableCell><Skeleton className="h-10 w-full bg-gray-800/50" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full bg-gray-800/50" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full bg-gray-800/50" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full bg-gray-800/50" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full bg-gray-800/50" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full bg-gray-800/50" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full bg-gray-800/50" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full bg-gray-800/50" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full bg-gray-800/50" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b-geez-green/20 hover:bg-black">
                    <TableHead>User</TableHead>
                    <TableHead>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="px-2 py-1 h-auto text-geez-green">
                            Course <ChevronDown className="w-4 h-4 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuRadioGroup value={selectedCourse} onValueChange={setSelectedCourse}>
                            <DropdownMenuRadioItem value="all">All Courses</DropdownMenuRadioItem>
                            {courses.map(course => (
                              <DropdownMenuRadioItem key={course.id} value={course.id.toString()}>
                                {course.title}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>
                    <TableHead>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="px-2 py-1 h-auto text-geez-green">
                            Status <ChevronDown className="w-4 h-4 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuRadioGroup value={selectedStatus} onValueChange={setSelectedStatus}>
                            <DropdownMenuRadioItem value="all">All Statuses</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="PENDING">Pending</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="PAYMENT_VERIFIED">Verified</DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>
                    <TableHead>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="px-2 py-1 h-auto text-geez-green">
                            Payment Plan <ChevronDown className="w-4 h-4 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuRadioGroup value={selectedPaymentPlan} onValueChange={setSelectedPaymentPlan}>
                            <DropdownMenuRadioItem value="all">All Plans</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="ONE_TIME">Full Payment</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="TWO_TIME">Two-Time Payment</DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>
                    <TableHead>Coupon</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Receipt</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.length > 0 ? (
                    filteredRegistrations.map(reg => (
                      <TableRow key={reg.id} className="border-b-gray-800 hover:bg-gray-900/50">
                        <TableCell>
                          <div className="font-medium text-gray-200">{reg.user ? `${reg.user.firstName} ${reg.user.lastName}` : 'N/A'}</div>
                          <div className="text-sm text-muted-foreground">{reg.user?.email ?? 'N/A'}</div>
                        </TableCell>
                        <TableCell className="text-gray-300">{reg.course?.title ?? 'N/A'}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={reg.status === 'PENDING' ? 'secondary' : 'default'} 
                            className={reg.status === 'PENDING' ? 'bg-yellow-600/20 text-yellow-300' : 'bg-green-600/20 text-green-300'}
                          >
                            {reg.status ?? 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">{reg.paymentPlan ?? 'N/A'}</TableCell>
                        <TableCell className="text-gray-300">{reg.coupon?.code ?? 'N/A'}</TableCell>
                        <TableCell>
                          <div className="text-gray-300">{reg.paymentMethod} - {reg.finalPrice} Birr</div>
                          <div className="text-xs text-muted-foreground">Ref: {reg.referenceNumber}</div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {reg.receiptImageUrl ? (
                            <a 
                              href={reg.receiptImageUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-geez-green hover:underline"
                            >
                              View Receipt
                            </a>
                          ) : reg.paymentLink ? (
                            <a 
                              href={reg.paymentLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-geez-green hover:underline"
                            >
                              View Payment Link
                            </a> 
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-300">{reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell className="text-right flex items-center gap-2">
                          {reg.status === 'PENDING' && typeof reg.id === 'number' && (
                            <Button
                              className="btn-cyber"
                              onClick={() => handleVerify(reg.id!)}
                              size="sm"
                              disabled={verifying[reg.id!]}
                            >
                              {verifying[reg.id!] ? 'Verifying...' : 'Verify'}
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => openDeleteDialog(reg)}
                            disabled={deleting[reg.id!]}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center h-24 text-gray-400">
                        No registrations found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="card-cyber text-white">
          {registrationToDelete && (
            <>
              <DialogHeader><DialogTitle className="text-geez-green">Confirm Deletion</DialogTitle></DialogHeader>
              <p>
                Are you sure you want to delete the registration for "{registrationToDelete.user ? `${registrationToDelete.user.firstName} ${registrationToDelete.user.lastName}` : 'this user'}"? 
                This action cannot be undone.
              </p>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button 
                  onClick={handleDeleteRegistration}
                  variant="destructive" 
                  disabled={deleting[registrationToDelete.id] ?? false}
                >
                  {deleting[registrationToDelete.id] ? 'Deleting...' : 'Delete'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminRegistrationsPage;
