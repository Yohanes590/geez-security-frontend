import { redirect } from 'next/navigation'

// This course page is currently disabled - redirect to main course page
export default function GtwssCoursePage() {
  redirect('/course/2') // Redirect to GTWSS via dynamic route
}
