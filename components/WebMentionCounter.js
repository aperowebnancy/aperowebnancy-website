import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const initialCounts = {
    count: 0,
    type: {
        like: 0,
        mention: 0,
        reply: 0,
        repost: 0,
    },
};

const fetchCounts = async (target) => {
    return fetch(`https://webmention.io/api/count.json?target=${target}`).then((response) => {
        return response.json ? response.json() : response;
    });
};

export const WebMentionCounter = ({ target }) => {
    const [counts, setCounts] = useState(initialCounts);

    // Get counts on `target` change
    useEffect(() => {
        const getCounts = async () => {
            const responseCounts = await fetchCounts(target);
            setCounts((previousCounts) => {
                return {
                    ...previousCounts,
                    ...responseCounts,
                    type: {
                        ...previousCounts.type,
                        ...responseCounts.type,
                    },
                };
            });
        };

        getCounts();
    }, [target]);

    return (
        <div>
            {counts && (
                <>
                    <span data-testid="likes">
                        {counts.type.like}
                        {` j'aime`}
                    </span>
                    <Separator />
                    <span data-testid="replies">
                        {counts.type.reply}
                        {pluralize(` réponse`, counts.type.reply)}
                    </span>
                    <Separator />
                    <span data-testid="reposts">
                        {counts.type.repost}
                        {pluralize(` partage`, counts.type.repost)}
                    </span>
                </>
            )}
        </div>
    );
};

WebMentionCounter.defaultProps = {
    target: null,
};

WebMentionCounter.propTypes = {
    target: PropTypes.string,
};

const Separator = () => {
    return <span>&nbsp;&bull;&nbsp;</span>;
};

const pluralize = (word, count) => `${word}${count > 1 ? 's' : ''}`;
