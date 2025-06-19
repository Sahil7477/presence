"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Users, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  const handleLoginClick = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gray-100 p-3 rounded-full">
              <QrCode className="h-12 w-12 text-black" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">QR Attendance System</h1>
            <p className="text-gray-700">Streamline attendance tracking with QR codes</p>
          </div>
        </div>

        {/* Features Cards */}
        <div className="grid gap-4">
          <Card className="border shadow-sm">
            <CardContent className="flex items-center space-x-4 p-4">
              <div className="bg-gray-200 p-2 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">Easy Check-in</CardTitle>
                <CardDescription className="text-xs text-gray-600">
                  Quick QR code scanning for attendance
                </CardDescription>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="flex items-center space-x-4 p-4">
              <div className="bg-gray-200 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">Real-time Tracking</CardTitle>
                <CardDescription className="text-xs text-gray-600">
                  Monitor attendance in real-time
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Login Section */}
        <Card className="border shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Get Started</CardTitle>
            <CardDescription>Please log in to access the attendance system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleLoginClick} className="w-full h-11 text-base font-medium">
              Go to Login
            </Button>
            <p className="text-xs text-center text-gray-500">
              Secure access to your attendance dashboard
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-400">© 2024 QR Attendance System. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
