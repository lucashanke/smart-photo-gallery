import React from 'react';
import { getFolder, getThumbnailUrl } from '../../aws/s3';
import { Folder } from '../../models';
import { useRouteMatch, Link } from 'react-router-dom';

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
        <h1>{folder?.name}</h1>

        <ul className="subfolders">
            {folder?.children?.map(child => <li><Link to={`${url}/${child.name}`} key={child.name}>{child.name}</Link></li>)}
        </ul>

        <ul className="contents">
            {folder?.content?.map(key => <li>
                <Link to={`/photo/${key}`} key={key}>
                    <img src={getThumbnailUrl(key)} alt="" />
                </Link>
            </li>)}
        </ul>
    </div>;
}

export default FolderComponent;