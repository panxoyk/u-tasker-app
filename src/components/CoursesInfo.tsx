'use client';

import type { CourseData } from '@/types/course';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import Link from 'next/link';
import SchoolIcon from '@mui/icons-material/School';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

interface CoursesStatsProps {
  coursesData: CourseData[];
}

export default function CoursesInfo({ coursesData }: CoursesStatsProps) {
  const getTotalCredits = () => {
    return coursesData.reduce((total, course) => {
      return total + (course.credits || 0);
    }, 0);
  };

  const totalCourses = coursesData.length;
  const totalCredits = getTotalCredits();

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2, mt: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
        Mis Asignaturas
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {totalCourses}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Asignaturas
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
            {totalCredits}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Créditos
          </Typography>
        </Box>
      </Box>

      <Stack sx={{ mb: 2 }} spacing={2}>
        <Box sx={{ flexGrow: 1 }}>
          <Link href={'/course'}>
            <Button fullWidth variant="outlined" startIcon={<SchoolIcon />}>
              Añadir nueva asignatura
            </Button>
          </Link>
        </Box>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
        Lista de Asignaturas:
      </Typography>

      {coursesData.length > 0 ? (
        <List dense sx={{ py: 0 }}>
          {coursesData.map((course) => (
            <ListItem key={course.id} sx={{ px: 0, py: 0.5 }}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {course.name}
                    </Typography>
                    {course.code && (
                      <Chip
                        label={course.code}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.65rem', height: 20 }}
                      />
                    )}
                    {course.credits && (
                      <Chip
                        label={`${course.credits} créditos`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: '0.65rem', height: 20 }}
                      />
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            No hay cursos registrados
          </Typography>
          <Link href={'/courses/add'}>
            <Button
              size="small"
              startIcon={<AddOutlinedIcon />}
              sx={{ mt: 1, textTransform: 'none' }}
            >
              Añadir primer curso
            </Button>
          </Link>
        </Box>
      )}
    </Paper>
  );
}
