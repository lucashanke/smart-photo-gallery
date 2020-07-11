export interface Folder {
    path: string;
    name: string;
    pathComponents?: PathComponent[];
    content?: string[];
    children?: Folder[],
}

export interface PathComponent {
    path: string;
    name: string;
}
