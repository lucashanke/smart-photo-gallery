import React from 'react';
import { getFolder, getImageUrl } from '../../aws/s3';
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

    return loading ? <span>Loading...</span> : <>
        <h1>{folder?.name}</h1>
        {folder?.children?.map(child => <Link to={`${url}/${child.name}`}>{child.name}</Link>)}
        {folder?.content?.map(key => <img src={getImageUrl(key)} />)}
    </>;
}

export default FolderComponent;