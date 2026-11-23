import { useState } from "react"
import { MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { OfferCard } from "@/components/offer-card"
import { getOffers } from "@/lib/data"

export function HomePage() {
  const [offers] = useState(getOffers)
  const [visibleCount, setVisibleCount] = useState(24)
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")
  const [min, setMin] = useState("")
  const [max, setMax] = useState("")
  const matches = offers.filter(
    (offer) =>
      offer.title
        .toLocaleLowerCase("ru")
        .includes(query.toLocaleLowerCase("ru")) &&
      `${offer.location} ${offer.metro ?? ""}`
        .toLocaleLowerCase("ru")
        .includes(location.toLocaleLowerCase("ru")) &&
      (!min || offer.price >= Number(min)) &&
      (!max || offer.price <= Number(max))
  )
  return (
    <main>
      <section id="catalog" className="page-shell py-12 sm:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
              Вещи рядом с вами
            </h1>
            <p className="mt-2 text-muted-foreground">
              Демонстрационные объявления: цены и доступность приведены для
              примера.
            </p>
          </div>
          <span className="brand-script hidden text-4xl text-primary/80 sm:block">
            Share more, own less
          </span>
        </div>
        <Card className="mb-8 border-border/70 bg-card/90 shadow-sm">
          <CardContent>
            <FieldGroup className="grid gap-4 md:grid-cols-[1.4fr_1fr_.7fr_.7fr]">
              <Field>
                <FieldLabel htmlFor="search">Название</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Что ищете?"
                  />
                  <InputGroupAddon>
                    <Search size={16} />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="location">Расположение</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="location"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Город или метро"
                  />
                  <InputGroupAddon>
                    <MapPin size={16} />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="price-from">Цена от</FieldLabel>
                <Input
                  id="price-from"
                  min="0"
                  type="number"
                  value={min}
                  onChange={(event) => setMin(event.target.value)}
                  placeholder="₽"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="price-to">Цена до</FieldLabel>
                <Input
                  id="price-to"
                  min="0"
                  type="number"
                  value={max}
                  onChange={(event) => setMax(event.target.value)}
                  placeholder="₽"
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
        <div className="mb-5 flex items-center justify-between text-sm text-muted-foreground">
          <span>Найдено: {matches.length}</span>
          {(query || location || min || max) && (
            <button
              className="font-medium text-primary hover:underline"
              onClick={() => {
                setQuery("")
                setLocation("")
                setMin("")
                setMax("")
              }}
            >
              Сбросить фильтры
            </button>
          )}
        </div>
        {matches.length ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {matches.slice(0, visibleCount).map((offer, index) => (
                <OfferCard key={offer.id} offer={offer} index={index} />
              ))}
            </div>
            {matches.length > visibleCount && (
              <div className="mt-9 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setVisibleCount((count) => count + 24)}
                >
                  Показать ещё
                </Button>
              </div>
            )}
          </>
        ) : (
          <Empty className="rounded-2xl border border-dashed border-border bg-card">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Search />
              </EmptyMedia>
              <EmptyTitle>Ничего не нашлось</EmptyTitle>
              <EmptyDescription>
                Попробуйте изменить название, район или диапазон цены.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("")
                  setLocation("")
                  setMin("")
                  setMax("")
                }}
              >
                Сбросить фильтры
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </section>
    </main>
  )
}
