"use client"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react";
import DiscountModal from "@/components/admin/discount-adding-modal";
import { toast, Toaster } from "react-hot-toast";

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loadingState, setLoading] = useState(true);
    // Tracks which specific course button is loading
    const [processingId, setProcessingId] = useState<number | null>(null);

    const fetchCourses = async () => {
        try {
            const RequestServer = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const APIResponse = await RequestServer.json();
            setCourses(APIResponse.data);
        } catch (error) {
            toast.error("Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const OpenDiscountModal = () => {
        const FindModalContainer = document.querySelector('.discount-modal-container') as HTMLElement;
        if (FindModalContainer) {
            FindModalContainer.classList.remove('hidden');
            FindModalContainer.classList.add('fixed');
        }
    }

    const CourseStatus = async (id: number, currentStatus: string) => {
        const newStatus = currentStatus === "ACTIVE" ? "CLOSED" : "ACTIVE";
        const Token = localStorage.getItem('adminToken');

        setProcessingId(id); // Start loading for this specific ID

        try {
            const EditCourseStaus = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminToken: Token,
                    courseId: id,
                    status: newStatus
                })
            });

            const APIResponse = await EditCourseStaus.json();

            if (APIResponse.success) {
                toast.success(`Course ${newStatus.toLowerCase()} successfully`);
                await fetchCourses(); // Refresh list to show updated status
            } else {
                toast.error(APIResponse.message || "Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setProcessingId(null); // Stop loading
        }
    }

    if (loadingState) {
        return (
            <div className="flex flex-col items-center justify-center h-scree">
                <Loader2 className="h-12 w-12 text-green-500 animate-spin" />
                <p className="mt-4 text-gray-400">Loading data...</p>
            </div>
        )
    }

    return (
        <div>
            <Toaster position="top-center" />
            <DiscountModal />

            <div className="header flex items-center justify-between">
                <div className="header-text-contaier">
                    <h1 className="text-3xl font-bold text-white">
                        <span className="text-green-400">Courses</span> Management
                    </h1>
                    <p className="pl-[10px] pt-[5px] text-zinc-400">Manage your courses here.</p>
                </div>
                <div>
                    <button
                        onClick={OpenDiscountModal}
                        className="bg-green-500 hover:bg-green-400 text-black font-bold py-2 px-6 rounded-lg transition-colors duration-200 text-sm uppercase tracking-tight"
                    >
                        Add Discount
                    </button>
                </div>
            </div>

            <div className="p-6 min-h-screen mt-[40px]">
                <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                    Current Courses
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-[40px]">
                    {courses.map((course: any) => (
                        <div
                            key={course.id}
                            className="group relative bg-zinc-900 border border-zinc-800 rounded-xl p-5 transition-all duration-300 hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-[10px] uppercase tracking-widest font-mono px-2 py-1 border rounded ${course.status === 'ACTIVE'
                                    ? 'bg-zinc-800 text-green-400 border-green-500/20'
                                    : 'bg-zinc-800 text-red-400 border-red-500/20'
                                    }`}>
                                    {course.status}
                                </span>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-zinc-400 text-xs font-medium uppercase mb-1">Course Name</h3>
                                <p className="text-white text-lg font-semibold truncate">
                                    {course.slug.replace(/-/g, ' ').toUpperCase()}
                                </p>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="text-zinc-400 text-xs font-medium uppercase mb-1">Investment</h3>
                                    <p className="text-2xl font-mono font-bold text-white">
                                        ${course.price.toFixed(2)}
                                    </p>
                                </div>

                                <button
                                    disabled={processingId === course.id}
                                    onClick={() => CourseStatus(course.id, course.status)}
                                    className={`flex items-center gap-2 min-w-[100px] justify-center ${course.status === 'ACTIVE'
                                        ? 'bg-green-600 hover:bg-green-500'
                                        : 'bg-zinc-700 hover:bg-zinc-600'
                                        } text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-xs uppercase tracking-tight disabled:opacity-50`}
                                >
                                    {processingId === course.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        course.status === 'ACTIVE' ? 'Deactivate' : 'Activate'
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}