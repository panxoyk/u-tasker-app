import Navbar from "@/components/Navbar";
import WeekStats from "./timetable/WeekStats";
import { getClassesByDayOfTheWeek } from "@/actions/class";
import { Box, Container, Stack, Typography } from "@mui/material";

export default async function Page() {
  const daysOfWeek = [1, 2, 3, 4, 5, 6, 7];

  const classesPromises = daysOfWeek.map((day) => getClassesByDayOfTheWeek(day));
  const classesResults = await Promise.all(classesPromises);

  const classesData: { [key: number]: any[] } = {};

  daysOfWeek.forEach((day, index) => {
    const result = classesResults[index];
    classesData[day] = result.success ? result.data || [] : [];
  });

  return (
  <div>
    <Navbar />
    <Container maxWidth="sm">
      <Stack spacing={2}>
        <Box sx={{ mt: 8 }}>
          <WeekStats classesData={classesData} /> 
        </Box>       
      </Stack>
    </Container>
  </div>
  );
}