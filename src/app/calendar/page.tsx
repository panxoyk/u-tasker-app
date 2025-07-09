import { CalendarDisplay } from "@/components/calendar-display"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

// Mock functions - replace with your actual server actions
async function getAllCoursesFromActivePeriod() {
  return {
    data: [
      { id: 1, name: "Mathematics", code: "MATH101" },
      { id: 2, name: "Physics", code: "PHYS201" },
      { id: 3, name: "Chemistry", code: "CHEM301" },
    ],
    error: null,
  }
}

async function getEvaluationsByCourse(courseId: number) {
  const mockEvaluations = [
    {
      id: 1,
      title: "Final Exam",
      course_id: 1,
      course: { id: 1, name: "Mathematics", code: "MATH101" },
      start_date: "2024-01-15T09:00:00",
      end_date: "2024-01-15T11:00:00",
    },
    {
      id: 2,
      title: "Midterm Test",
      course_id: 2,
      course: { id: 2, name: "Physics", code: "PHYS201" },
      start_date: "2024-01-20T14:00:00",
      end_date: "2024-01-20T16:00:00",
    },
  ]

  return {
    success: true,
    data: mockEvaluations.filter((e) => e.course_id === courseId),
  }
}

export default async function HomePage() {
  const { data: courses, error: coursesError } = await getAllCoursesFromActivePeriod()

  let allEvaluations: any[] = []
  let displayError: string | null = null

  if (coursesError) {
    console.error("Error al obtener los cursos:", coursesError)
    displayError = `Error al cargar los cursos: ${coursesError}.`
  } else if (!courses || courses.length === 0) {
    displayError = "No hay cursos activos disponibles para gestionar evaluaciones. Por favor, añade un curso primero."
  } else {
    const evaluationPromises = courses.map((course) => getEvaluationsByCourse(course.id))

    try {
      const results = await Promise.all(evaluationPromises)

      allEvaluations = results.flatMap((result) => {
        if (result.success && result.data) {
          return result.data
        } else {
          console.error(`Error al obtener evaluaciones para un curso: ${result.error}`)
          return []
        }
      })

      if (allEvaluations.length === 0 && !displayError) {
        displayError = "No hay evaluaciones programadas para tus cursos activos."
      }
    } catch (e: any) {
      console.error("Error inesperado al procesar las evaluaciones:", e)
      displayError = `Ocurrió un error inesperado al cargar las evaluaciones: ${e.message || "Error desconocido"}.`
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">Calendario de Evaluaciones</h1>
            {courses && courses.length > 0 && !coursesError && (
              <Button asChild variant="secondary">
                <Link href="/calendar/add">
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Evaluación
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 pt-20 pb-8">
        {displayError ? (
          <div className="mt-8 text-center">
            <p className="text-destructive text-lg">{displayError}</p>
          </div>
        ) : (
          <CalendarDisplay evaluations={allEvaluations} courses={courses || []} />
        )}
      </main>
    </div>
  )
}