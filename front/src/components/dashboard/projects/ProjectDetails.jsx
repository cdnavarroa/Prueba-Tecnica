import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, Grid, Card, CardContent } from "@mui/material";
import TasksOverview from "../TasksOverview";

export default function ProjectDetails({ projectId }) {
  const [project, setProject] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!projectId) return;
    const token = localStorage.getItem("token");
    fetch(`${process.env.BACKEND_URL}/projects/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    })
      .then(res => res.json())
      .then(data => setProject(data))
      .catch(() => setProject(null));
  }, [projectId]);

  if (!project) return <Typography>Cargando proyecto...</Typography>;

  return (
    <Box>
      <Typography variant="h4" sx={{ color: "#2f70aa", fontWeight: "bold", mb: 2 }}>
        {project.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {project.description}
      </Typography>
      <Button variant="contained" sx={{ mb: 2, bgcolor: "#2f70aa" }} onClick={() => router.push(`/dashboard/projects/${projectId}/tasks/new`)}>
        Crear tarea
      </Button>
      <TasksOverview projectId={projectId} />
    </Box>
  );
}
