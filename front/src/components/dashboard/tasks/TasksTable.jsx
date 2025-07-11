import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, CircularProgress, Box, TextField, MenuItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TaskDetailsDialog from "./TaskDetailsDialog";
import { useRouter } from "next/navigation";

export default function TasksTable() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  // Filtros
  const [filterStatus, setFilterStatus] = useState("");
  const [filterProject, setFilterProject] = useState("");
  const [filterResponsible, setFilterResponsible] = useState("");
  const [filterDueDate, setFilterDueDate] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Obtener rol del usuario desde localStorage (o puedes ajustarlo según tu auth)
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsAdmin(user.role === "admin");
      } catch (e) {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
    Promise.all([
      fetch(`${process.env.BACKEND_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch(`${process.env.BACKEND_URL}/projects`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch(`${process.env.BACKEND_URL}/users`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch(`${process.env.BACKEND_URL}/teams`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json())
    ])
      .then(([tasksData, projectsData, usersData, teamsData]) => {
        setTasks(Array.isArray(tasksData) ? tasksData : (tasksData.tasks || []));
        setProjects(Array.isArray(projectsData) ? projectsData : (projectsData.projects || []));
        setUsers(Array.isArray(usersData) ? usersData : (usersData.users || []));
        setTeams(Array.isArray(teamsData) ? teamsData : (teamsData.teams || []));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleView = (task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };
  const handleEdit = (task) => {
    router.push(`/dashboard/tasks/${task.id}/edit`);
  };
  const handleDelete = async (task) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta tarea?")) return;
    const token = localStorage.getItem("token");
    await fetch(`${process.env.BACKEND_URL}/tasks/${task.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    setTasks(tasks.filter(t => t.id !== task.id));
  };

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;

  // Filtro de tareas
  const filteredTasks = tasks.filter(task => {
    let match = true;
    if (filterStatus && task.status !== filterStatus) match = false;
    if (filterProject && String(task.projectId) !== String(filterProject)) match = false;
    if (filterResponsible) {
      if (filterResponsible.startsWith("user-") && String(task.userId) !== filterResponsible.replace("user-", "")) match = false;
      if (filterResponsible.startsWith("team-") && String(task.teamId) !== filterResponsible.replace("team-", "")) match = false;
    }
    if (filterDueDate) {
      const due = task.deadline || task.dueDate;
      if (!due || due.slice(0, 10) !== filterDueDate) match = false;
    }
    if (searchText) {
      const text = searchText.toLowerCase();
      const fields = [task.title, task.description, task.project?.name, task.projectName, task.responsibleName, task.userName, task.teamName];
      if (!fields.some(f => f && f.toLowerCase().includes(text))) match = false;
    }
    return match;
  });

  return (
    <>
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <TextField
          label="Buscar"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          placeholder="Palabra clave..."
          sx={{ minWidth: 180 }}
        />
        <TextField
          label="Fecha límite"
          type="date"
          value={filterDueDate}
          onChange={e => setFilterDueDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 160 }}
        />
        <TextField
          select
          label="Estado"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="todo">Por hacer</MenuItem>
          <MenuItem value="in_progress">En progreso</MenuItem>
          <MenuItem value="done">Completada</MenuItem>
        </TextField>
        <TextField
          select
          label="Proyecto"
          value={filterProject}
          onChange={e => setFilterProject(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">Todos</MenuItem>
          {projects.map(p => (
            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Responsable"
          value={filterResponsible}
          onChange={e => setFilterResponsible(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">Todos</MenuItem>
          {users.map(u => (
            <MenuItem key={"user-"+u.id} value={"user-"+u.id}>{u.name || u.email}</MenuItem>
          ))}
          {teams.map(t => (
            <MenuItem key={"team-"+t.id} value={"team-"+t.id}>{t.name}</MenuItem>
          ))}
        </TextField>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Proyecto</TableCell>
              <TableCell>Responsable</TableCell>
              <TableCell>Fecha vencimiento</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.map((task) => {
              let due = task.deadline || task.dueDate;
              let daysLeft = null;
              let dueLabel = "-";
              let dueColor = "default";
              if (due) {
                
                // Parsear solo la parte de la fecha para evitar desfase de zona horaria
                const [year, month, day] = due.slice(0, 10).split("-").map(Number);
                const dueDate = new Date(year, month - 1, day); // Local time, sin desfase
                const today = new Date();
                today.setHours(0,0,0,0);
                dueDate.setHours(0,0,0,0);
                daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                dueLabel = due.slice(0, 10); // Mostrar solo YYYY-MM-DD
                if (daysLeft < 0) dueColor = "error";
                else if (daysLeft === 0) dueColor = "warning";
                else if (daysLeft <= 3) dueColor = "warning";
                else dueColor = "success";
              }
              return (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{
                    (() => {
                      if (task.project?.name) return task.project.name;
                      if (task.projectName) return task.projectName;
                      const found = projects.find(p => p.id === task.projectId);
                      return found ? found.name : (task.projectId || "-");
                    })()
                  }</TableCell>
                  <TableCell>{
                    (() => {
                      if (task.responsibleName) return task.responsibleName;
                      if (task.userName) return task.userName;
                      if (task.teamName) return task.teamName;
                      if (task.userId) {
                        const user = users.find(u => u.id === task.userId);
                        if (user) return user.name || user.email;
                      }
                      if (task.teamId) {
                        const team = teams.find(t => t.id === task.teamId);
                        if (team) return team.name;
                      }
                      return "-";
                    })()
                  }</TableCell>
                  <TableCell>
                    <Chip label={dueLabel + (daysLeft !== null ? ` (${daysLeft < 0 ? 'Vencida' : daysLeft === 0 ? 'Hoy' : `Faltan ${daysLeft} días`})` : '')} color={dueColor} />
                  </TableCell>
                  <TableCell>
                    <Chip label={task.status === "todo" ? "Por hacer" : task.status === "in_progress" ? "En progreso" : "Completada"} color={task.status === "done" ? "success" : task.status === "in_progress" ? "warning" : "default"} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleView(task)} title="Ver"><VisibilityIcon /></IconButton>
                    <IconButton onClick={() => handleEdit(task)} title="Editar" disabled={!isAdmin}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(task)} title="Eliminar" disabled={!isAdmin}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TaskDetailsDialog open={dialogOpen} onClose={() => setDialogOpen(false)} taskId={selectedTask?.id} task={selectedTask} />
    </>
  );
}
