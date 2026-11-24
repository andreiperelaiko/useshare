import { useState, type FormEvent } from "react"
import { MapPin, Send, ShieldCheck } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { ChatList, type Conversation } from "@/components/chat-list"
import { ProductVisual } from "@/components/offer-card"
import imageCredits from "@/data/image-credits.json"
import {
  formatPrice,
  getConversations,
  getMessages,
  getOffers,
  saveMessage,
  type ChatMessage,
  type Offer,
} from "@/lib/data"

type ImageCredit = {
  source: string
  artist: string
  license: string
  licenseUrl: string
}

function OfferSummary({
  offer,
  imageCredit,
}: {
  offer: Offer
  imageCredit?: ImageCredit
}) {
  return (
    <Card className="gap-0 overflow-hidden p-0 shadow-sm ring-0">
      <div className="h-52 sm:h-56 lg:h-48">
        <ProductVisual offer={offer} compact />
      </div>
      <CardHeader className="px-5 pt-5 pb-2">
        <CardTitle>
          <h1 className="text-xl leading-tight font-semibold tracking-tight">
            {offer.title}
          </h1>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-5 pb-5">
        <p className="text-sm leading-6 whitespace-pre-wrap text-muted-foreground">
          {offer.description}
        </p>
        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin size={16} className="mt-0.5 shrink-0" />
          <span>
            {offer.location}
            {offer.metro && ` · м. ${offer.metro}`}
          </span>
        </p>
        <p>
          <strong className="text-2xl">{formatPrice(offer.price)}</strong>
          <span className="ml-1 text-sm text-muted-foreground">/ день</span>
        </p>
        {offer.isDemo && (
          <p className="text-xs text-muted-foreground">
            Демонстрационное объявление. Цена и доступность приведены для
            примера.
          </p>
        )}
        {imageCredit && (
          <p className="text-xs text-muted-foreground">
            Фото:{" "}
            <a
              href={imageCredit.source}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              {imageCredit.artist}
            </a>
            {" · "}
            <a
              href={imageCredit.licenseUrl}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              {imageCredit.license}
            </a>
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function ChatPanel({
  offer,
  messages,
  draft,
  onDraftChange,
  onSend,
}: {
  offer: Offer
  messages: ChatMessage[]
  draft: string
  onDraftChange: (value: string) => void
  onSend: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <Card className="h-[min(78dvh,860px)] min-h-[560px] min-w-0 gap-0 overflow-hidden py-0 shadow-sm ring-0">
      <CardHeader className="border-b border-border/60 px-5 py-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <Avatar size="sm">
            <AvatarFallback>А</AvatarFallback>
          </Avatar>
          Чат по объявлению
        </CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-4 px-4 py-4 sm:px-5">
        <MessageScrollerProvider>
          <MessageScroller className="min-h-0 flex-1">
            <MessageScrollerViewport>
              <MessageScrollerContent className="py-3">
                <MessageScrollerItem>
                  <Message>
                    <MessageAvatar>
                      <Avatar size="sm">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </MessageAvatar>
                    <MessageContent>
                      <MessageHeader>Use & Share</MessageHeader>
                      <Bubble variant="secondary">
                        <BubbleContent>
                          {offer.isDemo
                            ? "Это демонстрационное объявление. Сообщения сохраняются только в вашем браузере."
                            : "Напишите владельцу, чтобы обсудить детали аренды и удобное время встречи."}
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
                {messages.map((item) => (
                  <MessageScrollerItem key={item.id}>
                    <Message align="end">
                      <MessageContent>
                        <Bubble>
                          <BubbleContent>{item.text}</BubbleContent>
                        </Bubble>
                        <MessageFooter>{item.time}</MessageFooter>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
          </MessageScroller>
        </MessageScrollerProvider>
        <form onSubmit={onSend}>
          <InputGroup>
            <InputGroupInput
              aria-label="Сообщение"
              placeholder="Написать сообщение…"
              value={draft}
              onChange={(event) => onDraftChange(event.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <Button
                type="submit"
                size="icon-sm"
                disabled={!draft.trim()}
                aria-label="Отправить сообщение"
              >
                <Send />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export function DetailPage() {
  const id = new URLSearchParams(window.location.search).get("id") ?? "demo-001"
  const offers = getOffers()
  const offer: Offer = offers.find((item) => item.id === id) ?? {
    id,
    title: "Велосипед",
    description: "Удобный городской велосипед для поездок по городу.",
    price: 10000,
    location: "Москва",
  }
  const imageCredit = (imageCredits as Record<string, ImageCredit>)[id]
  const [messages, setMessages] = useState(() => getMessages(id))
  const [draft, setDraft] = useState("")
  const savedConversations = getConversations()
  const conversationEntries = savedConversations.some(
    (item) => item.offerId === id
  )
    ? savedConversations
    : [{ offerId: id, messages: [] }, ...savedConversations]
  const conversations: Conversation[] = conversationEntries.map((item) => ({
    ...item,
    offer: offers.find((candidate) => candidate.id === item.offerId),
  }))

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft.trim()) return
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      text: draft.trim(),
      time: new Intl.DateTimeFormat("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
    }
    saveMessage(id, message)
    setMessages((current) => [...current, message])
    setDraft("")
  }

  return (
    <main className="page-shell py-8 pb-16">
      <div className="grid items-start gap-5 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[230px_minmax(0,1fr)_290px]">
        <ChatList conversations={conversations} activeId={id} />
        <ChatPanel
          offer={offer}
          messages={messages}
          draft={draft}
          onDraftChange={setDraft}
          onSend={send}
        />
        <aside className="flex min-w-0 flex-col gap-5 lg:col-start-2 xl:col-start-auto">
          <OfferSummary offer={offer} imageCredit={imageCredit} />
          <Card className="shadow-sm ring-0">
            <CardHeader>
              <CardTitle className="text-lg">Текущий статус</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                {messages.length ? "Обсуждение аренды" : "Ожидает сообщения"}
              </Badge>
            </CardContent>
          </Card>
          <div className="flex items-start gap-3 rounded-xl bg-accent p-4 text-sm leading-6 text-accent-foreground">
            <ShieldCheck className="mt-1 shrink-0" size={18} />
            <p>
              Обсуждайте аренду и договорённости в чате. Контактные данные
              доступны в профиле.
            </p>
          </div>
        </aside>
      </div>
    </main>
  )
}
