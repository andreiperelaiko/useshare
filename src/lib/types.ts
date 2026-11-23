export type Offer = {
  id: string
  title: string
  description: string
  price: number
  location: string
  metro?: string
  category?: string
  image?: string
  isDemo?: boolean
}

export type Profile = { name: string; email: string; phone: string }
export type ChatMessage = { id: string; text: string; time: string }

export type RentalRequest = {
  id: string
  title: string
  description: string
  location: string
  budget?: number
  startDate?: string
  endDate?: string
  createdAt: string
  isDemo?: boolean
}
