import { demoOffers } from "@/data/demo-offers"
import type { ChatMessage, Offer, Profile } from "@/lib/types"

export type { ChatMessage, Offer, Profile } from "@/lib/types"

const OFFER_KEY = "use-and-share-offers-v2"
const PROFILE_KEY = "use-and-share-profile-v2"
const MESSAGE_KEY = "use-and-share-messages-v1"

function read<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

export function getOwnOffers(): Offer[] {
  return read<Offer[]>(OFFER_KEY, [])
}

export function getOffers(): Offer[] {
  return [...getOwnOffers(), ...demoOffers]
}

export function saveOffer(offer: Offer) {
  localStorage.setItem(OFFER_KEY, JSON.stringify([offer, ...getOwnOffers()]))
}

export function getProfile(): Profile {
  return read<Profile>(PROFILE_KEY, {
    name: "Андрей Перелайко",
    email: "",
    phone: "",
  })
}

export function saveProfile(profile: Profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function getMessages(id: string): ChatMessage[] {
  return read<Record<string, ChatMessage[]>>(MESSAGE_KEY, {})[id] ?? []
}

export function saveMessage(id: string, message: ChatMessage) {
  const all = read<Record<string, ChatMessage[]>>(MESSAGE_KEY, {})
  all[id] = [...(all[id] ?? []), message]
  localStorage.setItem(MESSAGE_KEY, JSON.stringify(all))
}

export const formatPrice = (price: number) =>
  `${new Intl.NumberFormat("ru-RU").format(price)} ₽`
