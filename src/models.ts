export interface S3Folder {
    path: string;
    name: string;
    content?: string[];
    children?: S3Folder[];
}

export interface Folder {
    path: string;
    name: string;
    photos?: Photo[];
    children?: Folder[];
    creditsFilePath?: string;
}

export interface Photo {
    path: string;
    filename: string;
    url: string;
    thumbnailUrl: string;
}
