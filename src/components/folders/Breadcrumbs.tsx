import React from 'react';
import { PathComponent } from '../../models';
import { Link } from 'react-router-dom';

const Breadcrumbs: React.FunctionComponent<{
    pathComponents?: PathComponent[];
}> = (props) => {
    return <ul className="breadcrumb" data-testid="breadcrumbs">
        {props.pathComponents && props.pathComponents.length > 0 && <li key="home">
            <Link to="/folder">Home</Link>
        </li>}
        {props.pathComponents?.map((pathComponent, index, list) => <li key={pathComponent.path}>
            {index !== (list.length - 1) ? <Link to={`/folder${pathComponent.path}`}>{pathComponent.name}</Link> : pathComponent.name}
        </li>)}
    </ul>;
}

export default Breadcrumbs;