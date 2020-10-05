import React from 'react';
import { render, screen, getByText, within } from '@testing-library/react';

import Talks from './talks';

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

            const listTalks = screen.getByRole('list');

            const valuesTalks = [
                ['A new third talk #3', '19 oct. 2020', 'A new third talk description'],
                ['A new second talk #2', '18 oct. 2020', 'A new second talk description'],
                ['A new first talk #1', '17 oct. 2020', 'A new first talk description'],
            ];

            valuesTalks.forEach(([title, date, description]) => {
                const li = getByText(listTalks, title).closest('li');
                const utils = within(li);
                expect(utils.getByText(title)).toBeInTheDocument();
                expect(utils.getByText(date)).toBeInTheDocument();
                expect(utils.getByText(description)).toBeInTheDocument();
            });
        });

        it('should render correct Talks when events is planned', () => {
            const talks = [
                {
                    date: new Date('2020-10-21').toISOString(),
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

            const listTalks = screen.getByRole('list');

            const valuesTalks = [
                ['A new four talk #4', '21 oct. 2020', 'A new four talk description', true],
                ['A new third talk #3', '19 oct. 2020', 'A new third talk description', false],
                ['A new second talk #2', '18 oct. 2020', 'A new second talk description', false],
                ['A new first talk #1', '17 oct. 2020', 'A new first talk description', false],
            ];

            valuesTalks.forEach(([title, date, description, isNextTalk]) => {
                const li = getByText(listTalks, title).closest('li');
                const utils = within(li);
                expect(utils.getByText(title)).toBeInTheDocument();
                expect(utils.getByText(date)).toBeInTheDocument();
                expect(utils.getByText(description)).toBeInTheDocument();
                if (isNextTalk) {
                    expect(utils.getByText('Inscrivez-vous !')).toBeInTheDocument();
                }
            });
        });
    });

    afterEach(() => {
        jest.useRealTimers();
    });
});
