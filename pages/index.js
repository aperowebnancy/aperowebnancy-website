import React from 'react';
import Head from 'next/head';

export default function Home() {
    return (
        <div>
            <Head>
                <title>Apéro Web Nancy</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1 className="text-5xl text-center">Welcome to Apéro Web Nancy</h1>
            </main>
        </div>
    );
}
