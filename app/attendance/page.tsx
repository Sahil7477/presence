// app/attendance/page.tsx
import AttendanceTable from "@/components/AttendanceTable";

export default function AttendancePage() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Attendance</h1>
      <AttendanceTable />
    </div>
  );
}
