import React, { useEffect, useRef, useState } from 'react';

export const Tabs = ({ children, header = [] }) => {
    const childrenArray = React.Children.toArray(children);
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className='card'>
            <div className='card-body'>
                <ul className="nav nav-pills nav-fill custom-pill-nav rounded-pill d-inline-flex" role="tablist">
                    {
                        header.map((li, i) => (
                            <li className="nav-item" role="presentation" key={i}>
                                <button className={`nav-link rounded-pill ${i === activeIndex ? 'active' : ''}`} onClick={() => {
                                    setActiveIndex(i);
                                    if (li.fn) li.fn();
                                }} type="button">{li.title}</button>
                            </li>
                        ))
                    }
                </ul>

                <div className="tab-content mt-3">
                    {
                        header.map((li, i) => (
                            <div className={`tab-pane fade ${i === activeIndex ? 'show active' : ''}`} key={i} style={{ overflowY: "auto", maxHeight: "80vh" }}>
                                {childrenArray[i] || <div className="text-muted">Tidak ada konten</div>}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};
