import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import type { Student } from "@/types/student"

interface StudentProfileCardProps {
  student: Student
}

export default function StudentProfileCard({ student }: StudentProfileCardProps) {
  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
            <AvatarFallback className="bg-slate-700 text-white">
              {student.name
                .split(" ")
                .map((n: string, _i: number, _arr: string[]) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white font-semibold">{student.name}</p>
            <p className="text-sm text-slate-400">{student.roll}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-300">
          Department: <span className="font-medium text-white">{student.department}</span>
        </p>
      </CardContent>
    </Card>
  )
}
