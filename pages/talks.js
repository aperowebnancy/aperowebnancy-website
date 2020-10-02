import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { siteConfig } from '../lib/siteConfig';
import { getAllTalks } from '../lib/requestMdxFiles';
import { MeetupIcon } from '../components/Icons';
import { Seo } from '../components/Seo';

export default function Talks({ talks }) {
    return (
        <>
            <Seo
                title="Précédents talks"
                description="Retrouvez la liste de tout les talks du Meetup Apéro Web Nancy"
            />
            <div className="container mx-auto">
                <h1 className="text-3xl md:text-4xl text-red-600 font-bold">Précédents talks</h1>
                <div className="pt-6 pb-8 space-y-2 md:space-y-5">
                    <p className="text-lg leading-7 text-gray-700">
                        Voici quelques-uns des sujets que nous avons abordés lors des rencontres
                        précédentes.
                    </p>
                    <p className="text-lg leading-7 text-gray-700">
                        Récemment, nous avons également enregistré et publié les conférences sur
                        YouTube, vous pouvez donc les visionner{' '}
                        <a
                            className="underline"
                            rel="noopener noreferrer"
                            href={siteConfig.youtubeUrl}
                        >
                            ici
                        </a>
                        .
                    </p>
                    <p className="text-lg leading-7 text-gray-700">
                        Un sujet ? N&apos;hésitez pas à nous contacter pour nous le soumettre.
                    </p>
                </div>
                <ul className="talks-list flex flex-wrap -mx-2">
                    {talks.map(({ date, slug, frontMatter }) => {
                        return (
                            <li
                                key={slug}
                                className={`talk mb-4 w-full 
                            ${
                                new Date() - new Date(date) < 0
                                    ? 'next-talk'
                                    : new Date().getDate() == new Date(date).getDate() &&
                                      new Date().getMonth() == new Date(date).getMonth() &&
                                      new Date().getFullYear() == new Date(date).getFullYear()
                                    ? 'current-talk'
                                    : 'md:w-1/2 lg:w-1/3 xl:w-1/4'
                            }`}
                            >
                                <article className="card h-full p-4 pt-8 mx-2 rounded-lg relative">
                                    <ul className="tags absolute top-0 flex">
                                        {new Date() - new Date(date) < 0 && (
                                            <li className="tag">
                                                <div className="tag-content leading-3 overflow-hidden flex relative rounded-b-lg next-talk text-sm font-medium text-white p-2 pb-1 pt-2">
                                                    <span>Prochainement</span>
                                                </div>
                                            </li>
                                        )}
                                        {new Date().getDate() == new Date(date).getDate() &&
                                            new Date().getMonth() == new Date(date).getMonth() &&
                                            new Date().getFullYear() ==
                                                new Date(date).getFullYear() && (
                                                <li className="tag">
                                                    <div className="tag-content leading-3 overflow-hidden flex relative rounded-b-lg next-talk text-sm font-medium text-white p-2 pb-1 pt-2">
                                                        <span>Aujourd'hui</span>
                                                    </div>
                                                </li>
                                            )}
                                        <li className="tag">
                                            <div className="tag-content leading-3 overflow-hidden flex relative rounded-b-lg date p-2 pb-1 pt-2">
                                                <dl>
                                                    <dt className="sr-only">Published on</dt>
                                                    <dd className="text-sm font-medium text-white">
                                                        <time dateTime={date}>
                                                            {new Date(date).toLocaleDateString(
                                                                'fr-FR',
                                                                {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                },
                                                            )}
                                                        </time>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </li>
                                        <li className="tag">
                                            <div className="tag-content leading-3 overflow-hidden flex relative rounded-b-lg edition text-sm font-medium text-white p-2 pb-1 pt-2">
                                                <span>#{frontMatter.edition}</span>
                                            </div>
                                        </li>
                                    </ul>
                                    <div className="informations flex flex-col xl:w-11/12">
                                        <div className="space-y-2 mb-6">
                                            <h2 className="text-2xl leading-8 font-bold tracking-tight">
                                                <Link href={slug}>
                                                    <a className="text-gray-900 hover:text-red-600">
                                                        {frontMatter.title}
                                                    </a>
                                                </Link>
                                            </h2>
                                            <div className="max-w-none text-gray-700">
                                                {frontMatter.description}
                                            </div>
                                        </div>
                                        <div className="text-base leading-6 font-medium flex">
                                            <Link href={slug}>
                                                <a
                                                    className="text-red-500 hover:text-red-600"
                                                    aria-label={`Lire "${frontMatter.title}"`}
                                                >
                                                    Lire plus &rarr;
                                                </a>
                                            </Link>
                                            {(new Date() - new Date(date) < 0 ||
                                                (new Date().getDate() == new Date(date).getDate() &&
                                                    new Date().getMonth() ==
                                                        new Date(date).getMonth() &&
                                                    new Date().getFullYear() ==
                                                        new Date(date).getFullYear())) && (
                                                <div className="flex mx-4">
                                                    <a
                                                        href={frontMatter.meetupLink}
                                                        className="flex items-center text-red-500 hover:text-red-600"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <span className="inline-block w-6 h-6 mr-1">
                                                            <MeetupIcon />
                                                        </span>
                                                        Inscrivez-vous !
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}

Talks.propTypes = {
    talks: PropTypes.arrayOf(
        PropTypes.shape({
            date: PropTypes.string.isRequired,
            slug: PropTypes.string.isRequired,
            frontMatter: PropTypes.object.isRequired,
        }),
    ).isRequired,
};

export async function getStaticProps() {
    return {
        props: {
            talks: getAllTalks(),
        },
    };
}
