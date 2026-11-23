import { ArrowUpRight, MapPin, MousePointer2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Offer } from "@/lib/data"
import { formatPrice } from "@/lib/data"

type ProductVisualProps = {
  offer: Offer
  index?: number
  compact?: boolean
}

export function ProductVisual({
  offer,
  index = 0,
  compact = false,
}: ProductVisualProps) {
  return (
    <div
      className={`product-visual product-visual--${index % 4} ${compact ? "product-visual--compact" : ""}`}
    >
      {offer.image ? (
        <img
          src={offer.image}
          alt={offer.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        <>
          <span className="product-orbit" />
          <span className="product-icon">
            <MousePointer2 strokeWidth={1.2} size={compact ? 26 : 58} />
          </span>
          <span className="product-caption">use it · share it</span>
        </>
      )}
    </div>
  )
}

export function OfferCard({
  offer,
  index = 0,
}: {
  offer: Offer
  index?: number
}) {
  const href = `/page-2?id=${encodeURIComponent(offer.id)}`

  return (
    <Card className="group h-full gap-0 overflow-hidden bg-card p-0 shadow-sm ring-0 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <a href={href} className="block" aria-label={`Открыть ${offer.title}`}>
        <ProductVisual offer={offer} index={index} />
      </a>
      <CardHeader className="px-5 pt-4 pb-2">
        <CardTitle className="line-clamp-2 text-lg leading-snug">
          <a href={href} className="hover:text-primary">
            {offer.title}
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-3">
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin size={15} className="shrink-0" />
          {offer.metro ? `м. ${offer.metro}` : offer.location}
        </p>
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between border-t-0 bg-card px-5 py-4">
        <div>
          <strong className="text-lg">{formatPrice(offer.price)}</strong>
          <span className="ml-1 text-xs text-muted-foreground">/ день</span>
        </div>
        <a
          href={href}
          className="inline-flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground transition group-hover:bg-primary group-hover:text-primary-foreground"
          aria-label={`Подробнее: ${offer.title}`}
        >
          <ArrowUpRight size={17} />
        </a>
      </CardFooter>
    </Card>
  )
}
