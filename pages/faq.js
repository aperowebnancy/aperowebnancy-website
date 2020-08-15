import React from 'react';
import Head from 'next/head';

import { siteConfig } from '../lib/siteConfig';

const currentOrganizer = Object.entries(siteConfig.currentOrganizer).map(([name, link], index) => (
    <React.Fragment key={name}>
        {index > 0 ? ', ' : ''}
        <a href={link} className="underline" rel="noopener noreferrer">
            {name}
        </a>
    </React.Fragment>
));

export default function FAQ() {
    return (
        <>
            <Head>
                <title>Foire aux questions | Apéro Web Nancy</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <section className="container mx-auto space-y-4">
                <h1 className="text-3xl md:text-4xl text-red-600 font-bold">Foire aux questions</h1>

                <h3 className="text-xl md:text-2xl text-gray-600 font-bold">
                    Qu’est-ce que c&apos;est ?
                </h3>
                <p>
                    <strong>Apéro Web Nancy</strong> est une communauté de{' '}
                    <strong>développeurs Nancéiens</strong>. Cette communauté organise des
                    rencontres, généralement <strong>le dernier mercredi du mois</strong>, avec un
                    sujet technique lié à notre métier présenté par un <strong>speaker</strong> de
                    la communauté.
                </p>
                <p>
                    Ouvert à tous les étudiants ou professionnels, n&apos;hésitez pas à venir boire
                    une bière avec nous !
                </p>

                <h3 className="text-xl md:text-2xl text-gray-600 font-bold">Qui sommes nous ?</h3>
                <p>
                    Apéro Web Nancy ne vit que par l&apos;investissement des membres de sa
                    communauté et ne dépend d&apos;aucune entreprise. Nous souhaitons rester{' '}
                    <strong>libres</strong> et <strong>indépendants</strong>.
                </p>
                <p>Les organisateurs actuels sont : {currentOrganizer}.</p>

                <h3 className="text-xl md:text-2xl text-gray-600 font-bold">
                    Comment contribuer ?
                </h3>
                <p>Il existe de multiples façons de contribuer à l&apos;Apéro Web Nancy :</p>
                <ul className="list-disc list-inside">
                    <li>
                        <a className="underline" href={`mailto:${siteConfig.emailMeetup}`}>
                            proposer un talk
                        </a>
                    </li>
                    <li>participer à l’organisation</li>
                    <li>assister à un meetup</li>
                    <li>proposer des améliorations sur le site web</li>
                </ul>
                <p>
                    Le plus simple est de venir faire un petit coucou sur le discord ou tout
                    simplement venir nous parler pendant un événement !
                </p>
            </section>
        </>
    );
}
