import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, Clock, XCircle } from "lucide-react"
import type { AttendanceSummary } from "@/types/student"

interface AttendanceSummaryCardsProps {
  summary: AttendanceSummary
}

export default function AttendanceSummaryCards({ summary }: AttendanceSummaryCardsProps) {
  const cards = [
    {
      title: "Total Present",
      value: summary.totalPresent,
      icon: CheckCircle,
      bgColor: "bg-blue-500",
      borderColor: "border-green-500/30",
      iconColor: "text-green-400",
      textColor: "text-black",
    },
    {
      title: "Total Late",
      value: summary.totalLate,
      icon: Clock,
      bgColor: "bg-yellow-500",
      borderColor: "border-yellow-500/30",
      iconColor: "text-yellow-400",
      textColor: "text-black",
    },
    {
      title: "Total Absent",
      value: summary.totalAbsent,
      icon: XCircle,
      bgColor: "bg-red-500",
      borderColor: "border-red-500/30",
      iconColor: "text-red-400",
      textColor: "text-black",
    },
  ]

  return (
    <>
      {cards.map((card) => (
        <Card key={card.title} className={`${card.bgColor} ${card.borderColor} border`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className={`${card.textColor} text-sm font-medium`}>{card.title}</CardTitle>
              <CardDescription className={`${card.textColor} text-2xl font-bold`}>{card.value}</CardDescription>
            </div>
            <card.icon className={`w-8 h-8 ${card.iconColor}`} />
          </CardHeader>
        </Card>
      ))}
    </>
  )
}
