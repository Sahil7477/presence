"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import StudentProfileCard from "@/components/student-profile-card"
import AttendanceSummaryCards from "@/components/attendance-summary-cards"
import AttendanceHistoryTable from "@/components/attendance-history-table"

import type { Student, AttendanceRecord, AttendanceSummary } from "@/types/student"
import { Toaster } from "@/components/ui/toaster"
import QRScanner from "@/components/QRScanner"

// Mock data
const mockStudent: Student = {
  id: "1",
  name: "Rahul Verma",
  roll: "CSE2023/001",
  department: "Computer Science Engineering",
  avatar: "https://i.pravatar.cc/150?img=9",
}

const mockAttendanceRecords: AttendanceRecord[] = [
  { id: "1", date: "2025-06-18", time: "09:02 AM", status: "Present" },
  { id: "2", date: "2025-06-17", time: "09:10 AM", status: "Late" },
  { id: "3", date: "2025-06-16", time: "-", status: "Absent" },
  { id: "4", date: "2025-06-15", time: "08:58 AM", status: "Present" },
  { id: "5", date: "2025-06-14", time: "09:05 AM", status: "Late" },
]

const mockSummary: AttendanceSummary = {
  totalPresent: 42,
  totalLate: 5,
  totalAbsent: 3,
}

export default function StudentDashboard() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords)

  const handleQRScanSuccess = (data: string) => {
    // In a real app, you would send this to your backend
    console.log("QR Code scanned:", data)

    // Add new attendance record
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      status: "Present",
    }

    setAttendanceRecords((prev) => [newRecord, ...prev])
  }

  return (
    <div className="min-h-screen bg-white text-white">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
          <div className="text-sm text-slate-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Profile + Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StudentProfileCard student={mockStudent} />
          <AttendanceSummaryCards summary={mockSummary} />
        </div>

        {/* QR Scanner */}
        <Card className="bg-white-900 ">
          <CardHeader>
            <CardTitle className="text-white">Mark Attendance</CardTitle>
            <CardDescription className="text-slate-400">Scan the QR code to mark your attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <QRScanner  />
          </CardContent>
        </Card>

        {/* Attendance History */}
        <AttendanceHistoryTable records={attendanceRecords} />
      </div>

      <Toaster />
    </div>
  )
}
