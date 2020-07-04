import AWS from 'aws-sdk';
import { Folder } from '../models';
import { CommonPrefix } from 'aws-sdk/clients/s3';

AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'us-east-1:ba31fc5b-17d8-46c9-acd0-e491baeb684d',
});

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: 'sa-east-1',
});
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

      resolve({
        path,
        name: getPathName(path),
        children: data.CommonPrefixes?.map(element => ({
          name: getChildName(element, path),
          path: element.Prefix!,
        })),
        content: data.Contents?.map(content => content.Key!).filter(key => key.endsWith('jpg')),
      });
    });
  });
}
