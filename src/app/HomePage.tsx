'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
  CssBaseline,
  CircularProgress,
  Breadcrumbs,
  Link,
  Chip,
  Avatar,
  Divider,
  Fade,
  Slide,
  Badge,
  Tooltip,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Grid,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Assignment as AssignmentIcon,
  AccountCircle as AccountCircleIcon,
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
  NavigateNext as NavigateNextIcon,
  Dashboard as DashboardIcon,
  // Add an icon for adding a task
  NoteAdd as NoteAddIcon,
} from '@mui/icons-material';
import TaskCarousel from './tasks/TaskCarousel';
import type { TaskData } from '@/types/task';

import AccountForm from '@/app/account/AccountForm';

import { type User } from '@supabase/supabase-js';

// Import the new useTasks hook
import { useTasks } from './hooks/useTasks';

// Import AddTaskForm
import AddTaskForm from './tasks/add/AddTaskForm'; // Adjust path if needed
import { CourseData } from '@/types/course'; // Import CourseData type

// Componentes de contenido mejorados
const HomePageContent = () => {
  const theme = useTheme();

  return (
    <Fade in timeout={500}>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                color: 'white',
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h3" gutterBottom fontWeight="bold">
                  ¡Bienvenido de vuelta! 👋
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Aquí tienes un resumen de tu actividad reciente
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DashboardIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Resumen del día</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Mantente al día con tus tareas y proyectos
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssignmentIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Productividad</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Revisa tu progreso y logros
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <NotificationsIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Recordatorios</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  No olvides tus próximas tareas
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

const AccountPageContent = ({ user }: { user: User | null }) => {
  return (
    <Fade in timeout={500}>
      <Box>
        <CardContent>
          <AccountForm user={user} />
        </CardContent>
      </Box>
    </Fade>
  );
};

// --- AddTaskPageContent: New Component for AddTaskForm ---
interface AddTaskPageContentProps {
  courses: CourseData[];
  coursesError?: string | null;
  onTaskAdded: () => void; // Callback to refresh tasks
  showSnackbar: (message: string, severity: 'success' | 'error' | 'info') => void; // Callback for snackbar
}

const AddTaskPageContent = ({
  courses,
  coursesError,
  onTaskAdded,
  showSnackbar,
}: AddTaskPageContentProps) => {
  return (
    <Fade in timeout={500}>
      <Box>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Añadir Nueva Tarea
            </Typography>
            <AddTaskForm
              courses={courses}
              coursesError={coursesError}
              onTaskAdded={onTaskAdded} // Pass the callback
              showSnackbar={showSnackbar} // Pass the snackbar function
            />
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

// --- HomePageProps Interface ---
interface HomePageProps {
  initialUser: User | null;
  initialTasks: {
    pendiente: TaskData[];
    enProceso: TaskData[];
    entregada: TaskData[];
    vencida: TaskData[];
  };
  initialCourses: CourseData[];
  coursesError?: string | null;
}

export default function HomePage({
  initialUser,
  initialTasks,
  initialCourses,
  coursesError,
}: HomePageProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [activeSection, setActiveSection] = useState('home');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // States for Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');

  // Initialize user state with initialUser prop
  const [user, setUser] = useState<User | null>(initialUser);
  // Set loadingUser to false initially as user data is already provided via prop
  const [loadingUser, setLoadingUser] = useState(false); // Consider if this needs to be true if you re-fetch user

  // Initialize the useTasks hook with combined initial tasks
  const {
    tasks,
    loading: loadingTasks,
    error: errorTasks,
    reFetchTasks,
    totalTasks,
  } = useTasks(initialTasks);

  // Function to show notifications
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Handler for refreshing tasks using the hook's reFetchTasks
  const handleRefreshTasks = useCallback(async () => {
    const success = await reFetchTasks();
    if (success) {
      showSnackbar('Tareas actualizadas correctamente', 'success');
    } else {
      showSnackbar('Error al actualizar las tareas.', 'error');
    }
  }, [reFetchTasks]);

  // Handler for when a task is successfully added
  const handleTaskAdded = useCallback(() => {
    handleRefreshTasks(); // Refresh the tasks list
    setActiveSection('tasks'); // Optionally, navigate to the tasks section
  }, [handleRefreshTasks]);

  const menuItems = useMemo(
    () => [
      {
        id: 'home',
        text: 'Inicio',
        icon: <HomeIcon />,
        component: <HomePageContent />,
        badge: null,
      },
      {
        id: 'tasks',
        text: 'Tareas',
        icon: <AssignmentIcon />,
        component: loadingTasks ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '400px',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <CircularProgress size={60} />
            <Typography variant="h6">Cargando tareas...</Typography>
          </Box>
        ) : errorTasks ? (
          <Card sx={{ m: 2 }}>
            <CardContent>
              <Typography variant="h6" color="error" gutterBottom>
                Error al cargar tareas
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {errorTasks}
              </Typography>
              <Button onClick={handleRefreshTasks} variant="contained" startIcon={<RefreshIcon />}>
                Reintentar
              </Button>
            </CardContent>
          </Card>
        ) : (
          <TaskCarousel
            tasksPendiente={tasks.pendiente}
            tasksEnProceso={tasks.enProceso}
            tasksEntregada={tasks.entregada}
            tasksVencida={tasks.vencida}
          />
        ),
        badge: totalTasks > 0 ? totalTasks : null,
      },

      {
        id: 'add-task', // NEW: New menu item for adding tasks
        text: 'Añadir Tarea',
        icon: <NoteAddIcon />, // Use the new icon
        component: (
          <AddTaskPageContent
            // Ensure courses is always an array, even if initialCourses is null/undefined
            courses={initialCourses || []}
            coursesError={coursesError}
            onTaskAdded={handleTaskAdded}
            showSnackbar={showSnackbar}
          />
        ),
        badge: null,
      },
      {
        id: 'account',
        text: 'Cuenta',
        icon: <AccountCircleIcon />,
        component: loadingUser ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '400px',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <CircularProgress size={60} />
            <Typography variant="h6">Cargando perfil...</Typography>
          </Box>
        ) : (
          <AccountPageContent user={user} />
        ),
        badge: null,
      },
    ],
    [
      loadingTasks,
      errorTasks,
      tasks, // tasks object from useTasks hook
      totalTasks,
      handleRefreshTasks,
      user,
      loadingUser,
      initialCourses, // Add initialCourses to dependency array
      coursesError, // Add coursesError to dependency array
      handleTaskAdded, // Add handleTaskAdded to dependency array
      showSnackbar, // Add showSnackbar to dependency array
    ],
  );

  const appTitle = useMemo(() => {
    const currentItem = menuItems.find((item) => item.id === activeSection);
    return currentItem ? currentItem.text : 'Bienvenido';
  }, [activeSection, menuItems]);

  const handleMenuItemClick = (sectionId: string) => {
    setActiveSection(sectionId);
    if (!isDesktop) {
      setMobileDrawerOpen(false);
    }
  };

  const currentContent = useMemo(() => {
    const item = menuItems.find((item) => item.id === activeSection);
    return item ? item.component : <HomePageContent />;
  }, [activeSection, menuItems]);

  const drawerWidth = 280;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
        }}
      >
        <Typography variant="h6" noWrap component="div" fontWeight="bold">
          TaskManager Pro
        </Typography>
      </Toolbar>

      <Box sx={{ flexGrow: 1, p: 1 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={activeSection === item.id}
                onClick={() => handleMenuItemClick(item.id)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    },
                  },
                  '&:hover': {
                    bgcolor: alpha(theme.palette.action.hover, 0.1),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: activeSection === item.id ? theme.palette.primary.main : 'inherit',
                  }}
                >
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: activeSection === item.id ? 'bold' : 'normal',
                      color: activeSection === item.id ? theme.palette.primary.main : 'inherit',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Chip
          label={`${totalTasks} tareas totales`}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ width: '100%' }}
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Breadcrumbs */}
          <Box sx={{ flexGrow: 1 }}>
            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{
                '& .MuiBreadcrumbs-separator': { color: 'white' },
                '& .MuiBreadcrumbs-ol': { alignItems: 'center' },
              }}
              separator={<NavigateNextIcon fontSize="small" />}
            >
              <Link color="inherit" href="#" onClick={() => handleMenuItemClick('home')}>
                <Typography variant="h6" sx={{ color: 'white', opacity: 0.8 }}>
                  Inicio
                </Typography>
              </Link>
              {activeSection !== 'home' && (
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {appTitle}
                </Typography>
              )}
            </Breadcrumbs>
          </Box>

          {/* Botones de acción */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {activeSection === 'tasks' && (
              <>
                <Tooltip title="Actualizar tareas">
                  <IconButton color="inherit" onClick={handleRefreshTasks} disabled={loadingTasks}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                {/* Modify the "New Task" button to navigate to 'add-task' section */}
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{
                    bgcolor: 'white',
                    color: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: alpha('#fff', 0.9),
                    },
                  }}
                  onClick={() => handleMenuItemClick('add-task')} // Navigate to add-task section
                >
                  Nueva Tarea
                </Button>
              </>
            )}
            {activeSection === 'add-task' && ( // Add a refresh button for add-task page if needed
              <Tooltip title="Resetear formulario">
                <IconButton
                  color="inherit"
                  onClick={() => {
                    /* Implement reset logic in AddTaskForm if needed */
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Notificaciones">
              <IconButton color="inherit">
                <Badge badgeContent={tasks.vencida.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: '56px', sm: '64px' },
          minHeight: 'calc(100vh - 64px)',
          bgcolor: alpha(theme.palette.background.default, 0.5),
        }}
      >
        <Slide direction="up" in mountOnEnter unmountOnExit>
          <Box>{currentContent}</Box>
        </Slide>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
