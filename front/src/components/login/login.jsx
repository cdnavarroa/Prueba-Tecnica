"use client"

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  InputAdornment,
  CircularProgress, // <--- Importamos el spinner
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Email } from "@mui/icons-material";

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


function Login() {
  const [formData, setFormData] = useState({
    email: "",
    contraseña: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (prop) => (event) => {
    setFormData({ ...formData, [prop]: event.target.value });
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const data = {
      email: formData.email,
      password: formData.contraseña,
    };

    await fetch(`${process.env.BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
      },
      body: new URLSearchParams(data).toString(),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          window.location.href = "/dashboard"; // Redirigir al dashboard
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
      })
      .finally(() => {
        setIsLoading(false);
      });

  };


  return (
    <StyledContainer maxWidth="sm">
      <StyledPaper>
        <Box sx={{ textAlign: "center", mb: 4 }}>

          <Typography variant="h4" sx={{ mt: 2, color: "#2f70aa", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PersonIcon sx={{ mr: 1, fontSize: 35 }} />
            Inicia sesión
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>

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
                  <Email sx={{ color: "#2f70aa" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            value={formData.contraseña}
            onChange={handleChange("contraseña")}
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

          <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Botón con animación (spinner) cuando isLoading es true */}
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
                  Iniciando...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </Button>

            <Link href="/register" passHref style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  color: "#2f70aa",
                  borderColor: "#2f70aa",
                  "&:hover": { borderColor: "#1e4976", bgcolor: "rgba(16, 36, 60, 0.04)" }
                }}
              >
                Registrarse
              </Button>
            </Link>
          </Box>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Link
              href="/password-recovery"
              style={{
                color: "#2f70aa",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: "bold"
              }}
            >
              <KeyIcon /> ¿Olvidaste tu contraseña?
            </Link>
          </Box>
        </form>

      </StyledPaper>
    </StyledContainer>
  );
}

export default Login;
