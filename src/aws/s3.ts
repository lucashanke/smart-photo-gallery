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

const getPathComponents = (path) => {
  const pathComponents = path.split('/').filter(component => component !== '');
  let currentPath = '';
  return pathComponents.map(element => {
    currentPath = `${currentPath}/${element}`;
    return {
      name: element,
      path: currentPath
    };
  });
}

export const getThumbnailUrl = (key: string) => 'https://' + thumbnailBucketName + '.s3.amazonaws.com/' + key;
export const getImageUrl = (key: string) => 'https://' + bucketName + '.s3.amazonaws.com/' + key;

export const listObjectsResponseToFolder = (path: string, data: AWS.S3.Types.ListObjectsV2Output) => ({
  path,
  name: getPathName(path),
  pathComponents: getPathComponents(path),
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
}
