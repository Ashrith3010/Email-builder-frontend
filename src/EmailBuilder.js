import React, { useState, useEffect } from 'react';
import './Email.css'
import { Navbar } from './Navbar';
function EmailBuilder() {
  const [template, setTemplate] = useState({
    title: '',
    content: '',
    imageUrl: '',
    footer: ''
  });
  const [htmlLayout, setHtmlLayout] = useState('');
  const [preview, setPreview] = useState('');

  useEffect(() => {
    fetchLayout();
  }, []);

  const fetchLayout = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/templates'); // Get all templates
      const data = await response.json();
      if (data.length > 0) {
        setHtmlLayout(data[0].content); // Assuming you want to use the content of the first template
      }
    } catch (error) {
      console.error('Error fetching layout:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTemplate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:8080/api/upload-image', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setTemplate(prev => ({
        ...prev,
        imageUrl: data.imageUrl
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSave = async () => {
    try {
      await fetch('http://localhost:8080/api/templates', {  // Save template
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(template)
      });
      alert('Template saved successfully!');
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handlePreview = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/renderAndDownloadTemplate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(template)
      });
      const html = await response.text();
      setPreview(html);
    } catch (error) {
      console.error('Error generating preview:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Navbar/>
      <br/>
      <br/>
      
      {/* Main Editor Card */}
      <div className="bg-white rounded-lg shadow-lg mb-6 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Email Builder</h1>
        </div>
        
        <div className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={template.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email title"
            />
          </div>

          {/* Content Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              name="content"
              value={template.content}
              onChange={handleInputChange}
              rows="6"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email content"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
                id="image-upload"
              />
              <button
                onClick={() => document.getElementById('image-upload').click()}
                className="uploadclass"
              >
                Upload Image
              </button>
              {template.imageUrl && (
                <span className="text-sm text-gray-500">Image uploaded</span>
              )}
            </div>
          </div>

          {/* Footer Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Footer
            </label>
            <input
              type="text"
              name="footer"
              value={template.footer}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email footer"
            />
          </div>

          {/* Action Buttons */}
          <div className="button-group">
  <button
    onClick={handleSave}
    className="button"
  >
    Save Template
  </button>
  <button
    onClick={handlePreview}
    className="button"
  >
    Preview
  </button>
</div>

        </div>
      </div>

      {/* Preview Section */}
      {preview && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800">Preview</h2>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: preview }}
            className="border border-gray-200 p-4 rounded-md"
          />
        </div>
      )}
    </div>
  );
}

export default EmailBuilder;
