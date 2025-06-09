"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Check, ChevronDown, Download, Filter, QrCode, Search, SlidersHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Types for our attendance data
type AttendanceStatus = "present" | "absent" | "late" | "excused"

interface AttendanceRecord {
  id: string
  studentId: string
  studentName: string
  avatarUrl?: string
  course: string
  date: Date
  checkInTime?: string
  checkOutTime?: string
  status: AttendanceStatus
  qrScanned: boolean
  notes?: string
}

// Sample data for demonstration
const attendanceData: AttendanceRecord[] = [
  {
    id: "1",
    studentId: "STU001",
    studentName: "Alex Johnson",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    course: "Computer Science 101",
    date: new Date(2023, 4, 15),
    checkInTime: "09:05 AM",
    checkOutTime: "11:00 AM",
    status: "present",
    qrScanned: true,
    notes: "Arrived on time",
  },
  {
    id: "2",
    studentId: "STU002",
    studentName: "Maria Garcia",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    course: "Computer Science 101",
    date: new Date(2023, 4, 15),
    checkInTime: "09:15 AM",
    checkOutTime: "11:00 AM",
    status: "late",
    qrScanned: true,
    notes: "Arrived 15 minutes late",
  },
  {
    id: "3",
    studentId: "STU003",
    studentName: "James Wilson",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    course: "Computer Science 101",
    date: new Date(2023, 4, 15),
    status: "absent",
    qrScanned: false,
  },
  {
    id: "4",
    studentId: "STU004",
    studentName: "Sarah Ahmed",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    course: "Computer Science 101",
    date: new Date(2023, 4, 15),
    status: "excused",
    qrScanned: false,
    notes: "Medical appointment",
  },
  {
    id: "5",
    studentId: "STU005",
    studentName: "David Lee",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    course: "Computer Science 101",
    date: new Date(2023, 4, 15),
    checkInTime: "09:00 AM",
    checkOutTime: "11:00 AM",
    status: "present",
    qrScanned: true,
  },
  {
    id: "6",
    studentId: "STU006",
    studentName: "Emma Thompson",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    course: "Computer Science 101",
    date: new Date(2023, 4, 15),
    checkInTime: "09:02 AM",
    checkOutTime: "11:00 AM",
    status: "present",
    qrScanned: true,
  },
  {
    id: "7",
    studentId: "STU007",
    studentName: "Michael Brown",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    course: "Computer Science 101",
    date: new Date(2023, 4, 15),
    checkInTime: "09:20 AM",
    checkOutTime: "11:00 AM",
    status: "late",
    qrScanned: true,
    notes: "Traffic delay",
  },
  {
    id: "8",
    studentId: "STU008",
    studentName: "Sophia Martinez",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    course: "Computer Science 101",
    date: new Date(2023, 4, 15),
    status: "absent",
    qrScanned: false,
  },
]

// Status badge component
const StatusBadge = ({ status }: { status: AttendanceStatus }) => {
  switch (status) {
    case "present":
      return <Badge className="bg-green-500 hover:bg-green-600">Present</Badge>
    case "absent":
      return <Badge variant="destructive">Absent</Badge>
    case "late":
      return <Badge className="bg-amber-500 hover:bg-amber-600">Late</Badge>
    case "excused":
      return (
        <Badge variant="outline" className="text-blue-500 border-blue-500">
          Excused
        </Badge>
      )
    default:
      return null
  }
}

export default function AttendanceTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<string>("all")

  // Filter data based on search query and filters
  const filteredData = attendanceData.filter((record) => {
    // Search filter
    const matchesSearch =
      record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || record.status === statusFilter

    // Date filter (if implemented)
    const matchesDate =
      !selectedDate ||
      (record.date.getDate() === selectedDate.getDate() &&
        record.date.getMonth() === selectedDate.getMonth() &&
        record.date.getFullYear() === selectedDate.getFullYear())

    // Course filter
    const matchesCourse = selectedCourse === "all" || record.course === selectedCourse

    return matchesSearch && matchesStatus && matchesDate && matchesCourse
  })

  // Get unique courses for the filter dropdown
  const courses = [...new Set(attendanceData.map((record) => record.course))]

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Attendance Records</CardTitle>
              <CardDescription>Manage and track student attendance via QR code check-ins</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 gap-1">
                    <QrCode className="h-4 w-4" />
                    Generate QR
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate Attendance QR Code</DialogTitle>
                    <DialogDescription>Create a QR code for students to scan for attendance</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                      <Select defaultValue="Computer Science 101">
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course} value={course}>
                              {course}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-center py-6">
                      <div className="border p-4 rounded-lg">
                        <QrCode className="h-40 w-40" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Download QR</Button>
                      <Button>Share QR</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters and search */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name or ID..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="excused">Excused</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="w-[150px]">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      <SelectValue placeholder="Course" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" className="gap-1" onClick={() => setSelectedDate(new Date())}>
                  <Calendar className="h-4 w-4" />
                  {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Date"}
                </Button>

                {(searchQuery || statusFilter !== "all" || selectedDate || selectedCourse !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 text-xs"
                    onClick={() => {
                      setSearchQuery("")
                      setStatusFilter("all")
                      setSelectedDate(null)
                      setSelectedCourse("all")
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear filters
                  </Button>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Student</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>QR Scanned</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={record.avatarUrl || "/placeholder.svg"} alt={record.studentName} />
                              <AvatarFallback>{record.studentName.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{record.studentName}</div>
                              <div className="text-xs text-muted-foreground">{record.studentId}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{format(record.date, "MMM dd, yyyy")}</TableCell>
                        <TableCell>{record.checkInTime || "—"}</TableCell>
                        <TableCell>{record.checkOutTime || "—"}</TableCell>
                        <TableCell>
                          <StatusBadge status={record.status} />
                        </TableCell>
                        <TableCell>
                          {record.qrScanned ? (
                            <div className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-xs">Scanned</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <X className="h-4 w-4 text-red-500 mr-1" />
                              <span className="text-xs">Not scanned</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{record.notes || "—"}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <span className="sr-only">Open menu</span>
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuCheckboxItem checked={record.status === "present"}>
                                Mark as Present
                              </DropdownMenuCheckboxItem>
                              <DropdownMenuCheckboxItem checked={record.status === "absent"}>
                                Mark as Absent
                              </DropdownMenuCheckboxItem>
                              <DropdownMenuCheckboxItem checked={record.status === "late"}>
                                Mark as Late
                              </DropdownMenuCheckboxItem>
                              <DropdownMenuCheckboxItem checked={record.status === "excused"}>
                                Mark as Excused
                              </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No attendance records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
