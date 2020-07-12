import React from 'react';
import { render, waitForElementToBeRemoved, act } from '@testing-library/react';
import FolderComponent from './Folder';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../aws/config');

describe('<Folder>', () => {
  it('displays a loading message and eventually shows all the subfolders', async () => {
    const { getByText, getByRole } = render(<MemoryRouter><FolderComponent /></MemoryRouter>);
    const loading = getByText(/loading/i);
    expect(loading).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(/loading/i));

    expect(getByRole('heading')).toHaveTextContent('Categorias');
    expect(getByText(/Category 1/i)).toBeInTheDocument();
    expect(getByText(/Category 2/i)).toBeInTheDocument();
    expect(getByText(/Category 3/i)).toBeInTheDocument();
  });

  it('loads the subfolder when clicking', async () => {
    const { getByRole, findByText, getByText } = render(<MemoryRouter><FolderComponent /></MemoryRouter>);

    await act(async () => {
      const categoryFolder = await findByText(/Category 1/i);
      categoryFolder.click();
    });

    expect(getByRole('heading')).toHaveTextContent('Category 1');
    expect(getByText(/SubCategory 11/i)).toBeInTheDocument();
    expect(getByText(/SubCategory 12/i)).toBeInTheDocument();
  });

  it.each([
    ['/', 'Categorias', ['Category 1', 'Category 2', 'Category 3']],
    ['/Category 1', 'Category 1', ['SubCategory 11', 'SubCategory 12']],
    ['/Category 1/', 'Category 1', ['SubCategory 11', 'SubCategory 12']],
    ['/Category 1/SubCategory 11', 'SubCategory 11', []],
  ])('loads the folder with the correct prefix when page url is %s', async (pageUrl, expectedHeader, expectedSubFolders) => {
    const { getByText, getByRole } = render(<MemoryRouter initialEntries={[pageUrl]}><FolderComponent /></MemoryRouter>);

    await waitForElementToBeRemoved(() => getByText(/loading/i));

    expect(getByRole('heading')).toHaveTextContent(expectedHeader);
    expectedSubFolders.forEach((expectedSubFolder) => {
      const subfolder = getByText(expectedSubFolder);
      expect(subfolder).toBeInTheDocument();
      expect(subfolder).toHaveAttribute('href');
    });
  });
});
