import * as React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { siteConfig } from '../lib/siteConfig';
import { getAllTalks, getAllSpeakers } from '../lib/requestMdxFiles';
import {
    CalendarIcon,
    PlaceIcon,
    PeopleIcon,
    DiscordIcon,
    TwitterIcon,
    YoutubeIcon,
    MeetupIcon,
} from '../components/Icons';
import { Seo } from '../components/Seo';

export function FutureTalk({ talk, speakers }) {
    return (
        <React.Fragment>
            <h3 className="text-2xl leading-9 tracking-tight font-extrabold text-gray-900 sm:text-3xl sm:leading-10">
                Prochain meetup: {talk.frontMatter.title}
            </h3>

            <div className="space-y-2 text-gray-600 text-lg font-medium">
                <div className="flex items-center">
                    <CalendarIcon />
                    <span className="sr-only">Date</span>
                    {new Date(talk.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </div>

                <div className="flex items-center">
                    <PlaceIcon />
                    <span>En ligne</span>
                </div>

                {speakers.length > 0 && (
                    <div className="flex items-center">
                        <PeopleIcon />
                        <span className="sr-only">Speaker</span>
                        {speakers.map(({ slug, frontMatter }, index) => (
                            <React.Fragment key={slug}>
                                {index > 0 ? ', ' : ''}
                                {frontMatter.firstName} {frontMatter.lastName}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>
        </React.Fragment>
    );
}

FutureTalk.propTypes = {
    talk: PropTypes.shape({
        date: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        frontMatter: PropTypes.object.isRequired,
    }).isRequired,
    speakers: PropTypes.arrayOf(
        PropTypes.shape({
            slug: PropTypes.string.isRequired,
            frontMatter: PropTypes.object.isRequired,
        }),
    ).isRequired,
};

export default function Home({ talks, lastTalkSpeakers }) {
    const lastTalk = talks[0];
    const isFutureTalk = new Date() - new Date(lastTalk.date) < 0;

    return (
        <>
            <Seo />
            <section className="space-y-8 container mx-auto">
                <h1 className="sr-only">Meetup Apéro Web Nancy</h1>
                <h2 className="text-2xl md:text-3xl text-red-600 font-bold">
                    Le meetup mensuel autour des technos du Web
                </h2>
                {isFutureTalk ? (
                    <FutureTalk talk={lastTalk} speakers={lastTalkSpeakers} />
                ) : (
                    <h3 className="my-4 text-xl md:text-2xl text-gray-600 font-bold">
                        Aucun événement planifié
                    </h3>
                )}

                <div className="flex items-center flex-wrap">
                    <Link href={siteConfig.meetupUrl}>
                        <a
                            className="text-white bg-red-600 p-3 rounded tracking-wider"
                            rel="noopener noreferrer"
                        >
                            <span className="inline-block align-middle w-8 text-gray-900">
                                <MeetupIcon fillBackground="#fff" fillLetter="#e53e3e" />
                            </span>
                            Suivre sur Meetup.com
                        </a>
                    </Link>

                    <p className="m-2 space-x-2">
                        <span>Rejoignez aussi la communauté sur</span>
                        <a href={siteConfig.discordUrl} rel="noopener noreferrer">
                            <span className="inline-block align-middle w-8 pr-1 text-indigo-600">
                                <DiscordIcon />
                            </span>
                            Discord
                        </a>
                        <a href={siteConfig.twitterUrl} rel="noopener noreferrer">
                            <span className="inline-block align-middle w-8 pr-1 text-blue-400">
                                <TwitterIcon />
                            </span>
                            Twitter
                        </a>
                        <a href={siteConfig.youtubeUrl} rel="noopener noreferrer">
                            <span className="inline-block align-middle w-8 pr-1 text-red-600">
                                <YoutubeIcon />
                            </span>
                            Youtube
                        </a>
                    </p>
                </div>
            </section>

            <section className="bg-gray-100 border-t border-gray-200 mt-20 p-10">
                <div className="container mx-auto flex items-center flex-wrap justify-around">
                    <a
                        className="bg-red-600 text-white p-10 m-2 rounded-lg text-3xl flex flex-col max-w-sm font-bold"
                        rel="noopener noreferrer"
                        target="_blank"
                        href={siteConfig.mailchimpUrl}
                    >
                        Newsletters
                        <span className="text-base font-medium">
                            Inscrivez-vous pour recevoir de nos nouvelles !
                        </span>
                    </a>
                    <a
                        className="bg-red-600 text-white p-10 m-2 rounded-lg text-3xl flex flex-col max-w-sm font-bold"
                        href={`mailto:${siteConfig.emailMeetup}`}
                    >
                        Proposer un sujet
                        <span className="text-base font-medium">
                            Vous souhaitez faire un talk de 5-20min ? Contactez-nous.
                        </span>
                    </a>
                </div>
            </section>

            <section className="border-t border-gray-300 pt-10 container mx-auto">
                <h2 className="text-1xl md:text-2xl font-bold">Derniers talks</h2>

                <ul className="my-4">
                    {talks.map(({ date, slug, frontMatter }) => {
                        return (
                            <li key={slug} className="pb-4 flex">
                                <Link href={slug}>
                                    <a className="text-gray-900 flex">
                                        <span className="sr-only">Publié le</span>
                                        <time dateTime={date} className="mr-1 whitespace-no-wrap">
                                            {new Date(date).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </time>
                                        -{' '}
                                        <h2 className="ml-1">
                                            {frontMatter.title} #{frontMatter.edition}
                                        </h2>
                                    </a>
                                </Link>
                                {new Date() - new Date(date) < 0 && (
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
                            </li>
                        );
                    })}
                </ul>
                <div className="text-base leading-6 font-medium flex">
                    <Link href="/talks">
                        <a className="text-red-500 hover:text-red-600">Voir les talks &rarr;</a>
                    </Link>
                </div>
            </section>
        </>
    );
}

Home.propTypes = {
    talks: PropTypes.arrayOf(
        PropTypes.shape({
            date: PropTypes.string.isRequired,
            slug: PropTypes.string.isRequired,
            frontMatter: PropTypes.object.isRequired,
        }),
    ).isRequired,
    lastTalkSpeakers: PropTypes.arrayOf(
        PropTypes.shape({
            slug: PropTypes.string.isRequired,
            frontMatter: PropTypes.object.isRequired,
        }),
    ).isRequired,
};

export async function getStaticProps() {
    const talks = getAllTalks().slice(0, 5);

    const lastTalkSpeakers = talks[0].frontMatter.speakers;
    const lastTalkSpeakersData = getAllSpeakers().filter((s) => lastTalkSpeakers.includes(s.slug));

    return {
        props: {
            talks,
            lastTalkSpeakers: lastTalkSpeakersData,
        },
    };
}
