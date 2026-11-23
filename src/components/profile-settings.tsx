import { useState, type FormEvent } from "react"
import { Settings2 } from "lucide-react"
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

type ProfileSettingsProps = {
  profile: Profile
  onSave: (profile: Profile) => void
}

export function ProfileSettings({ profile, onSave }: ProfileSettingsProps) {
  const [draft, setDraft] = useState(profile)
  const [saved, setSaved] = useState(false)

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
    </div>
  )
}
