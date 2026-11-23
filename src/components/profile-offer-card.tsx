import { ArrowUpRight, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ProductVisual } from "@/components/offer-card"
import { formatPrice, type Offer } from "@/lib/data"

type ProfileOfferCardProps = {
  offer: Offer
  status: string
  details: string
  index?: number
}

export function ProfileOfferCard({
  offer,
  status,
  details,
  index = 0,
}: ProfileOfferCardProps) {
  return (
    <Card className="overflow-hidden border-border/70 p-0 shadow-none">
      <div className="flex min-h-36">
        <div className="w-36 shrink-0 sm:w-44">
          <ProductVisual offer={offer} index={index} compact />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between p-5">
          <div>
            <Badge variant="secondary" className="mb-3">
              {status}
            </Badge>
            <h3 className="text-lg font-semibold">{offer.title}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin size={14} />
              {details}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2">
            <strong>{formatPrice(offer.price)} / день</strong>
            <a
              href={`/page-2?id=${encodeURIComponent(offer.id)}`}
              className="text-primary"
              aria-label={`Открыть ${offer.title}`}
            >
              <ArrowUpRight size={20} />
            </a>
          </div>
        </div>
      </div>
    </Card>
  )
}
