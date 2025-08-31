import React, { useState } from 'react';
import { api, pesan } from '../Modul';
import { TextBox } from 'devextreme-react/text-box';
import { SelectBox } from 'devextreme-react/select-box';
import { TextArea } from 'devextreme-react/text-area';
import { Validator, RequiredRule } from 'devextreme-react/validator';

export function createTag(tagName, id = "tag-input") {
    let tagContainer = document.getElementById(id + "-container");
    let tagInput = document.getElementById(id);
    let tag = document.createElement("div");
    tag.classList.add("tag");
    let tagText = document.createElement("span");
    tagText.classList.add("tag-text");
    tagText.textContent = tagName;
    let closeButton = document.createElement("span");
    closeButton.classList.add("close-button");
    closeButton.textContent = "x";

    closeButton.addEventListener("click", () => {
        tag.remove();
        let clsTag = tag.getElementsByClassName('tag-text');
        let tags = "";
        for (let i = 0; i < clsTag.length; i++) {
            if (clsTag[i].innerText != ",") tags += clsTag[i].innerText;
        }
        document.getElementById(id + 'tagHidden').value = tags;
    });

    tag.appendChild(tagText);
    tag.appendChild(closeButton);
    tagContainer.insertBefore(tag, tagInput);

    let clsTag = tagContainer.getElementsByClassName('tag-text');
    let tags = "";
    for (let i = 0; i < clsTag.length; i++) {
        if (clsTag[i].innerText != ",") tags += clsTag[i].innerText;
    }
    document.getElementById(id + 'tagHidden').value = tags;
}

const DummySearchHashtags = async (TagName, PerusahaanID) => {
    let sql = await api("filtertag", { TagName: TagName.replace("#", ""), PerusahaanID });
    if (sql.status == "sukses") {
        let data = sql.data;
        return data;
    }
};

export const FormInput = ({ label = "", type = 'text', id = "edt", name = "", value = "", min = "1", onChange, onClick = () => { return false }, placeholder = '', required = false, disabled = false, readOnly = false, className = 'form-control', accept = 'image/*', rows = "4", data = [], PerusahaanID = 0 }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    if (type == "textarea") {
        return (
            <div className="form-group">
                <label htmlFor={name}>{label}</label>
                <textarea name={name} value={value} onChange={onChange} onClick={onClick} placeholder={placeholder} required={required} disabled={disabled} readOnly={readOnly} className={className} rows={rows} />
                <div className='invalid-feedback'>Silahkan masukan {label}</div>
            </div>
        );
    } else if (type == "select") {
        return (
            <div className="form-group">
                <label htmlFor={name}>{label}</label>
                <select name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} disabled={disabled} readOnly={readOnly} className={className == "form-control" ? "form-select" : className}>
                    <option value="">Silahkan Pilih {label}</option>
                    {
                        data.map((opt, i) => {
                            return <option key={i} value={opt.ID || opt.value}>{opt.Nama || opt.caption}</option>
                        })
                    }
                </select>
                <div className='invalid-feedback'>Silahkan pilih {label}</div>
            </div>
        );
    } else if (type == "tag") {
        const handleKeyUp = async (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                const hasil = await DummySearchHashtags(query, PerusahaanID);
                setSuggestions(hasil);
            } else {
                setSuggestions([]);
            }
        };

        const handleAddTag = (tag) => {
            createTag(tag, id);
            setInputValue('');
            setSuggestions([]);
        };
        return (
            <div className='form-group'>
                <label>{label}</label>
                <div className="tag-input-container" id={`${id}-container`} style={{ position: 'relative' }}>
                    <input type='hidden' name={name} id={id + "tagHidden"} />
                    <input
                        type='text'
                        id={id}
                        className="input-tag fokus"
                        placeholder="Gunakan # unt menambah Tag Baru"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyUp={handleKeyUp}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && e.target.value.trim() !== "") {
                                e.preventDefault();
                                if (e.target.value.startsWith("#")) {
                                    handleAddTag(e.target.value.trim());
                                } else {
                                    pesan("Pemberitahuan", "Silahkan Tambahkan Awalan Karakter # untuk menambah Tag Baru", "warning");
                                }
                            }
                        }}
                    />
                    {suggestions.length > 0 && (
                        <ul className="hashtag-suggestions" style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            zIndex: 10,
                            background: '#fff',
                            border: '1px solid #ccc',
                            margin: 0,
                            padding: '5px',
                            listStyle: 'none',
                            maxHeight: '150px',
                            overflowY: 'auto'
                        }}>
                            {suggestions.map((tag, index) => (
                                <li key={index} style={{ padding: '5px', cursor: 'pointer' }} onClick={() => handleAddTag("#" + tag.TagName)}>
                                    {tag.TagName}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        );
    } else {
        return (
            <div className="form-group">
                <label htmlFor={name}>{label}</label>
                {
                    type == "number" ? <input type={type} name={name} value={value} onChange={onChange} onClick={onClick} placeholder={placeholder} required={required} disabled={disabled} readOnly={readOnly} className={className} min={min} />
                        : type == "file" ? <input type={type} name={name} value={value} onChange={onChange} onClick={onClick} placeholder={placeholder} required={required} disabled={disabled} readOnly={readOnly} className={className} accept={accept} />
                            : <input type={type} name={name} value={value} onChange={onChange} onClick={onClick} placeholder={placeholder} required={required} disabled={disabled} readOnly={readOnly} className={className} />
                }
                <div className='invalid-feedback'>Silahkan masukan {label}</div>
            </div>
        );
    }
};


export const DxFormInput = ({
    label = "",
    type = 'text',
    name = "",
    value = "",
    onChange,
    onClick = () => false,
    placeholder = '',
    required = false,
    disabled = false,
    readOnly = false,
    id = "",
    height = "90",
    data = []
}) => {
    const [showPassword, setShowPassword] = useState(false);

    if (type == "textarea") {
        return (
            <div style={{ marginBottom: '25px' }}>
                <TextArea
                    name={name}
                    label={label}
                    labelMode="floating"
                    value={value}
                    onValueChanged={onChange}
                    placeholder={placeholder}
                    showClearButton={false}
                    width="100%"
                    height={`${height}px`}
                    readOnly={readOnly}
                    disabled={disabled}
                    id={id}
                    minHeight={100}
                    inputAttr={{
                        style: {
                            overflow: "auto",
                            resize: "none"
                        }
                    }}
                >
                    {required && (
                        <Validator>
                            <RequiredRule message={`Silahkan isi ${label}`} />
                        </Validator>
                    )}
                </TextArea>
            </div>
        );
    } else if (type == "select") {
        let Data = [{ ID: "", Nama: `Silahkan pilih ${label}` }, ...data];
        return (
            <div style={{ marginBottom: '25px' }}>
                <SelectBox
                    name={name}
                    label={label}
                    labelMode="floating"
                    dataSource={Data}
                    value={value}
                    onValueChanged={onChange}
                    displayExpr="Nama"
                    valueExpr="ID"
                    placeholder={"Silahkan pilih " + label}
                    showClearButton={false}
                    width="100%"
                    readOnly={readOnly}
                    disabled={disabled}
                    id={id}
                >
                    {required && (
                        <Validator>
                            <RequiredRule message={`Silahkan pilih ${label}`} />
                        </Validator>
                    )}
                </SelectBox>
            </div>
        );
    } else {
        const mode = (type === 'password' && showPassword) ? 'text' : type;

        const buttons = [];
        if (type === 'password') {
            buttons.push({
                name: 'togglePassword',
                location: 'after',
                options: {
                    icon: showPassword ? 'eyeopen' : 'eyeclose', // ganti sesuai icon DevExtreme atau custom
                    stylingMode: 'text',
                    onClick: () => setShowPassword(!showPassword)
                }
            });
        }

        return (
            <div style={{ marginBottom: '25px' }}>
                <TextBox
                    name={name}
                    label={label}
                    labelMode="floating"
                    value={value}
                    onValueChanged={onChange}
                    placeholder={placeholder}
                    showClearButton={false}
                    width="100%"
                    mode={mode}
                    readOnly={readOnly}
                    disabled={disabled}
                    buttons={buttons}
                    id={id}
                >
                    {required && (
                        <Validator>
                            <RequiredRule message={`Silahkan isi ${label}`} />
                        </Validator>
                    )}
                </TextBox>
            </div>
        );
    }
};

export const FormControl = ({ type = 'text', name = "", value = "", onChange, onClick = () => { return false }, placeholder = '', required = false, disabled = false, readOnly = false, className = 'form-control' }) => {
    return <input type={type} name={name} value={value} onChange={onChange} onClick={onClick} placeholder={placeholder} required={required} disabled={disabled} readOnly={readOnly} className={className} />
};

export const FormSelect = ({ label = "", name = "", value = "", onChange, placeholder = '', required = false, disabled = false, className = 'form-select', data = [] }) => {
    return (
        <select name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} disabled={disabled} className={className}>
            <option value="">Silahkan Pilih {label}</option>
            {
                data.map((opt, i) => {
                    return <option key={i} value={opt.ID || opt.value}>{opt.Nama || opt.caption}</option>
                })
            }
        </select>
    );
};

export const FormTextarea = ({
    name = "",
    value = "",
    onChange,
    placeholder = '',
    required = false,
    disabled = false,
    className = 'form-control',
    rows = "4"
}) => {
    return (
        <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} disabled={disabled} className={className} rows={rows} />
    );
};

export const FormSwitch = ({
    label = "",
    name = "",
    value = "",
    onChange,
    id = "chk",
    checked = false
}) => {
    return (
        <div className="form-check form-switch">
            <input className="form-check-input" name={name} type="checkbox" value={value} role="switch" id={id} checked={checked} onChange={onChange} />
            <label className="form-check-label" htmlFor={id}>{label}</label>
        </div>
    );
};