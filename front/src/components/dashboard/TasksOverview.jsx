"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, Typography, Grid, CircularProgress, Box } from "@mui/material";

export default function TasksOverview({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const router = useRouter();

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
    let url = `${process.env.BACKEND_URL}/tasks`;
    if (projectId) url = `${process.env.BACKEND_URL}/projects/${projectId}/tasks`;
    Promise.all([
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      }).then(res => res.json()),
      fetch(`${process.env.BACKEND_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json()),
      fetch(`${process.env.BACKEND_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json()),
      fetch(`${process.env.BACKEND_URL}/teams`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json()),
      fetch(`${process.env.BACKEND_URL}/userteams`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json())
    ])
      .then(([tasksData, projectsData, usersData, teamsData, userTeamsData]) => {
        setTasks(Array.isArray(tasksData) ? tasksData : (tasksData.tasks || []));
        setProjects(Array.isArray(projectsData) ? projectsData : (projectsData.projects || []));
        setUsers(Array.isArray(usersData) ? usersData : (usersData.users || []));
        setTeams(Array.isArray(teamsData) ? teamsData : (teamsData.teams || []));
        setUserTeams(Array.isArray(userTeamsData) ? userTeamsData : (userTeamsData.userTeams || []));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Obtener userId y equipos del usuario actual usando userTeams
  let userId = null;
  let userTeamIds = [];
  const userData = (typeof window !== "undefined") ? localStorage.getItem("user") : null;
  if (userData) {
    try {
      const user = JSON.parse(userData);
      userId = user.id;
    } catch {}
  }
  // Relación de equipos por userTeams
  if (userId && Array.isArray(userTeams)) {
    userTeamIds = userTeams.filter(ut => ut.userId === userId).map(ut => Number(ut.teamId));
  }

  // Filtrar tareas asignadas directamente al usuario
  const userTasks = tasks.filter(task => userId && task.userId === userId);
  // Filtrar tareas asignadas a equipos del usuario (y que NO sean directas del usuario)
  const teamTasks = tasks.filter(task => !userTasks.includes(task) && task.teamId && userTeamIds.includes(Number(task.teamId)));

  // Debug: mostrar datos clave
  console.log("userId", userId);
  console.log("userTeamIds", userTeamIds);
  console.log("tasks", tasks);
  console.log("userTasks", userTasks);
  console.log("teamTasks", teamTasks);
  console.log("users", users);
  console.log("teams", teams);

  if (!userTasks.length && !teamTasks.length) {
    return(
        <>
    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        {userName.role === "admin" && (
        <button
          style={{ background: "#2f70aa", color: "white", border: 0, borderRadius: 6, padding: "8px 16px", cursor: "pointer" }}
          onClick={() => router.push("/dashboard/tasks/new")}
        >
          Crear tarea
        </button>
        )}
      </Box>
    <Typography color="text.secondary">No tienes tareas asignadas.</Typography>
    </>);
  }



  return (
    <>
    {userName.role === "admin" && (
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, top: "50px"  }}>
        <button
          style={{ background: "#2f70aa", color: "white", border: 0, borderRadius: 6, padding: "8px 16px", cursor: "pointer" }}
          onClick={() => router.push("/dashboard/tasks/new")}
        >
          Crear tarea
        </button>
      </Box>
    )}
      {/* Tareas asignadas directamente al usuario */}
      {userTasks.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#1e4976', fontWeight: 700 }}>Tareas asignadas a mí</Typography>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            {userTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
                <Card sx={{ borderLeft: "6px solid #1e4976" }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ color: "#1e4976", fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
                    >
                      {task.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ cursor: "pointer" }}
                      onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
                    >
                      {task.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                      Estado: {task.status}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                      Proyecto: {
                        (() => {
                          if (task.project?.name) return task.project.name;
                          if (task.projectName) return task.projectName;
                          const found = projects.find(p => p.id === task.projectId);
                          return found ? found.name : (task.projectId || "-");
                        })()
                      }
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                      Responsable: {
                        (() => {
                          if (task.responsibleName) return task.responsibleName;
                          if (task.userName) return task.userName;
                          if (task.teamName) return task.teamName;
                          if (task.userId) {
                            const user = users.find(u => u.id === task.userId);
                            if (user) return user.name || user.email;
                          }
                          if (task.teamId) {
                            const team = teams.find(t => Number(t.id) === Number(task.teamId));
                            if (team) return team.name;
                          }
                          return "-";
                        })()
                      }
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                      <button
                        style={{display: userName.role !== "admin" ? "none" : "block" , background: "#2f70aa", color: "white", border: 0, borderRadius: 6, padding: "6px 12px", cursor: "pointer" }}
                        onClick={e => { e.stopPropagation(); router.push(`/dashboard/tasks/${task.id}/edit`); }}
                        disabled={userName.role !== "admin"}
                      >
                        Editar
                      </button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
      {/* Tareas asignadas a mis equipos */}
      {teamTasks.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 4, mb: 1, color: '#1e4976', fontWeight: 700 }}>Tareas asignadas a mis equipos</Typography>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            {teamTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
                <Card sx={{ borderLeft: "6px solid #1e4976" }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ color: "#1e4976", fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
                    >
                      {task.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ cursor: "pointer" }}
                      onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
                    >
                      {task.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                      Estado: {task.status}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                      Proyecto: {
                        (() => {
                          if (task.project?.name) return task.project.name;
                          if (task.projectName) return task.projectName;
                          const found = projects.find(p => p.id === task.projectId);
                          return found ? found.name : (task.projectId || "-");
                        })()
                      }
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                      Responsable: {
                        (() => {
                          if (task.responsibleName) return task.responsibleName;
                          if (task.userName) return task.userName;
                          if (task.teamName) return task.teamName;
                          if (task.userId) {
                            const user = users.find(u => u.id === task.userId);
                            if (user) return user.name || user.email;
                          }
                          if (task.teamId) {
                            const team = teams.find(t => Number(t.id) === Number(task.teamId));
                            if (team) return team.name;
                          }
                          return "-";
                        })()
                      }
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                      <button
                        style={{display: userName.role !== "admin" ? "none" : "block" , background: "#2f70aa", color: "white", border: 0, borderRadius: 6, padding: "6px 12px", cursor: "pointer" }}
                        onClick={e => { e.stopPropagation(); router.push(`/dashboard/tasks/${task.id}/edit`); }}
                        disabled={userName.role !== "admin"}
                      >
                        Editar
                      </button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </>
  );
}
