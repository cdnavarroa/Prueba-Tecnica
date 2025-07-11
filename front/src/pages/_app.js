import React, { useState } from 'react';
import dynamic from 'next/dynamic';


const ClientSideRouter = dynamic(
    () => import('@/hooks/ClientSideRouter'),
    { ssr: false }
);



function MyApp({ Component, pageProps }) {

    return (
        <Component {...pageProps} />
    );
}

export default MyApp;