import React from 'react';
import PropTypes from 'prop-types';

import '../styles/tailwind.css';

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

MyApp.propTypes = {
    pageProps: PropTypes.object.isRequired,
    Component: PropTypes.elementType.isRequired,
};

export default MyApp;
