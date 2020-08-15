import fs from 'fs';
import glob from 'fast-glob';
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import matter from 'gray-matter';

export default function Talks({ talks }) {
    return (
        <>
            <Head>
                <title>Proposez un talk | Apéro Web Nancy</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="container mx-auto">
                <div className="pt-6 pb-8 space-y-2 md:space-y-5">
                    <h1 className="text-3xl leading-9 font-extrabold text-gray-900 tracking-tight sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                        Rencontres passées
                    </h1>
                    <p className="text-lg leading-7 text-gray-500">
                        Voici quelques-uns des sujets que nous avons abordés lors de rencontres
                        précédentes. Si vous souhaitez participer en donnant une conférence, ne vous
                        inquiétez pas trop si nous avons déjà abordé le sujet. De nouvelles
                        personnes nous rejoignent chaque jour et de nombreux sujets méritent d'être
                        revus.
                    </p>
                    <p className="text-lg leading-7 text-gray-500">
                        Récemment, nous avons également enregistré et publié les conférences sur
                        YouTube, vous pouvez donc les visionner ici.
                    </p>
                </div>
                <ul className="divide-y divide-gray-200">
                    {talks.map(({ date, slug, frontMatter }) => {
                        return (
                            <li key={slug} className="py-12">
                                <article className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
                                    <dl>
                                        <dt className="sr-only">Published on</dt>
                                        <dd className="text-base leading-6 font-medium text-gray-500">
                                            <time dateTime={date}>{date.toString()}</time>
                                        </dd>
                                    </dl>
                                    <div className="space-y-5 xl:col-span-3">
                                        <div className="space-y-6">
                                            <h2 className="text-2xl leading-8 font-bold tracking-tight">
                                                <Link href={slug}>
                                                    <a className="text-gray-900">
                                                        {frontMatter.title}
                                                    </a>
                                                </Link>
                                            </h2>
                                            <div className="prose max-w-none text-gray-500"></div>
                                        </div>
                                        <div className="text-base leading-6 font-medium">
                                            <Link href={slug}>
                                                <a
                                                    className="text-red-500 hover:text-red-600"
                                                    aria-label={`Read "${frontMatter.title}"`}
                                                >
                                                    Lire plus &rarr;
                                                </a>
                                            </Link>
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
    talks: PropTypes.arrayOf({
        date: PropTypes.instanceOf(Date).isRequired,
        slug: PropTypes.string.isRequired,
        frontMatter: PropTypes.object.isRequired,
    }).isRequired,
};

export async function getStaticProps() {
    const files = glob.sync('talks/*.mdx');

    const allMdx = files.map((file) => {
        const [_, filename] = file.split('/');
        const [date, slug] = filename.replace('.mdx', '').split('_');

        const mdxSource = fs.readFileSync(file);
        const { data } = matter(mdxSource);

        return {
            date,
            slug: `talks/${slug}`,
            frontMatter: data,
        };
    });

    const orderedByDate = allMdx.sort((a, z) => {
        return new Date(z.date) - new Date(a.date);
    });

    return {
        props: {
            talks: orderedByDate,
        },
    };
}
