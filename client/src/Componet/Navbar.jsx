import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Tooltip } from '@mui/material';
import { Home, Person, Favorite, Group } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#9947c0ff' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          MyApp
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Home">
            <IconButton color="inherit" component={Link} to="/home">
              <Home />
            </IconButton>
          </Tooltip>
          <Tooltip title="Profile">
            <IconButton color="inherit" component={Link} to="/profile">
              <Person />
            </IconButton>
          </Tooltip>
          <Tooltip title="Favorites">
            <IconButton color="inherit" component={Link} to="/favorites">
              <Favorite />
            </IconButton>
          </Tooltip>
          <Tooltip title="Friends">
            <IconButton color="inherit" component={Link} to="/friends">
              <Group />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
