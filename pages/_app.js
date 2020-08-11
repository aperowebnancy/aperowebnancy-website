import React from 'react';
import PropTypes from 'prop-types';

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

MyApp.propTypes = {
    pageProps: PropTypes.object.isRequired,
    Component: PropTypes.elementType.isRequired,
};

export default MyApp;
