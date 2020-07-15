import React from 'react';
import path from 'path-browserify';
import ImageGallery from 'react-image-gallery';
import { getFolder, getThumbnailUrl, getImageUrl } from '../../aws/s3';
import { Folder } from '../../models';
import { Link, useLocation, useHistory } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';

const FOLDER_ICON = '/folder.png';

const FolderComponent: React.FunctionComponent = () => {
    const location = useLocation();
    const history = useHistory();
    const [loading, setLoading] = React.useState<boolean>(true);
    const [folder, setFolder] = React.useState<Folder | undefined>(undefined);
    const [photos, setPhotos] = React.useState<any[]>([]);
    const currentPath = location.pathname.replace(/\/(.+)\/$|\/(.+)$/, '$1$2/');

    const getCurrentPhotoIndex = () => {
        if (location.hash === '') return 0;
        const filename = location.hash.substr(1);
        const index = photos.findIndex(photo => photo.filename === filename);
        return index === -1 ? 0 : index;
    };

    const fetchFolders = async (path) => {
        setLoading(true);
        const folderReponse = await getFolder(path);
        setFolder(folderReponse);
        if (folderReponse?.content) {
            setPhotos(folderReponse.content.filter(key => !key.endsWith('cover.jpg')).map(key => ({
                original: getImageUrl(key),
                thumbnail: getThumbnailUrl(key),
                filename: key.split('/').pop(),
            })));
        }
        setLoading(false);
    };

    React.useEffect(() => {
        fetchFolders(currentPath);
    }, [currentPath]);

    return loading ? <span>Loading...</span> : <div className="folder">
        <Breadcrumbs path={folder?.path || ''} />

        <h1>{folder?.name || 'Categorias'}</h1>

        <ul className="subfolders">
            {folder?.children?.map((child, index) => <li key={child.name}>
                <Link to={path.join(location.pathname, child.name)}>
                    <img src={getThumbnailUrl(`${currentPath}${child.name}/cover.jpg`)} onError={(e) => (e.target as HTMLImageElement).src = FOLDER_ICON } alt={child.name} className="cover" id={`cover-${index}`} />
                    {child.name}
                </Link>
            </li>)}
        </ul>

        <div className="contents">
            {photos.length > 0 && <ImageGallery items={photos} showIndex slideDuration={0} lazyLoad startIndex={getCurrentPhotoIndex()} onBeforeSlide={(nextIndex: number) => {
                const currentPhoto = photos[nextIndex];
                history.push({ ...location, hash: `#${currentPhoto.filename}`});
            }} />}
        </div>
    </div>;
}

export default FolderComponent;