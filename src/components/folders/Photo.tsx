import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { getImageUrl } from '../../aws/s3';

const PhotoComponent: React.FunctionComponent = () => {
    const { url } = useRouteMatch();
    const imageKey = `${url.replace(/\/photo(\/?)/, '')}`;

    return <div className="photo">
        <img src={getImageUrl(imageKey)} alt="" />
    </div>;
}

export default PhotoComponent;