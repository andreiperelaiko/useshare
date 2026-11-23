import { ArrowUpRight, Plus, UserRound } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="page-shell flex h-20 items-center justify-between gap-4">
        <a
          href="/"
          className="brand-script text-3xl leading-none whitespace-nowrap sm:text-4xl"
          aria-label="Use & Share — главная"
        >
          Use & Share
          <span className="ml-1 inline-block align-top font-sans text-sm">
            ✳
          </span>
        </a>
        <nav
          className="flex items-center gap-2 sm:gap-3"
          aria-label="Главное меню"
        >
          <a
            href="/"
            className="hidden px-3 text-sm font-medium hover:text-primary sm:inline"
          >
            Ассортимент
          </a>
          <Button
            variant="ghost"
            render={<a href="/page" />}
            nativeButton={false}
            aria-label="Профиль"
          >
            <Avatar size="sm">
              <AvatarFallback>
                <UserRound />
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline">Профиль</span>
          </Button>
          <Button
            render={<a href="/add-offer" />}
            nativeButton={false}
            size="sm"
          >
            <Plus />
            <span className="hidden sm:inline">Разместить вещь</span>
            <span className="sm:hidden">Добавить</span>
          </Button>
        </nav>
      </div>
    </header>
  )
}
export function BackLink({
  href = "/",
  label = "К ассортименту",
}: {
  href?: string
  label?: string
}) {
  return (
    <a
      href={href}
      className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
    >
      <ArrowUpRight className="rotate-[-135deg]" size={17} />
      {label}
    </a>
  )
}
