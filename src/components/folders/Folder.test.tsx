import React from 'react';
import { render } from '@testing-library/react';
import FolderComponent from './Folder';
import { getFolder } from '../../aws/s3'
import { Folder } from '../../models';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../aws/s3');

const subfolder = {
  path: 'Subfolder 1/',
  name: 'Subfolder 1'
};
const folderWithSubfolder = {
  path: '/',
  name: '',
  children: [
    subfolder
  ],
};

test('shows the subfolders', async () => {
  getFolder.mockResolvedValue(folderWithSubfolder);

  const { findByText } = render(<MemoryRouter><FolderComponent /></MemoryRouter>);
  const subfolderElement = await findByText(/Subfolder 1/i);
  expect(subfolderElement).toBeInTheDocument();
});

// test('loads the subfolder when clicking', async () => {
//   getFolder.mockResolvedValueOnce(folderWithSubfolder);
//   getFolder.mockResolvedValueOnce(subfolder);

//   const { findByText, findByTestId } = render(<MemoryRouter><FolderComponent /></MemoryRouter>);
//   const subfolderElement = await findByText(/Subfolder 1/i);
//   subfolderElement.click();

//   const folderTitleElement = await findByTestId('folder-name');

//   await waitFor(() => )
//   expect(folderTitleElement).toHaveTextContent('Subfolder 1');
// });
