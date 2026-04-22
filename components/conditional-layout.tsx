'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdminPage = pathname.startsWith('/geezadmin')

    useEffect(() => {
        const htmlElement = document.documentElement;
        const bodyElement = document.body;

        if (isAdminPage) {
            htmlElement.classList.add('dark');
            bodyElement.classList.add('cyber-bg', 'cyber-grid', 'text-foreground');
        } else {
            // Ensure classes are removed when navigating away from admin pages
            htmlElement.classList.remove('dark');
            bodyElement.classList.remove('cyber-bg', 'cyber-grid', 'text-foreground');
        }

        // Cleanup function for when the component unmounts
        return () => {
            htmlElement.classList.remove('dark');
            bodyElement.classList.remove('cyber-bg', 'cyber-grid', 'text-foreground');
        };
    }, [isAdminPage]);

    return (
        <>
            {!isAdminPage && <Navigation />}
            {children}
            {!isAdminPage && <Footer />}
        </>
    )
}
