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

export const WebMentionCount = ({ target }) => {
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
            {counts === undefined && (
                <p data-testid="failed">
                    Failed to load counts{' '}
                    <span role="img" aria-label="Sad">
                        😞
                    </span>
                </p>
            )}
            {counts && (
                <>
                    <p data-testid="likes">
                        {counts.type.like || 0}
                        {' Likes '}&bull;
                    </p>
                    <p data-testid="replies">
                        {' '}
                        {counts.type.reply || 0}
                        {' Replies '}&bull;
                    </p>
                    <p data-testid="reposts">
                        {' '}
                        {counts.type.repost || 0}
                        {' Reposts'}
                    </p>
                </>
            )}
        </div>
    );
};

WebMentionCount.defaultProps = {
    target: null,
};

WebMentionCount.propTypes = {
    target: PropTypes.string,
};
