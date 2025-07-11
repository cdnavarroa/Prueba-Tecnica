import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Box, Chip, Avatar, Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from "@mui/material";

export default function TeamsOverview() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editTeamId, setEditTeamId] = useState(null); // null = crear, id = editar
    const [newTeam, setNewTeam] = useState({ name: '', members: [] });
    const [openMembersDialog, setOpenMembersDialog] = useState(false);
    const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
    const [selectedTeamName, setSelectedTeamName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        let userObj = null;
        if (userStr) {
            try { userObj = JSON.parse(userStr); } catch { }
        }
        setUser(userObj);

        // Función para cargar equipos y miembros
        const fetchTeamsAndMembers = (usersList) => {
            fetch(`${process.env.BACKEND_URL}/teams`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    let allTeams = Array.isArray(data) ? data : (data.teams || []);
                    const loadMembers = async (team) => {
                        const res = await fetch(`${process.env.BACKEND_URL}/teams/${team.id}/users`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        let members = await res.json();
                        if (members && !Array.isArray(members) && Array.isArray(members.users)) {
                            members = members.users;
                        }

                        if (Array.isArray(members) && members.length > 0 && members[0].user && members[0].userteam) {
                            members = members.map(m => ({ ...m.user, userteam: m.userteam }));
                        }
                        // Si los miembros solo traen userId, mapear a los datos completos del usuario
                        else if (Array.isArray(members) && members.length > 0 && members[0].userId && usersList.length > 0) {
                            members = members.map(m => {
                                const u = usersList.find(u => u.id === (m.userId || m.id));
                                return u ? u : { id: m.userId || m.id, name: `Usuario ${m.userId || m.id}` };
                            });
                        }
                        return { ...team, members };
                    };
                    Promise.all(allTeams.map(loadMembers)).then(teamsWithMembers => {
                        setTeams(teamsWithMembers);
                        setLoading(false);
                    });
                })
                .catch(() => setLoading(false));
        };

        // Traer usuarios primero (si es admin), luego equipos
        if (userObj && userObj.role === "admin") {
            fetch(`${process.env.BACKEND_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    const usersList = Array.isArray(data) ? data : (data.users || []);
                    setUsers(usersList);
                    fetchTeamsAndMembers(usersList);
                });
        } else {
            // Para miembros, cargar usuarios básicos para poder mapear nombres
            fetch(`${process.env.BACKEND_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    const usersList = Array.isArray(data) ? data : (data.users || []);
                    setUsers(usersList);
                    fetchTeamsAndMembers(usersList);
                });
        }
    }, []);

    console.log("Teams:", teams);
    console.log("User:", users);

    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ color: "#2f70aa", fontWeight: "bold" }}>
                    Equipos
                </Typography>
                {user && user.role === "admin" && (
                    <Button variant="contained" sx={{ bgcolor: '#2f70aa', color: 'white', fontWeight: 700, borderRadius: 2 }} onClick={() => setOpenDialog(true)}>
                        Crear equipo
                    </Button>
                )}
            </Box>
            <Grid container spacing={2}>
                {teams.length === 0 && !loading && (
                    <Grid item xs={12}>
                        <Typography color="text.secondary">No perteneces a ningún equipo.</Typography>
                    </Grid>
                )}
                {teams.map(team => (
                    <Grid item xs={12} sm={6} md={4} key={team.id}>
                        <Card sx={{ borderLeft: "6px solid #2f70aa", boxShadow: 2, borderRadius: 3, minHeight: 160 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ color: "#2f70aa", fontWeight: "bold", mb: 1 }}>
                                            {team.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {team.members.length} miembro{team.members.length !== 1 ? 's' : ''}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Button size="small" variant="outlined" sx={{ ml: 1, minWidth: 0, px: 1, fontSize: 12 }}
                                            onClick={() => {
                                                setSelectedTeamMembers(team.members);
                                                setSelectedTeamName(team.name);
                                                setOpenMembersDialog(true);
                                            }}>
                                            Ver miembros
                                        </Button>
                                        {user && user.role === "admin" && (
                                            <Button size="small" variant="outlined" color="error" sx={{ ml: 1, minWidth: 0, px: 1, fontSize: 12 }}
                                                onClick={async () => {
                                                    if (window.confirm('¿Seguro que deseas eliminar este equipo?')) {
                                                        const token = localStorage.getItem("token");
                                                        const res = await fetch(`${process.env.BACKEND_URL}/teams/${team.id}`, {
                                                            method: 'DELETE',
                                                            headers: { Authorization: `Bearer ${token}` }
                                                        });
                                                        if (res.ok) {
                                                            setTeams(teams.filter(t => t.id !== team.id));
                                                        } else {
                                                            alert('Error al eliminar el equipo');
                                                        }
                                                    }
                                                }}>
                                                Eliminar
                                            </Button>
                                        )}
                                        {user && user.role === "admin" && (
                                            <Button size="small" variant="outlined" sx={{ ml: 1, minWidth: 0, px: 1, fontSize: 12 }}
                                                onClick={() => {
                                                    setEditTeamId(team.id);
                                                    // Mapear correctamente los IDs de usuario asignados
                                                    const memberIds = team.members.map(m =>
                                                        m.userteam && m.userteam.userId ? m.userteam.userId : (m.userId ? m.userId : m.id)
                                                    );
                                                    setNewTeam({ name: team.name, members: memberIds });
                                                    setOpenDialog(true);
                                                }}>
                                                Editar
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                        
                                {/* Dialog para ver miembros del equipo */}
                                <Dialog open={openMembersDialog} onClose={() => setOpenMembersDialog(false)} maxWidth="xs" fullWidth>
                                    <DialogTitle sx={{ color: '#2f70aa', fontWeight: 700 }}>{`Miembros de ${selectedTeamName}`}</DialogTitle>
                                    <DialogContent>
                                        {selectedTeamMembers.length === 0 ? (
                                            <Typography color="text.secondary">Sin miembros</Typography>
                                        ) : (
                                            <Stack spacing={1} sx={{ mt: 1 }}>
                                                {selectedTeamMembers.map(member => {
                                                    // Si viene userteam, buscar el usuario por userId
                                                    let userData = member;
                                                    if (member.userteam && users.length > 0) {
                                                        userData = users.find(u => u.id === member.userteam.userId) || member;
                                                    } else if (member.userId && users.length > 0) {
                                                        userData = users.find(u => u.id === member.userId) || member;
                                                    }
                                                    const name = userData.name || userData.email || '?';
                                                    return (
                                                        <Box key={userData.id || member.userId} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Avatar sx={{ width: 28, height: 28 }}>{name[0]}</Avatar>
                                                            <Typography>{name}</Typography>
                                                        </Box>
                                                    );
                                                })}
                                            </Stack>
                                        )}
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => setOpenMembersDialog(false)} color="primary">Cerrar</Button>
                                    </DialogActions>
                                </Dialog>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Dialog para crear equipo (solo admin) */}
            <Dialog open={openDialog} onClose={() => { setOpenDialog(false); setEditTeamId(null); }} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ color: '#2f70aa', fontWeight: 700, pb: 0 }}>{editTeamId ? 'Editar equipo' : 'Crear equipo'}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, p: 2 }}>
                    <TextField
                        label="Nombre del equipo"
                        value={newTeam.name}
                        onChange={e => setNewTeam({ ...newTeam, name: e.target.value })}
                        fullWidth
                        sx={{ bgcolor: 'white', borderRadius: 2, mb: 2 }}
                        disabled={!!editTeamId} // No permitir cambiar el nombre al editar
                    />
                    <TextField
                        select
                        label="Miembros"
                        value={newTeam.members}
                        onChange={e => setNewTeam({ ...newTeam, members: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value })}
                        SelectProps={{
                            multiple: true,
                            renderValue: (selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map(id => {
                                        const u = users.find(u => u.id === id);
                                        return (
                                            <Chip key={id} label={u ? (u.name || u.email) : id} size="small" sx={{ bgcolor: '#e3f2fd', color: '#1e4976' }} />
                                        );
                                    })}
                                </Box>
                            )
                        }}
                        fullWidth
                        sx={{ bgcolor: 'white', borderRadius: 2, mb: 1 }}
                    >
                        {users.map(u => (
                            <MenuItem key={u.id} value={u.id}>{u.name || u.email}</MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => { setOpenDialog(false); setEditTeamId(null); }} color="inherit">Cancelar</Button>
                    <Button variant="contained" sx={{ bgcolor: '#2f70aa', color: 'white', fontWeight: 700 }}
                        onClick={async () => {
                            const token = localStorage.getItem("token");
                            let teamId = editTeamId;
                            if (!editTeamId) {
                                // Crear equipo
                                const res = await fetch(`${process.env.BACKEND_URL}/teams`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`
                                    },
                                    body: JSON.stringify({ name: newTeam.name })
                                });
                                if (!res.ok) {
                                    alert('Error al crear el equipo');
                                    return;
                                }
                                const created = await res.json();
                                teamId = created.id;
                            }
                            // Asignar usuarios (crear o editar)
                            if (newTeam.members.length > 0 && teamId) {
                                await fetch(`${process.env.BACKEND_URL}/teams/${teamId}/users`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`
                                    },
                                    body: JSON.stringify({ userIds: newTeam.members })
                                });
                            }
                            // 3. Refrescar equipos y miembros
                            setOpenDialog(false);
                            setEditTeamId(null);
                            setNewTeam({ name: '', members: [] });
                            setLoading(true);
                            fetch(`${process.env.BACKEND_URL}/teams`, {
                                headers: { Authorization: `Bearer ${token}` }
                            })
                                .then(res => res.json())
                                .then(async data => {
                                    let allTeams = Array.isArray(data) ? data : (data.teams || []);
                                    let filtered = [];
                                    if (user && user.role === "admin") {
                                        filtered = allTeams;
                                    } else if (user) {
                                        let userTeamIds = [];
                                        if (user.teams && Array.isArray(user.teams)) {
                                            userTeamIds = user.teams.map(t => t.id || t);
                                        }
                                        filtered = allTeams.filter(team => userTeamIds.includes(team.id));
                                    }
                                    const loadMembers = async (team) => {
                                        const res = await fetch(`${process.env.BACKEND_URL}/teams/${team.id}/users`, {
                                            headers: { Authorization: `Bearer ${token}` }
                                        });
                                        const members = await res.json();
                                        return { ...team, members };
                                    };
                                    Promise.all(filtered.map(loadMembers)).then(teamsWithMembers => {
                                        setTeams(teamsWithMembers);
                                        setLoading(false);
                                    });
                                })
                                .catch(() => setLoading(false));
                        }}>
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
