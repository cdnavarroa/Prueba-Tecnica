import Dashboard from "@/components/dashboard/dashboard";
import ProjectForm from "@/components/dashboard/projects/ProjectForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewProjectPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (form) => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.BACKEND_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al crear el proyecto");
      }
      router.push("/dashboard/projects");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Dashboard>
      <ProjectForm onSubmit={handleSubmit} />
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
    </Dashboard>
  );
}
