import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const withRouter = (Component) => {
    return function WrapperComponent(props) {
        const params = useParams();
        const location = useLocation();
        const navigate = useNavigate();

        return (
            <Component
                {...props}
                params={params || {}}
                location={location}
                navigate={navigate}
            />
        );
    };
};

export default withRouter;