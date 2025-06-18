'use client'

import React, { useState, useCallback } from 'react'
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

export default function Index() {
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-indigo-600 flex items-center justify-center">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <h1 className="font-bold text-xl">AttendEase</h1>
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

      {/* Main content */}
      <main className="p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Attendance Dashboard</h1>
          <p className="text-slate-400">Monitor daily attendance and student status</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total", value: students.length.toString(), icon: <Users className="h-5 w-5 text-blue-400" />, bg: "bg-blue-900" },
            { label: "Present", value: students.filter(s => s.status === 'Present').length.toString(), icon: <Check className="h-5 w-5 text-green-400" />, bg: "bg-green-900" },
            { label: "Late", value: students.filter(s => s.status === 'Late').length.toString(), icon: <Clock className="h-5 w-5 text-yellow-400" />, bg: "bg-yellow-900" },
            { label: "Absent", value: students.filter(s => s.status === 'Absent').length.toString(), icon: <X className="h-5 w-5 text-red-400" />, bg: "bg-red-900" },
          ].map(({ label, value, icon, bg }, i) => (
            <Card key={i} className={`${bg}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{label}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">{icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart */}
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

        {/* Table */}
        {students.length > 0 && (
          <Card className="mt-6 bg-slate-900 text-white">
            <CardHeader>
              <CardTitle>Student List</CardTitle>
              <CardDescription>Recently added students</CardDescription>
            </CardHeader>
            <CardContent>
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
