"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Plus, Clock, Repeat, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isAddingClass, setIsAddingClass] = useState(false)
  const [newClass, setNewClass] = useState({
    title: "",
    subject: "",
    startTime: "",
    endTime: "",
    location: "",
    isRecurring: false,
    recurringDays: [],
  })

  const [classes, setClasses] = useState([
    {
      id: 1,
      title: "Cálculo Diferencial",
      subject: "Matemáticas",
      startTime: "08:00",
      endTime: "10:00",
      location: "Aula 101",
      day: 1, // Monday
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Laboratorio de Física",
      subject: "Física",
      startTime: "14:00",
      endTime: "16:00",
      location: "Lab 201",
      day: 3, // Wednesday
      color: "bg-green-500",
    },
    {
      id: 3,
      title: "Programación Orientada a Objetos",
      subject: "Programación",
      startTime: "10:00",
      endTime: "12:00",
      location: "Lab Comp 1",
      day: 5, // Friday
      color: "bg-purple-500",
    },
  ])

  const subjects = [
    { name: "Matemáticas", color: "bg-blue-500" },
    { name: "Física", color: "bg-green-500" },
    { name: "Programación", color: "bg-purple-500" },
  ]

  const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  const timeSlots = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 7
    return `${hour.toString().padStart(2, "0")}:00`
  })

  const addClass = () => {
    if (newClass.title && newClass.subject && newClass.startTime && newClass.endTime) {
      const subjectColor = subjects.find((s) => s.name === newClass.subject)?.color || "bg-gray-500"

      if (newClass.isRecurring && newClass.recurringDays.length > 0) {
        // Add recurring classes
        newClass.recurringDays.forEach((day) => {
          setClasses((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              title: newClass.title,
              subject: newClass.subject,
              startTime: newClass.startTime,
              endTime: newClass.endTime,
              location: newClass.location,
              day: Number.parseInt(day),
              color: subjectColor,
            },
          ])
        })
      } else {
        // Add single class (you'd need to select a specific day)
        setClasses((prev) => [
          ...prev,
          {
            id: Date.now(),
            title: newClass.title,
            subject: newClass.subject,
            startTime: newClass.startTime,
            endTime: newClass.endTime,
            location: newClass.location,
            day: 1, // Default to Monday
            color: subjectColor,
          },
        ])
      }

      setNewClass({
        title: "",
        subject: "",
        startTime: "",
        endTime: "",
        location: "",
        isRecurring: false,
        recurringDays: [],
      })
      setIsAddingClass(false)
    }
  }

  const getClassesForDay = (dayIndex) => {
    return classes.filter((cls) => cls.day === dayIndex)
  }

  const handleRecurringDayChange = (day, checked) => {
    if (checked) {
      setNewClass((prev) => ({
        ...prev,
        recurringDays: [...prev.recurringDays, day],
      }))
    } else {
      setNewClass((prev) => ({
        ...prev,
        recurringDays: prev.recurringDays.filter((d) => d !== day),
      }))
    }
  }

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
              <h1 className="text-2xl font-bold text-gray-900">Calendario de Clases</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isAddingClass} onOpenChange={setIsAddingClass}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Clase
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Agregar Nueva Clase</DialogTitle>
                    <DialogDescription>Programa una nueva clase en tu horario</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="class-title">Título de la Clase</Label>
                      <Input
                        id="class-title"
                        value={newClass.title}
                        onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
                        placeholder="ej. Cálculo Diferencial"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="class-subject">Materia</Label>
                      <Select
                        value={newClass.subject}
                        onValueChange={(value) => setNewClass({ ...newClass, subject: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una materia" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject.name} value={subject.name}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="start-time">Hora de Inicio</Label>
                        <Input
                          id="start-time"
                          type="time"
                          value={newClass.startTime}
                          onChange={(e) => setNewClass({ ...newClass, startTime: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="end-time">Hora de Fin</Label>
                        <Input
                          id="end-time"
                          type="time"
                          value={newClass.endTime}
                          onChange={(e) => setNewClass({ ...newClass, endTime: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Ubicación</Label>
                      <Input
                        id="location"
                        value={newClass.location}
                        onChange={(e) => setNewClass({ ...newClass, location: e.target.value })}
                        placeholder="ej. Aula 101"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="recurring"
                        checked={newClass.isRecurring}
                        onCheckedChange={(checked) => setNewClass({ ...newClass, isRecurring: checked })}
                      />
                      <Label htmlFor="recurring" className="flex items-center space-x-2">
                        <Repeat className="h-4 w-4" />
                        <span>Clase recurrente</span>
                      </Label>
                    </div>
                    {newClass.isRecurring && (
                      <div className="grid gap-2">
                        <Label>Días de la semana</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {daysOfWeek.slice(1, 6).map((day, index) => (
                            <div key={day} className="flex items-center space-x-2">
                              <Checkbox
                                id={`day-${index + 1}`}
                                checked={newClass.recurringDays.includes((index + 1).toString())}
                                onCheckedChange={(checked) => handleRecurringDayChange((index + 1).toString(), checked)}
                              />
                              <Label htmlFor={`day-${index + 1}`} className="text-sm">
                                {day}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingClass(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={addClass}>Agregar Clase</Button>
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
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Horario Semanal</h2>
            <p className="text-gray-600">Gestiona tu horario de clases</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">Semana Actual</span>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Weekly Calendar */}
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-6 border-b">
              <div className="p-4 border-r bg-gray-50">
                <span className="text-sm font-medium text-gray-500">Hora</span>
              </div>
              {daysOfWeek.slice(1, 6).map((day, index) => (
                <div key={day} className="p-4 border-r last:border-r-0 bg-gray-50">
                  <span className="text-sm font-medium text-gray-900">{day}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-6">
              {/* Time column */}
              <div className="border-r">
                {timeSlots.map((time) => (
                  <div key={time} className="h-16 p-2 border-b text-xs text-gray-500 flex items-center">
                    {time}
                  </div>
                ))}
              </div>

              {/* Days columns */}
              {[1, 2, 3, 4, 5].map((dayIndex) => (
                <div key={dayIndex} className="border-r last:border-r-0">
                  {timeSlots.map((time, timeIndex) => {
                    const dayClasses = getClassesForDay(dayIndex).filter((cls) => {
                      const classStartHour = Number.parseInt(cls.startTime.split(":")[0])
                      const slotHour = Number.parseInt(time.split(":")[0])
                      return classStartHour === slotHour
                    })

                    return (
                      <div key={time} className="h-16 border-b relative">
                        {dayClasses.map((cls) => {
                          const startHour = Number.parseInt(cls.startTime.split(":")[0])
                          const endHour = Number.parseInt(cls.endTime.split(":")[0])
                          const duration = endHour - startHour

                          return (
                            <div
                              key={cls.id}
                              className={`absolute inset-x-1 rounded p-1 text-white text-xs ${cls.color}`}
                              style={{
                                height: `${duration * 64 - 4}px`,
                                zIndex: 10,
                              }}
                            >
                              <div className="font-medium truncate">{cls.title}</div>
                              <div className="opacity-90 truncate">{cls.location}</div>
                              <div className="opacity-75 text-xs">
                                {cls.startTime} - {cls.endTime}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Classes */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Clases de Hoy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.slice(0, 3).map((cls) => (
              <Card key={cls.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${cls.color}`}></div>
                    <CardTitle className="text-lg">{cls.title}</CardTitle>
                  </div>
                  <CardDescription>{cls.subject}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>
                        {cls.startTime} - {cls.endTime}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{cls.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
