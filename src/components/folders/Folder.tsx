import React from 'react';
import path from 'path-browserify';
import { getFolder, getThumbnailUrl } from '../../aws/s3';
import { Folder } from '../../models';
import { Link, useLocation } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';

const FOLDER_ICON = '/folder.png';

const FolderComponent: React.FunctionComponent = () => {
    const { pathname } = useLocation();
    const [loading, setLoading] = React.useState<boolean>(true);
    const [folder, setFolder] = React.useState<Folder | undefined>(undefined);
    const currentPath = pathname.replace(/\/(.+)\/$|\/(.+)$/, '$1$2/');

    const fetchFolders = async (path) => {
        setLoading(true);
        setFolder(await getFolder(path));
        setLoading(false);
    };

    React.useEffect(() => {
        fetchFolders(currentPath);
    }, [currentPath]);

    return loading ? <span>Loading...</span> : <div className="folder">
        <Breadcrumbs pathComponents={folder?.parents} />

        <h1 data-testid="folder-name">{folder?.name || 'Categorias'}</h1>

        <ul className="subfolders">
            {folder?.children?.map((child, index) => <li key={child.name}>
                <Link to={path.join(pathname, child.name)}>
                    <img src={getThumbnailUrl(`${currentPath}${child.name}/cover.jpg`)} onError={(e) => (e.target as HTMLImageElement).src = FOLDER_ICON } alt={child.name} className="cover" id={`cover-${index}`} />
                    {child.name}
                </Link>
            </li>)}
        </ul>

        <ul className="contents">
            {folder?.content?.map(key => <li key={key}>
                <Link to={`/photo/${key}`}>
                    <img src={getThumbnailUrl(key)} alt="" />
                </Link>
            </li>)}
        </ul>
    </div>;
}

export default FolderComponent;