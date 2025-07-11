import React, { useEffect, useState } from "react";
export default function ProjectsOverviewKPI() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.BACKEND_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCount(Array.isArray(data) ? data.length : (data.projects?.length || 0)));
  }, []);
  return <span style={{ fontSize: 28, fontWeight: 700 }}>{count}</span>;
}
