import { auth } from "@/lib/auth"
import ChatInterface from "@/components/ChatInterface"
import Sidebar from "@/components/Sidebar"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <section className="w-full h-screen flex">
      <Sidebar />
      <ChatInterface />
    </section>
  )
}
