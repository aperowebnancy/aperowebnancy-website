import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const perPage = 50;

async function getMentions(page, postsPerPage, postURL) {
    const resp = await fetch(
        `https://webmention.io/api/mentions?page=${page}&per-page=${postsPerPage}&target=${postURL}`,
    );
    const { links } = await resp.json();
    return links;
}

export function WebMentions({ postUrl }) {
    const [page, setPage] = useState(0);
    const [mentions, addMentions] = useState([]);

    useEffect(() => {
        const fetchMentions = async () => {
            const olderMentions = await getMentions(page, perPage, postUrl);
            addMentions((mentions) => [...mentions, ...olderMentions]);
        };
        fetchMentions();
    }, [page, postUrl]);

    return (
        <>
            <div>
                {mentions.map((mention, index) => (
                    <div key={mention.data.author.name + index}>
                        <p>{mention.data.author.name}</p>
                    </div>
                ))}
            </div>
            {mentions.length > 0 && (
                <button
                    onClick={() => {
                        setPage(page + 1);
                    }}
                >
                    Voir plus
                </button>
            )}
        </>
    );
}

WebMentions.propTypes = {
    postUrl: PropTypes.string.isRequired,
};
