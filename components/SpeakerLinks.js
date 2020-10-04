import React from 'react';

import { GitHubIcon, LinkedinIcon, TwitterIcon, PersonalIcon } from './Icons';
import PropTypes from 'prop-types';

const socials = {
    twitter: <TwitterIcon />,
    github: <GitHubIcon />,
    linkedin: <LinkedinIcon />,
    perso: <PersonalIcon />,
};

export function SpeakerLinks({ links }) {
    return links.map(({ url, title }) => {
        return (
            <a
                key={`${url}-${title}`}
                href={url}
                className="inline-block text-gray-600 mr-2 h-4 w-4"
                rel="noopener noreferrer"
            >
                {socials[title]}
            </a>
        );
    });
}

SpeakerLinks.propTypes = {
    links: PropTypes.arrayOf(
        PropTypes.shape({
            url: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
        }),
    ).isRequired,
};
