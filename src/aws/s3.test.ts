import { getFolder } from './s3';
import { s3 } from './config';

jest.mock('./config.ts');

const expectedFolders = [
  ['/', {
    path: '/',
    name: '',
    parents: [],
    content: [],
    children: [
      { name: 'Category 1', path: 'Category 1/' },
      { name: 'Category 2', path: 'Category 2/' },
      { name: 'Category 3', path: 'Category 3/' },
    ],
  }],
  ['Category 1/', {
    path: 'Category 1/',
    name: 'Category 1',
    parents: [{
      path: '/Category 1',
      name: 'Category 1',
    }],
    content: [],
    children: [
      { name: 'SubCategory 11', path: 'Category 1/SubCategory 11/' },
      { name: 'SubCategory 12', path: 'Category 1/SubCategory 12/' },
    ],
  }],
  ['Category 1/SubCategory 11/', {
    path: 'Category 1/SubCategory 11/',
    name: 'SubCategory 11',
    parents: [{
      path: '/Category 1',
      name: 'Category 1',
    }, {
      path: '/Category 1/SubCategory 11',
      name: 'SubCategory 11',
    }],
    content: ['Category 1/SubCategory 11/photo111.jpg'],
    children: [],
  }],
  ['Category 1/SubCategory 12/', {
    path: 'Category 1/SubCategory 12/',
    name: 'SubCategory 12',
    parents: [{
      path: '/Category 1',
      name: 'Category 1',
    }, {
      path: '/Category 1/SubCategory 12',
      name: 'SubCategory 12',
    }],
    content: ['Category 1/SubCategory 12/photo121.jpg', 'Category 1/SubCategory 12/photo122.jpg'],
    children: [],
  }],
  ['Category 2/', {
    path: 'Category 2/',
    name: 'Category 2',
    parents: [{
      path: '/Category 2',
      name: 'Category 2',
    }],
    content: [],
    children: [
      { name: 'SubCategory 21', path: 'Category 2/SubCategory 21/' },
      { name: 'SubCategory 22', path: 'Category 2/SubCategory 22/' },
    ],
  }],
  ['Category 2/SubCategory 21/', {
    path: 'Category 2/SubCategory 21/',
    name: 'SubCategory 21',
    parents: [{
      path: '/Category 2',
      name: 'Category 2',
    }, {
      path: '/Category 2/SubCategory 21',
      name: 'SubCategory 21',
    }],
    content: [],
    children: [],
  }],
  ['Category 2/SubCategory 22/', {
    path: 'Category 2/SubCategory 22/',
    name: 'SubCategory 22',
    parents: [{
      path: '/Category 2',
      name: 'Category 2',
    }, {
      path: '/Category 2/SubCategory 22',
      name: 'SubCategory 22',
    }],
    content: ['Category 2/SubCategory 22/photo221.jpg', 'Category 2/SubCategory 22/photo222.jpg', 'Category 2/SubCategory 22/photo223.jpg'],
    children: [],
  }],
  ['Category 3/', {
    path: 'Category 3/',
    name: 'Category 3',
    parents: [{
      path: '/Category 3',
      name: 'Category 3',
    }],
    content: ['Category 3/photo31.jpg', 'Category 3/photo32.jpg', 'Category 3/photo33.jpg'],
    children: [],
  }],
];

describe('getFolder', () => {
  it.each(expectedFolders)('should map folders of \'%s\' path correctly', async (path, expected) => {

    expect(await getFolder(path as string)).toEqual(expected);

    expect(s3.listObjectsV2).toBeCalledWith(
      expect.objectContaining({
        Prefix: path === '/' ? '' : path,
        Delimiter: '/',
        Bucket: expect.any(String),
      }), expect.any(Function));
  });
})

