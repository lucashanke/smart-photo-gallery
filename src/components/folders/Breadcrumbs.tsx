import React from 'react';
import { Folder } from '../../models';
import { Link } from 'react-router-dom';

const Breadcrumbs: React.FunctionComponent<{
    pathComponents?: Folder[];
}> = (props) => {
    return <ul className="breadcrumb" data-testid="breadcrumbs">
        {props.pathComponents && props.pathComponents.length > 0 && <li key="home">
            <Link to="/">Home</Link>
        </li>}
        {props.pathComponents?.map((pathComponent, index, list) => <li key={pathComponent.path}>
            {index !== (list.length - 1) ? <Link to={`${pathComponent.path}`}>{pathComponent.name}</Link> : pathComponent.name}
        </li>)}
    </ul>;
}

export default Breadcrumbs;
