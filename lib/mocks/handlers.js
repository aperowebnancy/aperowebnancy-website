import { rest } from 'msw';

const getWebMentionsCount = (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            count: 11,
            type: {
                like: 1,
                mention: 1,
                reply: 1,
                repost: 2,
            },
        }),
    );
};

const getWebMentions = (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            children: [
                {
                    author: {
                        name: 'james bond',
                        photo: 'https://james.bond/photo',
                        url: 'https://james.bond/url',
                    },
                    url: 'https://post.url',
                    published: '2020-10-09T19:47:32+00:00',
                    content: {
                        text: 'Aller voir le super talk',
                    },
                    'wm-property': 'mention-of',
                },
                {
                    author: {
                        name: 'captain marvel',
                        photo: 'https://captain.marvel/photo',
                        url: 'https://captain.marvel/url',
                    },
                    url: 'https://post.url',
                    published: '2020-10-07t14:48:38+00:00',
                    content: {
                        text: 'bien joué',
                    },
                    'wm-property': 'in-reply-to',
                },
                {
                    author: {
                        name: 'black panther',
                        photo: 'https://black.panther/photo',
                        url: 'https://black.panther/url',
                    },
                    url: 'https://post.url',
                    published: null,
                    'wm-property': 'like-of',
                },
                {
                    author: {
                        name: 'spider man',
                        photo: 'https://spider.man/photo',
                        url: 'https://spider.man/url',
                    },
                    url: 'https://my.url',
                    published: '2020-10-01T13:35:33+00:00',
                    'wm-property': 'repost-of',
                },
            ],
        }),
    );
};

export const handlers = [
    rest.get('https://webmention.io/api/count.json', getWebMentionsCount),
    rest.get('https://webmention.io/api/mentions.jf2', getWebMentions),
];
