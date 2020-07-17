import { getFolder } from "./galleryService";

jest.mock('../aws/config');

describe('getFolder', () => {
  it('maps the S3 folder to a gallery folder including children', async () => {
    expect(await getFolder('Category 1/')).toEqual({
      path: 'Category 1/',
      name: 'Category 1',
      children: [
        { name: 'SubCategory 11', path: 'Category 1/SubCategory 11/' },
        { name: 'SubCategory 12', path: 'Category 1/SubCategory 12/' },
      ],
      photos: []
    });
  });

  it('maps the photos correctly when there are photos', async () => {
    expect(await getFolder('Category 1/SubCategory 11/')).toEqual({
      path: 'Category 1/SubCategory 11/',
      name: 'SubCategory 11',
      photos: [
        {
          path: 'Category 1/SubCategory 11/photo111.jpg',
          filename: 'photo111.jpg',
          url: 'https://test-gallery-photos.s3.amazonaws.com/Category 1/SubCategory 11/photo111.jpg',
          thumbnailUrl: 'https://test-gallery-thumbnails.s3.amazonaws.com/Category 1/SubCategory 11/photo111.jpg'
        }
      ],
      children: []
    });
  });

  it('maps the photos correctly excluding cover photos', async () => {
    expect(await getFolder('Category 1/SubCategory 12/')).toEqual({
      path: 'Category 1/SubCategory 12/',
      name: 'SubCategory 12',
      photos: [
        {
          path: 'Category 1/SubCategory 12/photo121.jpg',
          filename: 'photo121.jpg',
          url: 'https://test-gallery-photos.s3.amazonaws.com/Category 1/SubCategory 12/photo121.jpg',
          thumbnailUrl: 'https://test-gallery-thumbnails.s3.amazonaws.com/Category 1/SubCategory 12/photo121.jpg'
        },
        {
          path: 'Category 1/SubCategory 12/photo122.jpg',
          filename: 'photo122.jpg',
          url: 'https://test-gallery-photos.s3.amazonaws.com/Category 1/SubCategory 12/photo122.jpg',
          thumbnailUrl: 'https://test-gallery-thumbnails.s3.amazonaws.com/Category 1/SubCategory 12/photo122.jpg'
        }
      ],
      children: []
    });
  });

  it('maps the credits correctly excluding credits file from photos', async () => {
    expect(await getFolder('Category 3/')).toEqual({
      path: 'Category 3/',
      name: 'Category 3',
      photos: [
        {
          path: 'Category 3/photo31.jpg',
          filename: 'photo31.jpg',
          url: 'https://test-gallery-photos.s3.amazonaws.com/Category 3/photo31.jpg',
          thumbnailUrl: 'https://test-gallery-thumbnails.s3.amazonaws.com/Category 3/photo31.jpg'
        },
        {
          path: 'Category 3/photo32.jpg',
          filename: 'photo32.jpg',
          url: 'https://test-gallery-photos.s3.amazonaws.com/Category 3/photo32.jpg',
          thumbnailUrl: 'https://test-gallery-thumbnails.s3.amazonaws.com/Category 3/photo32.jpg'
        },
        {
          path: 'Category 3/photo33.jpg',
          filename: 'photo33.jpg',
          url: 'https://test-gallery-photos.s3.amazonaws.com/Category 3/photo33.jpg',
          thumbnailUrl: 'https://test-gallery-thumbnails.s3.amazonaws.com/Category 3/photo33.jpg'
        },
      ],
      creditsFileUrl: 'https://test-gallery-photos.s3.amazonaws.com/Category 3/credits.txt',
      children: []
    });
  });
});
