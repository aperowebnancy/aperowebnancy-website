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
import { Seo } from '../../components/Seo';

const Youtube = ({ videoId, title }) => (
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
const getTalkJsonLd = ({ title, image, description, date, slug, speakers }) => [
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

const isServerSide = () => typeof window === 'undefined';
const isShareFeatureEnabled = () => navigator && navigator.share;

const ShareMore = ({ title, slug }) => {
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
        <button onClick={handleShare}>
            <svg
                className="h-6 w-6"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 426.67 426.67"
            >
                <path d="M352 256c-23.98 0-45.13 11.57-58.8 29.2l-144.44-55.55c.15-1.9.57-3.72.57-5.65 0-3.59-.56-7.02-1.06-10.48l148.01-68.32c13.7 15.49 33.48 25.47 55.72 25.47 41.17 0 74.67-33.5 74.67-74.67S393.17 21.33 352 21.33 277.33 54.83 277.33 96c0 3.59.57 7.03 1.06 10.48l-148 68.32c-13.7-15.49-33.48-25.47-55.72-25.47C33.5 149.33 0 182.83 0 224s33.5 74.67 74.67 74.67c23.98 0 45.13-11.57 58.8-29.2l144.44 55.55c-.15 1.9-.58 3.71-.58 5.65 0 41.16 33.5 74.66 74.67 74.66s74.67-33.5 74.67-74.66c0-41.17-33.5-74.67-74.67-74.67z" />
            </svg>
        </button>
    );
};

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
                                {frontMatter.title}
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
                                                                    className="inline-block text-gray-600 mr-2"
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
                                Tu veux parler de ce talk?{' '}
                                <a
                                    href={siteConfig.discordUrl}
                                    rel="noopener noreferrer"
                                    className="font-medium text-red-500 hover:text-red-600"
                                >
                                    Viens en discuter sur Discord &rarr;
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
                                    <svg
                                        className="h-6 w-6 inline-block mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 512 512"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M453.081 242.84c0-23.608-15.787-43.516-37.375-49.779.137-2.073.213-4.163.213-6.27 0-51.884-42.061-93.945-93.945-93.945-11.425 0-22.372 2.042-32.5 5.776-16.851-11.627-37.278-18.442-59.3-18.442-45.351 0-83.953 28.879-98.432 69.248-34.948 4.003-62.095 33.667-62.095 69.687a69.813 69.813 0 0011.213 38.028c-15.239 14.06-24.791 34.192-24.791 56.561 0 38.542 28.336 70.464 65.312 76.075.922 44.208 37.022 79.768 81.451 79.768 19.123 0 36.693-6.604 50.595-17.632 10.95 9.824 25.419 15.806 41.288 15.806 28.465 0 52.424-19.234 59.63-45.409a91.69 91.69 0 004.82.13c49.919 0 90.387-40.468 90.387-90.387 0-18.333-5.474-35.38-14.854-49.627 11.238-9.511 18.383-23.712 18.383-39.588z" />
                                        <path
                                            d="M184.117 340.883c-7.627 18.078-17.53 29.494-42.669 20.172-25.139-9.321-25.422-28.529-19.49-47.454s28.058-90.671 35.967-110.632 27.87-36.532 46.795-32.578c18.925 3.955 29.941 15.536 38.415 13.558 8.474-1.977 19.49-20.055 37.285-19.773s19.349 14.829 28.247 15.536 16.665-12.993 41.805-4.519c25.139 8.474 23.727 35.308 16.101 53.668s-27.682 64.967-32.766 77.678c-5.084 12.711-6.591 30.412 4.143 34.649s24.48 3.107 31.071 7.721c4.882 3.417 11.299 20.432-5.555 24.575-18.238 4.483-54.516 1.949-69.204-24.575-11.864-20.62-.565-41.24 3.107-48.867s28.23-58.76 31.354-66.662c4.802-12.146-15.219-22.832-22.845-8.991-9.879 17.929-48.179 96.501-52.684 104.666-4.851 8.792-11.261 13.433-22.486 10.814-7.918-1.847-12.132-12.208-8.474-23.727 3.383-10.65 25.591-64.801 29.006-73.83 4.808-12.711-17.674-24.389-25.64-5.62-6.886 16.225-39.116 98.579-41.483 104.191z"
                                            fill="#fafafa"
                                        />
                                        <path d="M347.138 385.292c-21.65 0-48.355-7.654-61.585-31.468-13.84-24.142-2.181-47.935 2.21-56.897l.595-1.222c7.207-14.967 28.378-59.209 31.063-65.997-.27-.475-1.394-1.435-2.827-1.56-.711-.07-1.369.002-2.157 1.43-4.332 7.861-14.553 28.717-24.438 48.886-17.281 35.26-25.758 52.349-28.827 56.71-3.945 5.604-14.424 20.489-33.586 14.198-6.448-2.118-11.578-6.591-14.447-12.594-3.386-7.085-3.479-15.67-.261-24.174 2.072-5.476 8.857-22.648 15.418-39.257 6.153-15.573 11.965-30.283 13.587-34.572-.091-.489-1.372-1.74-3.048-1.891-.585-.051-2.367-.21-4.033 3.717-4.358 10.268-19.063 47.53-29.801 74.738-6.882 17.438-10.817 27.402-11.672 29.431-10.753 25.488-29.25 34.168-54.978 25.794-15.159-4.934-38.685-19.284-25.938-59.954.744-2.373 2.042-6.534 3.548-11.362 1.642-5.263 3.53-11.315 5.216-16.707 1.648-5.271 7.259-8.206 12.529-6.559 5.271 1.648 8.208 7.258 6.559 12.529-1.685 5.387-3.571 11.435-5.212 16.692-1.509 4.838-2.81 9.009-3.556 11.388-7.676 24.49 1.732 31.273 13.043 34.955 15.923 5.181 23.584 1.511 30.36-14.55.807-1.912 5.76-14.465 11.496-28.999 10.777-27.309 25.537-64.709 29.995-75.211 6.635-15.635 20.736-18.313 31.032-14.182 11.428 4.584 17.211 16.552 13.166 27.246-1.674 4.426-7.512 19.202-13.692 34.846-6.536 16.541-13.293 33.646-15.313 38.985-1.231 3.253-1.381 6.42-.4 8.472.529 1.106 1.344 1.79 2.643 2.216 3.438 1.13 5.342 1.317 10.989-6.707 2.6-3.76 16.832-32.798 27.224-54.001 10.448-21.318 20.316-41.455 24.88-49.736 5.934-10.77 18.364-14.761 29.56-9.488 10.779 5.075 15.633 16.271 11.542 26.62-3.508 8.871-30.497 64.941-31.644 67.323-.198.413-.418.862-.655 1.346-3.698 7.547-11.392 23.251-2.793 38.195l.08.143c12.392 22.378 45.066 22.904 58.069 19.709 1.409-.347 2.996-.98 3.219-1.721.434-1.437-.542-4.1-1.308-5.132-1.898-1.028-6.956-1.764-10.705-2.309-5.614-.816-11.976-1.741-18.008-4.122-5.368-2.119-9.48-6.192-11.89-11.781-4.674-10.837-1.962-25.641 2.134-35.883 2.946-7.365 10.781-25.792 18.357-43.613 5.764-13.556 11.208-26.36 14.459-34.188 3.632-8.745 6.071-21.271 2.021-30.195-2.195-4.837-6.146-8.16-12.081-10.16-13.031-4.394-19.237-1.45-25.24 1.395-4.017 1.902-8.571 4.064-14.162 3.617-7.491-.595-12.016-5.445-15.32-8.986-3.606-3.866-5.989-6.42-12.294-6.52-7.524-.162-13.929 5.249-20.119 10.443-4.781 4.011-9.297 7.8-14.737 9.068-7.902 1.843-15.028-1.783-22.573-5.624-5.738-2.92-12.242-6.229-20.159-7.883-13.793-2.881-29.466 11.36-35.453 26.472a188.925 188.925 0 00-3.026 8.181c-1.807 5.219-7.5 7.987-12.721 6.18-5.219-1.807-7.986-7.502-6.18-12.721a208.401 208.401 0 013.332-9.006c9.145-23.077 33.395-43.861 58.138-38.683 10.523 2.198 18.627 6.322 25.138 9.636 3.128 1.592 7.365 3.748 9.013 3.924 1.337-.643 4.229-3.067 6.372-4.866 7.726-6.48 18.303-15.332 33.291-15.119 14.81.235 22.191 8.146 26.601 12.874.813.872 1.87 2.005 2.545 2.575.913-.293 2.518-1.054 3.747-1.636 7.297-3.459 19.51-9.249 40.193-2.273 11.156 3.76 19.422 10.969 23.905 20.848 8.199 18.067 1.498 38.28-1.764 46.132-3.283 7.904-8.743 20.746-14.523 34.342-7.535 17.723-15.327 36.05-18.193 43.215-3.071 7.678-4.077 16.506-2.339 20.534.393.911.691 1.028.869 1.099 3.869 1.527 8.786 2.242 13.542 2.934 7.249 1.054 14.096 2.049 19.593 5.896 5.907 4.135 11.123 14.797 9.25 24.813-1.645 8.795-8.261 15.234-18.152 17.666-5.3 1.302-11.746 2.095-18.713 2.096z" />
                                        <path d="M142.61 257.888a9.957 9.957 0 01-3.025-.471c-5.265-1.669-8.179-7.29-6.51-12.555l.202-.633c1.688-5.259 7.321-8.152 12.579-6.465 5.258 1.688 8.152 7.32 6.464 12.578l-.181.564c-1.349 4.261-5.286 6.982-9.529 6.982z" />
                                        <g>
                                            <circle cx="28.23" cy="247.83" r="18.229" />
                                            <circle cx="300.53" cy="39.577" r="20" />
                                            <circle cx="397.4" cy="472.42" r="20" />
                                            <circle cx="466.1" cy="160.19" r="20" />
                                        </g>
                                        <path d="M202.831 479.545c-24.1 0-46.844-9.293-64.043-26.168-15.231-14.942-24.61-34.346-26.884-55.312-17.225-4.308-32.84-13.863-44.6-27.425a86.919 86.919 0 01-21.235-56.938c0-21.49 8.058-42.274 22.336-58.162a79.878 79.878 0 01-8.758-36.426c0-38.686 27.484-71.491 64.87-78.688C142.248 98.17 183.968 70.18 230.174 70.18c21.633 0 42.514 6.001 60.708 17.4 10.032-3.145 20.468-4.735 31.093-4.735 57.099 0 103.592 46.28 103.943 103.298 22.222 9.707 37.164 32.008 37.164 56.696a61.707 61.707 0 01-15.75 41.217c8.016 14.686 12.219 31.119 12.219 47.997 0 2.481-.092 4.99-.273 7.455-.404 5.508-5.191 9.628-10.706 9.241-5.508-.405-9.645-5.198-9.24-10.706.146-1.98.219-3.995.219-5.99 0-15.746-4.567-31.005-13.207-44.128a10.002 10.002 0 011.894-13.134c9.434-7.98 14.844-19.627 14.844-31.952 0-18.502-12.403-35.022-30.161-40.174a10.001 10.001 0 01-7.192-10.263c.127-1.929.192-3.817.192-5.612 0-46.287-37.658-83.945-83.945-83.945-9.986 0-19.756 1.735-29.041 5.159a10.003 10.003 0 01-9.139-1.152c-15.808-10.906-34.35-16.672-53.621-16.672-39.81 0-75.584 25.167-89.02 62.624a10 10 0 01-8.275 6.559c-30.348 3.477-53.233 29.164-53.233 59.752 0 11.6 3.323 22.872 9.61 32.599a10 10 0 01-1.617 12.778c-13.709 12.649-21.572 30.587-21.572 49.211 0 32.819 24.424 61.274 56.812 66.188a10 10 0 018.498 9.678c.805 38.585 32.859 69.977 71.453 69.977 16.279 0 31.625-5.349 44.38-15.467a10.002 10.002 0 0112.893.391 51.753 51.753 0 0034.609 13.25c23.263 0 43.819-15.652 49.989-38.063a10.003 10.003 0 0110.16-7.332c1.486.077 2.933.116 4.301.116 16.557 0 32.453-4.99 45.97-14.432 4.526-3.163 10.761-2.056 13.924 2.472 3.163 4.528 2.056 10.762-2.472 13.925-16.258 11.355-35.264 17.56-55.1 18.009-10.751 27.026-37.182 45.306-66.773 45.306a71.719 71.719 0 01-41.574-13.252c-14.93 9.888-32.165 15.076-50.307 15.076zm234.642-92.338a9.958 9.958 0 01-5.012-1.354c-4.776-2.772-6.399-8.893-3.626-13.669l.117-.202c2.734-4.799 8.841-6.474 13.639-3.737 4.798 2.734 6.472 8.842 3.737 13.64l-.197.343a10.004 10.004 0 01-8.658 4.979zM502 233.168h-.134c-5.523 0-10-4.478-10-10s4.477-10 10-10H502c5.523 0 10 4.478 10 10s-4.477 10-10 10zM157.794 40.156h-.134c-5.523 0-10-4.478-10-10s4.477-10 10-10h.134c5.523 0 10 4.478 10 10s-4.477 10-10 10z" />
                                        <path d="M91.915 424.037h-.134c-5.523 0-10-4.478-10-10s4.477-10 10-10h.134c5.523 0 10 4.478 10 10s-4.477 10-10 10zM251.218 499.633h-.134c-5.523 0-10-4.478-10-10s4.477-10 10-10h.134c5.523 0 10 4.478 10 10s-4.477 10-10 10zM479.102 298.021h-.134c-5.523 0-10-4.478-10-10s4.477-10 10-10h.134c5.523 0 10 4.478 10 10s-4.477 10-10 10zM112.525 124.641h-.134c-5.523 0-10-4.478-10-10s4.477-10 10-10h.134c5.523 0 10 4.478 10 10s-4.477 10-10 10zM28.229 276.061C12.664 276.061 0 263.397 0 247.832s12.664-28.229 28.229-28.229 28.229 12.663 28.229 28.229-12.664 28.229-28.229 28.229zm0-36.458c-4.538 0-8.229 3.691-8.229 8.229 0 4.538 3.691 8.229 8.229 8.229s8.229-3.691 8.229-8.229c0-4.538-3.691-8.229-8.229-8.229zM300.53 69.578c-16.542 0-30-13.458-30-30s13.458-30 30-30 30 13.458 30 30-13.458 30-30 30zm0-40c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10-4.486-10-10-10zM397.397 502.422c-16.542 0-30-13.458-30-30s13.458-30 30-30 30 13.458 30 30-13.458 30-30 30zm0-40c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10-4.486-10-10-10zM466.1 190.193c-16.542 0-30-13.458-30-30s13.458-30 30-30 30 13.458 30 30-13.458 30-30 30zm0-40c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10-4.486-10-10-10z" />
                                    </svg>
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
                                    <svg
                                        className="h-6 w-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
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
                                                <a>{next.title}</a>
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
                                                <a>{previous.title}</a>
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
    speakers: PropTypes.array.isRequired,
    slug: PropTypes.string.isRequired,
    previous: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    }),
    next: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
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
