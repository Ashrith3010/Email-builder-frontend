import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Card, CardContent, Typography, Box, CircularProgress, Grid } from '@mui/material';
import './email-builder.css';
import { Navbar } from './Navbar';

function EmailBuilder() {
  const { id } = useParams();
  const [template, setTemplate] = useState({
    title: '',
    content: '',
    imageUrl: '',
    footer: '',
    imageData: null,
    isImageOnly: false
  });
  const [preview, setPreview] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetchTemplate();
    }
  }, [id]);

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/templates/${id}`);
      if (!response.ok) throw new Error('Failed to fetch template');
      const data = await response.json();
      setTemplate(data);

      if (data.imageData) {
        setImagePreview(`http://localhost:8080/api/templates/${id}/image`);
      }
    } catch (error) {
      console.error('Error fetching template:', error);
      alert('Failed to load template');
    }
  };

  const validateTemplate = () => {
    const newErrors = {};
    if (!template.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!template.content?.trim()) {
      newErrors.content = 'Content is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTemplate((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      setImagePreview(`http://localhost:8080${data.imageUrl}`);
      setTemplate((prev) => ({
        ...prev,
        imageUrl: data.imageUrl,
        imageData: data.imageId,
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!validateTemplate()) {
      return;
    }

    try {
      const url = id
        ? `http://localhost:8080/api/templates/${id}`
        : 'http://localhost:8080/api/templates';
      const method = id ? 'PUT' : 'POST';

      const templateToSave = {
        ...template,
        imageData: null
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateToSave),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to save template');
      }

      alert('Template saved successfully!');
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template: ' + error.message);
    }
  };

  const handlePreview = async () => {
    if (!validateTemplate()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/preview-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...template,
          imageUrl: imagePreview || template.imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }

      const html = await response.text();
      setPreview(html);
    } catch (error) {
      console.error('Error generating preview:', error);
      alert('Failed to generate preview. Please try again.');
    }
  };

  return (
    <Box className="container" p={4}>
      <Navbar />
      <Box mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h4" component="div" gutterBottom>
              Email Builder
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={template.title}
                  onChange={handleInputChange}
                  error={!!errors.title}
                  helperText={errors.title}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Content"
                  name="content"
                  value={template.content}
                  onChange={handleInputChange}
                  multiline
                  rows={6}
                  error={!!errors.content}
                  helperText={errors.content}
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Button
                    variant="outlined"
                    component="label"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Upload Image'}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Button>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxWidth: '100px', borderRadius: '8px' }}
                    />
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Footer"
                  name="footer"
                  value={template.footer}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} display="flex" gap={2}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                  Save Template
                </Button>
                <Button variant="contained" color="secondary" onClick={handlePreview}>
                  Preview
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {preview && (
        <Box mt={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Preview
              </Typography>
              <Box
                dangerouslySetInnerHTML={{ __html: preview }}
                p={2}
                style={{ border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}

export default EmailBuilder;
