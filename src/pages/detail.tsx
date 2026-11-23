import { useState, type FormEvent } from "react"
import { Check, MapPin, Send, ShieldCheck } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { BackLink } from "@/components/header"
import { ProductVisual } from "@/components/offer-card"
import {
  formatPrice,
  getMessages,
  getOffers,
  saveMessage,
  type ChatMessage,
  type Offer,
} from "@/lib/data"

const stages = ["Заявка создана", "Заявка принята", "Предоплата"]
export function DetailPage() {
  const id =
    new URLSearchParams(window.location.search).get("id") ?? "mousepad-1"
  const offer: Offer = getOffers().find((item) => item.id === id) ?? {
    id,
    title: "Велосипед",
    description: "Удобный городской велосипед для поездок по городу.",
    price: 10000,
    location: "Москва",
  }
  const [messages, setMessages] = useState(() => getMessages(id))
  const [draft, setDraft] = useState("")
  const [stage, setStage] = useState(0)
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
    <main className="page-shell py-9 pb-20">
      <BackLink />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="eyebrow">Объявление · общение</span>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
            {offer.title}
          </h1>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,.7fr)]">
        <div className="min-w-0 space-y-6">
          <Card className="overflow-hidden border-border/70 p-0 shadow-none">
            <div className="grid sm:grid-cols-[220px_1fr]">
              <ProductVisual offer={offer} compact />
              <div className="flex flex-col justify-center gap-4 p-6">
                <p className="text-sm leading-6 text-muted-foreground">
                  {offer.description}
                </p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={16} />
                  {offer.location}
                </p>
                <p>
                  <strong className="text-2xl">
                    {formatPrice(offer.price)}
                  </strong>
                  <span className="ml-1 text-sm text-muted-foreground">
                    / день
                  </span>
                </p>
              </div>
            </div>
          </Card>
          <Card className="h-[440px] border-border/70 shadow-none">
            <CardHeader className="border-b border-border/70">
              <CardTitle className="flex items-center gap-3 text-lg">
                <Avatar size="sm">
                  <AvatarFallback>А</AvatarFallback>
                </Avatar>
                Чат по объявлению
              </CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
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
                                Напишите владельцу, чтобы обсудить детали аренды
                                и удобное время встречи.
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
              <form onSubmit={send}>
                <InputGroup>
                  <InputGroupInput
                    aria-label="Сообщение"
                    placeholder="Написать сообщение…"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
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
        </div>
        <aside className="space-y-6">
          <Card className="border-border/70 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Статус аренды</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stages.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={stage === index}
                  onClick={() => setStage(index)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition ${stage === index ? "border-primary bg-accent font-medium" : "border-transparent hover:bg-muted"}`}
                >
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full ${stage >= index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    {stage > index ? <Check size={15} /> : index + 1}
                  </span>
                  {label}
                </button>
              ))}
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
