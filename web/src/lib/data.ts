import { demoOffers } from "@/data/demo-offers"
import { demoRequests } from "@/data/demo-requests"
import type { ChatMessage, Offer, Profile, RentalRequest } from "@/lib/types"

export type { ChatMessage, Offer, Profile, RentalRequest } from "@/lib/types"

const OFFER_KEY = "use-and-share-offers-v2"
const PROFILE_KEY = "use-and-share-profile-v2"
const MESSAGE_KEY = "use-and-share-messages-v1"
const RENTAL_REQUEST_KEY = "use-and-share-rental-requests-v1"

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

export function getRentalRequests(): RentalRequest[] {
  return read<RentalRequest[]>(RENTAL_REQUEST_KEY, [])
}

export function getCatalogRequests(): RentalRequest[] {
  return [...getRentalRequests(), ...demoRequests]
}

export function saveRentalRequest(request: RentalRequest) {
  localStorage.setItem(
    RENTAL_REQUEST_KEY,
    JSON.stringify([request, ...getRentalRequests()])
  )
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

export function getConversations(): {
  offerId: string
  messages: ChatMessage[]
}[] {
  const all = read<Record<string, ChatMessage[]>>(MESSAGE_KEY, {})
  return Object.entries(all)
    .filter(([, messages]) => messages.length > 0)
    .reverse()
    .map(([offerId, messages]) => ({ offerId, messages }))
}

export function saveMessage(id: string, message: ChatMessage) {
  const all = read<Record<string, ChatMessage[]>>(MESSAGE_KEY, {})
  const messages = all[id] ?? []
  delete all[id]
  all[id] = [...messages, message]
  localStorage.setItem(MESSAGE_KEY, JSON.stringify(all))
}

export const formatPrice = (price: number) =>
  `${new Intl.NumberFormat("ru-RU").format(price)} ₽`
