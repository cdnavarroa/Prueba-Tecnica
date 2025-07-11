import Dashboard from "@/components/dashboard/dashboard";
import ProjectForm from "@/components/dashboard/projects/ProjectForm";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.BACKEND_URL}/projects/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          }
        });
        if (!res.ok) throw new Error("No se pudo cargar el proyecto");
        setProject(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchProject();
  }, [params.id]);

  const handleSubmit = async (form) => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.BACKEND_URL}/projects/${params.id}`, {
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
        throw new Error(data.message || "Error al editar el proyecto");
      }
      router.push("/dashboard/projects");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Dashboard>
      {loading ? (
        <p style={{ textAlign: "center" }}>Cargando proyecto...</p>
      ) : (
        <ProjectForm onSubmit={handleSubmit} initialData={project} />
      )}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
    </Dashboard>
  );
}
