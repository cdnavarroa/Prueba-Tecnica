"use client"

import React, { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import GroupIcon from '@mui/icons-material/Group';

const StyledContainer = styled(Container)(({ theme }) => ({
  background: "linear-gradient(135deg, rgba(75, 156, 211, 0.05) 0%, rgba(75, 156, 211, 0.1) 100%)",
  minHeight: "90vh",
  paddingTop: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  backgroundImage: `
    radial-gradient(at 50% 0%, rgba(75, 156, 211, 0.1) 0%, transparent 50%),
    radial-gradient(at 85% 85%, rgba(75, 156, 211, 0.2) 0%, transparent 50%),
    radial-gradient(at 15% 85%, rgba(75, 156, 211, 0.15) 0%, transparent 50%)
  `,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  backdropFilter: "blur(10px)",
  background: "rgba(255, 255, 255, 0.9)",
  boxShadow: "0 8px 32px rgba(16, 36, 60, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  position: "relative",
  overflow: "hidden",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #2f70aa, #1e4976)",
  }
}));

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    passwordvalidation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (prop) => (event) => {
    setFormData({ ...formData, [prop]: event.target.value });
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    if (formData.password !== formData.passwordvalidation) {
      alert("Las contraseñas no coinciden");
        setIsLoading(false);
        return;
    }

    const data = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        };

    await fetch(`${process.env.BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded", 
            "Accept": "application/json",
        },
        body: new URLSearchParams(data).toString(), // Convertir a form-data
    })

    .then((response) => response.json())
    .then((data) => {
        if (data.error) {
            alert(data.error);
        } else {
            alert("Usuario registrado exitosamente");
            // Redirigir al login o a otra página
            window.location.href = "/";
        }
    })
    .catch((error) => {
        console.error("Error al registrar el usuario:", error);
        alert("Error al registrar el usuario. Inténtalo de nuevo más tarde.");
    })
    .finally(() => {
        setIsLoading(false);
    }
    );
    
  };

  return (
    <StyledContainer maxWidth="sm">
      <StyledPaper>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ mt: 2, color: "#2f70aa", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GroupIcon sx={{ mr: 1, fontSize: 35 }} />
            Crear cuenta
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre completo"
            value={formData.name}
            onChange={handleChange("name")}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "#2f70aa" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Correo electrónico"
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: "#2f70aa" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange("password")}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <KeyIcon sx={{ color: "#2f70aa" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Confirmar contraseña"
            type={showPassword ? "text" : "passwordvalidation"}
            value={formData.passwordvalidation}
            onChange={handleChange("passwordvalidation")}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <KeyIcon sx={{ color: "#2f70aa" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* <TextField
            select
            fullWidth
            label="Rol"
            value={formData.role}
            onChange={handleChange("role")}
            margin="normal"
          >
            <MenuItem value="member">Miembro</MenuItem>
            <MenuItem value="admin">Administrador</MenuItem>
          </TextField> */}

          <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                bgcolor: "#2f70aa",
                color: "white",
                "&:hover": { bgcolor: "#1e4976" }
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={24} sx={{ color: "#2f70aa", mr: 1 }} />
                  Registrando...
                </>
              ) : (
                "Registrarse"
              )}
            </Button>

            <Link href="/" passHref style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  color: "#2f70aa",
                  borderColor: "#2f70aa",
                  "&:hover": { borderColor: "#1e4976", bgcolor: "rgba(16, 36, 60, 0.04)" }
                }}
              >
                ¿Ya tienes cuenta? Inicia sesión
              </Button>
            </Link>
          </Box>
        </form>
      </StyledPaper>
    </StyledContainer>
    );
}

export default Register;