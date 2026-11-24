import { useState } from "react"
import { ChevronDown, MessageCircle, Package } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChatMessage, Offer } from "@/lib/data"

export type Conversation = {
  offerId: string
  offer?: Offer
  messages: ChatMessage[]
}

export function ChatList({
  conversations,
  activeId,
}: {
  conversations: Conversation[]
  activeId: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="min-w-0 gap-0 overflow-hidden p-0 shadow-sm ring-0 lg:h-[min(78dvh,860px)] lg:min-h-[560px]">
      <CardHeader className="border-b border-border/60 px-4 py-4">
        <CardTitle className="flex items-center justify-between gap-2 text-base">
          <span className="flex items-center gap-2">
            <MessageCircle size={18} />
            Чаты
            <span className="text-sm font-normal text-muted-foreground">
              {conversations.length}
            </span>
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            aria-label={
              isOpen ? "Свернуть список чатов" : "Открыть список чатов"
            }
            aria-expanded={isOpen}
            aria-controls="conversation-list"
            onClick={() => setIsOpen((current) => !current)}
          >
            <ChevronDown
              className={cn("transition-transform", isOpen && "rotate-180")}
            />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent
        id="conversation-list"
        className={cn(
          "min-h-0 overflow-y-auto p-2 lg:block lg:flex-1",
          isOpen ? "max-h-80" : "hidden"
        )}
      >
        <nav
          aria-label="Диалоги по объявлениям"
          className="flex flex-col gap-1"
        >
          {conversations.map(({ offerId, offer, messages }) => {
            const lastMessage = messages.at(-1)
            const isActive = offerId === activeId

            return (
              <a
                key={offerId}
                href={`/page-2?id=${encodeURIComponent(offerId)}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-w-0 items-center gap-3 rounded-xl p-2 transition-colors hover:bg-accent",
                  isActive && "bg-accent"
                )}
              >
                <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
                  {offer?.image ? (
                    <img
                      src={offer.image}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  ) : (
                    <Package size={20} />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-sm leading-snug font-medium">
                    {offer?.title ?? "Объявление недоступно"}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {lastMessage?.text ?? "Начните общение"}
                  </span>
                </span>
              </a>
            )
          })}
        </nav>
      </CardContent>
    </Card>
  )
}
