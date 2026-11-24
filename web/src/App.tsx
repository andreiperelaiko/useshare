import { Header } from "@/components/header"
import { HomePage } from "@/pages/home"
import { ProfilePage } from "@/pages/profile"
import { DetailPage } from "@/pages/detail"
import { AddOfferPage } from "@/pages/add-offer"
import { AddRequestPage } from "@/pages/add-request"

function CurrentPage() {
  switch (window.location.pathname) {
    case "/page":
      return <ProfilePage />
    case "/page-2":
      return <DetailPage />
    case "/add-offer":
      return <AddOfferPage />
    case "/add-request":
      return <AddRequestPage />
    default:
      return <HomePage />
  }
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <CurrentPage />
    </div>
  )
}
