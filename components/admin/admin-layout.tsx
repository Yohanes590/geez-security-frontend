'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Ticket, User, LogOut, BookAIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/geezadmin/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/geezadmin/registrations', icon: User, label: 'Registrations' },
  { href: '/geezadmin/coupons', icon: Ticket, label: 'Coupons' },
  { href: '/geezadmin/courses', icon: BookAIcon, label: 'Courses' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/geezadmin/login');
  };

  return (
    <div className="font-cyber">
      <aside className="fixed top-0 left-0 h-full w-64 bg-black p-4 flex flex-col justify-between border-r border-geez-green/20 z-10">
        <div>
          <div className="mb-12 text-center">
            <Link href="/" className="flex items-center justify-center space-x-3 group">
              <span className="font-cyber font-bold text-3xl text-white neon-text">GEEZ</span>
              <span className="font-cyber text-lg text-white font-semibold tracking-wider">ADMIN</span>
            </Link>
          </div>
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-all duration-300 ${isActive
                    ? 'bg-geez-green/20 text-geez-green neon-glow'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}>
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
        <Button variant="outline" className="w-full neon-border text-gray-300 hover:bg-gray-800 hover:text-white" onClick={handleLogout}>
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </aside>
      <main className="ml-64 p-8 h-screen overflow-auto bg-gray-800">
        {children}
      </main>
    </div>
  );
}
