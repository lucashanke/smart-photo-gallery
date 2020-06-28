import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders categories link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/categorias/i);
  expect(linkElement).toBeInTheDocument();
});
