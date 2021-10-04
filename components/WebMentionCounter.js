import * as React from 'react';
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

function Separator() {
    return <span>&nbsp;&bull;&nbsp;</span>;
}

const pluralize = (word, count) => `${word}${count > 1 ? 's' : ''}`;

export function WebMentionCounter({ target }) {
    const [counts, setCounts] = React.useState(initialCounts);

    // Get counts on `target` change
    React.useEffect(() => {
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
        <a href="#mentions">
            <span>
                {counts.type.like}
                {` j'aime`}
            </span>
            <Separator />
            <span>
                {counts.type.reply}
                {pluralize(` réponse`, counts.type.reply)}
            </span>
            <Separator />
            <span>
                {counts.type.repost}
                {pluralize(` partage`, counts.type.repost)}
            </span>
        </a>
    );
}

WebMentionCounter.defaultProps = {
    target: null,
};

WebMentionCounter.propTypes = {
    target: PropTypes.string,
};
