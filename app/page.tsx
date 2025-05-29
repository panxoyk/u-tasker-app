"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, BookOpen, ClipboardList, FileText, GraduationCap, Plus, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const [semesters] = useState([
    {
      id: 1,
      name: "Semestre 2024-1",
      subjects: [
        { id: 1, name: "Matemáticas", color: "bg-blue-500" },
        { id: 2, name: "Física", color: "bg-green-500" },
        { id: 3, name: "Programación", color: "bg-purple-500" },
      ],
    },
  ])

  const [upcomingTasks] = useState([
    { id: 1, title: "Tarea de Matemáticas", subject: "Matemáticas", dueDate: "2024-01-15", priority: "high" },
    { id: 2, title: "Proyecto de Programación", subject: "Programación", dueDate: "2024-01-18", priority: "medium" },
    { id: 3, title: "Laboratorio de Física", subject: "Física", dueDate: "2024-01-20", priority: "low" },
  ])

  const [upcomingExams] = useState([
    { id: 1, title: "Examen Parcial", subject: "Matemáticas", date: "2024-01-22", type: "Parcial" },
    { id: 2, title: "Quiz de Física", subject: "Física", date: "2024-01-25", type: "Quiz" },
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">StudyApp</h1>
            </div>
            <nav className="flex space-x-4">
              <Link href="/semesters">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Semestres</span>
                </Button>
              </Link>
              <Link href="/calendar">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Calendario</span>
                </Button>
              </Link>
              <Link href="/tasks">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <ClipboardList className="h-4 w-4" />
                  <span>Tareas</span>
                </Button>
              </Link>
              <Link href="/exams">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Evaluaciones</span>
                </Button>
              </Link>
              <Link href="/notes">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Notas</span>
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Bienvenido a tu centro de estudios</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Semestres Activos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{semesters.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Materias</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {semesters.reduce((total, semester) => total + semester.subjects.length, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingTasks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximos Exámenes</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingExams.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Semester */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Semestre Actual
                <Link href="/semesters">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Gestionar
                  </Button>
                </Link>
              </CardTitle>
              <CardDescription>Materias del semestre activo</CardDescription>
            </CardHeader>
            <CardContent>
              {semesters.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="font-semibold">{semesters[0].name}</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {semesters[0].subjects.map((subject) => (
                      <div key={subject.id} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                        <div className={`w-3 h-3 rounded-full ${subject.color}`}></div>
                        <span className="font-medium">{subject.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No hay semestres creados</p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Tareas Próximas
                <Link href="/tasks">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Ver Todas
                  </Button>
                </Link>
              </CardTitle>
              <CardDescription>Tareas con fechas de entrega próximas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-600">{task.subject}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          task.priority === "high"
                            ? "destructive"
                            : task.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {task.dueDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Exams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Próximas Evaluaciones
                <Link href="/exams">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Ver Todas
                  </Button>
                </Link>
              </CardTitle>
              <CardDescription>Exámenes y evaluaciones programadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingExams.map((exam) => (
                  <div key={exam.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium">{exam.title}</p>
                      <p className="text-sm text-gray-600">{exam.subject}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{exam.type}</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {exam.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Accesos directos a funciones principales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/calendar">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                    <Calendar className="h-6 w-6" />
                    <span className="text-sm">Agregar Clase</span>
                  </Button>
                </Link>
                <Link href="/tasks">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                    <ClipboardList className="h-6 w-6" />
                    <span className="text-sm">Nueva Tarea</span>
                  </Button>
                </Link>
                <Link href="/exams">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                    <AlertCircle className="h-6 w-6" />
                    <span className="text-sm">Nueva Evaluación</span>
                  </Button>
                </Link>
                <Link href="/notes">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">Tomar Notas</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
