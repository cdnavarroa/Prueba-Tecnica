import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

export default function ProjectForm({ onSubmit, initialData = {} }) {
  const [form, setForm] = useState({
    name: initialData.name || "",
    description: initialData.description || ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{
      maxWidth: 420,
      mx: "auto",
      mt: 4,
      p: 4,
      bgcolor: "#f7fafd",
      borderRadius: 4,
      boxShadow: 3,
      border: '1px solid #e3e8ee',
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>
      <Typography variant="h5" sx={{ mb: 2, color: '#2f70aa', fontWeight: 700, textAlign: 'center', letterSpacing: 1 }}>
        {initialData && initialData.id ? 'Editar Proyecto' : 'Crear Proyecto'}
      </Typography>
      <TextField
        label="Nombre"
        name="name"
        value={form.name}
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
