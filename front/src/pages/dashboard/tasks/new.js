import Dashboard from "@/components/dashboard/dashboard";
import TaskForm from "@/components/dashboard/tasks/TaskForm";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function NewTaskPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [usersRes, teamsRes, projectsRes] = await Promise.all([
          fetch(`${process.env.BACKEND_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.BACKEND_URL}/teams`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.BACKEND_URL}/projects`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (!usersRes.ok || !teamsRes.ok || !projectsRes.ok) throw new Error("Error al cargar datos iniciales");
        setUsers(await usersRes.json());
        setTeams(await teamsRes.json());
        setProjects(await projectsRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (form) => {
    setError("");
    // Validación básica
    if (!form.title || !form.status || (!form.responsibleId && !form.projectId)) {
      setError("Completa todos los campos obligatorios");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.BACKEND_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          dueDate: form.deadline,
          status: form.status,
          userId: form.responsibleType === "user" ? form.responsibleId : null,
          teamId: form.responsibleType === "team" ? form.responsibleId : null,
          projectId: form.projectId || null
        })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al crear la tarea");
      }
      router.push("/dashboard/tasks");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Dashboard>
      {loading ? (
        <p style={{ textAlign: "center" }}>Cargando datos...</p>
      ) : (
        <TaskForm
          onSubmit={handleSubmit}
          users={users}
          teams={teams}
          projects={projects}
        />
      )}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
    </Dashboard>
  );
}
