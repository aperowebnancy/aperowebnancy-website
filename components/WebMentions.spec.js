import React from 'react';
import {
    render,
    screen,
    fireEvent,
    getByText,
    getByAltText,
    waitFor,
} from '@testing-library/react';

import { WebMentions } from './WebMentions';

const mentions = [
    {
        name: 'james bond',
        text: 'Aller voir le super talk',
        type: 'mentionne',
        date: 'le 9 oct. 2020 à 21:47:32',
        image: 'https://james.bond/photo',
        profileUrl: 'https://james.bond/url',
        url: 'https://post.url',
    },
    {
        name: 'captain marvel',
        text: 'bien joué',
        type: 'répond',
        date: 'le 7 oct. 2020 à 16:48:38',
        image: 'https://captain.marvel/photo',
        profileUrl: 'https://captain.marvel/url',
        url: 'https://post.url',
    },
    {
        name: 'spider man',
        text: null,
        type: 'partage',
        date: null,
        image: 'https://spider.man/photo',
        profileUrl: 'https://spider.man/url',
        url: 'https://my.url',
    },
];

describe('WebMentions Components', () => {
    describe('<WebMentions />', () => {
        it('should render default web mentions', async () => {
            render(<WebMentions target="https://fake-site.com/take-talk" />);

            await screen.findByText('1');

            expect(screen.getByRole('heading', 'Webmentions')).toBeInTheDocument();
            expect(screen.getByText('1')).toBeInTheDocument(); // 1 j'aime
            expect(screen.getByText('3')).toBeInTheDocument(); // 2 mentions

            expect(screen.getByRole('button')).toHaveTextContent('Voir les mentions');
        });

        it('should render full web mentions when click on "Voir les mentions"', async () => {
            render(<WebMentions target="https://fake-site.com/take-talk" />);

            await screen.findByText('1');
            fireEvent.click(screen.getByText('Voir les mentions'));

            await screen.findByRole('list');
            expect(screen.getByRole('button')).toHaveTextContent('Cacher les mentions');

            const listWebMentions = screen.getAllByRole('listitem');
            expect(listWebMentions).toHaveLength(mentions.length);

            mentions.forEach(({ name, text, image, profileUrl, type, url, date }, index) => {
                const webMention = listWebMentions[index];
                expect(getByText(webMention, new RegExp(name, 'i'))).toBeInTheDocument();

                if (text) expect(getByText(webMention, text)).toBeInTheDocument();
                if (date) expect(getByText(webMention, new RegExp(date, 'i'))).toBeInTheDocument();

                const imageTag = getByAltText(webMention, new RegExp(name, 'i'));
                expect(imageTag).toHaveAttribute('src', image);
                expect(imageTag.closest('a')).toHaveAttribute('href', profileUrl);

                const typeLink = getByText(webMention, type);
                expect(typeLink).toHaveAttribute('href', url);
            });

            fireEvent.click(screen.getByText('Cacher les mentions'));

            await waitFor(() => {
                expect(screen.getByRole('button')).toHaveTextContent('Voir les mentions');
            });

            expect(screen.queryByRole('list')).not.toBeInTheDocument();
        });
    });
});
