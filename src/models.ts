export interface Folder {
    path: string;
    name: string;
    parents?: Folder[];
    content?: string[];
    children?: Folder[],
}
