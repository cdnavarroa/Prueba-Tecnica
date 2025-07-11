import React, { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, ListItemText, TextField, Button, Divider } from "@mui/material";

export default function TaskComments({ taskId, user }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Función para obtener comentarios
  const fetchComments = () => {
    if (!taskId) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    let userRole = "";
    let userId = null;
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const u = JSON.parse(userStr);
      userRole = u.role;
      userId = u.id;
      setIsAdmin(userRole === "admin");
    }
    let url = `${process.env.BACKEND_URL}/tasks/${taskId}/comments`;
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setComments(Array.isArray(data) ? data : (data.comments || [])))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  console.log("Comments:", comments);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const userId = userStr ? JSON.parse(userStr).id : null;
    if (!userId) {
      alert("No se pudo identificar el usuario");
      return;
    }
    const res = await fetch(`${process.env.BACKEND_URL}/tasks/${taskId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text: newComment, userId })
    });
    if (res.ok) {
      setNewComment("");
      fetchComments();
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Comentarios</Typography>
      <Divider sx={{ mb: 2 }} />
      <List sx={{ maxHeight: 200, overflow: "auto", bgcolor: "#f7f7f7", borderRadius: 1 }}>
        {loading ? <Typography sx={{ p: 2 }}>Cargando...</Typography> :
          comments.length === 0 ? <Typography sx={{ p: 2 }}>Sin comentarios.</Typography> :
          comments.map((c, i) => (
            <ListItem key={c.id || i} alignItems="flex-start">
              <ListItemText
                primary={<><b>{c.userName || c.name || c.userId || "Usuario"}</b><span style={{ fontSize: 14, color: "#888" }}> - {c.userEmail || ""}</span></>}
                
                secondary={<>
                  <span>{c.text || c.content}</span>
                  <br />
                  <span style={{ fontSize: 12, color: "#888" }}>{c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}</span>
                </>}
              />
            </ListItem>
          ))
        }
      </List>
      <Box component="form" onSubmit={handleAddComment} sx={{ display: "flex", gap: 1, mt: 2 }}>
        <TextField
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Escribe un comentario..."
          size="small"
          fullWidth
        />
        <Button type="submit" variant="contained" disabled={!newComment.trim()}>Enviar</Button>
      </Box>
    </Box>
  );
}
