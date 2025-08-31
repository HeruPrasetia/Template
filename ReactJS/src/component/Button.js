import React from 'react';

export const BtnDefault = ({ children, text = "", id = "btn", onClick = () => { return false } }) => {
    return (
        <button type="button" className="btn btn-default" id={id} onClick={onClick}>{children}{text}</button>
    );
};

export const BtnPrimary = ({ children, text = "", id = "btn", onClick = () => { return false } }) => {
    return (
        <button type="button" className="btn btn-primary" id={id} onClick={onClick}>{children}{text}</button>
    );
};

export const BtnDanger = ({ children, text = "", id = "btn", onClick = () => { return false } }) => {
    return (
        <button type="button" className="btn btn-danger" id={id} onClick={onClick}>{children}{text}</button>
    );
};

export const BtnSecondary = ({ children, text = "", id = "btn", onClick = () => { return false } }) => {
    return (
        <button type="button" className="btn btn-secondary" id={id} onClick={onClick}>{children}{text}</button>
    );
};

export const BtnIconBawah = ({ icon = "fas fa-plus", posisi = "100px", onClick = () => { return false } }) => {
    return (
        <div className="btn btn-default" style={{ position: "fixed", bottom: posisi, right: "20px", borderRadius: "50%" }} onClick={onClick}>
            <i className={icon}></i>
        </div>
    );
};