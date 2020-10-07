import React from 'react';
import PropTypes from 'prop-types';

export function Youtube({ videoId, title }) {
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
