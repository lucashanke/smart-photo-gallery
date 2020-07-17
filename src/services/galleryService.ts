import { Folder, S3Folder, Photo } from "../models";
import { getFolder as getFolderS3 } from "../aws/s3";
import { thumbnailBucketName, bucketName } from "../aws/config";

const getThumbnailUrl = (key: string) => 'https://' + thumbnailBucketName + '.s3.amazonaws.com/' + key;
const getImageUrl = (key: string) => 'https://' + bucketName + '.s3.amazonaws.com/' + key;

const mapS3ItemToPhoto = (key: string): Photo => {
  return {
    path: key,
    filename: key.split('/').pop() || key,
    url: getImageUrl(key),
    thumbnailUrl: getThumbnailUrl(key)
  }
};

const mapS3FolderToGalleryFolder = (s3folder: S3Folder): Folder => {
  const creditsFileKey = s3folder.content?.find(key => key.endsWith('credits.txt'));
  return {
    path: s3folder.path,
    name: s3folder.name,
    photos: s3folder.content?.filter(key => !key.endsWith('cover.jpg') && !key.endsWith('credits.txt')).map(mapS3ItemToPhoto),
    children: s3folder.children?.map(mapS3FolderToGalleryFolder),
    creditsFileUrl: creditsFileKey ? getImageUrl(creditsFileKey) : undefined
  }
}

export const getFolder = async (path: string = ''): Promise<Folder> => {
    const s3folder = await getFolderS3(path);
    return mapS3FolderToGalleryFolder(s3folder);
};
