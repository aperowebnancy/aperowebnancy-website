import '../styles/tailwind.css';

import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <link rel="dns-prefetch" href="//fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="true" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap"
                    rel="stylesheet"
                />
                <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
                <meta
                    name="google-site-verification"
                    content="33EUCC-Zc5EVJc60ah7uEsU9Vps2Ysazfn0EhvDj4eY"
                />
            </Head>
            <div className="bg-gray-50 h-full min-h-full">
                <Header />
                <main className="pt-20">
                    <Component {...pageProps} />
                </main>
                <Footer />
            </div>
        </>
    );
}

MyApp.propTypes = {
    pageProps: PropTypes.object.isRequired,
    Component: PropTypes.elementType.isRequired,
};

export default MyApp;
