import React from 'react';
import { render, screen } from '@testing-library/react';
import Credits from './Credits';

describe('<Credits />', () => {
  it('shows the credits loaded from the provided url', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      text: jest.fn().mockResolvedValue('Credits: Bla')
    });
    render(<Credits url="https://example.com/credits.txt" />);

    const credits = await screen.findByTestId('credits');
    expect(credits).toHaveTextContent('Credits: Bla');
  })
});
