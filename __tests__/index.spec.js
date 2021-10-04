import { render, screen, within } from '@testing-library/react';

import Home, { FutureTalk } from '../pages/index';

jest.mock('next/router', () => ({
    useRouter: jest.fn().mockImplementation(() => ({
        asPath: 'path',
    })),
}));

describe('Index Components', () => {
    beforeEach(() => {
        jest.useFakeTimers('modern');
        jest.setSystemTime(new Date('2020-10-20'));
    });

    describe('<Home />', () => {
        let defaultSpeakers, defaultTalks;

        beforeEach(() => {
            defaultTalks = [
                {
                    date: new Date('2020-10-19').toISOString(),
                    slug: 'a-new-third-talk',
                    frontMatter: {
                        title: 'A new third talk',
                        edition: 3,
                    },
                },
                {
                    date: new Date('2020-10-18').toISOString(),
                    slug: 'a-new-second-talk',
                    frontMatter: {
                        title: 'A new second talk',
                        edition: 2,
                    },
                },
                {
                    date: new Date('2020-10-17').toISOString(),
                    slug: 'a-new-first-talk',
                    frontMatter: {
                        title: 'A new first talk',
                        edition: 1,
                    },
                },
            ];

            defaultSpeakers = [
                { slug: 'james-bond', frontMatter: { firstName: 'james', lastName: 'bond' } },
            ];
        });

        it('should render correct Home when no events is scheduled', () => {
            render(<Home talks={defaultTalks} lastTalkSpeakers={defaultSpeakers} />);

            expect(
                screen.getByRole('heading', { level: 1, name: 'Meetup Apéro Web Nancy' }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole('heading', { level: 3, name: 'Aucun événement planifié' }),
            ).toBeInTheDocument();

            const listTalks = screen.getByRole('list');

            const valuesTalks = [
                ['A new third talk #3', '19 oct. 2020'],
                ['A new second talk #2', '18 oct. 2020'],
                ['A new first talk #1', '17 oct. 2020'],
            ];

            valuesTalks.forEach(([title, date]) => {
                const ul = within(listTalks);

                // eslint-disable-next-line testing-library/no-node-access
                const li = within(ul.getByText(title).closest('li'));
                expect(li.getByText(title)).toBeInTheDocument();
                expect(li.getByText(date)).toBeInTheDocument();
            });
        });

        it('should render correct Home when events is planned', () => {
            const talks = [
                {
                    date: new Date('2020-10-21').toISOString(),
                    slug: 'a-new-four-talk',
                    frontMatter: {
                        title: 'A new four talk',
                        edition: 4,
                    },
                },
                ...defaultTalks,
            ];

            render(<Home talks={talks} lastTalkSpeakers={defaultSpeakers} />);

            expect(
                screen.getByRole('heading', { level: 1, name: 'Meetup Apéro Web Nancy' }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole('heading', { level: 3, name: 'Prochain meetup: A new four talk' }),
            ).toBeInTheDocument();

            const listTalks = screen.getByRole('list');

            const valuesTalks = [
                ['A new four talk #4', '21 oct. 2020', true],
                ['A new third talk #3', '19 oct. 2020', false],
                ['A new second talk #2', '18 oct. 2020', false],
                ['A new first talk #1', '17 oct. 2020', false],
            ];

            valuesTalks.forEach(([title, date, isNextTalk]) => {
                const ul = within(listTalks);

                // eslint-disable-next-line testing-library/no-node-access
                const li = within(ul.getByText(title).closest('li'));
                expect(li.getByText(title)).toBeInTheDocument();
                expect(li.getByText(date)).toBeInTheDocument();
                if (isNextTalk) {
                    // eslint-disable-next-line jest/no-conditional-expect
                    expect(li.getByText('Inscrivez-vous !')).toBeInTheDocument();
                }
            });
        });
    });

    describe('<FutureTalk />', () => {
        it('should render correct future talk', () => {
            const talk = {
                date: new Date('2020-10-17').toISOString(),
                slug: 'a-new-talk',
                frontMatter: {
                    title: 'A new talk',
                    edition: 1,
                },
            };
            const speakers = [
                { slug: 'james-bond', frontMatter: { firstName: 'james', lastName: 'bond' } },
            ];

            render(<FutureTalk talk={talk} speakers={speakers} />);

            expect(
                screen.getByRole('heading', {
                    level: 3,
                    name: 'Prochain meetup: A new talk',
                }),
            ).toBeInTheDocument();
            expect(screen.getByText('17 octobre 2020')).toBeInTheDocument();
            expect(screen.getByText('En ligne')).toBeInTheDocument();
            expect(screen.getByText('james bond')).toBeInTheDocument();
        });

        it('should render correct future talk without speakers part', () => {
            const talk = {
                date: new Date('2020-10-17').toISOString(),
                slug: 'a-new-talk',
                frontMatter: {
                    title: 'A new talk',
                    edition: 1,
                },
            };
            const speakers = [];

            render(<FutureTalk talk={talk} speakers={speakers} />);

            expect(
                screen.getByRole('heading', {
                    level: 3,
                    name: 'Prochain meetup: A new talk',
                }),
            ).toBeInTheDocument();
            expect(screen.getByText('17 octobre 2020')).toBeInTheDocument();
            expect(screen.getByText('En ligne')).toBeInTheDocument();
            expect(screen.queryByText('Speaker')).not.toBeInTheDocument();
        });
    });

    afterEach(() => {
        jest.useRealTimers();
    });
});
