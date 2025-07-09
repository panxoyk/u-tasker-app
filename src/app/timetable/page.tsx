import { getClassesByDayOfTheWeek } from '@/actions/class';
import { Container } from '@mui/material';
import TimetableView from './TimetableView';

export default async function TimetablePage() {
  const daysOfWeek = [1, 2, 3, 4, 5, 6, 7];

  const classesPromises = daysOfWeek.map((day) => getClassesByDayOfTheWeek(day));
  const classesResults = await Promise.all(classesPromises);

  const classesData: { [key: number]: any[] } = {};

  daysOfWeek.forEach((day, index) => {
    const result = classesResults[index];
    classesData[day] = result.success ? result.data || [] : [];
  });

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <TimetableView classesData={classesData} />
    </Container>
  );
}
