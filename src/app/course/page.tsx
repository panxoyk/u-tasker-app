"use client"
import { Controller, useForm } from "react-hook-form"
import { Container, Box, Typography, FormControl, FormLabel, TextField, Button, Paper, Stack } from "@mui/material"
import { redirect } from "next/navigation"
import type { AddCourseFormData } from "@/types/course"
import HorizontalLinearLabelStepper from "@/components/HorizontalLinearLabelStepper"
import { addCourse } from "@/actions/course"
import SchoolIcon from "@mui/icons-material/School"

export default function AddCoursePage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddCourseFormData>({
    defaultValues: {
      course: "",
      code: "",
      credits: "",
    },
  })

  const onboardingSteps = ["Welcome", "Add your first course", "Set up timetable", "All set"]

  const onSubmit = async (formData: AddCourseFormData) => {
    const result = await addCourse(formData)
    if (result.success) {
      redirect("/")
    } else {
      console.error("Error al añadir el curso:", result.error)
      redirect("/error")
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Container maxWidth="sm">
        <Stack spacing={4}>
          {/* Header Section */}
          <Box sx={{ textAlign: "center", pt: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 2 }}>
              <SchoolIcon sx={{ color: "primary.main", fontSize: 32 }} />
              <Typography
                variant="h4"
                component="h1"
                sx={{ color: "text.primary", fontWeight: 600, letterSpacing: "-0.025em" }}
              >
                Añadir Asignatura
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 400, mx: "auto" }}>
              Ingresa los datos de la asignatura que deseas añadir a tu plan de estudios.
            </Typography>
          </Box>

          {/* Form Container */}
          <Paper
            elevation={0}
            sx={{ bgcolor: "background.paper", border: 1, borderColor: "divider", borderRadius: 3, overflow: "hidden" }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ p: 4, display: "flex", flexDirection: "column", gap: 3 }}
            >
              {/* Course Name Field */}
              <Controller
                name="course"
                control={control}
                rules={{
                  required: "A name is required",
                  minLength: { value: 2, message: "Minimum 2 characters" },
                  maxLength: { value: 100, message: "Maximum 100 characters allowed" },
                }}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <FormLabel htmlFor="name-add-course" sx={{ color: "text.primary", fontWeight: 500, mb: 1 }}>
                      Nombre de la Asignatura
                    </FormLabel>
                    <TextField
                      {...field}
                      id="name-add-course"
                      placeholder="Physics"
                      autoFocus
                      fullWidth
                      variant="outlined"
                      error={!!errors.course}
                      helperText={errors.course?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "background.default",
                          "&:hover": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "primary.main",
                            },
                          },
                        },
                      }}
                      slotProps={{
                        htmlInput: { maxLength: 100 },
                      }}
                    />
                  </FormControl>
                )}
              />

              {/* Course Code Field */}
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <FormLabel htmlFor="code-add-course" sx={{ color: "text.primary", fontWeight: 500, mb: 1 }}>
                      Código de la Asignatura
                    </FormLabel>
                    <TextField
                      {...field}
                      id="code-add-course"
                      placeholder="PHY"
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "background.default",
                          "&:hover": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "primary.main",
                            },
                          },
                        },
                      }}
                      slotProps={{
                        htmlInput: { maxLength: 20 },
                      }}
                    />
                  </FormControl>
                )}
              />

              {/* Credits Field */}
              <Controller
                name="credits"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <FormLabel htmlFor="credits-add-course" sx={{ color: "text.primary", fontWeight: 500, mb: 1 }}>
                      Creditos 
                    </FormLabel>
                    <TextField
                      {...field}
                      id="credits-add-course"
                      placeholder="5"
                      fullWidth
                      type="number"
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "background.default",
                          "&:hover": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "primary.main",
                            },
                          },
                        },
                      }}
                      slotProps={{
                        htmlInput: { maxLength: 10 },
                      }}
                    />
                  </FormControl>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "1rem",
                  boxShadow: 0,
                  "&:hover": { boxShadow: 1 },
                }}
              >
                Continue
              </Button>

              {/* Stepper */}
              <Box sx={{ mt: 3 }}>
                <HorizontalLinearLabelStepper steps={onboardingSteps} activeStep={1} />
              </Box>
            </Box>
          </Paper>
        </Stack>
      </Container>
    </Box>
  )
}
