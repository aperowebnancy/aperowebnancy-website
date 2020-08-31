import fs from 'fs';
import glob from 'fast-glob';
import React from 'react';
import PropTypes from 'prop-types';
import matter from 'gray-matter';

import { siteConfig } from '../lib/siteConfig';
import { Seo } from '../components/Seo';

export const socials = {
    twitter: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
    ),
    github: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
            />
        </svg>
    ),
    linkedin: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 512 512">
            <path d="M0 160h114.496v352H0zM426.368 164.128c-1.216-.384-2.368-.8-3.648-1.152a74.218 74.218 0 00-4.64-.896c-6.08-1.216-12.736-2.08-20.544-2.08-66.752 0-109.088 48.544-123.04 67.296V160H160v352h114.496V320s86.528-120.512 123.04-32v224H512V274.464c0-53.184-36.448-97.504-85.632-110.336z" />
            <circle cx="56" cy="56" r="56" />
        </svg>
    ),
    perso: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 478.407 478.407">
            <path d="M239.608 0C107.649-.223.494 106.57.271 238.529a238.934 238.934 0 0073.54 172.84c.137.136.188.341.324.461 1.382 1.331 2.884 2.458 4.284 3.738 3.84 3.413 7.68 6.946 11.725 10.24a163.172 163.172 0 006.639 4.983c3.823 2.85 7.646 5.7 11.639 8.329 2.714 1.707 5.513 3.413 8.294 5.12 3.686 2.219 7.356 4.454 11.162 6.485 3.226 1.707 6.519 3.174 9.796 4.727 3.584 1.707 7.117 3.413 10.786 4.949 3.669 1.536 7.356 2.731 11.076 4.062s6.929 2.56 10.496 3.652c4.028 1.212 8.158 2.15 12.254 3.157 3.413.836 6.724 1.792 10.24 2.475 4.71.939 9.489 1.536 14.268 2.185 2.953.41 5.837.99 8.823 1.28 7.817.768 15.701 1.195 23.654 1.195s15.838-.427 23.654-1.195c2.987-.29 5.871-.87 8.823-1.28 4.779-.649 9.557-1.246 14.268-2.185 3.413-.683 6.827-1.707 10.24-2.475 4.096-1.007 8.226-1.946 12.254-3.157 3.567-1.092 7.014-2.423 10.496-3.652s7.441-2.56 11.076-4.062 7.202-3.26 10.786-4.949c3.277-1.553 6.571-3.021 9.796-4.727 3.806-2.031 7.475-4.267 11.162-6.485 2.782-1.707 5.581-3.26 8.294-5.12 3.994-2.628 7.817-5.478 11.639-8.329 2.219-1.707 4.471-3.243 6.639-4.983 4.045-3.243 7.885-6.69 11.725-10.24 1.399-1.28 2.901-2.406 4.284-3.738.136-.119.188-.324.324-.461a238.081 238.081 0 0073.404-172.032C478.36 107.378 371.567.223 239.608 0zm166.405 357.729a171.52 171.52 0 00-91.375-117.641c38.245-41.661 35.475-106.438-6.186-144.683-41.662-38.245-106.438-35.475-144.683 6.186-35.954 39.166-35.954 99.332 0 138.497a171.519 171.519 0 00-91.375 117.641c-65.565-91.946-44.179-219.635 47.768-285.2a204.478 204.478 0 01119.042-37.992c112.929-.18 204.621 91.221 204.801 204.15a204.478 204.478 0 01-37.992 119.042z" />
        </svg>
    ),
};

const youSpeaker = {
    firstName: 'Vous',
    lastName: '',
    resume: 'Rejoignez les autres speakers ! Proposez un sujet de talk.',
    picture: 'you.png',
    links: null,
};

const Speaker = ({ firstName, lastName, resume, picture, links }) => {
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
                                className="inline-block text-gray-600 mr-2"
                                rel="noopener noreferrer"
                            >
                                {socials[title]}
                            </a>
                        );
                    })}
            </div>
        </article>
    );
};

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
    const files = glob.sync('speakers/*.mdx');

    const allMdx = files.map((file) => {
        const [_, filename] = file.split('/');
        const [slug] = filename.split('.');

        const mdxSource = fs.readFileSync(file);
        const { data } = matter(mdxSource);

        return {
            slug,
            frontMatter: data,
        };
    });

    const orderedByLastName = allMdx.sort((a, z) =>
        a.frontMatter.lastName.localeCompare(z.frontMatter.lastName),
    );

    return {
        props: {
            speakers: orderedByLastName,
        },
    };
}
