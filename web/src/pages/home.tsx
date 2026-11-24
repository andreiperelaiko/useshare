import { useState, type ReactNode } from "react"
import { MapPin, Search, SquarePen } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OfferCard } from "@/components/offer-card"
import { RentalRequestCard } from "@/components/rental-request-card"
import { getCatalogRequests, getOffers } from "@/lib/data"

type CatalogMode = "offers" | "requests"

function CatalogResults({
  count,
  visibleCount,
  hasFilters,
  onReset,
  onLoadMore,
  children,
}: {
  count: number
  visibleCount: number
  hasFilters: boolean
  onReset: () => void
  onLoadMore: () => void
  children: ReactNode
}) {
  return (
    <>
      <div className="mb-5 flex items-center justify-between text-sm text-muted-foreground">
        <span>Найдено: {count}</span>
        {hasFilters && (
          <button
            className="font-medium text-primary hover:underline"
            onClick={onReset}
          >
            Сбросить фильтры
          </button>
        )}
      </div>
      {count ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {children}
          </div>
          {count > visibleCount && (
            <div className="mt-9 flex justify-center">
              <Button variant="outline" onClick={onLoadMore}>
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
            <Button render={<a href="/add-request" />} nativeButton={false}>
              Написать запрос
            </Button>
            {hasFilters && (
              <Button variant="outline" onClick={onReset}>
                Сбросить фильтры
              </Button>
            )}
          </EmptyContent>
        </Empty>
      )}
    </>
  )
}

export function HomePage() {
  const [offers] = useState(getOffers)
  const [requests] = useState(getCatalogRequests)
  const [mode, setMode] = useState<CatalogMode>(() =>
    new URLSearchParams(window.location.search).get("view") === "requests"
      ? "requests"
      : "offers"
  )
  const [visibleCount, setVisibleCount] = useState(24)
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")
  const [min, setMin] = useState("")
  const [max, setMax] = useState("")

  const search = query.trim().toLocaleLowerCase("ru")
  const place = location.trim().toLocaleLowerCase("ru")
  const hasFilters = Boolean(query || location || min || max)
  const matchesText = (title: string, address: string) =>
    title.toLocaleLowerCase("ru").includes(search) &&
    address.toLocaleLowerCase("ru").includes(place)
  const matchesPrice = (price?: number) =>
    (!min && !max) ||
    (price !== undefined &&
      (!min || price >= Number(min)) &&
      (!max || price <= Number(max)))
  const matchingOffers = offers.filter(
    (offer) =>
      matchesText(offer.title, `${offer.location} ${offer.metro ?? ""}`) &&
      matchesPrice(offer.price)
  )
  const matchingRequests = requests.filter(
    (request) =>
      matchesText(request.title, request.location) &&
      matchesPrice(request.budget)
  )

  function resetFilters() {
    setQuery("")
    setLocation("")
    setMin("")
    setMax("")
    setVisibleCount(24)
  }

  return (
    <main>
      <section id="catalog" className="page-shell py-12 sm:py-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
              {mode === "offers" ? "Вещи рядом с вами" : "Запросы на аренду"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {mode === "offers"
                ? "Демонстрационные объявления: цены и доступность приведены для примера."
                : "100 демонстрационных запросов. Бюджеты и потребности приведены для примера."}
            </p>
          </div>
          <Button
            variant="outline"
            render={<a href="/add-request" />}
            nativeButton={false}
          >
            <SquarePen data-icon="inline-start" />
            Написать запрос на аренду
          </Button>
        </div>
        <Tabs
          value={mode}
          onValueChange={(value) => {
            if (value === "offers" || value === "requests") {
              setMode(value)
              setVisibleCount(24)
              const url = new URL(window.location.href)
              if (value === "requests") url.searchParams.set("view", "requests")
              else url.searchParams.delete("view")
              window.history.replaceState(null, "", url)
            }
          }}
        >
          <TabsList
            className="mb-6 h-11 w-full sm:w-auto"
            aria-label="Тип объявлений"
          >
            <TabsTrigger value="offers" className="px-5">
              Предложения
            </TabsTrigger>
            <TabsTrigger value="requests" className="px-5">
              Запросы
            </TabsTrigger>
          </TabsList>
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
                      placeholder={
                        mode === "offers" ? "Что ищете?" : "Какую вещь ищут?"
                      }
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
                  <FieldLabel htmlFor="price-from">
                    {mode === "offers" ? "Цена от" : "Бюджет от"}
                  </FieldLabel>
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
                  <FieldLabel htmlFor="price-to">
                    {mode === "offers" ? "Цена до" : "Бюджет до"}
                  </FieldLabel>
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
          <TabsContent value="offers">
            <CatalogResults
              count={matchingOffers.length}
              visibleCount={visibleCount}
              hasFilters={hasFilters}
              onReset={resetFilters}
              onLoadMore={() => setVisibleCount((count) => count + 24)}
            >
              {matchingOffers.slice(0, visibleCount).map((offer, index) => (
                <OfferCard key={offer.id} offer={offer} index={index} />
              ))}
            </CatalogResults>
          </TabsContent>
          <TabsContent value="requests">
            <CatalogResults
              count={matchingRequests.length}
              visibleCount={visibleCount}
              hasFilters={hasFilters}
              onReset={resetFilters}
              onLoadMore={() => setVisibleCount((count) => count + 24)}
            >
              {matchingRequests.slice(0, visibleCount).map((request) => (
                <RentalRequestCard key={request.id} request={request} compact />
              ))}
            </CatalogResults>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}
