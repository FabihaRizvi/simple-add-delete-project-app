import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data.projects))
      .catch((err) => console.error('Error fetching projects:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName }),
      });

      const data = await response.json();

      if (data.success && data.project) {
        const updated = [...projects, data.project];
        setProjects(updated);
        console.log('Projects list ➜', updated);
        setProjectName('');
      } else {
        alert(data.message || 'Failed to add project');
      }
    } catch (err) {
      console.error('Error Adding project:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'DELETE',
      });
      setProjects(projects.filter((project) => project.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  return (
    <div className="container">
      <h2>Project Submission Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />
        <button type="submit">Add Project</button>
      </form>

      <h3>All Projects:</h3>

      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              {project.name}
              <button className="delete-btn"
                onClick={() => handleDelete(project.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-projects">No projects added yet.</p>
      )}
    </div>
  );
}

export default App;
