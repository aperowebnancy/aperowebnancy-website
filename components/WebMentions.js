import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { HeartIcon, QuestionMarkIcon, RePostIcon } from './Icons';

const perPage = 50;

async function getMentions(target) {
    const resp = await fetch(
        `https://webmention.io/api/mentions.jf2?&per-page=${perPage}&target=${target}`,
    );
    const { children } = await resp.json();
    return children;
}

export function WebMentions({ target }) {
    const [showMentions, setShowMentions] = useState(false);
    const [mentions, addMentions] = useState([]);

    useEffect(() => {
        const fetchMentions = async () => {
            const olderMentions = await getMentions(target);
            addMentions((mentions) => [...mentions, ...olderMentions]);
        };
        fetchMentions();
    }, [target]);

    const onShowMentions = () => {
        setShowMentions((showMentions) => !showMentions);
    };

    const totalLike = mentions.filter((mention) => mention['wm-property'] === 'like-of').length;
    const totalRepost = mentions.filter((mention) => mention['wm-property'] === 'repost-of').length;

    return (
        <>
            <h3>Webmentions</h3>
            <div>
                <div>
                    <span className="inline-block h-6 w-6">
                        <HeartIcon />
                        <span className="sr-only">Nombre de j&apos;aime</span>
                    </span>
                    <span>{totalLike}</span>
                    <span className="inline-block h-6 w-6">
                        <RePostIcon />
                        <span className="sr-only">Nombre de partages</span>
                    </span>
                    <span>{totalRepost}</span>
                    <button onClick={onShowMentions}>
                        {showMentions ? 'Cacher' : 'Voir'} les mentions
                    </button>

                    <a
                        href="https://indieweb.org/webmention-fr"
                        className="inline-block h-6 w-6 text-gray-500 hover:text-gray-600"
                        rel="noopener noreferrer"
                    >
                        <QuestionMarkIcon />
                        Qu&apos;est-ce que c&apos;est ?
                    </a>
                </div>
                {showMentions && (
                    <div>
                        <ol>
                            {showMentions &&
                                mentions.map((mention, index) => {
                                    const mentionType =
                                        mention['wm-property'] === 'like-of' ? 'aime' : 'repost';
                                    return (
                                        <li key={mention.author.name + index}>
                                            <a href={mention.author.url}>
                                                <img
                                                    alt={mention.author.name}
                                                    src={mention.author.photo}
                                                />
                                            </a>
                                            {mention.author.name} {mentionType}
                                        </li>
                                    );
                                })}
                        </ol>
                    </div>
                )}
            </div>
        </>
    );
}

WebMentions.propTypes = {
    target: PropTypes.string.isRequired,
};
