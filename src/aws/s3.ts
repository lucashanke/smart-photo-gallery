import { S3Folder } from '../models';
import { CommonPrefix } from 'aws-sdk/clients/s3';
import { s3, thumbnailBucketName, bucketName } from './config';

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

const listObjectsResponseToFolder = (path: string, data: AWS.S3.Types.ListObjectsV2Output): S3Folder => ({
  path,
  name: getPathName(path),
  children: data.CommonPrefixes?.map(element => ({
    name: getChildName(element, path),
    path: element.Prefix!,
  })),
  content: data.Contents?.map(content => content.Key!),
});

export const getFolder = (path: string = ''): Promise<S3Folder> => {
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
