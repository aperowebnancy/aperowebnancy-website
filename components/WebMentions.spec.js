import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { WebMentions } from './WebMentions';

describe('WebMentions Components', () => {
    describe('Timezones', () => {
        it('should always be UTC+2', () => {
            expect(new Date().getTimezoneOffset()).toBe(-120);
        });
    });

    describe('<WebMentions />', () => {
        it('should render id="mentions" on root element for anchor', async () => {
            const { container } = render(<WebMentions target="all" />);
            await screen.findByText('1');

            expect(container.querySelector('#mentions')).toBeInTheDocument();
        });

        it('should render default web mentions', async () => {
            render(<WebMentions target="all" />);
            await screen.findByText('1');

            expect(screen.getByRole('heading', 'Webmentions')).toBeInTheDocument();
            expect(screen.getByText('1')).toBeInTheDocument(); // 1 j'aime
            expect(screen.getByText('3')).toBeInTheDocument(); // 2 mentions
            expect(screen.getByRole('button')).toHaveTextContent('Voir les mentions');
        });

        it('should render "Voir les mentions" button, click it and change text', async () => {
            render(<WebMentions target="all" />);
            await screen.findByText('1');

            expect(screen.getByRole('button')).toHaveTextContent('Voir les mentions');

            fireEvent.click(screen.getByText('Voir les mentions'));
            await screen.findByRole('list');

            fireEvent.click(screen.getByText('Cacher les mentions'));

            await waitFor(() => {
                expect(screen.getByRole('button')).toHaveTextContent('Voir les mentions');
            });

            expect(screen.queryByRole('list')).not.toBeInTheDocument();
        });

        it('should render web mentions of type "mentionne"', async () => {
            render(<WebMentions target="mention-of" />);
            await screen.findByText('1');

            fireEvent.click(screen.getByText('Voir les mentions'));
            await screen.findByRole('list');

            expect(screen.getByText('james bond', { exact: false })).toBeInTheDocument();

            expect(
                screen.getByText('Aller voir le super talk', { exact: false }),
            ).toBeInTheDocument();
            expect(
                screen.getByText('le 9 oct. 2020 à 21:47:32 :', { exact: false }),
            ).toBeInTheDocument();

            const imageTag = screen.getByAltText('james bond', { exact: false });
            expect(imageTag).toHaveAttribute('src', 'https://james.bond/photo');
            expect(imageTag.closest('a')).toHaveAttribute('href', 'https://james.bond/url');

            const typeLink = screen.getByText('mentionne');
            expect(typeLink).toHaveAttribute('href', 'https://post.url');
        });

        it('should render web mentions of type "répond"', async () => {
            render(<WebMentions target="in-reply-to" />);
            await screen.findByText('1');

            fireEvent.click(screen.getByText('Voir les mentions'));
            await screen.findByRole('list');

            expect(screen.getByText('captain marvel', { exact: false })).toBeInTheDocument();

            expect(screen.getByText('bien joué', { exact: false })).toBeInTheDocument();
            expect(
                screen.getByText('le 7 oct. 2020 à 16:48:38 :', { exact: false }),
            ).toBeInTheDocument();

            const imageTag = screen.getByAltText('captain marvel', { exact: false });
            expect(imageTag).toHaveAttribute('src', 'https://captain.marvel/photo');
            expect(imageTag.closest('a')).toHaveAttribute('href', 'https://captain.marvel/url');

            const typeLink = screen.getByText('répond');
            expect(typeLink).toHaveAttribute('href', 'https://post.url');
        });

        it('should render web mentions of type "partage"', async () => {
            render(<WebMentions target="repost-of" />);
            await screen.findByText('1');

            fireEvent.click(screen.getByText('Voir les mentions'));
            await screen.findByRole('list');

            expect(screen.getByText('spider man', { exact: false })).toBeInTheDocument();

            expect(screen.queryByText('bien joué')).not.toBeInTheDocument();
            expect(screen.queryByText('le 7 oct. 2020 à 16:48:38 :')).not.toBeInTheDocument();

            expect(screen.queryByRole('image')).not.toBeInTheDocument();

            const typeLink = screen.getByText('partage');
            expect(typeLink).toHaveAttribute('href', 'https://my.url');
        });

        it('should render web mentions of type "aime"', async () => {
            render(<WebMentions target="like-of" />);
            await screen.findByText('1');

            fireEvent.click(screen.getByText('Voir les mentions'));

            expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
        });
    });
});
