'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types';
import apiClient from '@/app/lib/api-client';
import Loader from '@/components/admin/loader';
import { Calendar } from 'lucide-react';

const DashboardFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const courseId = searchParams.get('courseId') ?? ''; 
  const fromDate = searchParams.get('fromDate') ?? '';

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <label htmlFor="course-filter" className="block text-sm font-medium text-gray-400 mb-2">Filter by Course</label>
        <select
          id="course-filter"
          value={courseId}
          onChange={(e) => updateFilters('courseId', e.target.value)}
          className="w-full bg-gray-800 border border-geez-green/50 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-geez-green focus:border-geez-green"
        >
          <option value="">All Courses</option>
          <option value="1">Geez Tech Security Tester (GTST)</option>
          <option value="2">GeezTech Web Security Specialist (GTWSS)</option>
          <option value="3">Geez Tech Certified Red Teamer (GTCRT)</option>
        </select>
      </div>
      
      <div className="flex-1">
        <label htmlFor="round-date" className="block text-sm font-medium text-gray-400 mb-2">
          <Calendar className="inline w-4 h-4 mr-1" />
          Round Start Date (filter from)
        </label>
        <input
          type="date"
          id="round-date"
          value={fromDate}
          onChange={(e) => updateFilters('fromDate', e.target.value)}
          className="w-full bg-gray-800 border border-geez-green/50 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-geez-green focus:border-geez-green [color-scheme:dark]"
        />
        {fromDate && (
          <button
            onClick={() => updateFilters('fromDate', '')}
            className="mt-1 text-xs text-geez-green hover:text-geez-green/80 underline"
          >
            Clear date filter
          </button>
        )}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // On initial mount, if there's no courseId, set the default and prevent further execution.
    if (isInitialLoad && !searchParams.has('courseId')) {
      setIsInitialLoad(false);
      router.replace(`${pathname}?courseId=2`);
      return;
    }

    const fetchStats = async () => {
      const courseId = searchParams.get('courseId');
      const fromDate = searchParams.get('fromDate');
      
      // A null courseId can happen briefly during navigation; we don't fetch in that case.
      if (courseId === null) return;

      setStats(null); // Show loader
      
      // Build URL with both courseId and fromDate filters
      const params = new URLSearchParams();
      if (courseId) params.set('courseId', courseId);
      if (fromDate) params.set('fromDate', fromDate);
      
      const url = params.toString() 
        ? `/admin/dashboard/stats?${params.toString()}`
        : '/admin/dashboard/stats';

      try {
        const response = await apiClient.get(url);
        setStats(response.data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    fetchStats();
  }, [searchParams, pathname, router, isInitialLoad]);

  if (error) {
    return <div className="text-red-500 text-center p-8">Error: {error}</div>;
  }

  if (!stats) {
    return <Loader />;
  }

  const formattedEducationData = stats.registrationsByEducation.map(item => ({
    name: item.education,
    count: item._count.education,
  }));

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-cyber">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold neon-text">Admin Dashboard</h1>
      </div>
      <DashboardFilters />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="card-cyber hover-lift">
          <CardHeader>
            <CardTitle className="text-geez-green">Total Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.totalRegistrations}</p>
          </CardContent>
        </Card>
        <Card className="card-cyber hover-lift">
          <CardHeader>
            <CardTitle className="text-geez-green">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.pendingRegistrations}</p>
          </CardContent>
        </Card>
        <Card className="card-cyber hover-lift">
          <CardHeader>
            <CardTitle className="text-geez-green">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.totalRevenue.toLocaleString()} birr</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="text-geez-green">Registrations Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.registrationsByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(2, 239, 86, 0.3)" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #02ef56' }} />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#02ef56" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-cyber">
          <CardHeader>
            <CardTitle className="text-geez-green">Registrations by Education</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formattedEducationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(2, 239, 86, 0.3)" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #02ef56' }} />
                    <Legend />
                    <Bar dataKey="count" fill="#02ef56" />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
