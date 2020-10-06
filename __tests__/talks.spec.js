import React from 'react';
import { render, screen, getByText } from '@testing-library/react';

import Talks from '../pages/talks';

jest.mock('next/router', () => ({
    useRouter: jest.fn().mockImplementation(() => ({
        asPath: 'path',
    })),
}));

describe('Talks Components', () => {
    beforeEach(() => {
        jest.useFakeTimers('modern');
        jest.setSystemTime(new Date('2020-10-20'));
    });

    describe('<Talks />', () => {
        let defaultTalks;

        beforeEach(() => {
            jest.useFakeTimers('modern');
            jest.setSystemTime(new Date('2020-10-20'));

            defaultTalks = [
                {
                    date: new Date('2020-10-19').toISOString(),
                    slug: 'a-new-third-talk',
                    frontMatter: {
                        edition: 3,
                        title: 'A new third talk',
                        description: 'A new third talk description',
                    },
                },
                {
                    date: new Date('2020-10-18').toISOString(),
                    slug: 'a-new-second-talk',
                    frontMatter: {
                        edition: 2,
                        title: 'A new second talk',
                        description: 'A new second talk description',
                    },
                },
                {
                    date: new Date('2020-10-17').toISOString(),
                    slug: 'a-new-first-talk',
                    frontMatter: {
                        edition: 1,
                        title: 'A new first talk',
                        description: 'A new first talk description',
                    },
                },
            ];
        });

        it('should render correct Talks when no events is scheduled', () => {
            render(<Talks talks={defaultTalks} />);

            expect(
                screen.getByRole('heading', { level: 1, name: 'Précédents talks' }),
            ).toBeInTheDocument();

            const listTalks = screen.getAllByRole('article');

            const valuesTalks = [
                {
                    edition: '#3',
                    title: 'A new third talk',
                    description: 'A new third talk description',
                    date: '19 oct. 2020',
                },
                {
                    edition: '#2',
                    title: 'A new second talk',
                    description: 'A new second talk description',
                    date: '18 oct. 2020',
                },
                {
                    edition: '#1',
                    title: 'A new first talk',
                    description: 'A new first talk description',
                    date: '17 oct. 2020',
                },
            ];

            valuesTalks.forEach(({ title, date, description, edition }, index) => {
                const article = listTalks[index];
                expect(getByText(article, edition)).toBeInTheDocument();
                expect(getByText(article, title)).toBeInTheDocument();
                expect(getByText(article, date)).toBeInTheDocument();
                expect(getByText(article, description)).toBeInTheDocument();
            });
        });

        it('should render correct Talks when events is planned', () => {
            const talks = [
                {
                    date: new Date('2020-10-21').toISOString(),
                    slug: 'a-new-five-talk',
                    frontMatter: {
                        edition: 5,
                        title: 'A new five talk',
                        description: 'A new five talk description',
                    },
                },
                {
                    date: new Date('2020-10-20').toISOString(),
                    slug: 'a-new-four-talk',
                    frontMatter: {
                        edition: 4,
                        title: 'A new four talk',
                        description: 'A new four talk description',
                    },
                },
                ...defaultTalks,
            ];

            render(<Talks talks={talks} />);

            expect(
                screen.getByRole('heading', { level: 1, name: 'Précédents talks' }),
            ).toBeInTheDocument();

            const listTalks = screen.getAllByRole('article');

            const valuesTalks = [
                {
                    edition: '#5',
                    title: 'A new five talk',
                    description: 'A new five talk description',
                    date: '21 oct. 2020',
                    statusTalk: 'Prochainement',
                },
                {
                    edition: '#4',
                    title: 'A new four talk',
                    description: 'A new four talk description',
                    date: '20 oct. 2020',
                    statusTalk: "Aujourd'hui",
                },
                {
                    edition: '#3',
                    title: 'A new third talk',
                    description: 'A new third talk description',
                    date: '19 oct. 2020',
                },
                {
                    edition: '#2',
                    title: 'A new second talk',
                    description: 'A new second talk description',
                    date: '18 oct. 2020',
                },
                {
                    edition: '#1',
                    title: 'A new first talk',
                    description: 'A new first talk description',
                    date: '17 oct. 2020',
                },
            ];

            valuesTalks.forEach(({ title, date, description, edition, statusTalk }, index) => {
                const article = listTalks[index];
                expect(getByText(article, edition)).toBeInTheDocument();
                expect(getByText(article, title)).toBeInTheDocument();
                expect(getByText(article, date)).toBeInTheDocument();
                expect(getByText(article, description)).toBeInTheDocument();

                if (statusTalk) {
                    expect(getByText(article, statusTalk)).toBeInTheDocument();
                    expect(getByText(article, 'Inscrivez-vous !')).toBeInTheDocument();
                }
            });
        });
    });

    afterEach(() => {
        jest.useRealTimers();
    });
});
