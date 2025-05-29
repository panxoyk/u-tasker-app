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
import { Plus, FileText, Search, Edit, Trash2, GraduationCap, BookOpen, Calendar } from "lucide-react"
import Link from "next/link"

export default function NotesPage() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Derivadas - Regla de la Cadena",
      content:
        "La regla de la cadena es fundamental para derivar funciones compuestas. Si tenemos f(g(x)), entonces la derivada es f'(g(x)) * g'(x).\n\nEjemplos:\n- d/dx[sin(x²)] = cos(x²) * 2x\n- d/dx[e^(3x)] = e^(3x) * 3",
      subject: "Matemáticas",
      tags: ["derivadas", "cálculo", "regla-cadena"],
      createdAt: "2024-01-10",
      updatedAt: "2024-01-10",
    },
    {
      id: 2,
      title: "Leyes de Newton",
      content:
        "Las tres leyes fundamentales de la mecánica clásica:\n\n1. Primera Ley (Inercia): Un objeto en reposo permanece en reposo y un objeto en movimiento permanece en movimiento a velocidad constante, a menos que actúe una fuerza externa.\n\n2. Segunda Ley: F = ma. La fuerza es igual a la masa por la aceleración.\n\n3. Tercera Ley: Para cada acción hay una reacción igual y opuesta.",
      subject: "Física",
      tags: ["mecánica", "fuerzas", "newton"],
      createdAt: "2024-01-08",
      updatedAt: "2024-01-09",
    },
    {
      id: 3,
      title: "Programación Orientada a Objetos - Conceptos Básicos",
      content:
        "Los cuatro pilares de la POO:\n\n1. Encapsulación: Ocultar los detalles internos de implementación\n2. Herencia: Crear nuevas clases basadas en clases existentes\n3. Polimorfismo: Capacidad de un objeto de tomar múltiples formas\n4. Abstracción: Simplificar la complejidad mostrando solo lo esencial\n\nEjemplo en Java:\nclass Animal {\n  protected String nombre;\n  public void hacerSonido() { }\n}",
      subject: "Programación",
      tags: ["poo", "java", "conceptos"],
      createdAt: "2024-01-05",
      updatedAt: "2024-01-07",
    },
  ])

  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    subject: "",
    tags: "",
  })

  const [editingNote, setEditingNote] = useState(null)
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")

  const subjects = ["Matemáticas", "Física", "Programación"]

  const addNote = () => {
    if (newNote.title && newNote.content && newNote.subject) {
      const tags = newNote.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)
      setNotes([
        ...notes,
        {
          id: Date.now(),
          title: newNote.title,
          content: newNote.content,
          subject: newNote.subject,
          tags: tags,
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
        },
      ])
      setNewNote({ title: "", content: "", subject: "", tags: "" })
      setIsAddingNote(false)
    }
  }

  const updateNote = () => {
    if (editingNote && editingNote.title && editingNote.content && editingNote.subject) {
      const tags = editingNote.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)
      setNotes(
        notes.map((note) =>
          note.id === editingNote.id
            ? {
                ...editingNote,
                tags: tags,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : note,
        ),
      )
      setEditingNote(null)
      setIsEditingNote(false)
    }
  }

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const startEditing = (note) => {
    setEditingNote({
      ...note,
      tags: note.tags.join(", "),
    })
    setIsEditingNote(true)
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSubject = selectedSubject === "all" || note.subject === selectedSubject
    return matchesSearch && matchesSubject
  })

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
              <h1 className="text-2xl font-bold text-gray-900">Mis Notas</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Nota
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Nota</DialogTitle>
                    <DialogDescription>Agrega una nueva nota de estudio</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="note-title">Título</Label>
                      <Input
                        id="note-title"
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        placeholder="ej. Derivadas - Regla de la Cadena"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="note-subject">Materia</Label>
                        <Select
                          value={newNote.subject}
                          onValueChange={(value) => setNewNote({ ...newNote, subject: value })}
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
                        <Label htmlFor="note-tags">Etiquetas</Label>
                        <Input
                          id="note-tags"
                          value={newNote.tags}
                          onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                          placeholder="derivadas, cálculo, matemáticas"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="note-content">Contenido</Label>
                      <Textarea
                        id="note-content"
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                        placeholder="Escribe el contenido de tu nota aquí..."
                        rows={10}
                        className="min-h-[200px]"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={addNote}>Crear Nota</Button>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Notas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Materias</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(notes.map((note) => note.subject)).size}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notas Recientes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  notes.filter((note) => {
                    const noteDate = new Date(note.updatedAt)
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    return noteDate >= weekAgo
                  }).length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar en notas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las materias</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="h-fit">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline">{note.subject}</Badge>
                      <span className="text-xs text-gray-500">{note.updatedAt}</span>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => startEditing(note)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-700 line-clamp-4">{note.content}</p>
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-24 w-24 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || selectedSubject !== "all" ? "No se encontraron notas" : "No hay notas creadas"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedSubject !== "all"
                ? "Intenta con otros términos de búsqueda o filtros"
                : "Comienza creando tu primera nota de estudio"}
            </p>
            {!searchTerm && selectedSubject === "all" && (
              <Button onClick={() => setIsAddingNote(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Nota
              </Button>
            )}
          </div>
        )}

        {/* Edit Note Dialog */}
        <Dialog open={isEditingNote} onOpenChange={setIsEditingNote}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Nota</DialogTitle>
              <DialogDescription>Modifica el contenido de tu nota</DialogDescription>
            </DialogHeader>
            {editingNote && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Título</Label>
                  <Input
                    id="edit-title"
                    value={editingNote.title}
                    onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-subject">Materia</Label>
                    <Select
                      value={editingNote.subject}
                      onValueChange={(value) => setEditingNote({ ...editingNote, subject: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                    <Label htmlFor="edit-tags">Etiquetas</Label>
                    <Input
                      id="edit-tags"
                      value={editingNote.tags}
                      onChange={(e) => setEditingNote({ ...editingNote, tags: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-content">Contenido</Label>
                  <Textarea
                    id="edit-content"
                    value={editingNote.content}
                    onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                    rows={10}
                    className="min-h-[200px]"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditingNote(false)}>
                Cancelar
              </Button>
              <Button onClick={updateNote}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
