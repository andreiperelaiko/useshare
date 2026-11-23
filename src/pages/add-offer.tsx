import { useState, type FormEvent } from "react"
import { ArrowRight, ImagePlus, MapPin, Sparkles } from "lucide-react"
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
import { saveOffer, type Offer } from "@/lib/data"

export function AddOfferPage() {
  const [image, setImage] = useState<string>()
  const [imageError, setImageError] = useState("")
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const offer: Offer = {
      id: crypto.randomUUID(),
      title: String(form.get("title") || "").trim(),
      description: String(form.get("description") || "").trim(),
      price: Number(form.get("price")),
      location: String(form.get("location") || "").trim(),
      image,
    }
    if (
      !offer.title ||
      !offer.description ||
      !offer.location ||
      !Number.isFinite(offer.price) ||
      offer.price < 0
    )
      return
    try {
      saveOffer(offer)
      window.location.href = "/page?tab=renting"
    } catch {
      setImageError(
        "Не удалось сохранить фото. Попробуйте файл меньшего размера."
      )
    }
  }
  function changeImage(file?: File) {
    setImageError("")
    if (!file) {
      setImage(undefined)
      return
    }
    if (file.size > 1_000_000) {
      setImageError("Фото должно быть меньше 1 МБ.")
      return
    }
    const reader = new FileReader()
    reader.onload = () => setImage(String(reader.result))
    reader.readAsDataURL(file)
  }
  return (
    <main className="page-shell py-9 pb-20">
      <BackLink href="/page?tab=renting" label="К моим предложениям" />
      <div className="mb-8 max-w-2xl">
        <span className="eyebrow">
          <Sparkles size={14} /> Делитесь тем, что любите
        </span>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">
          Добавить предложение
        </h1>
        <p className="mt-3 text-muted-foreground">
          Расскажите о вещи, укажите цену и место передачи. Объявление сразу
          появится в каталоге.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(250px,.65fr)]">
        <Card className="border-border/70 shadow-none">
          <CardHeader>
            <CardTitle>О вашей вещи</CardTitle>
            <CardDescription>Поля со звёздочкой обязательны.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="offer-title">Название *</FieldLabel>
                  <Input
                    id="offer-title"
                    name="title"
                    required
                    maxLength={80}
                    placeholder="Например, велосипед для прогулок"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="offer-description">
                    Описание *
                  </FieldLabel>
                  <Textarea
                    id="offer-description"
                    name="description"
                    required
                    rows={5}
                    maxLength={1000}
                    placeholder="Состояние, комплектация и всё, что важно знать"
                  />
                  <FieldDescription>
                    Опишите вещь так, чтобы другому человеку было легко принять
                    решение.
                  </FieldDescription>
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="offer-price">
                      Цена в день, ₽ *
                    </FieldLabel>
                    <Input
                      id="offer-price"
                      name="price"
                      type="number"
                      min="0"
                      required
                      placeholder="1000"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="offer-location">
                      Расположение *
                    </FieldLabel>
                    <Input
                      id="offer-location"
                      name="location"
                      required
                      placeholder="Москва, район или метро"
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="offer-image">Фото вещи</FieldLabel>
                  <label
                    htmlFor="offer-image"
                    className="flex min-h-44 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed border-border bg-muted/40 text-sm text-muted-foreground hover:bg-muted"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt="Предпросмотр вещи"
                        className="max-h-60 w-full object-contain"
                      />
                    ) : (
                      <>
                        <ImagePlus size={28} />
                        <span>Выбрать фото</span>
                        <span className="text-xs">
                          До 1 МБ · хранится только в этом браузере
                        </span>
                      </>
                    )}
                  </label>
                  <Input
                    id="offer-image"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => changeImage(event.target.files?.[0])}
                  />
                  {imageError && (
                    <FieldDescription className="text-destructive" role="alert">
                      {imageError}
                    </FieldDescription>
                  )}
                </Field>
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Опубликовать предложение <ArrowRight />
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
        <aside>
          <Card className="border-border/70 bg-accent shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Хорошее объявление</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-sm leading-6 text-muted-foreground">
              <p className="flex gap-3">
                <span className="text-primary">01</span>Короткое и понятное
                название помогает найти вещь в поиске.
              </p>
              <p className="flex gap-3">
                <span className="text-primary">02</span>Расскажите о состоянии и
                условиях использования.
              </p>
              <p className="flex gap-3">
                <span className="text-primary">03</span>
                <span>
                  <MapPin size={15} className="mr-1 inline" />
                  Укажите район, где удобно встретиться.
                </span>
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}
