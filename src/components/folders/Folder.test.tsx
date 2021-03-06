import React from 'react';
import { render, waitForElementToBeRemoved, act, screen } from '@testing-library/react';
import FolderComponent from './Folder';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

jest.mock('../../aws/config');

describe('<Folder>', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      text: jest.fn().mockResolvedValue('Credits')
    });
  });

  it('displays a loading message and eventually shows all the subfolders', async () => {
    render(<MemoryRouter><FolderComponent /></MemoryRouter>);
    const loader = screen.getByTestId('loader');
    expect(loader).toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.getByTestId('loader'));

    expect(screen.getByRole('heading')).toHaveTextContent('Categorias');
    expect(screen.getByText(/Category 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Category 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Category 3/i)).toBeInTheDocument();
  });

  it('loads the subfolder when clicking', async () => {
    render(<MemoryRouter><FolderComponent /></MemoryRouter>);

    await act(async () => {
      const categoryFolder = await screen.findByText(/Category 1/i);
      categoryFolder.click();
    });

    expect(screen.getByRole('heading')).toHaveTextContent('Category 1');
    expect(screen.getByText(/SubCategory 11/i)).toBeInTheDocument();
    expect(screen.getByText(/SubCategory 12/i)).toBeInTheDocument();
  });

  it.each([
    ['/', 'Categorias', ['Category 1', 'Category 2', 'Category 3']],
    ['/Category 1', 'Category 1', ['SubCategory 11', 'SubCategory 12']],
    ['/Category 1/', 'Category 1', ['SubCategory 11', 'SubCategory 12']],
    ['/Category 1/SubCategory 11', 'SubCategory 11', []],
  ])('loads the folder with the correct prefix when page url is %s', async (pageUrl, expectedHeader, expectedSubFolders) => {
    render(<MemoryRouter initialEntries={[pageUrl]}><FolderComponent /></MemoryRouter>);
    await waitForElementToBeRemoved(() => screen.getByTestId('loader'));

    expect(screen.getByRole('heading')).toHaveTextContent(expectedHeader);
    expectedSubFolders.forEach((expectedSubFolder) => {
      const subfolder = screen.getByText(expectedSubFolder);
      expect(subfolder).toBeInTheDocument();
      expect(subfolder).toHaveAttribute('href');
    });
  });

  it('loads the photo gallery when folder has contents', async () => {
    render(<MemoryRouter initialEntries={['/Category 1/SubCategory 11']}><FolderComponent /></MemoryRouter>);

    await waitForElementToBeRemoved(() => screen.getByTestId('loader'));

    expect(screen.getAllByRole('img')[0]).toHaveAttribute('src', expect.stringContaining('Category 1/SubCategory 11/photo111.jpg'));
  });

  it('sets the hash of the photo on url when navigating the photo gallery', async () => {
    const history = createMemoryHistory();
    history.push('/Category 2/SubCategory 22');
    render(<Router history={history}><FolderComponent /></Router>);

    await waitForElementToBeRemoved(() => screen.getByTestId('loader'));

    screen.getAllByRole('img')[4].click();

    expect(history.location.hash).toEqual('#photo222.jpg');
  });

  it('shows the credits of the folder when it exists', async () => {
    render(<MemoryRouter initialEntries={['/Category 3']}><FolderComponent /></MemoryRouter>);

    await waitForElementToBeRemoved(() => screen.getByTestId('loader'));

    expect(screen.getByTestId('credits')).toBeInTheDocument();
  });

  it('does not show the credits of the folder when it does not exist', async () => {
    render(<MemoryRouter initialEntries={['/']}><FolderComponent /></MemoryRouter>);

    await waitForElementToBeRemoved(() => screen.getByTestId('loader'));

    expect(screen.queryByTestId('credits')).toBeNull();
  });
});
