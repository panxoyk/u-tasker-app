"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, Clock, CheckCircle, Circle, GraduationCap, Filter } from "lucide-react"
import Link from "next/link"

export default function TasksPage() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Tarea de Matemáticas - Derivadas",
      description: "Resolver ejercicios del capítulo 5, problemas 1-20",
      subject: "Matemáticas",
      dueDate: "2024-01-15",
      priority: "high",
      completed: false,
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      title: "Proyecto de Programación",
      description: "Desarrollar aplicación web con React y Node.js",
      subject: "Programación",
      dueDate: "2024-01-18",
      priority: "medium",
      completed: false,
      createdAt: "2024-01-08",
    },
    {
      id: 3,
      title: "Laboratorio de Física",
      description: "Informe del experimento de péndulo simple",
      subject: "Física",
      dueDate: "2024-01-20",
      priority: "low",
      completed: true,
      createdAt: "2024-01-05",
    },
  ])

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    subject: "",
    dueDate: "",
    priority: "medium",
  })

  const [isAddingTask, setIsAddingTask] = useState(false)
  const [filter, setFilter] = useState("all") // all, pending, completed
  const [priorityFilter, setPriorityFilter] = useState("all")

  const subjects = ["Matemáticas", "Física", "Programación"]

  const addTask = () => {
    if (newTask.title && newTask.subject && newTask.dueDate) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          ...newTask,
          completed: false,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ])
      setNewTask({
        title: "",
        description: "",
        subject: "",
        dueDate: "",
        priority: "medium",
      })
      setIsAddingTask(false)
    }
  }

  const toggleTask = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending" && task.completed) return false
    if (filter === "completed" && !task.completed) return false
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false
    return true
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getPriorityText = (priority) => {
    switch (priority) {
      case "high":
        return "Alta"
      case "medium":
        return "Media"
      case "low":
        return "Baja"
      default:
        return "Media"
    }
  }

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && !tasks.find((t) => t.dueDate === dueDate)?.completed
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Tareas</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Tarea
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Tarea</DialogTitle>
                    <DialogDescription>Agrega una nueva tarea a tu lista</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="task-title">Título de la Tarea</Label>
                      <Input
                        id="task-title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="ej. Tarea de Matemáticas"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="task-description">Descripción</Label>
                      <Textarea
                        id="task-description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Describe los detalles de la tarea..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="task-subject">Materia</Label>
                        <Select
                          value={newTask.subject}
                          onValueChange={(value) => setNewTask({ ...newTask, subject: value })}
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
                        <Label htmlFor="task-priority">Prioridad</Label>
                        <Select
                          value={newTask.priority}
                          onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">Alta</SelectItem>
                            <SelectItem value="medium">Media</SelectItem>
                            <SelectItem value="low">Baja</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="task-due-date">Fecha de Entrega</Label>
                      <Input
                        id="task-due-date"
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={addTask}>Crear Tarea</Button>
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
              <CardTitle className="text-sm font-medium">Total de Tareas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{tasks.filter((t) => !t.completed).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{tasks.filter((t) => t.completed).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {tasks.filter((t) => !t.completed && new Date(t.dueDate) < new Date()).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filtros</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Label>Estado:</Label>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="completed">Completadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Label>Prioridad:</Label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="low">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className={`${task.completed ? "opacity-75" : ""}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Button variant="ghost" size="sm" onClick={() => toggleTask(task.id)} className="mt-1">
                      {task.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${task.completed ? "line-through text-gray-500" : ""}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className={`text-gray-600 mt-1 ${task.completed ? "line-through" : ""}`}>
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-3">
                        <Badge variant="outline">{task.subject}</Badge>
                        <Badge variant={getPriorityColor(task.priority)}>{getPriorityText(task.priority)}</Badge>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(task.dueDate) < new Date() && !task.completed ? (
                              <span className="text-red-600 font-medium">Vencida - {task.dueDate}</span>
                            ) : (
                              task.dueDate
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay tareas</h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "Comienza creando tu primera tarea"
                : `No hay tareas ${filter === "pending" ? "pendientes" : "completadas"}`}
            </p>
            {filter === "all" && (
              <Button onClick={() => setIsAddingTask(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Tarea
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
