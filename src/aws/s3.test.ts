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
      { name: 'category1', path: 'category1/' },
      { name: 'category2', path: 'category2/' },
      { name: 'category3', path: 'category3/' },
    ],
  }],
  ['category1/', {
    path: 'category1/',
    name: 'category1',
    parents: [{
      path: '/category1',
      name: 'category1',
    }],
    content: [],
    children: [
      { name: 'subCategory11', path: 'category1/subCategory11/' },
      { name: 'subCategory12', path: 'category1/subCategory12/' },
    ],
  }],
  ['category1/subCategory11/', {
    path: 'category1/subCategory11/',
    name: 'subCategory11',
    parents: [{
      path: '/category1',
      name: 'category1',
    }, {
      path: '/category1/subCategory11',
      name: 'subCategory11',
    }],
    content: ['category1/subCategory11/photo111.jpg'],
    children: [],
  }],
  ['category1/subCategory12/', {
    path: 'category1/subCategory12/',
    name: 'subCategory12',
    parents: [{
      path: '/category1',
      name: 'category1',
    }, {
      path: '/category1/subCategory12',
      name: 'subCategory12',
    }],
    content: ['category1/subCategory12/photo121.jpg', 'category1/subCategory12/photo122.jpg'],
    children: [],
  }],
  ['category2/', {
    path: 'category2/',
    name: 'category2',
    parents: [{
      path: '/category2',
      name: 'category2',
    }],
    content: [],
    children: [
      { name: 'subCategory21', path: 'category2/subCategory21/' },
      { name: 'subCategory22', path: 'category2/subCategory22/' },
    ],
  }],
  ['category2/subCategory21/', {
    path: 'category2/subCategory21/',
    name: 'subCategory21',
    parents: [{
      path: '/category2',
      name: 'category2',
    }, {
      path: '/category2/subCategory21',
      name: 'subCategory21',
    }],
    content: [],
    children: [],
  }],
  ['category2/subCategory22/', {
    path: 'category2/subCategory22/',
    name: 'subCategory22',
    parents: [{
      path: '/category2',
      name: 'category2',
    }, {
      path: '/category2/subCategory22',
      name: 'subCategory22',
    }],
    content: ['category2/subCategory22/photo221.jpg', 'category2/subCategory22/photo222.jpg', 'category2/subCategory22/photo223.jpg'],
    children: [],
  }],
  ['category3/', {
    path: 'category3/',
    name: 'category3',
    parents: [{
      path: '/category3',
      name: 'category3',
    }],
    content: ['category3/photo31.jpg', 'category3/photo32.jpg', 'category3/photo33.jpg'],
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

