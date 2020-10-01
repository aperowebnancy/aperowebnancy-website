import React from 'react';
import Link from 'next/link';
import { Seo } from '../components/Seo';

export default function NotFoundPage() {
    return (
        <>
            <Seo title="Erreur 404" />
            <section className="flex flex-col flex-wrap justify-center lg:justify-between items-center">
                <h1 className="text-red-600 leading-loose font-mono font-bold text-6xl">Oups</h1>
                <p className="leading-snug text-4xl mb-12">C&apos;est une 404.</p>
                <p className="leading-relaxed mb-6 max-w-2xl">
                    Vous venez de prendre un chemin qui n'existe pas... la tristesse.
                </p>
                <Link href="/">
                    <a className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Retourner à l&apos;accueil
                    </a>
                </Link>
            </section>
        </>
    );
}
