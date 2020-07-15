import React from 'react';
import { render, screen } from '@testing-library/react';
import Breadcrumbs from './Breadcrumbs';
import { MemoryRouter } from 'react-router-dom';

describe('<Breadcrumbs />', () => {
  it('shows a home breadcrumb when path is not empty', async () => {
    render(<MemoryRouter><Breadcrumbs path="/Photoshoots/2020/Whatever album" /></MemoryRouter>);

    const homeLink = await screen.findByRole('link', { name: 'Home' });
    expect(homeLink).toHaveTextContent('Home');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('does not show a home breadcrumb when path is empty', async () => {
    render(<MemoryRouter><Breadcrumbs path={""} /></MemoryRouter>);

    const breadcrumbs = await screen.findByTestId('breadcrumbs');

    expect(breadcrumbs).not.toHaveTextContent('Home');
  });

  it('displays the breadcrumbs based on folder path', async () => {
    render(<MemoryRouter><Breadcrumbs path="/Photoshoots/2020/Whatever album" /></MemoryRouter>);

    const firstCrumb = screen.queryByRole('link', { name: 'Photoshoots' });
    expect(firstCrumb).toHaveTextContent('Photoshoots');
    expect(firstCrumb).toHaveAttribute('href', '/Photoshoots');

    const secondCrumb = screen.queryByRole('link', { name: '2020' })
    expect(secondCrumb).toHaveTextContent('2020');
    expect(secondCrumb).toHaveAttribute('href', '/Photoshoots/2020');

    expect(screen.queryByRole('link', { name: 'Whatever album' })).toBeNull();
    const thirdAndDisabledCrumb = await screen.findByText('Whatever album', { selector: 'li' });
    expect(thirdAndDisabledCrumb).toHaveTextContent('Whatever album');
  });
});
