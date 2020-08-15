import fs from 'fs';
import glob from 'fast-glob';
import Link from 'next/link';
import React from 'react';
import ReactDOM from 'react-dom/server';
import matter from 'gray-matter';
import MDX from '@mdx-js/runtime';

export default function Talk({ mdxHtml, frontMatter, speakers }) {
    return (
        <article className="xl:divide-y xl:divide-gray-200">
            <section className="pt-6 xl:pb-10">
                <div className="space-y-1 text-center">
                    <dl className="space-y-10">
                        <div>
                            <dt className="sr-only">Published on</dt>
                            <dd className="text-base leading-6 font-medium text-gray-500">
                                <time dateTime={frontMatter.date}>{frontMatter.date}</time>
                            </dd>
                        </div>
                    </dl>
                    <div>
                        <h1>{frontMatter.title}</h1>
                    </div>
                </div>
            </section>
            <div
                className="divide-y xl:divide-y-0 divide-gray-200 xl:grid xl:grid-cols-4 xl:col-gap-6 pb-16 xl:pb-20"
                style={{ gridTemplateRows: 'auto 1fr' }}
            >
                <dl className="pt-6 pb-10 xl:pt-11 xl:border-b xl:border-gray-200">
                    <dt className="sr-only">Speakers</dt>
                    <dd>
                        <ul className="flex justify-center xl:block space-x-8 sm:space-x-12 xl:space-x-0 xl:space-y-8">
                            {speakers.map((speaker) => (
                                <li key={speaker.slug} className="flex items-center space-x-2">
                                    <img
                                        src={`/speakers/${speaker.picture}`}
                                        alt=""
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <dl className="text-sm font-medium leading-5 whitespace-no-wrap">
                                        <dt className="sr-only">Name</dt>
                                        <dd className="text-gray-900">{speaker.firstName}</dd>
                                        <dt className="sr-only">Twitter</dt>
                                        <dd>
                                            <a
                                                href={`https://twitter.com/${speaker.links[0].url}`}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                {speaker.links[0].url}
                                            </a>
                                        </dd>
                                    </dl>
                                </li>
                            ))}
                        </ul>
                    </dd>
                </dl>
                <div className="divide-y divide-gray-200 xl:pb-0 xl:col-span-3 xl:row-span-2">
                    <div className="prose max-w-none pt-10 pb-8">
                        <div dangerouslySetInnerHTML={{ __html: mdxHtml }} />
                    </div>
                    <div className="pt-6 pb-16">
                        <p>
                            Tu veux parler de ce talk?{' '}
                            <a href="/" className="font-medium text-red-500 hover:text-red-600">
                                Vient en discuter sur Discord &rarr;
                            </a>
                        </p>
                    </div>
                </div>
                <section className="text-sm font-medium leading-5 divide-y divide-gray-200 xl:col-start-1 xl:row-start-2">
                    <div className="pt-8">
                        <Link href="/talks">
                            <a className="text-red-500 hover:text-red-600">&larr; Voir les talks</a>
                        </Link>
                    </div>
                </section>
            </div>
        </article>
    );
}

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
    const file = glob.sync(`talks/*_${slug}.mdx`)[0];
    if (!file) {
        console.warn('No MDX file found for slug');
    }

    const [date] = file.split('/')[1].split('_');

    const mdxSource = fs.readFileSync(file);
    const { content, data } = matter(mdxSource);

    const searchSpeakersRegex =
        data.speakers.length > 1 ? `{${data.speakers.join(',')}}` : `${data.speakers[0]}`;
    const speakersFiles = glob.sync(`speakers/${searchSpeakersRegex}.mdx`);

    const speakers = speakersFiles.map((file) => {
        const [_, filename] = file.split('/');
        const [slug] = filename.split('.');

        const mdxSource = fs.readFileSync(file);
        const { data } = matter(mdxSource);

        return {
            slug,
            ...data,
        };
    });

    const orderedByLastName = speakers.sort((a, z) => a.lastName.localeCompare(z.lastName));

    return {
        props: {
            mdxHtml: ReactDOM.renderToStaticMarkup(<MDX>{content}</MDX>),
            frontMatter: {
                date,
                ...data,
            },
            speakers: orderedByLastName,
        },
    };
}
