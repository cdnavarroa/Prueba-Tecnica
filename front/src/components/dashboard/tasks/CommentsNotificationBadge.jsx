import React, { useEffect, useState } from "react";
import { IconButton, Badge, Menu, MenuItem, ListItemText, ListItemAvatar, Avatar, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function CommentsNotificationBadge({ userId }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [comments, setComments] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!userId) return;
    const token = localStorage.getItem("token");
    let intervalId;
    const fetchRecentComments = () => {
      fetch(`${process.env.BACKEND_URL}/users/${userId}/recent-comments`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          let arr = Array.isArray(data) ? data : (data.comments || []);
          // Filtrar solo comentarios que NO sean del usuario actual (comparar como número)
          arr = arr.filter(c => Number(c.userId) !== Number(userId));
          setComments(arr.slice(0, 5));
          setUnread(arr.filter(c => !c.read).length);
        });
    };
    fetchRecentComments();
    intervalId = setInterval(fetchRecentComments, 10000); // refresca cada 10s
    return () => clearInterval(intervalId);
  }, [userId]);

  console.log("Recent Comments:", comments);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={unread} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <Typography sx={{ px: 2, pt: 1, fontWeight: 'bold' }}>Últimos comentarios</Typography>
        {comments.length === 0 ? (
          <MenuItem disabled>
            <ListItemText primary="Sin comentarios recientes" />
          </MenuItem>
        ) : comments.map((c, i) => (
          <MenuItem key={c.id || i} onClick={handleClose} sx={{ alignItems: 'flex-start', whiteSpace: 'normal' }}>
            <ListItemAvatar>
              <Avatar>{(c.userName || c.user?.name || 'U')[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<b>{c.userName || c.user?.name || c.user?.email || 'Usuario'}</b>}
              secondary={<>
                <span style={{ fontSize: 13 }}>{c.text?.slice(0, 60)}{c.text?.length > 60 ? '...' : ''}</span>
                <br />
                <span style={{ fontSize: 11, color: '#888' }}>{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</span>
              </>}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
