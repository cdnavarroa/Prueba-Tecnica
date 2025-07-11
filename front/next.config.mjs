/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {
        domains: [],
        loader: 'default',
    },
    i18n: {
        locales: ['es', 'en'],
        defaultLocale: 'es',
    },

    // Variables de entorno
    env: {
        BACKEND_URL: 'http://localhost:3001', // Aquí va la URL de tu backend
    },
};

export default nextConfig;
