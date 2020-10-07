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
            {counts && (
                <>
                    <span data-testid="likes">
                        {counts.type.like || 0}
                        {' Likes '}&bull;
                    </span>
                    <span data-testid="replies">
                        {' '}
                        {counts.type.reply || 0}
                        {' Replies '}&bull;
                    </span>
                    <span data-testid="reposts">
                        {' '}
                        {counts.type.repost || 0}
                        {' Reposts'}
                    </span>
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
