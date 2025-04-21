import { Calendar } from "@/components/menu/calendar"
import { Sidebar } from "@/components/menu/sidebar"

export default function Home() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <h1 className="mb-6 text-2xl font-bold">Calendario</h1>
        <Calendar />
      </main>
    </div>
  )
}
