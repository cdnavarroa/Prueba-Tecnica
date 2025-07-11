
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, CircularProgress, Card, CardContent, Button } from "@mui/material";
import TaskComments from "./TaskComments";

export default function TaskDetailsID({ taskId: propTaskId, task: propTask }) {
  const router = useRouter();
  const [task, setTask] = useState(propTask || null);
  const [loading, setLoading] = useState(!propTask);
  // Permitir recibir el id por prop o por ruta
  let taskId = propTaskId;
  if (!taskId && typeof window !== "undefined") {
    const path = window.location.pathname;
    const match = path.match(/tasks\/(\d+)/);
    if (match) taskId = match[1];
  }

  // Obtener info de usuario para permisos
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setIsAdmin(user.role === "admin");
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    if (propTask) {
      setTask(propTask);
      setLoading(false);
      return;
    }
    if (!taskId) return;
    const token = localStorage.getItem("token");
    fetch(`${process.env.BACKEND_URL}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTask(data))
      .finally(() => setLoading(false));
  }, [taskId, propTask]);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><CircularProgress /></Box>;
  if (!task) return <Typography color="text.secondary">No se encontró la tarea.</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>{task.title}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>{task.description}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Estado: {task.statusLabel || task.status}</Typography>
          {task.dueDate && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Vencimiento: {(() => {
                // Si la fecha viene en formato ISO sin zona, forzar a local
                let dateObj;
                if (typeof task.dueDate === "string" && task.dueDate.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)) {
                  // Forzar a tratar como local (no UTC)
                  const [date, time] = task.dueDate.split("T");
                  const [year, month, day] = date.split("-").map(Number);
                  const [hour, min] = time.split(":");
                  dateObj = new Date(year, month - 1, day, Number(hour), Number(min));
                } else {
                  dateObj = new Date(task.dueDate);
                }
                return dateObj.toLocaleString();
              })()}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Proyecto: {task.project?.name || task.projectName || task.projectId || "-"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Responsable: {
              task.responsibleName || task.userName || task.teamName ||
              (task.userId ? `Usuario #${task.userId}` : (task.teamId ? `Equipo #${task.teamId}` : "-"))
            }
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button variant="outlined" onClick={() => router.back()}>Volver</Button>
            {isAdmin && (
              <Button variant="contained" color="primary" onClick={() => router.push(`/dashboard/tasks/${task.id}/edit`)}>
                Editar tarea
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
      
        <Box sx={{ mt: 4 }}>
          <TaskComments taskId={task.id} />
        </Box>
    
    </Box>
  );
}
