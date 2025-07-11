import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TaskDetails from "./TaskDetails";

export default function TaskDetailsDialog({ open, onClose, taskId, task }) {
  const [projectName, setProjectName] = useState("");
  const [responsibleName, setResponsibleName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let ignore = false;
    async function fetchNames() {
      setLoading(true);
      let pName = "-";
      let rName = "-";
      try {
        const token = localStorage.getItem("token");
        // Proyecto
        if (task?.project?.name) {
          pName = task.project.name;
        } else if (task?.projectName) {
          pName = task.projectName;
        } else if (task?.projectId) {
          const res = await fetch(`${process.env.BACKEND_URL}/projects/${task.projectId}`, { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            const data = await res.json();
            pName = data.name || data.project?.name || data.projectName || pName;
          }
        }
        // Responsable
        if (task?.responsibleName) {
          rName = task.responsibleName;
        } else if (task?.userName) {
          rName = task.userName;
        } else if (task?.teamName) {
          rName = task.teamName;
        } else if (task?.userId) {
          const res = await fetch(`${process.env.BACKEND_URL}/users/${task.userId}`, { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            const data = await res.json();
            rName = data.name || data.user?.name || data.user?.email || rName;
          }
        } else if (task?.teamId) {
          const res = await fetch(`${process.env.BACKEND_URL}/teams/${task.teamId}`, { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            const data = await res.json();
            rName = data.name || data.team?.name || rName;
          }
        }
      } catch (e) {}
      if (!ignore) {
        setProjectName(pName);
        setResponsibleName(rName);
        setLoading(false);
      }
    }
    fetchNames();
    return () => { ignore = true; };
  }, [open, task]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        Detalle de Tarea
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TaskDetails taskId={taskId} task={task} projectName={projectName} responsibleName={responsibleName} />
      </DialogContent>
    </Dialog>
  );
}
