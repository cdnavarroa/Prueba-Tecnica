import Dashboard from "@/components/dashboard/dashboard";
import TaskDetailsID from "@/components/dashboard/tasks/TaskDetailsID";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TaskDetailPage({ params }) {
  const router = useRouter();
  // Obtener id de la tarea desde params, query o pathname
  let id = params && params.id;
  if (!id && typeof window !== "undefined") {
    // App Router: params puede no estar definido
    const path = window.location.pathname;
    const match = path.match(/tasks\/(\d+)/);
    if (match) id = match[1];
  }
  const [task, setTask] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("token");
    fetch(`${process.env.BACKEND_URL}/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    })
      .then(res => res.json())
      .then(async data => {
        if (data.error) {
          setError(data.error);
        } else {
          // Obtener nombre del proyecto
          let projectName = data.project?.name || data.projectName || null;
          if (!projectName && data.projectId) {
            try {
              const token = localStorage.getItem("token");
              const res = await fetch(`${process.env.BACKEND_URL}/projects/${data.projectId}`, { headers: { Authorization: `Bearer ${token}` } });
              if (res.ok) {
                const pj = await res.json();
                projectName = pj.name || pj.project?.name || pj.projectName || null;
              }
            } catch {}
          }
          // Obtener nombre del responsable
          let responsibleName = data.responsibleName || data.userName || data.teamName || null;
          if (!responsibleName && data.userId) {
            try {
              const token = localStorage.getItem("token");
              const res = await fetch(`${process.env.BACKEND_URL}/users/${data.userId}`, { headers: { Authorization: `Bearer ${token}` } });
              if (res.ok) {
                const user = await res.json();
                responsibleName = user.name || user.user?.name || user.user?.email || null;
              }
            } catch {}
          } else if (!responsibleName && data.teamId) {
            try {
              const token = localStorage.getItem("token");
              const res = await fetch(`${process.env.BACKEND_URL}/teams/${data.teamId}`, { headers: { Authorization: `Bearer ${token}` } });
              if (res.ok) {
                const team = await res.json();
                responsibleName = team.name || team.team?.name || null;
              }
            } catch {}
          }
          // Mapear estado a label legible
          let statusLabel = "";
          switch (data.status) {
            case "todo": statusLabel = "Por hacer"; break;
            case "in_progress": statusLabel = "En progreso"; break;
            case "done": statusLabel = "Completada"; break;
            default: statusLabel = data.status;
          }
          setTask({ ...data, projectName, responsibleName, statusLabel });
        }
      })
      .catch(() => setError("Error al cargar la tarea"));
  }, [id]);

  return (
    <Dashboard>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {task && <TaskDetailsID taskId={id} task={task} />}
    </Dashboard>
  );
}
