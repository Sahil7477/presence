'use client'

import React, { useState } from 'react'
import {
  Clock, Users, Check, X, Search
} from "lucide-react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table"
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem
} from "@/components/ui/select"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

import AddStudentForm from '@/components/addStudentForm'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useRouter } from 'next/navigation'

export default function Index() {
  const router = useRouter()
  const [students, setStudents] = useState<any[]>([])
  const [attendanceChartData, setAttendanceChartData] = useState<any[]>([])

  const handleAddStudent = (newStudent: { name: string; department: string; status: string }) => {
    const newEntry = {
      id: Date.now(),
      name: newStudent.name,
      department: newStudent.department,
      time: new Date().toLocaleTimeString(),
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      status: newStudent.status,
    }

    setStudents(prev => [newEntry, ...prev])

    const today = new Date().toLocaleDateString()
    setAttendanceChartData(prev => {
      const updated = [...prev]
      const index = updated.findIndex(d => d.date === today)

      if (index !== -1) {
        updated[index][newStudent.status.toLowerCase()] += 1
      } else {
        updated.push({
          date: today,
          present: newStudent.status === 'Present' ? 1 : 0,
          late: newStudent.status === 'Late' ? 1 : 0,
          absent: newStudent.status === 'Absent' ? 1 : 0,
        })
      }

      return updated
    })
  }

  const handleDownloadCSV = () => {
    const csvHeaders = "Name,Department,Time,Status\n"
    const csvRows = students.map(s =>
      `"${s.name}","${s.department}","${s.time}","${s.status}"`
    )
    const csvContent = csvHeaders + csvRows.join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "attendance.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text("Attendance Report", 14, 22)

    autoTable(doc, {
      startY: 30,
      head: [["Name", "Department", "Time", "Status"]],
      body: students.map((s) => [s.name, s.department, s.time, s.status]),
      theme: "striped",
    })

    doc.save("attendance.pdf")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-indigo-600 flex items-center justify-center">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <h1 className="font-bold text-xl">Presence</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input placeholder="Search..." className="pl-9 w-64 bg-slate-800 text-white border border-slate-700" />
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://i.pravatar.cc/150?img=8" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </nav>

      <main className="p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Attendance Dashboard</h1>
          <p className="text-slate-400">Monitor daily attendance and student status</p>
        </header>

        {/* Link to QR Generator */}
        <div className="flex justify-end mb-4">
          <Button onClick={() => router.push('/qr-generator')} className="bg-indigo-600 hover:bg-indigo-500 text-white">
            Go to QR Generator
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {["Total", "Present", "Late", "Absent"].map((label, i) => {
            const iconMap = [
              <Users className="h-5 w-5 text-blue-400" />,
              <Check className="h-5 w-5 text-green-400" />,
              <Clock className="h-5 w-5 text-yellow-400" />,
              <X className="h-5 w-5 text-red-400" />,
            ]
            const bgMap = ["bg-blue-900", "bg-green-900", "bg-yellow-900", "bg-red-900"]
            const count =
              label === "Total"
                ? students.length
                : students.filter((s) => s.status === label).length

            return (
              <Card key={i} className={bgMap[i]}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{label}</p>
                      <p className="text-2xl font-bold text-white">{count}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                      {iconMap[i]}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Attendance Chart */}
        <Card className="bg-slate-900 mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Attendance Overview</CardTitle>
              <Select defaultValue="today">
                <SelectTrigger className="w-36 bg-slate-800 text-white border-slate-700">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 text-white">
                  <SelectItem value="today">Today</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#cbd5e1" />
                  <YAxis stroke="#cbd5e1" allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="present" fill="#10b981" name="Present" />
                  <Bar dataKey="late" fill="#facc15" name="Late" />
                  <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Add Student Form */}
        <AddStudentForm onAddStudent={handleAddStudent} />

        {/* Student Table */}
        {students.length > 0 && (
          <Card className="mt-6 bg-slate-900 text-white">
            <CardHeader>
              <CardTitle>Student List</CardTitle>
              <CardDescription>Recently added students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end gap-3 mb-4">
                <Button variant="outline" onClick={handleDownloadCSV}>Download CSV</Button>
                <Button variant="outline" onClick={handleDownloadPDF}>Download PDF</Button>
              </div>
              <Table>
                <TableHeader className="bg-slate-800">
                  <TableRow>
                    <TableHead className="text-white">Student</TableHead>
                    <TableHead className="text-white">Department</TableHead>
                    <TableHead className="text-white">Time</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id} className="bg-slate-900 text-white">
                      <TableCell className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {student.name}
                      </TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell>{student.time}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.status === 'Present'
                            ? 'bg-green-800 text-green-200'
                            : student.status === 'Late'
                              ? 'bg-yellow-700 text-yellow-100'
                              : 'bg-red-700 text-red-100'
                        }`}>
                          {student.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
