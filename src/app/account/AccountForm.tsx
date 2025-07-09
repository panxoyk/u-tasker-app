"use client"

import { signout } from "@/actions/auth"
import { useCallback, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/client"
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  Divider,
  Stack,
  Alert,
}
from "@mui/material"
import { Person as PersonIcon, Email as EmailIcon, ExitToApp as ExitToAppIcon } from "@mui/icons-material"

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState<string | null>(null)
  const [last_name, setLastName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error, status } = await supabase
        .from("profile")
        .select(`name, last_name`)
        .eq("user_id", user?.id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setName(data.name)
        setLastName(data.last_name)
      }
    } catch (error) {
      setError("Error loading user data!")
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  const getInitials = () => {
    const firstName = name || ""
    const lastName = last_name || ""
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box
      maxWidth="md"
      sx={{
        mx: "auto",
        p: { xs: 2, md: 3 }, // Responsive padding
      }}
    >
      <Card elevation={3}>
        <CardHeader
          avatar={
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 64,
                height: 64,
                fontSize: "1.5rem",
              }}
            >
              {getInitials() || <PersonIcon />}
            </Avatar>
          }
          title={
            <Typography variant="h4" component="h1" gutterBottom>
              Account Profile
            </Typography>
          }
          subheader={
            <Typography variant="body1" color="text.secondary">
              Manage your personal account information.
            </Typography>
          }
          sx={{ pb: 0 }} // Remove default padding-bottom to control spacing with CardContent
        />

        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={3} sx={{ pt: 2 }}> {/* Added padding-top to stack for better spacing from header */}
            <TextField
              label="Email Address"
              value={user?.email || ""}
              disabled
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: "action.active" }} />,
              }}
              helperText="Your email address cannot be changed."
            />

            <TextField
              label="First Name"
              value={name || ""}
              disabled
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: "action.active" }} />,
              }}
              helperText="Your first name is set by your profile."
            />

            <TextField
              label="Last Name"
              value={last_name || ""}
              disabled
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: "action.active" }} />,
              }}
              helperText="Your last name is set by your profile."
            />

            <Divider sx={{ my: 3 }} /> {/* Increased vertical margin for divider */}

            <Box display="flex" justifyContent="flex-end">
              <form action={signout}>
                <Button
                  type="submit"
                  variant="outlined"
                  color="error"
                  startIcon={<ExitToAppIcon />}
                  size="large"
                  sx={{
                    minWidth: 140,
                    "&:hover": {
                      backgroundColor: "error.main",
                      color: "white",
                    },
                  }}
                >
                  Sign Out
                </Button>
              </form>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}