import React, { useState } from "react";
import { Box, TextField, Button, MenuItem, Typography } from "@mui/material";

export default function TaskForm({ onSubmit, initialData = {}, users = [], teams = [], projects = [] }) {
    // Normalización de datos iniciales para edición
  let normalized = { ...initialData };

  if (normalized.dueDate && !normalized.deadline) normalized.deadline = normalized.dueDate;
  if (normalized.deadline && normalized.deadline instanceof Date) {
    normalized.deadline = normalized.deadline.toISOString().slice(0, 10);
  } else if (normalized.deadline && typeof normalized.deadline === "string" && normalized.deadline.length > 10) {
    normalized.deadline = normalized.deadline.slice(0, 10);
  }

  if (normalized.project && !normalized.projectId) normalized.projectId = normalized.project.id;
  // responsable puede venir como userId/teamId o como objeto
  if (normalized.userId) {
    normalized.responsibleType = "user";
    normalized.responsibleId = normalized.userId;
  } else if (normalized.teamId) {
    normalized.responsibleType = "team";
    normalized.responsibleId = normalized.teamId;
  }

  if (normalized.user && !normalized.responsibleId) {
    normalized.responsibleType = "user";
    normalized.responsibleId = normalized.user.id;
  }
  if (normalized.team && !normalized.responsibleId) {
    normalized.responsibleType = "team";
    normalized.responsibleId = normalized.team.id;
  }
  const [form, setForm] = useState({
    title: normalized.title || "",
    description: normalized.description || "",
    deadline: normalized.deadline || "",
    status: normalized.status || "todo",
    responsibleType: normalized.responsibleType || "user",
    responsibleId: normalized.responsibleId || "",
    projectId: normalized.projectId || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Si cambia el tipo de responsable, limpiar el otro campo
    if (name === 'responsibleType') {
      setForm(f => ({
        ...f,
        responsibleType: value,
        responsibleId: '',
        // Limpiar userId/teamId según el tipo
        ...(value === 'user' ? { teamId: null } : { userId: null })
      }));
    } else if (name === 'responsibleId') {
      setForm(f => ({
        ...f,
        responsibleId: value,
        // Setear userId o teamId según el tipo
        ...(f.responsibleType === 'user'
          ? { userId: value, teamId: null }
          : { teamId: value, userId: null })
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{
      maxWidth: 500,
      mx: "auto",
      mt: 2,
      p: 4,
      bgcolor: "#f7fafd",
      borderRadius: 4,
      boxShadow: 3,
      border: '1px solid #e3e8ee',
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>
      <Typography variant="h5" sx={{ mb: 2, color: '#1e4976', fontWeight: 700, textAlign: 'center', letterSpacing: 1 }}>
        {initialData && initialData.id ? 'Editar Tarea' : 'Crear Tarea'}
      </Typography>
      <TextField
        label="Título"
        name="title"
        value={form.title}
        onChange={handleChange}
        fullWidth
        required
        sx={{ bgcolor: 'white', borderRadius: 2 }}
      />
      <TextField
        label="Descripción"
        name="description"
        value={form.description}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
        sx={{ bgcolor: 'white', borderRadius: 2 }}
      />
      <TextField
        label="Fecha límite"
        name="deadline"
        type="date"
        value={form.deadline}
        onChange={handleChange}
        fullWidth
        InputLabelProps={{ shrink: true }}
        sx={{ bgcolor: 'white', borderRadius: 2 }}
      />
      <TextField
        select
        label="Proyecto"
        name="projectId"
        value={form.projectId}
        onChange={handleChange}
        fullWidth
        required
        sx={{ bgcolor: 'white', borderRadius: 2 }}
      >
        {projects.map((project) => (
          <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
        ))}
      </TextField>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          select
          label="Estado"
          name="status"
          value={form.status}
          onChange={handleChange}
          fullWidth
          sx={{ bgcolor: 'white', borderRadius: 2 }}
        >
          <MenuItem value="todo">Por hacer</MenuItem>
          <MenuItem value="in_progress">En progreso</MenuItem>
          <MenuItem value="done">Completada</MenuItem>
        </TextField>
        <TextField
          select
          label="Responsable"
          name="responsibleType"
          value={form.responsibleType}
          onChange={handleChange}
          fullWidth
          sx={{ bgcolor: 'white', borderRadius: 2 }}
        >
          <MenuItem value="user">Usuario</MenuItem>
          <MenuItem value="team">Equipo</MenuItem>
        </TextField>
      </Box>
      <TextField
        select
        label={form.responsibleType === "user" ? "Usuario asignado" : "Equipo asignado"}
        name="responsibleId"
        value={form.responsibleId}
        onChange={handleChange}
        fullWidth
        sx={{ bgcolor: 'white', borderRadius: 2 }}
        helperText={form.responsibleType === 'user' ? 'Selecciona un usuario responsable' : 'Selecciona un equipo responsable'}
      >
        {(form.responsibleType === "user" ? users : teams).map((item) => (
          <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
        ))}
      </TextField>
      <Button
        type="submit"
        variant="contained"
        sx={{
          bgcolor: "#2f70aa",
          color: "white",
          fontWeight: 700,
          fontSize: 18,
          borderRadius: 3,
          py: 1.5,
          mt: 1,
          boxShadow: 2,
          '&:hover': { bgcolor: '#1e4976' }
        }}
        fullWidth
      >
        Guardar
      </Button>
    </Box>
  );
}
