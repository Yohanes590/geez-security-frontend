import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { GoogleGenerativeAI } from "@google/generative-ai"

const sql = neon(process.env.DATABASE_URL!)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { registrationId, paymentMethod, accountNumber, referenceNumber, extractedData } = await request.json()

    let verificationUrl = ""
    let verificationResult = null

    if (paymentMethod === "cbe") {
      // Extract last 5 digits of account number
      const last5Digits = accountNumber.slice(-5)
      verificationUrl = `https://apps.cbe.com.et:100/BranchReceipt/${referenceNumber}&${last5Digits}`
    } else if (paymentMethod === "telebirr") {
      verificationUrl = `https://transactioninfo.ethiotelecom.et/receipt/${referenceNumber}`
    }

    // Attempt to fetch and verify payment receipt
    try {
      const response = await fetch(verificationUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      })

      if (response.ok) {
        const receiptData = await response.text()

        // Use Gemini to verify the receipt content matches the registration
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

        const verificationPrompt = `
          Analyze this payment receipt and verify if it matches the provided payment information:
          
          Receipt Content: ${receiptData}
          
          Expected Information:
          - Reference Number: ${referenceNumber}
          - Account Number (last digits): ${accountNumber.slice(-5)}
          - Payment Method: ${paymentMethod}
          ${extractedData ? `- Extracted Amount: ${extractedData.amount}` : ""}
          
          Return JSON format:
          {
            "isValid": true/false,
            "matchedFields": ["field1", "field2"],
            "discrepancies": ["issue1", "issue2"],
            "confidence": 0-100,
            "verifiedAmount": "amount in ETB if found"
          }
        `

        const verificationResponse = await model.generateContent(verificationPrompt)
        const verificationText = await verificationResponse.response.text()

        try {
          const jsonMatch = verificationText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            verificationResult = JSON.parse(jsonMatch[0])
          }
        } catch (parseError) {
          // console.error("Failed to parse verification response:", parseError)
        }
      }
    } catch (fetchError) {
      // console.error("Failed to fetch receipt:", fetchError)
      // Continue with manual verification if automatic fetch fails
    }

    // Update registration with verification results
    const updateData = {
      status: verificationResult?.isValid ? "verified" : "pending_review",
      verification_url: verificationUrl,
      verification_result: JSON.stringify(verificationResult),
      extracted_data: JSON.stringify(extractedData),
      verified_at: verificationResult?.isValid ? new Date() : null,
    }

    await sql`
      UPDATE registrations 
      SET 
        status = ${updateData.status},
        verification_url = ${updateData.verification_url},
        verification_result = ${updateData.verification_result},
        extracted_data = ${updateData.extracted_data},
        verified_at = ${updateData.verified_at}
      WHERE id = ${registrationId}
    `

    // Store detailed verification data
    await sql`
      INSERT INTO payment_verifications (
        registration_id,
        verification_url,
        verification_response,
        is_verified,
        verified_amount,
        confidence_score,
        created_at
      ) VALUES (
        ${registrationId},
        ${verificationUrl},
        ${JSON.stringify(verificationResult)},
        ${verificationResult?.isValid || false},
        ${verificationResult?.verifiedAmount || extractedData?.amount || null},
        ${verificationResult?.confidence || extractedData?.confidence || 0},
        NOW()
      )
    `

    return NextResponse.json({
      success: true,
      verificationUrl,
      verificationResult,
      status: updateData.status,
      message: verificationResult?.isValid ? "Payment verified successfully" : "Payment submitted for manual review",
    })
  } catch (error) {
    // console.error("Payment verification error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Payment verification failed",
      },
      { status: 500 },
    )
  }
}
