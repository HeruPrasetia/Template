import React from 'react';

export const Row = ({ children }) => {
    return (
        <div className="row">
            {children}
        </div>
    );
};

export const Row9 = ({ children }) => {
    return (
        <div className="col-md-9 mb-2">
            {children}
        </div>
    );
};

export const Row6 = ({ children }) => {
    return (
        <div className="col-md-6 mb-2">
            {children}
        </div>
    );
};

export const row5 = ({ children }) => {
    return (
        <div className="col-md-5 mb-2">
            {children}
        </div>
    );
};

export const Row4 = ({ children }) => {
    return (
        <div className="col-md-4 mb-2">
            {children}
        </div>
    );
};

export const Row3 = ({ children }) => {
    return (
        <div className="col-md-3">
            {children}
        </div>
    );
};

export const Row2 = ({ children }) => {
    return (
        <div className="col-md-2">
            {children}
        </div>
    );
};
