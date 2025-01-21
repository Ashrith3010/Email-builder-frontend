import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Search as SearchIcon 
} from '@mui/icons-material';
import { Navbar } from './Navbar';

function TemplateList() {
  const [templates, setTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/templates');
      if (!response.ok) throw new Error('Failed to fetch templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error:', error);
      // You could add a snackbar/alert here to show the error
    }
  };

  const handleSearch = async () => {
    try {
      const url = searchQuery.trim()
        ? `http://localhost:8080/api/templates/search?query=${encodeURIComponent(searchQuery)}`
        : 'http://localhost:8080/api/templates';
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/templates/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete template');
      fetchTemplates();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={handleSearch}
                    variant="contained"
                    startIcon={<SearchIcon />}
                  >
                    Search
                  </Button>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid item xs={12} key={template.id}>
              <Card>
                <CardContent>
                  <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" component="h3">
                        {template.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Created: {new Date(template.createdAt).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <IconButton
                        onClick={() => navigate(`/edit/${template.id}`)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => setSelectedTemplate(template)}
                        color="info"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(template.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog
          open={Boolean(selectedTemplate)}
          onClose={() => setSelectedTemplate(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{selectedTemplate?.title}</Typography>
              <IconButton onClick={() => setSelectedTemplate(null)}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </DialogTitle>
          <DialogContent dividers>
            <div dangerouslySetInnerHTML={{ __html: selectedTemplate?.content }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedTemplate(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default TemplateList;