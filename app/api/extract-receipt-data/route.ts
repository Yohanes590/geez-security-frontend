import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File
    const paymentMethod = formData.get("paymentMethod") as string

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Create prompt based on payment method
    const prompts = {
      cbe: `
        Analyze this Commercial Bank of Ethiopia (CBE) receipt image and extract the following information in JSON format:
        {
          "referenceNumber": "transaction reference number (like FT251621NVKF)",
          "amount": "transferred amount in ETB",
          "receiverName": "receiver name",
          "receiverAccount": "receiver account number (last 4 digits shown)",
          "paymentDate": "payment date and time",
          "accountNumber": "payer account number (last 4 digits shown)",
          "success": true/false,
          "confidence": 0-100
        }
        
        Look for:
        - Reference No. (VAT Invoice No) - usually starts with letters followed by numbers
        - Transferred Amount in ETB
        - Receiver name and account
        - Payment Date & Time
        - Payer account details
        
        If you cannot clearly identify these details, set success to false and confidence to 0.
      `,
      telebirr: `
        Analyze this TeleBirr receipt image and extract the following information in JSON format:
        {
          "referenceNumber": "transaction reference number",
          "amount": "transaction amount in ETB", 
          "receiverName": "receiver name",
          "receiverPhone": "receiver phone number",
          "paymentDate": "transaction date and time",
          "senderPhone": "sender phone number",
          "success": true/false,
          "confidence": 0-100
        }
        
        Look for:
        - Transaction ID/Reference number
        - Amount transferred
        - Receiver details
        - Sender details
        - Transaction timestamp
        
        If you cannot clearly identify these details, set success to false and confidence to 0.
      `,
    }

    const prompt = prompts[paymentMethod as keyof typeof prompts] || prompts.cbe

    // Analyze the image
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: file.type,
          data: base64,
        },
      },
    ])

    const response = await result.response
    const text = response.text()

    // Try to parse the JSON response
    let extractedData
    try {
      // Clean the response text to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      // console.error("Failed to parse Gemini response:", text)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to extract data from receipt",
          rawResponse: text,
        },
        { status: 400 },
      )
    }

    // Validate extracted data
    if (!extractedData.success || !extractedData.referenceNumber) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not reliably extract payment information from receipt",
          extractedData,
          confidence: extractedData.confidence || 0,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      data: extractedData,
      message: "Receipt data extracted successfully",
    })
  } catch (error) {
    // console.error("Receipt extraction error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process receipt image",
      },
      { status: 500 },
    )
  }
}
