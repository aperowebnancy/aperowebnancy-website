import fs from 'fs';
import glob from 'fast-glob';
import Link from 'next/link';
import Head from 'next/head';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/server';
import matter from 'gray-matter';
import MDX from '@mdx-js/runtime';

import { socials } from '../speakers';
import { siteConfig } from '../../lib/siteConfig';
import { ShareIcon, MeetupIcon, TwitterIcon } from '../../components/Icons';
import { Seo } from '../../components/Seo';

function Youtube({ videoId, title }) {
    return (
        <figure>
            <div className="relative pb-9/16">
                <iframe
                    title={title}
                    className="absolute inset-0 h-full w-full"
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
            <figcaption className="italic text-center">{title}</figcaption>
        </figure>
    );
}

Youtube.propTypes = {
    videoId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};

const mdxComponents = {
    Youtube,
};

const logoMeetup = `${siteConfig.siteUrl}/logo.png`;

// https://developers.google.com/search/docs/data-types/article#non-amp
// https://developers.google.com/search/docs/data-types/breadcrumb
function getTalkJsonLd({ title, image, description, date, slug, speakers }) {
    return [
        {
            '@context': 'http://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: title,
                    item: {
                        '@id': `${siteConfig.siteUrl}/talks/${slug}`,
                        name: title,
                        image,
                    },
                },
            ],
        },
        {
            '@context': 'http://schema.org',
            '@type': 'BlogPosting',
            url: `${siteConfig.siteUrl}/talks/${slug}`,
            name: title,
            alternateName: 'Apéro Web Nancy',
            headline: title,
            image: {
                '@type': 'ImageObject',
                url: image,
            },
            description,
            author: speakers
                ? speakers.map((s) => ({
                      '@type': 'Person',
                      familyName: s.lastName,
                      givenName: s.firstName,
                      name: `${s.firstName} ${s.lastName}`,
                  }))
                : null,
            publisher: {
                '@type': 'Organization',
                url: siteConfig.siteUrl,
                logo: logoMeetup,
                name: 'Apéro Web Nancy',
            },
            mainEntityOfPage: {
                '@type': 'WebSite',
                '@id': siteConfig.siteUrl,
            },
            datePublished: date,
        },
    ];
}

function isServerSide() {
    return typeof window === 'undefined';
}

function isShareFeatureEnabled() {
    return navigator && navigator.share;
}

function ShareMore({ title, slug }) {
    if (isServerSide() || !isShareFeatureEnabled()) {
        return null;
    }

    const handleShare = async () => {
        await navigator.share({
            title,
            url: `${siteConfig.siteUrl}/talks/${slug}`,
        });
    };

    return (
        <button onClick={handleShare} className="h-6 w-6">
            <ShareIcon />
        </button>
    );
}

ShareMore.propTypes = {
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};

export default function Talk({ mdxHtml, frontMatter, speakers, slug, next, previous }) {
    const talkJsonLd = getTalkJsonLd({ ...frontMatter, slug, image: '', speakers });

    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        frontMatter.title,
    )}&via=${siteConfig.twitterHandler.replace('@', '')}&url=${encodeURIComponent(
        `${siteConfig.siteUrl}/talks/${slug}`,
    )}`;

    const githubTalkUrl = `https://github.com/aperowebnancy/aperowebnancy-website/blob/main/talks/${frontMatter.date}_${slug}.mdx`;

    return (
        <>
            <Seo
                title={frontMatter.title}
                description={frontMatter.description}
                jsonLdArray={talkJsonLd}
            />
            <Head>
                <meta property="og:type" content="article" key="ogtype" />
            </Head>

            <article className="container mx-auto xl:divide-y xl:divide-gray-200">
                <section className="pt-6 xl:pb-10">
                    <div className="space-y-1 text-center">
                        <dl className="space-y-10">
                            <div>
                                <dt className="sr-only">Publié le</dt>
                                <dd className="text-base leading-6 font-medium text-gray-500">
                                    <time dateTime={frontMatter.date}>
                                        {new Date(frontMatter.date).toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </time>
                                </dd>
                            </div>
                        </dl>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                                {frontMatter.title} #{frontMatter.edition}
                            </h1>
                        </div>
                    </div>
                </section>
                <div
                    className="divide-y xl:divide-y-0 divide-gray-200 xl:grid xl:grid-cols-4 xl:gap-x-6"
                    style={{ gridTemplateRows: 'auto 1fr' }}
                >
                    {speakers && (
                        <dl className="pt-6 pb-10 xl:pt-11 xl:border-b xl:border-gray-200">
                            <dt className="sr-only">Speakers</dt>
                            <dd>
                                <ul className="flex justify-center xl:block space-x-8 sm:space-x-12 xl:space-x-0 xl:space-y-8">
                                    {speakers.map((speaker) => (
                                        <li
                                            key={speaker.slug}
                                            className="flex items-center space-x-2"
                                        >
                                            <img
                                                src={`/speakers/${speaker.picture}`}
                                                alt={`${speaker.firstName} ${speaker.lastName}`}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <dl className="text-sm font-medium leading-5 whitespace-no-wrap">
                                                <dt className="sr-only">Nom du Speaker</dt>
                                                <dd className="text-gray-900">
                                                    {speaker.firstName} {speaker.lastName}
                                                </dd>
                                                <dt className="sr-only">Socials</dt>
                                                <dd>
                                                    {speaker.links &&
                                                        speaker.links.map(({ url, title }) => {
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
                                                </dd>
                                            </dl>
                                        </li>
                                    ))}
                                </ul>
                            </dd>
                        </dl>
                    )}
                    <div className="divide-y divide-gray-200 xl:pb-0 xl:col-span-3 xl:row-span-2">
                        <div className="prose max-w-none pt-10 pb-8">
                            <div dangerouslySetInnerHTML={{ __html: mdxHtml }} />
                        </div>
                        <div className="pt-6 pb-8 xl:pb-0">
                            <p>
                                Une faute ? Une amélioration ?{' '}
                                <a
                                    href={githubTalkUrl}
                                    rel="noopener noreferrer"
                                    className="font-medium text-red-500 hover:text-red-600"
                                >
                                    Édite cette page &rarr;
                                </a>
                            </p>
                        </div>
                    </div>
                    <section className="text-sm font-medium leading-5 divide-y divide-gray-200 xl:col-start-1 xl:row-start-2">
                        <div className="space-y-8 py-8">
                            <div className="text-gray-500 flex space-x-2">
                                <h2 className="tracking-wide text-gray-500">Annonce sur</h2>
                                <a
                                    href={frontMatter.meetupLink}
                                    className="flex items-center hover:text-gray-600"
                                    rel="noopener noreferrer"
                                >
                                    <div className="h-6 w-6 mr-2">
                                        <MeetupIcon />
                                    </div>
                                    Meetup
                                </a>
                            </div>
                            <div className="text-gray-500 flex space-x-2">
                                <h2 className="tracking-wide text-gray-500">Partager sur</h2>
                                <a
                                    href={twitterShareUrl}
                                    className="flex items-center hover:text-gray-600"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <div className="h-6 w-6">
                                        <TwitterIcon />
                                    </div>
                                    Twitter
                                </a>
                                <ShareMore title={frontMatter.title} slug={slug} />
                            </div>
                        </div>
                        {(next || previous) && (
                            <div className="space-y-8 py-8">
                                {next && (
                                    <div>
                                        <h2 className="text-xs tracking-wide uppercase text-gray-500">
                                            Talk Suivant
                                        </h2>
                                        <div className="text-red-500 hover:text-red-600">
                                            <Link href={next.slug}>
                                                <a>
                                                    {next.title} #{next.edition}
                                                </a>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                                {previous && (
                                    <div>
                                        <h2 className="text-xs tracking-wide uppercase text-gray-500">
                                            Talk Précédent
                                        </h2>
                                        <div className="text-red-500 hover:text-red-600">
                                            <Link href={previous.slug}>
                                                <a>
                                                    {previous.title} #{previous.edition}
                                                </a>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="pt-8">
                            <Link href="/talks">
                                <a className="text-red-500 hover:text-red-600">
                                    &larr; Voir les talks
                                </a>
                            </Link>
                        </div>
                    </section>
                </div>
            </article>
        </>
    );
}

Talk.propTypes = {
    mdxHtml: PropTypes.string.isRequired,
    frontMatter: PropTypes.object.isRequired,
    speakers: PropTypes.array,
    slug: PropTypes.string.isRequired,
    previous: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        edition: PropTypes.number.isRequired,
    }),
    next: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        edition: PropTypes.number.isRequired,
    }),
};

export async function getStaticPaths() {
    const files = glob.sync('talks/*.mdx');

    const paths = files.map((file) => {
        const [_, filename] = file.split('/');
        const [__, slug] = filename.replace('.mdx', '').split('_');

        return {
            params: {
                slug,
            },
        };
    });

    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params: { slug } }) {
    // Retrieve all talks
    const files = glob.sync('talks/*.mdx');

    // Find index of current talk
    const fileIndex = files.findIndex((file) => file.lastIndexOf(slug) !== -1);
    if (fileIndex === -1) {
        console.warn('No MDX file found for slug');
    }

    // Retrieve content and meta data of current talk
    const file = files[fileIndex];
    const [date] = file.split('/')[1].split('_');
    const mdxSource = fs.readFileSync(file);
    const { content, data } = matter(mdxSource);

    let propsSpeakers = null;

    if (data.speakers) {
        // Retrieve speakers informations
        const searchSpeakersRegex =
            data.speakers.length > 1 ? `{${data.speakers.join(',')}}` : `${data.speakers[0]}`;
        const speakersFiles = glob.sync(`speakers/${searchSpeakersRegex}.mdx`);
        const speakers = speakersFiles.map((file) => {
            const src = fs.readFileSync(file);
            const { data } = matter(src);
            return {
                slug: file.split('/')[1].split('.')[0],
                ...data,
            };
        });
        propsSpeakers = speakers.sort((a, z) => a.lastName.localeCompare(z.lastName));
    }

    // Retrieve previous and next talks from current talk
    const getLinkInfos = (file) => {
        const src = fs.readFileSync(file);
        const { data } = matter(src);
        return {
            slug: file.split('/')[1].split('_')[1].split('.')[0],
            title: data.title,
            edition: data.edition,
        };
    };
    const previous = fileIndex > 0 ? getLinkInfos(files[fileIndex - 1]) : null;
    const next = fileIndex < files.length - 1 ? getLinkInfos(files[fileIndex + 1]) : null;

    return {
        props: {
            mdxHtml: ReactDOM.renderToStaticMarkup(<MDX components={mdxComponents}>{content}</MDX>),
            frontMatter: {
                date,
                ...data,
            },
            slug,
            speakers: propsSpeakers,
            previous,
            next,
        },
    };
}
