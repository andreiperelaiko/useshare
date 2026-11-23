import { useState } from "react"
import { Mail, Phone, Plus, UserRound } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BackLink } from "@/components/header"
import { ProfileOfferCard } from "@/components/profile-offer-card"
import { ProfileSettings } from "@/components/profile-settings"
import {
  getOwnOffers,
  getProfile,
  saveProfile,
  type Offer,
  type Profile,
} from "@/lib/data"

const borrowedOffers: Offer[] = [1, 2].map((number) => ({
  id: `bike-${number}`,
  title: "Велосипед",
  description: "Городской велосипед",
  price: 10000,
  location: "Москва",
}))

export function ProfilePage() {
  const requestedTab = new URLSearchParams(window.location.search).get("tab")
  const initialTab =
    requestedTab === "renting" || requestedTab === "settings"
      ? requestedTab
      : "borrowing"
  const [profile, setProfile] = useState(getProfile)
  const [ownOffers] = useState(getOwnOffers)

  function updateProfile(next: Profile) {
    saveProfile(next)
    setProfile(next)
  }

  return (
    <main className="page-shell py-9 pb-20">
      <BackLink />
      <div className="mb-9 flex flex-wrap items-center gap-5">
        <Avatar className="size-24 border-4 border-card shadow-sm">
          <AvatarFallback className="text-3xl">
            <UserRound size={38} />
          </AvatarFallback>
        </Avatar>
        <div>
          <span className="eyebrow">Личный кабинет</span>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-.05em]">
            {profile.name}
          </h1>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
            {profile.email ? (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 hover:text-primary"
              >
                <Mail size={16} />
                {profile.email}
              </a>
            ) : (
              <a
                href="/page?tab=settings"
                className="inline-flex items-center gap-2 hover:text-primary"
              >
                <Mail size={16} />
                Добавить почту
              </a>
            )}
            {profile.phone ? (
              <a
                href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`}
                className="inline-flex items-center gap-2 hover:text-primary"
              >
                <Phone size={16} />
                {profile.phone}
              </a>
            ) : (
              <a
                href="/page?tab=settings"
                className="inline-flex items-center gap-2 hover:text-primary"
              >
                <Phone size={16} />
                Добавить телефон
              </a>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue={initialTab}>
        <TabsList
          variant="line"
          className="mb-8 w-full justify-start gap-4 border-b border-border sm:gap-8"
        >
          <TabsTrigger value="borrowing" className="px-3 py-3">
            Я беру
          </TabsTrigger>
          <TabsTrigger value="renting" className="px-3 py-3">
            Я сдаю
          </TabsTrigger>
          <TabsTrigger value="settings" className="px-3 py-3">
            Настройки
          </TabsTrigger>
        </TabsList>
        <TabsContent value="borrowing">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              Мои аренды
            </h2>
            <p className="mt-1 text-muted-foreground">
              Вещи, которые сейчас нужны вам.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {borrowedOffers.map((offer, index) => (
              <ProfileOfferCard
                key={offer.id}
                offer={offer}
                status="Активная аренда"
                details="16–20 октября · Москва"
                index={index}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="renting">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Мои предложения
              </h2>
              <p className="mt-1 text-muted-foreground">
                Вещи, которыми вы делитесь.
              </p>
            </div>
            <Button render={<a href="/add-offer" />} nativeButton={false}>
              <Plus />
              Добавить предложение
            </Button>
          </div>
          {ownOffers.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {ownOffers.map((offer, index) => (
                <ProfileOfferCard
                  key={offer.id}
                  offer={offer}
                  status="Опубликовано"
                  details={offer.location}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <Empty className="rounded-2xl border border-dashed border-border bg-card">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Plus />
                </EmptyMedia>
                <EmptyTitle>Пока нет предложений</EmptyTitle>
                <EmptyDescription>
                  Добавьте первую вещь, которой готовы поделиться.
                </EmptyDescription>
              </EmptyHeader>
              <Button render={<a href="/add-offer" />} nativeButton={false}>
                Добавить вещь
              </Button>
            </Empty>
          )}
        </TabsContent>
        <TabsContent value="settings">
          <ProfileSettings profile={profile} onSave={updateProfile} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
