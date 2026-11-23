import { CalendarDays, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice, type RentalRequest } from "@/lib/data"
import { cn } from "cn"

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(
    new Date(`${date}T12:00:00`)
  )

export function RentalRequestCard({
  request,
  compact = false,
}: {
  request: RentalRequest
  compact?: boolean
}) {
  return (
    <Card className="border-border/70 shadow-none">
      <CardHeader className="gap-3">
        <Badge variant="secondary" className="w-fit">
          {request.isDemo ? "Демо-запрос" : "Ищу вещь"}
        </Badge>
        <CardTitle className="text-lg">{request.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p
          className={cn(
            "text-sm leading-6 whitespace-pre-wrap text-muted-foreground",
            compact && "line-clamp-3"
          )}
        >
          {request.description}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={16} className="text-primary" />
            {request.location}
          </span>
          {request.startDate && request.endDate && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={16} className="text-primary" />
              {formatDate(request.startDate)} — {formatDate(request.endDate)}
            </span>
          )}
        </div>
        <strong>
          {request.budget === undefined
            ? "Бюджет не указан"
            : `До ${formatPrice(request.budget)} / день`}
        </strong>
      </CardContent>
    </Card>
  )
}
