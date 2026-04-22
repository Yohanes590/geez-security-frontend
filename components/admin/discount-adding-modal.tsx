"use client"
import { X } from "lucide-react";
import { useEffect, useState } from "react"
import { toast, Toaster } from 'react-hot-toast';

export default function DiscountModal() {
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [discountPercentage, setDiscountPercentage] = useState<number | string>('');

    useEffect(() => {
        const ReadingCourse = async () => {
            try {
                const RequestServer = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                const APIResponse = await RequestServer.json();
                setCourses(APIResponse.data);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            }
        }
        ReadingCourse()
    }, [])

    const CloseDiscountModal = () => {
        const FindModalContainer = document.querySelector('.discount-modal-container') as HTMLElement;
        FindModalContainer.classList.remove('fixed');
        FindModalContainer.classList.add('hidden');
    }

    const addingDiscount = async () => {
        if (!discountPercentage || selectedCourseId === '') {
            toast.error('Please select a course and enter a discount percentage.');
            return;
        };

        const AdminToken = localStorage.getItem('adminToken');

        const loadingToast = toast.loading('Updating discount...');

        try {
            const SendDataToServer = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/discount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    adminToken: AdminToken,
                    courseId: selectedCourseId,
                    discountPercentage: Number(discountPercentage)
                })
            })

            const ServerAPIResponse = await SendDataToServer.json();

            if (ServerAPIResponse.success) {
                toast.success('Discount applied successfully!', { id: loadingToast });
                setDiscountPercentage('');
                setSelectedCourseId('');
                CloseDiscountModal();
            } else {
                toast.error(ServerAPIResponse.message || 'Failed to update', { id: loadingToast });
            }
        } catch (error) {
            toast.error('Network error. Please try again.', { id: loadingToast });
        }
    }



    return (
        <>
            <Toaster />
            <div className="discount-modal-container hidden inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">

                    {/* Header Section */}
                    <div className="relative p-8 pb-6 border-b border-zinc-900">
                        <div className="absolute top-0 right-0 p-4">
                            <button onClick={CloseDiscountModal} className="text-zinc-500 hover:text-white transition-colors">
                                <X />
                            </button>
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            Add <span className="text-green-500">Discount</span>
                        </h1>
                        <p className="text-zinc-400 text-sm mt-1">
                            Configure promotional pricing for your curriculum.
                        </p>
                    </div>

                    {/* Form Section */}
                    <div className="p-8 space-y-6">

                        {/* Course Selection */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest font-semibold text-zinc-500 ml-1">
                                Target Course
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedCourseId}
                                    onChange={(e) => setSelectedCourseId(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all cursor-pointer"
                                >
                                    <option value="">Select a course</option>
                                    {courses.map((course: any) => (
                                        <option key={course.id} value={course.id} className="bg-zinc-900 text-white">
                                            {course.slug?.replace(/-/g, ' ') || `Course ID: ${course.id}`}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Discount Input */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest font-semibold text-zinc-500 ml-1">
                                Discount Percentage
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={discountPercentage}
                                    // FIXED: Added function call with target value
                                    onChange={(e) => setDiscountPercentage(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all placeholder:text-zinc-700"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 font-mono font-bold">
                                    %
                                </span>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={addingDiscount}
                            className="w-full group relative bg-green-500 hover:bg-green-400 text-black font-extrabold py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.2)] active:scale-[0.98]"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Apply Discount
                                <svg className="group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}