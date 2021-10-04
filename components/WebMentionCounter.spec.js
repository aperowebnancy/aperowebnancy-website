import { render, screen } from '@testing-library/react';

import { WebMentionCounter } from './WebMentionCounter';

describe('WebMentionCounter Components', () => {
    describe('<WebMentionCounter />', () => {
        it('should render href="#mentions" on root element for anchor', async () => {
            render(<WebMentionCounter target="https://fake-site.com/take-talk" />);
            await screen.findByText("1 j'aime");

            expect(screen.getByRole('link')).toHaveAttribute('href', '#mentions');
        });

        it('should render default web mentions', async () => {
            render(<WebMentionCounter target="https://fake-site.com/take-talk" />);

            await screen.findByText("1 j'aime");

            expect(screen.getByText("1 j'aime")).toBeInTheDocument();
            expect(screen.getByText('1 réponse')).toBeInTheDocument();
            expect(screen.getByText('2 partages')).toBeInTheDocument();
        });
    });
});
