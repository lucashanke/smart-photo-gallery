import React from 'react';
import { render, waitForElementToBeRemoved, act } from '@testing-library/react';
import FolderComponent from './Folder';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

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

  it('loads the photo gallery when folder has contents', async () => {
    const { getByText, getAllByRole } = render(<MemoryRouter initialEntries={['/Category 1/SubCategory 11']}><FolderComponent /></MemoryRouter>);

    await waitForElementToBeRemoved(() => getByText(/Loading/i));

    expect(getAllByRole('img')[0]).toHaveAttribute('src', expect.stringContaining('Category 1/SubCategory 11/photo111.jpg'));
  });

  it('sets the hash of the photo on url when navigating the photo gallery', async () => {
    const history = createMemoryHistory();
    history.push('/Category 2/SubCategory 22');
    const { getByText, getAllByRole } = render(<Router history={history}><FolderComponent /></Router>);

    await waitForElementToBeRemoved(() => getByText(/Loading/i));

    getAllByRole('img')[4].click();

    expect(history.location.hash).toEqual('#photo222.jpg');
  });
});
