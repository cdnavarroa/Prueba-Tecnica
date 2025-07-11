import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function NotFound() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to home page after 5 seconds
        const timer = setTimeout(() => {
            router.push('/');
        }, 5000);
        
        return () => clearTimeout(timer); // Cleanup the timer on unmount
    }, [router]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404 - Página no encontrada</h1>
            <p>Lo sentimos, la página que buscas no existe.</p>
            <button onClick={() => router.push('/')} style={{ padding: '10px 20px', fontSize: '16px' }}>
                Volver al inicio
            </button>
        </div>
    );
}