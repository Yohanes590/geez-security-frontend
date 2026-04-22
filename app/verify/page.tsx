"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle, ShieldCheck, Search } from "lucide-react"
import Image from "next/image"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://geez-reg-back.onrender.com/api'

interface CertificateData {
  certId: string
  holder: string
  course: string
  issuedAt: string | null
}

function VerifyContent() {
  const searchParams = useSearchParams()
  const [certId, setCertId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<CertificateData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasAutoVerified, setHasAutoVerified] = useState(false)

  const verifyCertificate = useCallback(async (id: string) => {
    if (!id.trim()) {
      setError("Please enter a certificate ID")
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`${API_BASE_URL}/certificates/verify?id=${encodeURIComponent(id.trim())}`)
      const data = await response.json()

      if (data.success) {
        setResult(data.data)
      } else {
        setError(data.message || "Certificate not found")
      }
    } catch (err) {
      setError("An error occurred while verifying the certificate. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Check for certificate ID in URL query params on mount
  useEffect(() => {
    const idFromUrl = searchParams.get("id")
    if (idFromUrl && !hasAutoVerified) {
      const uppercaseId = idFromUrl.toUpperCase()
      setCertId(uppercaseId)
      setHasAutoVerified(true)
      verifyCertificate(uppercaseId)
    }
  }, [searchParams, hasAutoVerified, verifyCertificate])

  const handleVerify = async () => {
    verifyCertificate(certId)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerify()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  return (
    <main className="min-h-screen cyber-bg flex flex-col items-center justify-center p-4">
      {/* Background grid effect */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image 
            src="/geezlogo.png" 
            alt="Geez Security" 
            width={80} 
            height={80}
            className="drop-shadow-lg"
          />
        </div>

        {/* Main Card */}
        <Card className="card-cyber border border-[#02EF56]/30 overflow-hidden">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#02EF56]/10 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-[#02EF56]" />
              </div>
            </div>
            <CardTitle className="text-2xl font-cyber text-white">
              Certificate Verification
            </CardTitle>
            <p className="text-gray-400 text-sm mt-2">
              Enter the certificate ID to verify its authenticity
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., GTWSSSID10"
                  className="input-cyber text-center text-lg tracking-wider font-mono h-14 pr-12"
                  disabled={isLoading}
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>

              <Button
                onClick={handleVerify}
                disabled={isLoading || !certId.trim()}
                className="w-full btn-cyber font-cyber h-12"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "VERIFY CERTIFICATE"
                )}
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Success Result */}
            {result && (
              <div className="rounded-lg p-5 border bg-[#02EF56]/10 border-[#02EF56]/30">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-8 h-8 text-[#02EF56]" />
                  <div>
                    <h3 className="font-cyber text-lg text-[#02EF56]">
                      Valid Certificate
                    </h3>
                    <p className="text-gray-400 text-xs font-mono">{result.certId}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                    <span className="text-gray-400">Holder</span>
                    <span className="text-white font-medium">{result.holder}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                    <span className="text-gray-400">Course</span>
                    <span className="text-white font-medium">{result.course}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Issued</span>
                    <span className="text-white font-medium">
                      {result.issuedAt ? formatDate(result.issuedAt) : "—"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © {new Date().getFullYear()} Geez Security. All rights reserved.
        </p>
      </div>
    </main>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen cyber-bg flex flex-col items-center justify-center p-4">
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#02EF56] animate-spin" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </main>
    }>
      <VerifyContent />
    </Suspense>
  )
}

