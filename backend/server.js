const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let projects = [];

app.get("/api/projects", (req, res) => {
  res.json({ success: true, projects });
});


app.post("/api/projects", (req, res) => {
  const { projectName } = req.body;

  if (!projectName || projectName.length < 3) {
    return res.status(400).json({
      success: false,
      message: "Project name must be at least 3 characters",
    });
  }

  const exists = projects.some(
    (p) => p.name.toLowerCase() === projectName.toLowerCase()
  );

  if (exists) {
    return res.status(400).json({
      success: false,
      message: "Duplicate project name",
    });
  }

  const newProject = {
    id: projects.length > 0 ? projects[projects.length - 1].id + 1 : 1,
    name: projectName,
  };

  projects.push(newProject);
  res.status(201).json({ success: true, project: newProject });
});

app.delete("/api/projects/:id", (req, res) => {
  const projectId = parseInt(req.params.id);
  const index = projects.findIndex((p) => p.id === projectId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  const deleted = projects.splice(index, 1)[0];
  res.json({ success: true, deleted });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
