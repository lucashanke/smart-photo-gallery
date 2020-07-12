import React from 'react';
import path from 'path-browserify';
import ImageGallery from 'react-image-gallery';
import { getFolder, getThumbnailUrl, getImageUrl } from '../../aws/s3';
import { Folder } from '../../models';
import { Link, useLocation } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';

const FOLDER_ICON = '/folder.png';

const FolderComponent: React.FunctionComponent = () => {
    const { pathname } = useLocation();
    const [loading, setLoading] = React.useState<boolean>(true);
    const [folder, setFolder] = React.useState<Folder | undefined>(undefined);
    const [photos, setPhotos] = React.useState<any[]>([]);
    const currentPath = pathname.replace(/\/(.+)\/$|\/(.+)$/, '$1$2/');

    const fetchFolders = async (path) => {
        setLoading(true);
        const folderReponse = await getFolder(path);
        setFolder(folderReponse);
        if (folderReponse?.content) {
            setPhotos(folderReponse.content.filter(key => !key.endsWith('cover.jpg')).map(key => ({
                original: getImageUrl(key),
                thumbnail: getThumbnailUrl(key),
            })));
        }
        setLoading(false);
    };

    React.useEffect(() => {
        fetchFolders(currentPath);
    }, [currentPath]);

    return loading ? <span>Loading...</span> : <div className="folder">
        <Breadcrumbs pathComponents={folder?.parents} />

        <h1>{folder?.name || 'Categorias'}</h1>

        <ul className="subfolders">
            {folder?.children?.map((child, index) => <li key={child.name}>
                <Link to={path.join(pathname, child.name)}>
                    <img src={getThumbnailUrl(`${currentPath}${child.name}/cover.jpg`)} onError={(e) => (e.target as HTMLImageElement).src = FOLDER_ICON } alt={child.name} className="cover" id={`cover-${index}`} />
                    {child.name}
                </Link>
            </li>)}
        </ul>

        <div className="contents">
            {photos.length > 0 && <ImageGallery items={photos} showIndex slideDuration={0} lazyLoad />}
        </div>
    </div>;
}

export default FolderComponent;