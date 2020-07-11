import { getFolder, listObjectsResponseToFolder } from './s3';
import AWS from 'aws-sdk';

jest.mock('aws-sdk');

test('returns the path components', async () => {
  const listObjectsResponse = {
    CommonPrefixes: [],
    Contents: [],
  };
  
  const folder = listObjectsResponseToFolder('Concerts/2020/Test/', listObjectsResponse);
  expect(folder.pathComponents).toEqual([
    {
      path: '/Concerts',
      name: 'Concerts',
    },
    {
      path: '/Concerts/2020',
      name: '2020',
    },
    {
      path: '/Concerts/2020/Test',
      name: 'Test',
    }
  ])
});
