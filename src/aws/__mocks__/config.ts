import { isArray } from "util";

const mockedBucketContent = {
    category1: {
        subCategory11: ['photo111.jpg'],
        subCategory12: ['photo121.jpg', 'photo122.jpg'],
    },
    category2: {
        subCategory21: [],
        subCategory22: ['photo221.jpg', 'photo222.jpg', 'photo223.jpg'],
    },
    category3: ['photo31.jpg', 'photo32.jpg', 'photo33.jpg']
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