import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
}));

const ButtonGroup = styled('div')({
  display: 'flex',
  gap: '1rem',
});

const StyledButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

export function Navbar() {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <StyledToolbar>
          <Typography variant="h5" component="h1">
            Email Builder
          </Typography>
          <ButtonGroup>
            <StyledButton component={Link} to="/">
              Templates
            </StyledButton>
            <StyledButton component={Link} to="/new">
              New Template
            </StyledButton>
          </ButtonGroup>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}