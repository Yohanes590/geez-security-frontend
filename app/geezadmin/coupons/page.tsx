'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coupon } from '@/types';
import apiClient from '@/app/lib/api-client';
import Loader from '@/components/admin/loader';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2 } from 'lucide-react';

const CouponManagementPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCoupon, setNewCoupon] = useState({ code: '', discountPercent: 10, maxUses: 100, expiresAt: '' });
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);
  const { toast } = useToast();

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/admin/coupons');
      setCoupons(response.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async () => {
    try {
      await apiClient.post('/admin/coupons', { ...newCoupon, expiresAt: newCoupon.expiresAt || null });
      fetchCoupons();
      setCreateDialogOpen(false);
      toast({ title: 'Success', description: 'Coupon created successfully.' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to create coupon.' });
    }
  };

  const handleUpdateCoupon = async () => {
    if (!editingCoupon) return;
    try {
      await apiClient.put(`/admin/coupons/${editingCoupon.id}`, { ...editingCoupon, expiresAt: editingCoupon.expiresAt || null });
      fetchCoupons();
      setEditDialogOpen(false);
      toast({ title: 'Success', description: 'Coupon updated successfully.' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update coupon.' });
    }
  };

  const handleDeleteCoupon = async () => {
    if (!couponToDelete) return;
    try {
      await apiClient.delete(`/admin/coupons/${couponToDelete.id}`);
      fetchCoupons();
      setDeleteDialogOpen(false);
      toast({ title: 'Success', description: 'Coupon deleted successfully.' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete coupon.' });
    }
  };

  const openEditDialog = (coupon: Coupon) => {
    setEditingCoupon({ ...coupon, expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '' });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (coupon: Coupon) => {
    setCouponToDelete(coupon);
    setDeleteDialogOpen(true);
  };

  if (error) return <div className="text-red-500 text-center p-8">Error: {error}</div>;
  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold neon-text">Coupon Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-cyber">Create Coupon</Button>
          </DialogTrigger>
          <DialogContent className="card-cyber text-white">
            <DialogHeader><DialogTitle className="text-geez-green">Create New Coupon</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <Label htmlFor="code">Code</Label>
              <Input id="code" value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })} className="input-cyber" />
              <Label htmlFor="discount">Discount (%)</Label>
              <Input id="discount" type="number" value={newCoupon.discountPercent} onChange={(e) => setNewCoupon({ ...newCoupon, discountPercent: parseInt(e.target.value) })} className="input-cyber" />
              <Label htmlFor="maxUses">Max Uses</Label>
              <Input id="maxUses" type="number" value={newCoupon.maxUses} onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: parseInt(e.target.value) })} className="input-cyber" />
              <Label htmlFor="expiresAt">Expires At</Label>
              <Input id="expiresAt" type="date" value={newCoupon.expiresAt} onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })} className="input-cyber" />
            </div>
            <DialogFooter>
              <Button onClick={handleCreateCoupon} className="btn-cyber w-full">Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      {editingCoupon && (
        <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="card-cyber text-white">
            <DialogHeader><DialogTitle className="text-geez-green">Edit Coupon</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
               <Label>Code</Label>
               <Input value={editingCoupon.code} onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value })} className="input-cyber" />
               <Label>Discount (%)</Label>
               <Input type="number" value={editingCoupon.discountPercent} onChange={(e) => setEditingCoupon({ ...editingCoupon, discountPercent: parseInt(e.target.value) })} className="input-cyber" />
               <Label>Max Uses</Label>
               <Input type="number" value={editingCoupon.maxUses} onChange={(e) => setEditingCoupon({ ...editingCoupon, maxUses: parseInt(e.target.value) })} className="input-cyber" />
               <Label>Expires At</Label>
               <Input type="date" value={editingCoupon.expiresAt || ''} onChange={(e) => setEditingCoupon({ ...editingCoupon, expiresAt: e.target.value })} className="input-cyber" />
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateCoupon} className="btn-cyber">Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {couponToDelete && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="card-cyber text-white">
            <DialogHeader><DialogTitle className="text-geez-green">Confirm Deletion</DialogTitle></DialogHeader>
            <p>Are you sure you want to delete the coupon "{couponToDelete.code}"? This action cannot be undone.</p>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={handleDeleteCoupon} variant="destructive">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Card className="card-cyber">
        <CardHeader><CardTitle className="text-geez-green">All Coupons</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-geez-green">Code</TableHead>
                <TableHead className="text-geez-green">Discount</TableHead>
                <TableHead className="text-geez-green">Usage</TableHead>
                <TableHead className="text-geez-green">Expires At</TableHead>
                <TableHead className="text-geez-green">Status</TableHead>
                <TableHead className="text-geez-green">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>{coupon.code}</TableCell>
                  <TableCell>{coupon.discountPercent}%</TableCell>
                  <TableCell>{coupon.currentUses} / {coupon.maxUses}</TableCell>
                  <TableCell>{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'Never'}</TableCell>
                  <TableCell><Badge variant={coupon.isActive ? 'default' : 'destructive'}>{coupon.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(coupon)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => openDeleteDialog(coupon)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CouponManagementPage;
