import Dashboard from "@/components/dashboard/dashboard";
import TaskForm from "@/components/dashboard/tasks/TaskForm";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!params || !params.id) return;
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [taskRes, usersRes, teamsRes, projectsRes] = await Promise.all([
          fetch(`${process.env.BACKEND_URL}/tasks/${params.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${process.env.BACKEND_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${process.env.BACKEND_URL}/teams`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${process.env.BACKEND_URL}/projects`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        if (!taskRes.ok) throw new Error("No se pudo cargar la tarea");
        const taskData = await taskRes.json();
        setTask(taskData);
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
  }, [params && params.id]);

  const handleSubmit = async (form) => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.BACKEND_URL}/tasks/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al editar la tarea");
      }
      router.push("/dashboard/tasks");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Dashboard>
      {loading ? (
        <p style={{ textAlign: "center" }}>Cargando tarea...</p>
      ) : (
        <TaskForm onSubmit={handleSubmit} initialData={task} users={users} teams={teams} projects={projects} />
      )}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
    </Dashboard>
  );
}
