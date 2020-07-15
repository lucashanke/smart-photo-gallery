import { Folder } from '../models';
import { CommonPrefix } from 'aws-sdk/clients/s3';
import { s3 } from './config';

const bucketName = 'pittystop-gallery-photos';
const thumbnailBucketName = 'pittystop-gallery-thumbnails';

const getChildName = (prefix: CommonPrefix, path: string) => {
  return prefix.Prefix!.replace(path, '').replace('/', '');
};

const getPathName = (path) => {
  const names = path.split('/');
  if (names.length > 1) {
    return names[names.length - 2];
  }
  return "";
}

export const getThumbnailUrl = (key: string) => 'https://' + thumbnailBucketName + '.s3.amazonaws.com/' + key;
export const getImageUrl = (key: string) => 'https://' + bucketName + '.s3.amazonaws.com/' + key;

const listObjectsResponseToFolder = (path: string, data: AWS.S3.Types.ListObjectsV2Output): Folder => ({
  path,
  name: getPathName(path),
  children: data.CommonPrefixes?.map(element => ({
    name: getChildName(element, path),
    path: element.Prefix!,
  })),
  content: data.Contents?.map(content => content.Key!).filter(key => {
    return key.toLowerCase().endsWith('jpg') || key.toLowerCase().endsWith('jpeg') || key.toLowerCase().endsWith('png')
  }),
});

export const getFolder = (path: string = ''): Promise<Folder> => {
  const params = {
    Bucket: thumbnailBucketName,
    Delimiter: '/',
    Prefix: path === '/' ? '' : path,
  };

  return new Promise((resolve, reject) => {
    s3.listObjectsV2(params, function (err, data) {
      if (err) {
        reject(err);
        return;
      }

      resolve(listObjectsResponseToFolder(path, data));
    });
  });
};
