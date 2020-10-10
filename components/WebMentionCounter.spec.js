import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { WebMentionCounter } from './WebMentionCounter';

describe('WebMentionCounter Components', () => {
    describe('<WebMentionCounter />', () => {
        it('should render href="#mentions" on root element for anchor', async () => {
            render(<WebMentionCounter target="https://fake-site.com/take-talk" />);
            await waitFor(() => expect(screen.getByText("1 j'aime")).toBeInTheDocument());

            expect(screen.getByRole('link')).toHaveAttribute('href', '#mentions');
        });

        it('should render default web mentions', async () => {
            render(<WebMentionCounter target="https://fake-site.com/take-talk" />);

            await waitFor(() => expect(screen.getByText("1 j'aime")).toBeInTheDocument());

            expect(screen.getByText("1 j'aime")).toBeInTheDocument();
            expect(screen.getByText('1 réponse')).toBeInTheDocument();
            expect(screen.getByText('2 partages')).toBeInTheDocument();
        });
    });
});
