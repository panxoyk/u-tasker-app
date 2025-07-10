'use client'; // ¡IMPORTANTE! Debe ser la primera línea

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // Necesario para timeGridWeek/Day
import interactionPlugin from '@fullcalendar/interaction';
import { EvaluationData } from '@/types/evaluation';
import { CourseData } from '@/types/course';
import { updateEvaluationDate } from '@/actions/evaluation';
import { EventClickArg, EventDropArg } from '@fullcalendar/core';
import EvaluationDetailModal from './EvaluationDetailModal';
import { Box } from '@mui/material';

interface CalendarDisplayProps {
  evaluations: EvaluationData[];
  courses: CourseData[];
}

export default function CalendarDisplay({ evaluations, courses }: CalendarDisplayProps) {
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const calendarEvents = evaluations.map((evalItem) => ({
    id: String(evalItem.id),
    title: `${evalItem.title} (${evalItem.course.name})`,
    start: evalItem.start_date, // FullCalendar espera formato ISO 8601 aquí
    end: evalItem.end_date, // FullCalendar espera formato ISO 8601 aquí
    allDay: !evalItem.start_date && !evalItem.end_date, // Si no hay fechas/horas, es todo el día
    extendedProps: {
      courseId: evalItem.course_id,
      evaluationData: evalItem,
    },
    backgroundColor: getCourseColor(evalItem.course_id, courses),
    borderColor: getCourseColor(evalItem.course_id, courses),
  }));

  function getCourseColor(courseId: number, allCourses: CourseData[]): string {
    const course = allCourses.find((c) => c.id === courseId);
    if (course) {
      const colors = ['#3f51b5', '#f50057', '#00bcd4', '#ff9800', '#4caf50', '#9c27b0', '#e91e63'];
      return colors[course.id % colors.length];
    }
    return '#607d8b';
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    const evaluation = clickInfo.event.extendedProps.evaluationData as EvaluationData;
    if (evaluation) {
      setSelectedEvaluation(evaluation);
      setIsDetailModalOpen(true);
    }
  };

  const handleEventDrop = async (dropInfo: EventDropArg) => {
    const event = dropInfo.event;
    const evaluationId = parseInt(event.id);
    const newStartDate = event.start?.toISOString();
    const newEndDate = event.end?.toISOString();

    const result = await updateEvaluationDate({
      id: evaluationId,
      start_date: newStartDate,
      end_date: newEndDate,
    });

    if (!result.success) {
      console.error('Error al actualizar la fecha de la evaluación:', result.error);
      dropInfo.revert();
    } else {
      console.log('Fecha de evaluación actualizada con éxito.');
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedEvaluation(null);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        // *** ESTOS SON LOS CAMBIOS CLAVE PARA MOSTRAR POR DÍA Y HORA ***
        initialView="timeGridWeek" // Puedes cambiar a "timeGridDay" si prefieres solo un día
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay', // Opciones de vista para el usuario
        }}
        events={calendarEvents}
        eventClick={handleEventClick}
        editable={true}
        eventDrop={handleEventDrop}
        locale="es"
        height="auto"
        // *** NUEVO: Formato de hora para los eventos en la vista de agenda ***
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: false, // O 'short'/'narrow' si quieres AM/PM
          hour12: false, // Formato 24 horas
        }}
        // Opcional: Rango de horas a mostrar en la vista de agenda
        slotMinTime="07:00:00" // Empieza a mostrar desde las 7 AM
        slotMaxTime="22:00:00" // Termina de mostrar a las 10 PM
        allDaySlot={false} // Oculta la sección de eventos de todo el día si no la necesitas
      />

      {selectedEvaluation && (
        <EvaluationDetailModal
          evaluation={selectedEvaluation}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          courses={courses}
        />
      )}
    </Box>
  );
}
