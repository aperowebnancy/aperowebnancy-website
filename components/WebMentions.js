import * as React from 'react';
import PropTypes from 'prop-types';

import { HeartIcon, QuestionMarkIcon, RePostIcon } from './Icons';

const perPage = 50;

const wmProperties = {
    'in-reply-to': 'répond',
    'repost-of': 'partage',
    'mention-of': 'mentionne',
};

async function getMentions(target) {
    const resp = await fetch(
        `https://webmention.io/api/mentions.jf2?&per-page=${perPage}&target=${target}`,
    );
    const { children } = await resp.json();
    return children;
}

export function WebMentions({ target }) {
    const [showMentions, setShowMentions] = React.useState(false);
    const [mentions, addMentions] = React.useState([]);

    React.useEffect(() => {
        const fetchMentions = async () => {
            const olderMentions = await getMentions(target);
            addMentions((mentions) => [...mentions, ...olderMentions]);
        };
        fetchMentions();
    }, [target]);

    const onShowMentions = () => {
        setShowMentions((showMentions) => !showMentions);
    };

    const mentionsWithoutLike = mentions.filter((mention) => mention['wm-property'] !== 'like-of');
    const totalLike = mentions.filter((mention) => mention['wm-property'] === 'like-of').length;
    const totalRepost = mentionsWithoutLike.length;

    return (
        <>
            <div className="flex flex-wrap items-center" id="mentions">
                <h2 className="text-xl md:text-2xl font-bold">Webmentions</h2>
                <span className="inline-block h-6 w-6 mx-4 text-blue-500">
                    <HeartIcon />
                    <span className="sr-only">Nombre de j&apos;aime</span>
                </span>
                <span className="text-blue-500">{totalLike}</span>
                <span className="inline-block h-6 w-6 mx-4 text-blue-500">
                    <RePostIcon />
                    <span className="sr-only">Nombre de partages</span>
                </span>
                <span className="text-blue-500">{totalRepost}</span>
                <button
                    onClick={onShowMentions}
                    className="mx-4 p-2 rounded-lg bg-red-600 text-white"
                >
                    {showMentions ? 'Cacher' : 'Voir'} les mentions
                </button>

                <span className="flex flex-1"></span>
                <a
                    href="https://indieweb.org/webmention-fr"
                    className="flex items-center text-gray-500 hover:text-gray-600"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <span className="h-6 w-6 mr-1">
                        <QuestionMarkIcon />
                    </span>
                    Qu&apos;est-ce que c&apos;est ?
                </a>
            </div>
            {showMentions && (
                <ol>
                    {mentionsWithoutLike.map((mention, index) => {
                        const mentionType = mention['wm-property'];
                        const mentionText = wmProperties[mentionType];
                        return (
                            <li key={mention.author.name + index} className="block rounded p-4">
                                <a href={mention.author.url}>
                                    <img
                                        alt={mention.author.name}
                                        src={mention.author.photo}
                                        className="inline-block w-12 h-12 rounded-full m-2"
                                    />
                                </a>
                                {mention.author.name}{' '}
                                <a
                                    href={mention.url}
                                    className="font-bold text-red-500 hover:text-red-600"
                                    rel="noopener noreferrer"
                                >
                                    {mentionText}
                                </a>
                                {mentionType !== 'repost-of' && (
                                    <>
                                        {' le '}
                                        {new Date(mention.published).toLocaleDateString('fr-FR', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                        {' à '}
                                        {new Date(mention.published).toLocaleTimeString('fr-FR')}
                                        {' :'}
                                        {mention.content && (
                                            <p className="ml-16">{mention.content.text}</p>
                                        )}
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ol>
            )}
        </>
    );
}

WebMentions.propTypes = {
    target: PropTypes.string.isRequired,
};
