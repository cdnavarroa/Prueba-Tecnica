// Utilidades para consumir el backend usando process.env.BACKEND_URL

const BACKEND_URL = process.env.BACKEND_URL;

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// PROYECTOS
export async function fetchProjects() {
  const res = await fetch(`${BACKEND_URL}/projects`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function createProject(data) {
  const res = await fetch(`${BACKEND_URL}/projects`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateProject(id, data) {
  const res = await fetch(`${BACKEND_URL}/projects/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteProject(id) {
  const res = await fetch(`${BACKEND_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
}

// TAREAS
export async function fetchTasks() {
  const res = await fetch(`${BACKEND_URL}/tasks`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function createTask(data) {
  const res = await fetch(`${BACKEND_URL}/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTask(id, data) {
  const res = await fetch(`${BACKEND_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${BACKEND_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
}
