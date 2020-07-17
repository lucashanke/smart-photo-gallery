import AWS from 'aws-sdk';

AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:ba31fc5b-17d8-46c9-acd0-e491baeb684d',
});

export const bucketName = 'pittystop-gallery-photos';
export const thumbnailBucketName = 'pittystop-gallery-thumbnails';

export const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    region: 'sa-east-1',
});