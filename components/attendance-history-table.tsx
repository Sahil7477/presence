import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { AttendanceRecord } from "@/types/student"

interface AttendanceHistoryTableProps {
  records: AttendanceRecord[]
}

export default function AttendanceHistoryTable({ records }: AttendanceHistoryTableProps) {
  const getStatusBadge = (status: "Present" | "Late" | "Absent") => {
    const variants = {
      Present: { variant: "default" as const, className: "bg-green-600 hover:bg-green-700" },
      Late: { variant: "secondary" as const, className: "bg-yellow-600 hover:bg-yellow-700" },
      Absent: { variant: "destructive" as const, className: "bg-red-600 hover:bg-red-700" },
    }

    const config = variants[status]
    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    )
  }

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Attendance History</CardTitle>
        <CardDescription className="text-slate-400">Recent attendance records</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700">
              <TableHead className="text-slate-300">Date</TableHead>
              <TableHead className="text-slate-300">Time</TableHead>
              <TableHead className="text-slate-300">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id} className="border-slate-700">
                <TableCell className="text-slate-200">
                  {new Date(record.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-slate-200">{record.time}</TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
