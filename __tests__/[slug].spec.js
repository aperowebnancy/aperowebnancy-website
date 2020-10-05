import React from 'react';
import { render, screen } from '@testing-library/react';

import Talk from '../pages/talks/[slug].js';

jest.mock('next/router', () => ({
    useRouter: jest.fn().mockImplementation(() => ({
        asPath: 'path',
    })),
}));

describe('Talk Components', () => {
    beforeEach(() => {
        jest.useFakeTimers('modern');
        jest.setSystemTime(new Date('2020-10-20'));
    });

    describe('<Talk />', () => {
        let defaultSpeakers, defaultTalk;

        beforeEach(() => {
            defaultSpeakers = [
                {
                    slug: 'james-bond',
                    firstName: 'james',
                    lastName: 'bond',
                    picture: 'https://picture.com',
                },
            ];

            defaultTalk = {
                speakers: defaultSpeakers,
                mdxHtml: '<h1>MDX talk</h1>',
                frontMatter: {
                    edition: 1,
                    title: 'A new talk',
                    description: 'A new talk description',
                    date: new Date('2020-10-20'),
                },
                slug: 'a-new-talk',
            };
        });

        it('should render correct Talk', () => {
            render(<Talk {...defaultTalk} />);

            expect(screen.getByText('mardi 20 octobre 2020')).toBeInTheDocument();
            expect(screen.getByText('A new talk #1')).toBeInTheDocument();
            expect(screen.getByText('james bond')).toBeInTheDocument();
            expect(screen.getByRole('heading', { level: 1, name: 'MDX talk' })).toBeInTheDocument();
        });

        it('should render correct next Talk', () => {
            const talk = {
                ...defaultTalk,
                next: {
                    edition: 2,
                    slug: 'second-talk',
                    title: 'second talk',
                },
            };

            render(<Talk {...talk} />);

            expect(screen.getByText('second talk #2')).toBeInTheDocument();
        });

        it('should render correct previous Talk', () => {
            const talk = {
                ...defaultTalk,
                previous: {
                    edition: 0,
                    slug: 'zero-talk',
                    title: 'zero talk',
                },
            };

            render(<Talk {...talk} />);

            expect(screen.getByText('zero talk #0')).toBeInTheDocument();
        });

        it('should render correct next and previous Talk', () => {
            const talk = {
                ...defaultTalk,
                next: {
                    edition: 2,
                    slug: 'second-talk',
                    title: 'second talk',
                },
                previous: {
                    edition: 0,
                    slug: 'zero-talk',
                    title: 'zero talk',
                },
            };

            render(<Talk {...talk} />);

            expect(screen.getByText('second talk #2')).toBeInTheDocument();
            expect(screen.getByText('zero talk #0')).toBeInTheDocument();
        });
    });

    afterEach(() => {
        jest.useRealTimers();
    });
});
