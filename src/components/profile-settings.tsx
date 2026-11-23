import { useState, type FormEvent } from "react"
import { Check, Palette, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { Profile } from "@/lib/data"
import { getPalette, palettes, setPalette } from "@/lib/palette"

type ProfileSettingsProps = {
  profile: Profile
  onSave: (profile: Profile) => void
}

export function ProfileSettings({ profile, onSave }: ProfileSettingsProps) {
  const [draft, setDraft] = useState(profile)
  const [saved, setSaved] = useState(false)
  const [selectedPalette, setSelectedPalette] = useState(getPalette)

  function choosePalette(palette: (typeof palettes)[number]["id"]) {
    setPalette(palette)
    setSelectedPalette(palette)
  }

  function update(key: keyof Profile, value: string) {
    setDraft((current) => ({ ...current, [key]: value }))
    setSaved(false)
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSave({
      name: draft.name.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
    })
    setSaved(true)
  }

  return (
    <div className="grid max-w-3xl gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Настройки профиля
        </h2>
        <p className="mt-1 text-muted-foreground">
          Контактные данные для связи и уведомлений.
        </p>
      </div>
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 size={20} />
            Личные данные
          </CardTitle>
          <CardDescription>
            Изменения сохраняются в этом браузере.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="profile-name">Имя</FieldLabel>
                <Input
                  id="profile-name"
                  required
                  value={draft.name}
                  onChange={(event) => update("name", event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="profile-email">Почта</FieldLabel>
                <Input
                  id="profile-email"
                  type="email"
                  value={draft.email}
                  onChange={(event) => update("email", event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="profile-phone">Телефон</FieldLabel>
                <Input
                  id="profile-phone"
                  type="tel"
                  value={draft.phone}
                  onChange={(event) => update("phone", event.target.value)}
                />
              </Field>
              <div className="flex items-center gap-4">
                <Button type="submit">Сохранить изменения</Button>
                {saved && (
                  <span className="text-sm text-primary" role="status">
                    Сохранено
                  </span>
                )}
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette size={20} />
            Цветовая палитра
          </CardTitle>
          <CardDescription>
            Оформление меняется сразу на всех страницах и сохраняется в этом
            браузере.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="grid gap-3 sm:grid-cols-3"
            role="group"
            aria-label="Цветовая палитра"
          >
            {palettes.map((palette) => (
              <button
                key={palette.id}
                type="button"
                aria-pressed={selectedPalette === palette.id}
                onClick={() => choosePalette(palette.id)}
                className="flex min-h-36 flex-col items-start rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-pressed:border-primary aria-pressed:ring-2 aria-pressed:ring-primary/30"
              >
                <span className="mb-4 flex gap-1.5" aria-hidden="true">
                  {palette.swatches.map((swatch) => (
                    <span
                      key={swatch}
                      className="size-6 rounded-full border border-foreground/15"
                      style={{ backgroundColor: swatch }}
                    />
                  ))}
                </span>
                <span className="flex w-full items-center justify-between gap-2 font-medium">
                  {palette.name}
                  {selectedPalette === palette.id && (
                    <Check size={17} aria-hidden="true" />
                  )}
                </span>
                <span className="mt-1 text-sm text-muted-foreground">
                  {palette.description}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
