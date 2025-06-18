export interface Student {
  id: string
  name: string
  roll: string
  department: string
  avatar: string
}

export interface AttendanceRecord {
  id: string
  date: string
  time: string
  status: "Present" | "Late" | "Absent"
}

export interface AttendanceSummary {
  totalPresent: number
  totalLate: number
  totalAbsent: number
}
