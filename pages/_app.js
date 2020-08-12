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
                <link
                    href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap"
                    rel="stylesheet"
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
