export type Offer = {
  id: string
  title: string
  description: string
  price: number
  location: string
  image?: string
}
export type Profile = { name: string; email: string; phone: string }
const OFFER_KEY = "use-and-share-offers-v2"
const PROFILE_KEY = "use-and-share-profile-v2"
const MESSAGE_KEY = "use-and-share-messages-v1"
const defaults: Offer[] = [
  {
    id: "mousepad-1",
    title: "Коврик для мыши",
    description:
      "Удобный коврик для рабочего места. Забирайте на день или на неделю.",
    price: 10000,
    location: "Москва, Центральный район",
  },
  {
    id: "mousepad-2",
    title: "Коврик для мыши",
    description: "Мягкий коврик для мыши в отличном состоянии.",
    price: 10000,
    location: "Москва, Северный район",
  },
  {
    id: "mousepad-3",
    title: "Коврик для мыши",
    description: "Простой и практичный коврик, подойдёт для дома и офиса.",
    price: 10000,
    location: "Москва, Южный район",
  },
  {
    id: "mousepad-4",
    title: "Коврик для мыши",
    description: "Коврик для мыши в аренду рядом с вами.",
    price: 10000,
    location: "Москва, Западный район",
  },
]
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
  return [...getOwnOffers(), ...defaults]
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
export type ChatMessage = { id: string; text: string; time: string }
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
