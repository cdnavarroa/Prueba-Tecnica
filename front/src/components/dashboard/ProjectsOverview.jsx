"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, Typography, Grid, CircularProgress, Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Button } from "@mui/material";

export default function ProjectsOverview() {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openTasksDialog, setOpenTasksDialog] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [filterStatus, setFilterStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const userData = (typeof window !== "undefined") ? localStorage.getItem("user") : null;
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setUserName(user);
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        Promise.all([
            fetch(`${process.env.BACKEND_URL}/projects`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json"
                }
            }).then(res => res.json()),
            fetch(`${process.env.BACKEND_URL}/tasks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json"
                }
            }).then(res => res.json()),
            fetch(`${process.env.BACKEND_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => res.json()),
            fetch(`${process.env.BACKEND_URL}/teams`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => res.json())
        ])
            .then(([projectsData, tasksData, usersData, teamsData]) => {
                setProjects(Array.isArray(projectsData) ? projectsData : (projectsData.projects || []));
                setTasks(Array.isArray(tasksData) ? tasksData : (tasksData.tasks || []));
                setUsers(Array.isArray(usersData) ? usersData : (usersData.users || []));
                setTeams(Array.isArray(teamsData) ? teamsData : (teamsData.teams || []));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);


    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!projects.length) {
        return (
            <>
            {userName.role === "admin" && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                    <button
                        style={{ background: "#2f70aa", color: "white", border: 0, borderRadius: 6, padding: "8px 16px", cursor: "pointer" }}
                        onClick={() => router.push("/dashboard/projects/new")}
                    >
                        Crear proyecto
                    </button>
                </Box>
            )}
                <Typography color="text.secondary">No tienes proyectos aún.</Typography>
            </>
        );
    }

    return (
        <>
        {userName.role === "admin" && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <button
                    style={{ background: "#2f70aa", color: "white", border: 0, borderRadius: 6, padding: "8px 16px", cursor: "pointer" }}
                    onClick={() => router.push("/dashboard/projects/new")}
                >
                    Crear proyecto
                </button>
            </Box>
        )}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                {projects.map((project) => {
                    const taskCount = tasks.filter(t => t.projectId === project.id).length;
                    return (
                        <Grid item xs={12} sm={6} md={4} key={project.id}>
                            <Card sx={{ borderLeft: "6px solid #2f70aa", boxShadow: 3, borderRadius: 3, minHeight: 180 }}>
                                <CardContent style={{ cursor: "pointer", paddingBottom: 16 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{ color: "#2f70aa", fontWeight: "bold", cursor: "pointer", flex: 1 }}
                                            onClick={() => router.push(`/dashboard/projects/`)}
                                        >
                                            {project.name}
                                        </Typography>
                                        <Box sx={{ ml: 1 }}>
                                            <span style={{ background: '#e3f2fd', color: '#1e4976', borderRadius: 12, padding: '2px 12px', fontWeight: 600, fontSize: 13, display: 'inline-block' }}>
                                                {taskCount} {taskCount === 1 ? 'Tarea' : 'Tareas'}
                                            </span>
                                        </Box>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ cursor: "pointer", mb: 1 }}
                                        onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                                    >
                                        {project.description || <span style={{ color: '#bdbdbd' }}>(Sin descripción)</span>}
                                    </Typography>
                                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
                                        <button
                                            style={{display: userName.role !== "admin" ? "none" : "block" ,background: "#fff", color: "#2f70aa", border: '1px solid #2f70aa', borderRadius: 6, padding: "6px 16px", cursor: "pointer", fontWeight: 600, transition: 'background 0.2s, color 0.2s', boxShadow: '0 1px 2px #0001' }}
                                            disabled={userName.role !== "admin"}
                                            onClick={e => { e.stopPropagation(); router.push(`/dashboard/projects/${project.id}/edit`); }}
                                            onMouseOver={e => { e.target.style.background = '#2f70aa'; e.target.style.color = '#fff'; }}
                                            onMouseOut={e => { e.target.style.background = '#fff'; e.target.style.color = '#2f70aa'; }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            style={{  background: "#e3f2fd", color: "#1e4976", border: 0, borderRadius: 6, padding: "6px 16px", cursor: "pointer", fontWeight: 600 }}
                                            disabled={!taskCount}
                                            onClick={e => {
                                                e.stopPropagation();
                                                setSelectedProject(project);
                                                setOpenTasksDialog(true);
                                                setFilterStatus('');
                                                setSearchTerm('');
                                            }}
                                        >
                                            Ver tareas
                                        </button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Dialog de tareas del proyecto */}
            <Box>
                <Dialog open={openTasksDialog} onClose={() => setOpenTasksDialog(false)} maxWidth="md" fullWidth>
                    <DialogTitle sx={{ color: '#2f70aa', fontWeight: 700 }}>
                        {selectedProject ? `Tareas de ${selectedProject.name}` : 'Tareas'}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', gap: 4, mt: 2, mb: 2 }}>
                            <TextField
                                label="Buscar tarea"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                size="small"
                                sx={{ minWidth: 180 }}
                            />
                            <TextField
                                select
                                label="Estado"
                                value={filterStatus}
                                onChange={e => setFilterStatus(e.target.value)}
                                size="small"
                                sx={{ minWidth: 140 }}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                <MenuItem value="todo">Por hacer</MenuItem>
                                <MenuItem value="in_progress">En progreso</MenuItem>
                                <MenuItem value="done">Finalizada</MenuItem>
                            </TextField>
                        </Box>
                        <Box>
                            {selectedProject && tasks.filter(t => t.projectId === selectedProject.id)
                                .filter(t => !filterStatus || t.status === filterStatus)
                                .filter(t => !searchTerm || (t.title && t.title.toLowerCase().includes(searchTerm.toLowerCase())))
                                .map(t => (
                                    <Card key={t.id} sx={{ mb: 2, boxShadow: 1, borderRadius: 2, borderLeft: t.status === 'done' ? '5px solid #43a047' : t.status === 'in_progress' ? '5px solid #fbc02d' : '5px solid #1976d2' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{t.title}</Typography>
                                                <Typography variant="caption" sx={{ color: t.status === 'done' ? '#43a047' : t.status === 'in_progress' ? '#fbc02d' : '#1976d2', fontWeight: 700, textTransform: 'capitalize' }}>
                                                    {t.status === 'todo' ? 'Por hacer' : t.status === 'in_progress' ? 'En progreso' : t.status === 'done' ? 'Finalizada' : t.status}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t.description}</Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                              {(() => {
                                                if (t.userId) {
                                                  const assignedUser = users.find(u => u.id === t.userId);
                                                  return assignedUser ? `Asignado a: ${assignedUser.name || assignedUser.email}` : 'Sin responsable';
                                                } else if (t.teamId) {
                                                  const assignedTeam = teams.find(team => team.id === t.teamId);
                                                  return assignedTeam ? `Asignado a equipo: ${assignedTeam.name}` : 'Sin responsable';
                                                } else {
                                                  return 'Sin responsable';
                                                }
                                              })()}
                                            </Typography>
                                            
                                        </CardContent>
                                    </Card>
                                ))}
                            {selectedProject && tasks.filter(t => t.projectId === selectedProject.id)
                                .filter(t => !filterStatus || t.status === filterStatus)
                                .filter(t => !searchTerm || (t.title && t.title.toLowerCase().includes(searchTerm.toLowerCase()))).length === 0 && (
                                    <Typography color="text.secondary">No hay tareas para este proyecto.</Typography>
                                )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenTasksDialog(false)} color="primary">Cerrar</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
}
