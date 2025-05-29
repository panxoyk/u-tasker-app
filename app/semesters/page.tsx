"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, BookOpen, GraduationCap, Calculator, Eye } from "lucide-react"
import Link from "next/link"

export default function SemestersPage() {
  const [semesters, setSemesters] = useState([
    {
      id: 1,
      name: "Semestre 2024-1",
      startDate: "2024-01-15",
      endDate: "2024-06-15",
      subjects: [
        {
          id: 1,
          name: "Matemáticas",
          code: "MAT101",
          credits: 4,
          color: "bg-blue-500",
          gradeComponents: [
            { id: 1, name: "Parciales", weight: 40, grades: [4.2, 3.8] },
            { id: 2, name: "Tareas", weight: 30, grades: [4.5, 4.0, 3.9] },
            { id: 3, name: "Final", weight: 30, grades: [] },
          ],
        },
        {
          id: 2,
          name: "Física",
          code: "FIS101",
          credits: 3,
          color: "bg-green-500",
          gradeComponents: [
            { id: 1, name: "Laboratorios", weight: 25, grades: [4.0, 4.3] },
            { id: 2, name: "Parciales", weight: 50, grades: [3.7] },
            { id: 3, name: "Proyecto", weight: 25, grades: [] },
          ],
        },
        {
          id: 3,
          name: "Programación",
          code: "PRG101",
          credits: 4,
          color: "bg-purple-500",
          gradeComponents: [
            { id: 1, name: "Proyectos", weight: 60, grades: [4.5] },
            { id: 2, name: "Quizzes", weight: 20, grades: [4.0, 3.8, 4.2] },
            { id: 3, name: "Participación", weight: 20, grades: [4.3] },
          ],
        },
      ],
    },
  ])

  const [newSemester, setNewSemester] = useState({ name: "", startDate: "", endDate: "" })
  const [newSubject, setNewSubject] = useState({ name: "", code: "", credits: "", semesterId: null })
  const [newGradeComponent, setNewGradeComponent] = useState({ name: "", weight: "", subjectId: null })
  const [newGrade, setNewGrade] = useState({ value: "", componentId: null, subjectId: null })

  const [isAddingSemester, setIsAddingSemester] = useState(false)
  const [isAddingSubject, setIsAddingSubject] = useState(false)
  const [isAddingGradeComponent, setIsAddingGradeComponent] = useState(false)
  const [isAddingGrade, setIsAddingGrade] = useState(false)
  const [selectedSemester, setSelectedSemester] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [viewingSubject, setViewingSubject] = useState(null)

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-gray-500",
  ]

  const calculateSubjectGrade = (subject) => {
    let totalWeightedGrade = 0
    let totalWeight = 0

    subject.gradeComponents.forEach((component) => {
      if (component.grades.length > 0) {
        const componentAverage = component.grades.reduce((sum, grade) => sum + grade, 0) / component.grades.length
        totalWeightedGrade += componentAverage * (component.weight / 100)
        totalWeight += component.weight
      }
    })

    return totalWeight > 0 ? totalWeightedGrade / (totalWeight / 100) : 0
  }

  const addSemester = () => {
    if (newSemester.name && newSemester.startDate && newSemester.endDate) {
      setSemesters([
        ...semesters,
        {
          id: Date.now(),
          ...newSemester,
          subjects: [],
        },
      ])
      setNewSemester({ name: "", startDate: "", endDate: "" })
      setIsAddingSemester(false)
    }
  }

  const addSubject = () => {
    if (newSubject.name && newSubject.code && newSubject.credits && selectedSemester) {
      setSemesters(
        semesters.map((semester) =>
          semester.id === selectedSemester.id
            ? {
                ...semester,
                subjects: [
                  ...semester.subjects,
                  {
                    id: Date.now(),
                    name: newSubject.name,
                    code: newSubject.code,
                    credits: Number.parseInt(newSubject.credits),
                    color: colors[semester.subjects.length % colors.length],
                    gradeComponents: [],
                  },
                ],
              }
            : semester,
        ),
      )
      setNewSubject({ name: "", code: "", credits: "", semesterId: null })
      setIsAddingSubject(false)
      setSelectedSemester(null)
    }
  }

  const addGradeComponent = () => {
    if (newGradeComponent.name && newGradeComponent.weight && selectedSubject) {
      setSemesters(
        semesters.map((semester) => ({
          ...semester,
          subjects: semester.subjects.map((subject) =>
            subject.id === selectedSubject.id
              ? {
                  ...subject,
                  gradeComponents: [
                    ...subject.gradeComponents,
                    {
                      id: Date.now(),
                      name: newGradeComponent.name,
                      weight: Number.parseInt(newGradeComponent.weight),
                      grades: [],
                    },
                  ],
                }
              : subject,
          ),
        })),
      )
      setNewGradeComponent({ name: "", weight: "", subjectId: null })
      setIsAddingGradeComponent(false)
    }
  }

  const addGrade = () => {
    if (newGrade.value && newGrade.componentId && selectedSubject) {
      setSemesters(
        semesters.map((semester) => ({
          ...semester,
          subjects: semester.subjects.map((subject) =>
            subject.id === selectedSubject.id
              ? {
                  ...subject,
                  gradeComponents: subject.gradeComponents.map((component) =>
                    component.id === newGrade.componentId
                      ? {
                          ...component,
                          grades: [...component.grades, Number.parseFloat(newGrade.value)],
                        }
                      : component,
                  ),
                }
              : subject,
          ),
        })),
      )
      setNewGrade({ value: "", componentId: null, subjectId: null })
      setIsAddingGrade(false)
    }
  }

  const deleteSemester = (id) => {
    setSemesters(semesters.filter((semester) => semester.id !== id))
  }

  const deleteSubject = (semesterId, subjectId) => {
    setSemesters(
      semesters.map((semester) =>
        semester.id === semesterId
          ? { ...semester, subjects: semester.subjects.filter((subject) => subject.id !== subjectId) }
          : semester,
      ),
    )
  }

  const deleteGrade = (subjectId, componentId, gradeIndex) => {
    setSemesters(
      semesters.map((semester) => ({
        ...semester,
        subjects: semester.subjects.map((subject) =>
          subject.id === subjectId
            ? {
                ...subject,
                gradeComponents: subject.gradeComponents.map((component) =>
                  component.id === componentId
                    ? {
                        ...component,
                        grades: component.grades.filter((_, index) => index !== gradeIndex),
                      }
                    : component,
                ),
              }
            : subject,
        ),
      })),
    )
  }

  const getGradeColor = (grade) => {
    if (grade >= 4.5) return "text-green-600"
    if (grade >= 4.0) return "text-blue-600"
    if (grade >= 3.5) return "text-yellow-600"
    if (grade >= 3.0) return "text-orange-600"
    return "text-red-600"
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Semestres</h1>
            </div>
            <Link href="/">
              <Button variant="outline">Volver al Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Semestres</h2>
            <p className="text-gray-600">Gestiona tus semestres académicos, materias y notas</p>
          </div>
          <Dialog open={isAddingSemester} onOpenChange={setIsAddingSemester}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Semestre
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Semestre</DialogTitle>
                <DialogDescription>Agrega un nuevo semestre académico</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="semester-name">Nombre del Semestre</Label>
                  <Input
                    id="semester-name"
                    value={newSemester.name}
                    onChange={(e) => setNewSemester({ ...newSemester, name: e.target.value })}
                    placeholder="ej. Semestre 2024-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="start-date">Fecha de Inicio</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={newSemester.startDate}
                      onChange={(e) => setNewSemester({ ...newSemester, startDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end-date">Fecha de Fin</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={newSemester.endDate}
                      onChange={(e) => setNewSemester({ ...newSemester, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingSemester(false)}>
                  Cancelar
                </Button>
                <Button onClick={addSemester}>Crear Semestre</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {semesters.map((semester) => (
            <Card key={semester.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>{semester.name}</span>
                    </CardTitle>
                    <CardDescription>
                      {semester.startDate} - {semester.endDate} • {semester.subjects.length} materias
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Dialog
                      open={isAddingSubject && selectedSemester?.id === semester.id}
                      onOpenChange={(open) => {
                        setIsAddingSubject(open)
                        if (open) setSelectedSemester(semester)
                        else setSelectedSemester(null)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Materia
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Agregar Nueva Materia</DialogTitle>
                          <DialogDescription>Agrega una nueva materia a {semester.name}</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="subject-name">Nombre de la Materia</Label>
                            <Input
                              id="subject-name"
                              value={newSubject.name}
                              onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                              placeholder="ej. Cálculo Diferencial"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="subject-code">Código</Label>
                              <Input
                                id="subject-code"
                                value={newSubject.code}
                                onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                                placeholder="ej. MAT201"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="subject-credits">Créditos</Label>
                              <Input
                                id="subject-credits"
                                type="number"
                                value={newSubject.credits}
                                onChange={(e) => setNewSubject({ ...newSubject, credits: e.target.value })}
                                placeholder="ej. 4"
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsAddingSubject(false)
                              setSelectedSemester(null)
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button onClick={addSubject}>Agregar Materia</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deleteSemester(semester.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {semester.subjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {semester.subjects.map((subject) => {
                      const finalGrade = calculateSubjectGrade(subject)
                      const totalWeight = subject.gradeComponents.reduce((sum, comp) => sum + comp.weight, 0)

                      return (
                        <div key={subject.id} className="p-4 rounded-lg border bg-white">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${subject.color}`}></div>
                              <div>
                                <h3 className="font-semibold">{subject.name}</h3>
                                <p className="text-sm text-gray-600">{subject.code}</p>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <Dialog
                                open={viewingSubject?.id === subject.id}
                                onOpenChange={(open) => {
                                  if (open) setViewingSubject(subject)
                                  else setViewingSubject(null)
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="ghost">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center space-x-2">
                                      <div className={`w-4 h-4 rounded-full ${subject.color}`}></div>
                                      <span>{subject.name} - Gestión de Notas</span>
                                    </DialogTitle>
                                    <DialogDescription>
                                      {subject.code} • {subject.credits} créditos
                                    </DialogDescription>
                                  </DialogHeader>

                                  <Tabs defaultValue="grades" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                      <TabsTrigger value="grades">Notas</TabsTrigger>
                                      <TabsTrigger value="components">Componentes</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="grades" className="space-y-4">
                                      <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">Notas por Componente</h3>
                                        <div className="text-right">
                                          <div className="text-sm text-gray-500">Nota Final</div>
                                          <div className={`text-2xl font-bold ${getGradeColor(finalGrade)}`}>
                                            {finalGrade.toFixed(2)}
                                          </div>
                                        </div>
                                      </div>

                                      {totalWeight !== 100 && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                          <div className="flex items-center space-x-2">
                                            <div className="text-yellow-600">⚠️</div>
                                            <div className="text-sm text-yellow-800">
                                              La suma de ponderaciones es {totalWeight}%. Debería ser 100%.
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      <div className="space-y-4">
                                        {subject.gradeComponents.map((component) => {
                                          const componentAverage =
                                            component.grades.length > 0
                                              ? component.grades.reduce((sum, grade) => sum + grade, 0) /
                                                component.grades.length
                                              : 0

                                          return (
                                            <Card key={component.id}>
                                              <CardHeader className="pb-3">
                                                <div className="flex justify-between items-center">
                                                  <div>
                                                    <CardTitle className="text-base">{component.name}</CardTitle>
                                                    <CardDescription>{component.weight}% del total</CardDescription>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="text-sm text-gray-500">Promedio</div>
                                                    <div
                                                      className={`text-lg font-semibold ${getGradeColor(componentAverage)}`}
                                                    >
                                                      {component.grades.length > 0
                                                        ? componentAverage.toFixed(2)
                                                        : "N/A"}
                                                    </div>
                                                  </div>
                                                </div>
                                              </CardHeader>
                                              <CardContent>
                                                <div className="space-y-3">
                                                  <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium">Notas registradas:</span>
                                                    <Dialog
                                                      open={isAddingGrade && newGrade.componentId === component.id}
                                                      onOpenChange={(open) => {
                                                        setIsAddingGrade(open)
                                                        if (open) {
                                                          setNewGrade({
                                                            ...newGrade,
                                                            componentId: component.id,
                                                            subjectId: subject.id,
                                                          })
                                                          setSelectedSubject(subject)
                                                        } else {
                                                          setNewGrade({ value: "", componentId: null, subjectId: null })
                                                        }
                                                      }}
                                                    >
                                                      <DialogTrigger asChild>
                                                        <Button size="sm" variant="outline">
                                                          <Plus className="h-4 w-4 mr-1" />
                                                          Agregar Nota
                                                        </Button>
                                                      </DialogTrigger>
                                                      <DialogContent>
                                                        <DialogHeader>
                                                          <DialogTitle>Agregar Nota</DialogTitle>
                                                          <DialogDescription>
                                                            Agregar nueva nota para {component.name}
                                                          </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                          <div className="grid gap-2">
                                                            <Label htmlFor="grade-value">Nota (0.0 - 5.0)</Label>
                                                            <Input
                                                              id="grade-value"
                                                              type="number"
                                                              min="0"
                                                              max="5"
                                                              step="0.1"
                                                              value={newGrade.value}
                                                              onChange={(e) =>
                                                                setNewGrade({ ...newGrade, value: e.target.value })
                                                              }
                                                              placeholder="ej. 4.2"
                                                            />
                                                          </div>
                                                        </div>
                                                        <DialogFooter>
                                                          <Button
                                                            variant="outline"
                                                            onClick={() => setIsAddingGrade(false)}
                                                          >
                                                            Cancelar
                                                          </Button>
                                                          <Button onClick={addGrade}>Agregar Nota</Button>
                                                        </DialogFooter>
                                                      </DialogContent>
                                                    </Dialog>
                                                  </div>

                                                  {component.grades.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                      {component.grades.map((grade, index) => (
                                                        <div key={index} className="flex items-center space-x-1">
                                                          <Badge
                                                            variant="outline"
                                                            className={`${getGradeColor(grade)} border-current`}
                                                          >
                                                            {grade.toFixed(1)}
                                                          </Badge>
                                                          <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => deleteGrade(subject.id, component.id, index)}
                                                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                                          >
                                                            ×
                                                          </Button>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  ) : (
                                                    <p className="text-sm text-gray-500">No hay notas registradas</p>
                                                  )}
                                                </div>
                                              </CardContent>
                                            </Card>
                                          )
                                        })}
                                      </div>
                                    </TabsContent>

                                    <TabsContent value="components" className="space-y-4">
                                      <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">Componentes de Evaluación</h3>
                                        <Dialog
                                          open={isAddingGradeComponent && selectedSubject?.id === subject.id}
                                          onOpenChange={(open) => {
                                            setIsAddingGradeComponent(open)
                                            if (open) setSelectedSubject(subject)
                                            else setSelectedSubject(null)
                                          }}
                                        >
                                          <DialogTrigger asChild>
                                            <Button size="sm">
                                              <Plus className="h-4 w-4 mr-2" />
                                              Agregar Componente
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>Agregar Componente de Evaluación</DialogTitle>
                                              <DialogDescription>
                                                Agrega un nuevo componente con su ponderación
                                              </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                              <div className="grid gap-2">
                                                <Label htmlFor="component-name">Nombre del Componente</Label>
                                                <Input
                                                  id="component-name"
                                                  value={newGradeComponent.name}
                                                  onChange={(e) =>
                                                    setNewGradeComponent({ ...newGradeComponent, name: e.target.value })
                                                  }
                                                  placeholder="ej. Parciales, Tareas, Final"
                                                />
                                              </div>
                                              <div className="grid gap-2">
                                                <Label htmlFor="component-weight">Ponderación (%)</Label>
                                                <Input
                                                  id="component-weight"
                                                  type="number"
                                                  min="1"
                                                  max="100"
                                                  value={newGradeComponent.weight}
                                                  onChange={(e) =>
                                                    setNewGradeComponent({
                                                      ...newGradeComponent,
                                                      weight: e.target.value,
                                                    })
                                                  }
                                                  placeholder="ej. 30"
                                                />
                                              </div>
                                            </div>
                                            <DialogFooter>
                                              <Button
                                                variant="outline"
                                                onClick={() => setIsAddingGradeComponent(false)}
                                              >
                                                Cancelar
                                              </Button>
                                              <Button onClick={addGradeComponent}>Agregar Componente</Button>
                                            </DialogFooter>
                                          </DialogContent>
                                        </Dialog>
                                      </div>

                                      <div className="space-y-3">
                                        {subject.gradeComponents.map((component) => (
                                          <div
                                            key={component.id}
                                            className="flex items-center justify-between p-3 border rounded-lg"
                                          >
                                            <div>
                                              <span className="font-medium">{component.name}</span>
                                              <span className="text-sm text-gray-500 ml-2">
                                                ({component.grades.length} notas)
                                              </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <Badge variant="outline">{component.weight}%</Badge>
                                            </div>
                                          </div>
                                        ))}
                                      </div>

                                      {subject.gradeComponents.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                          <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                          <p>No hay componentes de evaluación</p>
                                          <p className="text-sm">Agrega componentes para comenzar a registrar notas</p>
                                        </div>
                                      )}
                                    </TabsContent>
                                  </Tabs>
                                </DialogContent>
                              </Dialog>
                              <Button size="sm" variant="ghost" onClick={() => deleteSubject(semester.id, subject.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Badge variant="secondary">{subject.credits} créditos</Badge>
                              {finalGrade > 0 && (
                                <div className="text-right">
                                  <div className="text-xs text-gray-500">Nota actual</div>
                                  <div className={`text-lg font-bold ${getGradeColor(finalGrade)}`}>
                                    {finalGrade.toFixed(2)}
                                  </div>
                                </div>
                              )}
                            </div>

                            {subject.gradeComponents.length > 0 && (
                              <div className="space-y-1">
                                <div className="text-xs text-gray-500">Progreso de evaluaciones</div>
                                <Progress value={totalWeight} className="h-2" />
                                <div className="text-xs text-gray-500">{totalWeight}% configurado</div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay materias agregadas a este semestre</p>
                    <p className="text-sm">Haz clic en "Agregar Materia" para comenzar</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {semesters.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="h-24 w-24 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay semestres creados</h3>
            <p className="text-gray-600 mb-6">Comienza creando tu primer semestre académico</p>
            <Button onClick={() => setIsAddingSemester(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Semestre
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
