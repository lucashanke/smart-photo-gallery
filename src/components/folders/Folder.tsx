import React from 'react';
import { getFolder, getThumbnailUrl } from '../../aws/s3';
import { Folder } from '../../models';
import { useRouteMatch, Link } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';

const FOLDER_ICON = '/folder.png';

const FolderComponent: React.FunctionComponent = () => {
    const { url } = useRouteMatch();
    const [loading, setLoading] = React.useState<boolean>(true);
    const [folder, setFolder] = React.useState<Folder | undefined>(undefined);

    const path = `${url.replace(/\/folder(\/?)/, '')}/`;

    const fetchFolders = async (path) => {
        setLoading(true);
        setFolder(await getFolder(path));
        setLoading(false);
    };

    React.useEffect(() => {
        fetchFolders(path);
    }, [path]);

    return loading ? <span>Loading...</span> : <div className="folder">
        <Breadcrumbs pathComponents={folder?.pathComponents} />

        <h1 data-testid="folder-name">{folder?.name || 'Categorias'}</h1>

        <ul className="subfolders">
            {folder?.children?.map((child, index) => <li key={child.name}>
                <Link to={`${url}/${child.name}`}>
                    {/* <object data={getThumbnailUrl(`${path}${child.name}/cover.jpg`)} type="image/jpeg" className="cover">
                    </object> */}
                    <img src={getThumbnailUrl(`${path}${child.name}/cover.jpg`)} onError={(e) => (e.target as HTMLImageElement).src = FOLDER_ICON } alt={child.name} className="cover" id={`cover-${index}`} />

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