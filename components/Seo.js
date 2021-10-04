import PropTypes from 'prop-types';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { siteConfig } from '../lib/siteConfig';

export function Seo({ title, description, image, jsonLdArray = [] }) {
    const router = useRouter();

    const metaTitle = title || 'Apéro Web Nancy';
    const metaDescription =
        description || 'Apéro Web Nancy est un meetup mensuel autour des technos du Web à Nancy';
    const metaImage = image ? image : `${siteConfig.siteUrl}/generic-og-image.png`;

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
            logo: `${siteConfig.siteUrl}/logo.png`,
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
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:image:alt" content={metaTitle} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:url" content={`${siteConfig.siteUrl}${router.asPath}`} />

            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content={siteConfig.twitterHandler} />
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />
            <meta name="twitter:url" content={`${siteConfig.siteUrl}${router.asPath}`} />
            {/* Schema.org JSON-LD */}
            <script type="application/ld+json">{JSON.stringify(jsonLdSchema)}</script>

            {/* Favicon & Images */}
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#df1717" />
            <meta name="msapplication-TileColor" content="#2d89ef" />
            <meta name="theme-color" content="#ffffff" />
        </Head>
    );
}

Seo.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    jsonLdArray: PropTypes.array,
};
