import React, { Fragment } from 'react';
import { submitForm, openModal, cekProfile, DivExpired, VideoCard, DivAksesDitolak, host, pesan } from '../Modul';
import FileManager from '../component/FileManager';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Data: [],
            SysAkses: {},
            Field: [
                { cap: "", sort: "", type: "opsi" },
                { cap: "Nama", sort: "Nama", type: "str" },
                { cap: "Ukuran", sort: "Ukuran", type: "str" }
            ],
            Detail: {},
            ID: "",
            isDragging: false,
            isUpload: false,
            uploadCT: 0
        };
        this.dragRef = React.createRef();
    }

    async componentDidMount() {
        let ColorTheme = localStorage.getItem("ColorTheme") || "light";
        if (ColorTheme == "dark") {
            let cls = document.getElementsByClassName("table");
            for (let i = 0; i < cls.length; i++) {
                cls[i].classList.add("table-dark")
            }
        }
    }

    handleClick(e) {
        console.log(e);
    }

    render() {
        return (
            <Fragment>
                <div className="main-body">
                    {this.state.SysAkses.Aktif < 0 ? <DivExpired /> :
                        this.state.SysAkses.LinkTutorial != "Akses Ditolak" ?
                            <div className="div-content mt-1">
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div className="main-title">File Manager</div>
                                </div>
                                <FileManager handleclick={(e) => this.handleClick(e)} />
                                <VideoCard link={this.state.SysAkses.LinkTutorial} />
                            </div>
                            : <DivAksesDitolak />
                    }
                </div>
            </Fragment>
        )
    }

}

export default Dashboard;
