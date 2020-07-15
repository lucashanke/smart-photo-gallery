import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs: React.FunctionComponent<{
    path: string;
}> = (props) => {
    const crumbs = props.path.split('/').filter(name => name).map((name, index, names) => {
        return {
            name,
            path: names.slice(0, index+1).join('/'),
        }
    });

    return <ul className="breadcrumb" data-testid="breadcrumbs">
        {crumbs.length > 0 && <li key="home">
            <Link to="/">Home</Link>
        </li>}
        {crumbs?.map((option, index) => <li key={option.path}>
            {index !== (crumbs.length - 1) ? <Link to={`/${option.path}`}>{option.name}</Link> : option.name}
        </li>)}
    </ul>;
}

Breadcrumbs.defaultProps = {
    path: '',
}

export default Breadcrumbs;
