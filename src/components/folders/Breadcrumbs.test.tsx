import React from 'react';
import { render } from '@testing-library/react';
import Breadcrumbs from './Breadcrumbs';
import { MemoryRouter } from 'react-router-dom';

test('displays the breadcrumbs based on folder path', async () => {
  const pathComponents = [
    {
      path: '/Photoshoots',
      name: 'Photoshoots',
    },
    {
      path: '/Photoshoots/2020',
      name: '2020',
    },
    {
      path: '/Photoshoots/2020/Whatever album',
      name: 'Whatever album',
    }
  ];

  const { findByTestId } = render(<MemoryRouter><Breadcrumbs pathComponents={pathComponents} /></MemoryRouter>);

  const breadcrumbs = await findByTestId('breadcrumbs');

  expect(breadcrumbs).toHaveTextContent('Photoshoots');
  expect(breadcrumbs).toHaveTextContent('2020');
  expect(breadcrumbs).toHaveTextContent('Whatever album');
});

test('shows a home breadcrumb when there are path components', async () => {
  const pathComponents = [
    {
      path: '/Photoshoots',
      name: 'Photoshoots',
    },
    {
      path: '/Photoshoots/2020',
      name: '2020',
    },
    {
      path: '/Photoshoots/2020/Whatever album',
      name: 'Whatever album',
    }
  ];

  const { findByTestId } = render(<MemoryRouter><Breadcrumbs pathComponents={pathComponents} /></MemoryRouter>);

  const breadcrumbs = await findByTestId('breadcrumbs');

  expect(breadcrumbs).toHaveTextContent('Home');
});

test('does not show a home breadcrumb when path components is empty', async () => {
  const { findByTestId } = render(<MemoryRouter><Breadcrumbs pathComponents={[]} /></MemoryRouter>);

  const breadcrumbs = await findByTestId('breadcrumbs');

  expect(breadcrumbs).not.toHaveTextContent('Home');
});
