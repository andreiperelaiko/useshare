import { useState, type FormEvent } from "react"
import { ArrowRight, CalendarDays, MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BackLink } from "@/components/header"
import { saveRentalRequest, type RentalRequest } from "@/lib/data"

export function AddRequestPage() {
  const [error, setError] = useState("")

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    const form = new FormData(event.currentTarget)
    const budgetInput = String(form.get("budget") || "").trim()
    const startDate = String(form.get("startDate") || "")
    const endDate = String(form.get("endDate") || "")
    const request: RentalRequest = {
      id: crypto.randomUUID(),
      title: String(form.get("title") || "").trim(),
      description: String(form.get("description") || "").trim(),
      location: String(form.get("location") || "").trim(),
      budget: budgetInput ? Number(budgetInput) : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      createdAt: new Date().toISOString(),
    }

    if (!request.title || !request.description || !request.location) {
      setError("Заполните название, описание и расположение.")
      return
    }
    if (
      request.budget !== undefined &&
      (!Number.isFinite(request.budget) || request.budget < 0)
    ) {
      setError("Укажите корректный бюджет за день.")
      return
    }
    if (
      Boolean(startDate) !== Boolean(endDate) ||
      (startDate && endDate < startDate)
    ) {
      setError(
        "Укажите обе даты, причём дата окончания должна быть не раньше начала."
      )
      return
    }

    try {
      saveRentalRequest(request)
      window.location.href = "/page?tab=borrowing"
    } catch {
      setError(
        "Не удалось сохранить заявку. Проверьте настройки браузера и попробуйте ещё раз."
      )
    }
  }

  return (
    <main className="page-shell py-9 pb-20">
      <BackLink href="/page?tab=borrowing" label="К моим заявкам" />
      <div className="mb-8 max-w-2xl">
        <span className="eyebrow">
          <Search size={14} /> Найдите нужную вещь
        </span>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">
          Заявка на аренду
        </h1>
        <p className="mt-3 text-muted-foreground">
          Опишите, что хотите взять, где вам удобно встретиться и на каких
          условиях.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(250px,.65fr)]">
        <Card className="border-border/70 shadow-none">
          <CardHeader>
            <CardTitle>Что вам нужно?</CardTitle>
            <CardDescription>Поля со звёздочкой обязательны.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="request-title">
                    Название вещи *
                  </FieldLabel>
                  <Input
                    id="request-title"
                    name="title"
                    required
                    maxLength={80}
                    placeholder="Например, проектор на выходные"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="request-description">
                    Описание *
                  </FieldLabel>
                  <Textarea
                    id="request-description"
                    name="description"
                    required
                    rows={5}
                    maxLength={1000}
                    placeholder="Для чего нужна вещь, какие характеристики и комплект важны"
                  />
                  <FieldDescription>
                    Чем точнее описание, тем проще подобрать подходящую вещь.
                  </FieldDescription>
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="request-location">
                      Расположение *
                    </FieldLabel>
                    <Input
                      id="request-location"
                      name="location"
                      required
                      maxLength={120}
                      placeholder="Район или станция метро"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="request-budget">
                      Бюджет в день, ₽
                    </FieldLabel>
                    <Input
                      id="request-budget"
                      name="budget"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="До 1000"
                    />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="request-start">Дата начала</FieldLabel>
                    <Input id="request-start" name="startDate" type="date" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="request-end">
                      Дата окончания
                    </FieldLabel>
                    <Input id="request-end" name="endDate" type="date" />
                  </Field>
                </div>
                <FieldDescription>
                  Если даты пока неизвестны, оставьте оба поля пустыми.
                </FieldDescription>
                {error && (
                  <p className="text-sm text-destructive" role="alert">
                    {error}
                  </p>
                )}
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Сохранить заявку <ArrowRight data-icon="inline-end" />
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
        <aside>
          <Card className="border-border/70 bg-accent shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Как составить заявку</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 text-sm leading-6 text-muted-foreground">
              <p className="flex gap-3">
                <Search size={18} className="mt-1 shrink-0 text-primary" />
                Укажите конкретную модель или нужные характеристики.
              </p>
              <p className="flex gap-3">
                <MapPin size={18} className="mt-1 shrink-0 text-primary" />
                Напишите, в каком районе вам удобно забрать вещь.
              </p>
              <p className="flex gap-3">
                <CalendarDays
                  size={18}
                  className="mt-1 shrink-0 text-primary"
                />
                Если знаете сроки, укажите даты аренды.
              </p>
              <p>Сейчас заявка сохраняется только в вашем браузере.</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}
