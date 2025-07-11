import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

export default function TeamForm({ onSubmit, initialData = {} }) {
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
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: "auto", mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Crear/Editar Equipo</Typography>
      <TextField
        label="Nombre"
        name="name"
        value={form.name}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Descripción"
        name="description"
        value={form.description}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" sx={{ bgcolor: "#2f70aa", color: "white" }} fullWidth>
        Guardar
      </Button>
    </Box>
  );
}
