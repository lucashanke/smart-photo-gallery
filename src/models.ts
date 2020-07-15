export interface Folder {
    path: string;
    name: string;
    content?: string[];
    children?: Folder[],
}
