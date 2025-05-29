"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Clock, AlertCircle, GraduationCap, BookOpen } from "lucide-react"
import Link from "next/link"

export default function ExamsPage() {
  const [exams, setExams] = useState([
    {
      id: 1,
      title: "Examen Parcial de Cálculo",
      subject: "Matemáticas",
      type: "Parcial",
      date: "2024-01-22",
      time: "08:00",
      duration: "120",
      location: "Aula 101",
      topics: "Derivadas, límites, continuidad",
      weight: "30",
    },
    {
      id: 2,
      title: "Quiz de Mecánica",
      subject: "Física",
      type: "Quiz",
      date: "2024-01-25",
      time: "14:00",
      duration: "60",
      location: "Lab 201",
      topics: "Cinemática, dinámica",
      weight: "15",
    },
    {
      id: 3,
      title: "Examen Final de Programación",
      subject: "Programación",
      type: "Final",
      date: "2024-02-05",
      time: "10:00",
      duration: "180",
      location: "Lab Comp 1",
      topics: "POO, estructuras de datos, algoritmos",
      weight: "40",
    },
  ])

  const [newExam, setNewExam] = useState({
    title: "",
    subject: "",
    type: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    topics: "",
    weight: "",
  })

  const [isAddingExam, setIsAddingExam] = useState(false)

  const subjects = ["Matemáticas", "Física", "Programación"]
  const examTypes = ["Quiz", "Parcial", "Final", "Laboratorio", "Proyecto"]

  const addExam = () => {
    if (newExam.title && newExam.subject && newExam.type && newExam.date && newExam.time) {
      setExams([
        ...exams,
        {
          id: Date.now(),
          ...newExam,
        },
      ])
      setNewExam({
        title: "",
        subject: "",
        type: "",
        date: "",
        time: "",
        duration: "",
        location: "",
        topics: "",
        weight: "",
      })
      setIsAddingExam(false)
    }
  }

  const deleteExam = (id) => {
    setExams(exams.filter((exam) => exam.id !== id))
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "Final":
        return "destructive"
      case "Parcial":
        return "default"
      case "Quiz":
        return "secondary"
      case "Laboratorio":
        return "outline"
      case "Proyecto":
        return "outline"
      default:
        return "default"
    }
  }

  const isUpcoming = (date) => {
    return new Date(date) >= new Date()
  }

  const sortedExams = [...exams].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Link href="/">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Evaluaciones</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isAddingExam} onOpenChange={setIsAddingExam}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Evaluación
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Evaluación</DialogTitle>
                    <DialogDescription>Programa una nueva evaluación o examen</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="exam-title">Título de la Evaluación</Label>
                      <Input
                        id="exam-title"
                        value={newExam.title}
                        onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                        placeholder="ej. Examen Parcial de Cálculo"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="exam-subject">Materia</Label>
                        <Select
                          value={newExam.subject}
                          onValueChange={(value) => setNewExam({ ...newExam, subject: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona materia" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem key={subject} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="exam-type">Tipo de Evaluación</Label>
                        <Select value={newExam.type} onValueChange={(value) => setNewExam({ ...newExam, type: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {examTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="exam-date">Fecha</Label>
                        <Input
                          id="exam-date"
                          type="date"
                          value={newExam.date}
                          onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="exam-time">Hora</Label>
                        <Input
                          id="exam-time"
                          type="time"
                          value={newExam.time}
                          onChange={(e) => setNewExam({ ...newExam, time: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="exam-duration">Duración (min)</Label>
                        <Input
                          id="exam-duration"
                          type="number"
                          value={newExam.duration}
                          onChange={(e) => setNewExam({ ...newExam, duration: e.target.value })}
                          placeholder="120"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="exam-location">Ubicación</Label>
                        <Input
                          id="exam-location"
                          value={newExam.location}
                          onChange={(e) => setNewExam({ ...newExam, location: e.target.value })}
                          placeholder="ej. Aula 101"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="exam-weight">Peso (%)</Label>
                        <Input
                          id="exam-weight"
                          type="number"
                          value={newExam.weight}
                          onChange={(e) => setNewExam({ ...newExam, weight: e.target.value })}
                          placeholder="30"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="exam-topics">Temas a Evaluar</Label>
                      <Textarea
                        id="exam-topics"
                        value={newExam.topics}
                        onChange={(e) => setNewExam({ ...newExam, topics: e.target.value })}
                        placeholder="Lista los temas principales que se evaluarán..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingExam(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={addExam}>Crear Evaluación</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Link href="/">
                <Button variant="outline">Volver al Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Evaluaciones</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exams.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximas</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {exams.filter((exam) => isUpcoming(exam.date)).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {
                  exams.filter((exam) => {
                    const examDate = new Date(exam.date)
                    const today = new Date()
                    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
                    return examDate >= today && examDate <= weekFromNow
                  }).length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Finales</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {exams.filter((exam) => exam.type === "Final").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Exams */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Próximas Evaluaciones</CardTitle>
            <CardDescription>Evaluaciones programadas en orden cronológico</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedExams
                .filter((exam) => isUpcoming(exam.date))
                .slice(0, 3)
                .map((exam) => (
                  <div key={exam.id} className="flex items-center justify-between p-4 rounded-lg border bg-white">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="text-2xl font-bold text-blue-600">{new Date(exam.date).getDate()}</div>
                        <div className="text-xs text-gray-500 uppercase">
                          {new Date(exam.date).toLocaleDateString("es-ES", { month: "short" })}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold">{exam.title}</h3>
                        <p className="text-sm text-gray-600">{exam.subject}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={getTypeColor(exam.type)}>{exam.type}</Badge>
                          {exam.weight && <Badge variant="outline">{exam.weight}%</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-sm text-gray-500 mb-1">
                        <Clock className="h-4 w-4" />
                        <span>{exam.time}</span>
                        {exam.duration && <span>({exam.duration} min)</span>}
                      </div>
                      {exam.location && <div className="text-sm text-gray-500">{exam.location}</div>}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* All Exams */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Todas las Evaluaciones</h3>
          <div className="grid gap-6">
            {sortedExams.map((exam) => (
              <Card key={exam.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{exam.title}</span>
                        {!isUpcoming(exam.date) && <Badge variant="secondary">Pasada</Badge>}
                      </CardTitle>
                      <CardDescription>{exam.subject}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getTypeColor(exam.type)}>{exam.type}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteExam(exam.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Fecha y Hora</Label>
                      <div className="flex items-center space-x-1 mt-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{exam.date}</span>
                        <Clock className="h-4 w-4 text-gray-400 ml-2" />
                        <span>{exam.time}</span>
                      </div>
                    </div>
                    {exam.duration && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Duración</Label>
                        <p className="mt-1">{exam.duration} minutos</p>
                      </div>
                    )}
                    {exam.location && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Ubicación</Label>
                        <p className="mt-1">{exam.location}</p>
                      </div>
                    )}
                    {exam.weight && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Peso</Label>
                        <p className="mt-1">{exam.weight}% de la nota final</p>
                      </div>
                    )}
                  </div>
                  {exam.topics && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium text-gray-500">Temas a Evaluar</Label>
                      <p className="mt-1 text-gray-700">{exam.topics}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {exams.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-24 w-24 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay evaluaciones programadas</h3>
            <p className="text-gray-600 mb-6">Comienza agregando tu primera evaluación</p>
            <Button onClick={() => setIsAddingExam(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Evaluación
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
