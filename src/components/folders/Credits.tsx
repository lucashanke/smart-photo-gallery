import React from 'react';

const Credits: React.FunctionComponent<{
    url: string;
}> = (props) => {
    const [credits, setCredits] = React.useState<string>('');
    
    const fetchCredits = async (url) => {
        const response = await fetch(url);
        setCredits(await response.text());
    }

    React.useEffect(() => {
        fetchCredits(props.url);
    }, [props.url]);
 
    return <div className="credits" data-testid="credits">
        <pre>
            {credits}
        </pre>
    </div>;
}

export default Credits;
