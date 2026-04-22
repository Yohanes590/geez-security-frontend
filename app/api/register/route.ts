import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const closedCourseIds = new Set(["1", "2", "gtst", "gtwss"])
    if (closedCourseIds.has(String(data.courseId).toLowerCase())) {
      return NextResponse.json(
        { success: false, message: "Registration is currently closed for this course" },
        { status: 403 }
      )
    }

    // Insert registration data into database
    const result = await sql`
      INSERT INTO registrations (
        course_id,
        course_title,
        course_price,
        first_name,
        last_name,
        email,
        phone,  
        date_of_birth,
        education,
        experience,
        motivation,
        programming_languages,
        operating_system,
        networking_knowledge,
        payment_method,
        account_holder_name,
        account_number,
        reference_number,
        payment_link,
        coupon_code,
        extracted_data,
        status,
        created_at
      ) VALUES (
        ${data.courseId},
        ${data.courseTitle},
        ${data.coursePrice},
        ${data.firstName},
        ${data.lastName},
        ${data.email},
        ${data.phone},
        ${data.dateOfBirth},
        ${data.education},
        ${data.experience},
        ${data.motivation},
        ${data.programmingLanguages || ""},
        ${data.operatingSystem || ""},
        ${data.networkingKnowledge || ""},
        ${data.paymentMethod},
        ${data.accountHolderName},
        ${data.accountNumber},
        ${data.referenceNumber},
        ${data.paymentLink || ""},
        ${data.couponCode || ""},
        ${JSON.stringify(data.extractedData) || null},
        'pending',
        NOW()
      ) RETURNING id
    `

    // TODO: Implement payment verification logic
    // - For CBE: Generate verification URL using last 5 digits and reference number
    // - For TeleBirr: Generate verification URL
    // - Use Gemini API to extract reference from screenshots

    return NextResponse.json({
      success: true,
      registrationId: result[0].id,
      message: "Registration submitted successfully",
    })
  } catch (error) {
    // console.error("Registration error:", error)
    return NextResponse.json({ success: false, message: "Registration failed" }, { status: 500 })
  }
}
