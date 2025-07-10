import Navbar from "@/components/Navbar";

export default function Page() {

  return (
  <><Navbar /><div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Horario</h1>
      <p className="text-lg text-gray-700">Esta es la página de horario.</p>
      <p className="text-lg text-gray-700">Aquí puedes ver y gestionar tus horarios.</p>
    </div></>


)
}