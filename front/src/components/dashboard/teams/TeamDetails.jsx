import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, Button } from "@mui/material";

export default function TeamDetails({ teamId }) {
  const [team, setTeam] = useState(null);

  useEffect(() => {
    // fetchTeamById(teamId).then(setTeam);
  }, [teamId]);

  if (!team) return <Typography>Cargando equipo...</Typography>;

  return (
    <Box>
      <Typography variant="h4" sx={{ color: "#2f70aa", fontWeight: "bold", mb: 2 }}>
        {team.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {team.description}
      </Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>Miembros</Typography>
      <List>
        {team.members.map((member) => (
          <ListItem key={member.id}>
            <ListItemText primary={member.name} secondary={member.email} />
          </ListItem>
        ))}
      </List>
      <Button variant="contained" sx={{ mt: 2, bgcolor: "#2f70aa" }}>
        Agregar miembro
      </Button>
    </Box>
  );
}
