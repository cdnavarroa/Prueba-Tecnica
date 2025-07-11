import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Chip, Table, TableBody, TableCell, TableRow, TableContainer, Paper, IconButton, Menu, MenuItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/navigation";
import TaskComments from "./TaskComments";

export default function TaskDetails({ taskId, task: taskProp, projectName, responsibleName }) {
    const [task, setTask] = useState(taskProp || null);

    useEffect(() => {
        if (!task && taskId) {
            const token = localStorage.getItem("token");
            fetch(`${process.env.BACKEND_URL}/tasks/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json"
                }
            })
                .then(res => res.json())
                .then(data => setTask(data));
        }
    }, [taskId, task]);

    const [anchorEl, setAnchorEl] = useState(null);
    const [status, setStatus] = useState(task?.status || "todo");
    const [updating, setUpdating] = useState(false);
    const router = useRouter();

    if (!task) return <Typography>Cargando tarea...</Typography>;

    // Acciones
    const handleEdit = () => {
        router.push(`/dashboard/tasks/${task.id}/edit`);
    };
    const handleDelete = async () => {
        if (!window.confirm("¿Seguro que deseas eliminar esta tarea?")) return;
        const token = localStorage.getItem("token");
        await fetch(`${process.env.BACKEND_URL}/tasks/${task.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        router.push("/dashboard/tasks");
    };
    const handleStatusChange = async (newStatus) => {
        setUpdating(true);
        const token = localStorage.getItem("token");
        await fetch(`${process.env.BACKEND_URL}/tasks/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        setStatus(newStatus);
        setUpdating(false);
        setAnchorEl(null);
    };

    const statusLabel = (s) => {
        if (s === "todo") return "Por hacer";
        if (s === "in_progress") return "En progreso";
        if (s === "done") return "Completada";
        return s;
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ color: "#1e4976", fontWeight: "bold", mb: 2 }}>
                Detalle de Tarea
            </Typography>
            <TableContainer component={Paper} sx={{ maxWidth: 600, mb: 3 }}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell variant="head">Título</TableCell>
                            <TableCell>{task.title}</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={handleEdit} title="Editar"><EditIcon /></IconButton>
                                <IconButton onClick={handleDelete} title="Eliminar"><DeleteIcon /></IconButton>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">Descripción</TableCell>
                            <TableCell colSpan={2}>{task.description}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">Proyecto</TableCell>
                            <TableCell colSpan={2}>{projectName || task.project?.name || task.projectName || task.projectId || "-"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">Responsable</TableCell>
                            <TableCell colSpan={2}>{responsibleName || task.responsibleName || task.userName || task.teamName || task.userId || task.teamId || "-"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">Estado</TableCell>
                            <TableCell>
                                <Chip label={statusLabel(status)} color={status === "done" ? "success" : status === "in_progress" ? "warning" : "default"} />
                            </TableCell>
                            <TableCell align="right">
                                <IconButton onClick={e => setAnchorEl(e.currentTarget)} title="Cambiar estado">
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                                    <MenuItem onClick={() => handleStatusChange("todo")} disabled={status === "todo" || updating}>Por hacer</MenuItem>
                                    <MenuItem onClick={() => handleStatusChange("in_progress")} disabled={status === "in_progress" || updating}>En progreso</MenuItem>
                                    <MenuItem onClick={() => handleStatusChange("done")} disabled={status === "done" || updating}>Completada</MenuItem>
                                </Menu>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <TaskComments taskId={task.id} />
        </Box>
    );
}
