import React from 'react';
import PropTypes from 'prop-types';

import { siteConfig } from '../lib/siteConfig';
import { getAllSpeakers } from '../lib/requestMdxFiles';
import { TwitterIcon, GitHubIcon, LinkedinIcon, PersonalIcon } from '../components/Icons';
import { Seo } from '../components/Seo';

export const socials = {
    twitter: <TwitterIcon />,
    github: <GitHubIcon />,
    linkedin: <LinkedinIcon />,
    perso: <PersonalIcon />,
};

const youSpeaker = {
    firstName: 'Vous',
    lastName: '',
    resume: 'Rejoignez les autres speakers ! Proposez un sujet de talk.',
    picture: 'you.png',
    links: null,
};

function Speaker({ firstName, lastName, resume, picture, links }) {
    const completeName = `${firstName} ${lastName}`;
    const pathPicture = `/speakers/${picture}`;

    return (
        <article className="flex items-center flex-col max-w-sm rounded overflow-hidden shadow-lg m-2 px-6 py-4 w-64 h-64 text-sm md:text-base">
            <img className="object-cover rounded-full w-3/5" src={pathPicture} alt={completeName} />
            <h3 className="text-gray-800 font-bold capitalize">{completeName}</h3>
            <p className="text-gray-700 text-base tracking-tight">{resume}</p>
            <div className="py-3">
                {links &&
                    links.map(({ url, title }) => {
                        return (
                            <a
                                key={`${url}-${title}`}
                                href={url}
                                className="inline-block text-gray-600 mr-2 h-4 w-4"
                                rel="noopener noreferrer"
                            >
                                {socials[title]}
                            </a>
                        );
                    })}
            </div>
        </article>
    );
}

Speaker.propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    resume: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
    links: PropTypes.array,
};

export default function Speakers({ speakers }) {
    return (
        <>
            <Seo
                title="Speakers"
                description="Retrouvez la liste des speakers ayant participé au Meetup Apéro Web Nancy"
            />
            <section className="container mx-auto">
                <h1 className="text-3xl md:text-4xl text-red-600 font-bold">Speakers</h1>
                <div className="pt-6 pb-8 space-y-2 md:space-y-5">
                    <p className="text-lg leading-7 text-gray-700">
                        Voici quelques-uns des speakers ayant partagé un sujet lors des rencontres
                        précédentes.
                    </p>
                    <p className="text-lg leading-7 text-gray-700">
                        Un sujet ? N&apos;hésitez pas à nous contacter pour nous le soumettre.
                    </p>
                </div>
                <div className="flex flex-wrap justify-center">
                    <a href={`mailto:${siteConfig.emailMeetup}`}>
                        <Speaker key="you" {...youSpeaker} />
                    </a>
                    {speakers.map(({ slug, frontMatter }) => (
                        <Speaker key={slug} {...frontMatter} />
                    ))}
                </div>
            </section>
        </>
    );
}

Speakers.propTypes = {
    speakers: PropTypes.arrayOf(
        PropTypes.shape({
            slug: PropTypes.string.isRequired,
            frontMatter: PropTypes.object.isRequired,
        }),
    ).isRequired,
};

export async function getStaticProps() {
    return {
        props: {
            speakers: getAllSpeakers(),
        },
    };
}
