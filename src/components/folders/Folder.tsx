import React from 'react';
import path from 'path-browserify';
import ImageGallery from 'react-image-gallery';
import { Folder } from '../../models';
import { Link, useLocation, useHistory } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import { getFolder } from '../../services/galleryService';
import { getThumbnailUrl } from '../../aws/s3';
import Credits from './Credits';

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
        setPhotos(folderReponse.photos?.map(photo => ({
            original: photo.url,
            thumbnail: photo.thumbnailUrl,
            filename: photo.filename,
        })) || []);
        setLoading(false);
    };

    React.useEffect(() => {
        fetchFolders(currentPath);
    }, [currentPath]);

    return loading ? <div className="loader" data-testid="loader">Carregando...</div> : <div className="folder">
        <Breadcrumbs path={folder?.path || ''} />

        <h1>{folder?.name || 'Categorias'}</h1>

        <ul className="subfolders">
            {folder?.children?.map((child, index) => <li key={child.name}>
                <Link to={path.join(location.pathname, child.name)}>
                    <img src={getThumbnailUrl(`${child.path}cover.jpg`)} onError={(e) => (e.target as HTMLImageElement).src = FOLDER_ICON } alt={child.name} className="cover" id={`cover-${index}`} />
                    {child.name}
                </Link>
            </li>)}
        </ul>

        <div className="contents">
            {folder?.creditsFileUrl && <Credits url={folder.creditsFileUrl} />}

            {photos.length > 0 && <ImageGallery items={photos} showIndex slideDuration={0} lazyLoad startIndex={getCurrentPhotoIndex()} onBeforeSlide={(nextIndex: number) => {
                const currentPhoto = photos[nextIndex];
                history.push({ ...location, hash: `#${currentPhoto.filename}`});
            }} />}
        </div>
    </div>;
}

export default FolderComponent;