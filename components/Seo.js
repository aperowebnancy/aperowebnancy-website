import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { siteConfig } from '../lib/siteConfig';

export const Seo = ({ title, description, image, jsonLdArray = [] }) => {
    const router = useRouter();

    const metaDescription =
        description || 'Apéro Web Nancy est un meetup mensuel autour des technos du Web à Nancy';
    const metaImage = image || 'vercel.svg';

    // https://schema.org/WebSite
    const jsonLdSchema = [
        {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Apéro Web Nancy',
            description: metaDescription,
            url: siteConfig.siteUrl,
            image: metaImage,
            sameAs: [
                siteConfig.githubUrl,
                siteConfig.meetupUrl,
                siteConfig.twitterUrl,
                siteConfig.youtubeUrl,
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            url: siteConfig.siteUrl,
            logo: image,
        },
        ...jsonLdArray,
    ];

    return (
        <Head>
            {/* General tags */}
            <title>{`${title ? `${title} | ` : ''}Apéro Web Nancy`}</title>
            <meta name="description" content={metaDescription} />

            {/* OpenGraph tags */}
            <meta property="og:locale" content="fr_FR" />
            <meta property="og:type" content="website" key="ogtype" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:url" content={siteConfig.siteUrl} />
            <meta
                property="og:url"
                key="og:url"
                content={`${siteConfig.siteUrl}${router.pathname}`}
            />

            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content={siteConfig.twitterHandle} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />
            <meta name="twitter:url" content={siteConfig.siteUrl} />

            {/* Schema.org JSON-LD */}
            <script type="application/ld+json">{JSON.stringify(jsonLdSchema)}</script>

            <link rel="icon" type="image/x-icon" href="favicon.ico" />
            <link rel="apple-touch-icon" href="favicon.ico" />
        </Head>
    );
};

Seo.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    jsonLdArray: PropTypes.array,
};
