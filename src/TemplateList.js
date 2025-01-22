import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Email.css';

const Navbar = () => (
  <nav className="nav">
    <div className="templatenav">
      <h1 className="headernav">Email Builder</h1>
      <div className="nav-links">
        <Link to="/templates" className="templatelink">Templates</Link>
        <Link to="/new" className="newlink">New Template</Link>
      </div>
    </div>
  </nav>
);

const Modal = ({ template, onClose }) => {
  if (!template) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="template-title">{template.title}</h2>
          <button onClick={onClose} className="action-button">
            ✕
          </button>
        </div>
        <div className="modal-body">
          {template.imageUrl && (
            <img
              src={`http://localhost:8080${template.imageUrl}`}
              alt="Template"
              className="template-image"
              style={{ maxWidth: '100%', height: 'auto', marginBottom: '1rem' }}
            />
          )}
          <div dangerouslySetInnerHTML={{ __html: template.content }} />
          {template.footer && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              {template.footer}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="action-button edit-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const TemplateList = () => {
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
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/templates/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete template');
        fetchTemplates();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      <div className="templates-container">
        {templates.map((template) => (
          <div key={template.id} className="template-card">
            <div className="card-header">
              <div>
                <h3 className="template-title">{template.title}</h3>
                <p className="template-date">
                  Created: {new Date(template.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="card-actions">
                <button
                  onClick={() => navigate(`/edit/${template.id}`)}
                  className="action-button edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => setSelectedTemplate(template)}
                  className="action-button view-button"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="action-button delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <Modal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </div>
  );
};

export default TemplateList;