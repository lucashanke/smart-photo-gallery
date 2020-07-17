import { isArray } from "util";

export const bucketName = 'test-gallery-photos';
export const thumbnailBucketName = 'test-gallery-thumbnails';

const mockedBucketContent = {
    'Category 1': {
        'SubCategory 11': ['photo111.jpg'],
        'SubCategory 12': ['photo121.jpg', 'photo122.jpg', 'cover.jpg'],
    },
    'Category 2': {
        'SubCategory 21': [],
        'SubCategory 22': ['photo221.jpg', 'photo222.jpg', 'photo223.jpg'],
    },
    'Category 3': ['photo31.jpg', 'photo32.jpg', 'photo33.jpg', 'credits.txt']
};

const getListObjectsOutput = (prefix?: string): AWS.S3.Types.ListObjectsV2Output => {
    const content = prefix && prefix.length > 0 ? prefix.split('/').filter(field => field).reduce((o, i) => o[i], mockedBucketContent) : mockedBucketContent;

    if (content) {
        if (isArray(content)) {
            return {
                CommonPrefixes: [],
                Contents: content.map((file) => ({ Key: `${prefix}${file}` })),
            };
        } else {
            return {
                CommonPrefixes: Object.keys(content).map(folder => ({ Prefix: prefix ? `${prefix}${folder}/` : `${folder}/` })),
                Contents: [],
            };
        }
    } else {
        return {
            CommonPrefixes: [],
            Contents: [],
        };
    }
}

export const s3 = {
    listObjectsV2: jest.fn((
        params: AWS.S3.Types.ListObjectsV2Request,
        callback: (err, data: AWS.S3.Types.ListObjectsV2Output) => void
    ) => {
        const { Delimiter, Bucket, Prefix } = params;
        if (Delimiter !== '/') {
            callback('Delimiter should be / to get only a level down of folders', {});
            return;
        }

        if (!Bucket) {
            callback('Bucket name should be informed', {});
            return;
        }

        if (!(Prefix === '' || (Prefix !== '/' && Prefix!.endsWith('/')))) {
            callback('Prefix should be either empty or end with a slash after a named path eg: folder/', {});
            return;
        }

        callback(undefined, getListObjectsOutput(Prefix));
    }),
};