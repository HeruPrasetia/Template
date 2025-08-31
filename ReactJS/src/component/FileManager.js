import React, { Fragment } from 'react';
import { DxSubmitForm, submitForm, openModal, cekProfile, api, host, pesan } from '../Modul';
import { Modal, ModalDelete, ModalBody, ModalFooter } from './Modal';
import { DxFormInput, FormInput } from './FormInput';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Data: [],
            SysAkses: {},
            Detail: {},
            ID: "",
            isDragging: false,
            isUpload: false,
            uploadCT: 0,
            handleclick: () => console.log('ini click')
        };
        this.dragRef = React.createRef();
        this.validationReff = React.createRef();
    }

    async componentDidMount() {
        let profile = await cekProfile();
        this.setState({ PerusahaanID: profile.data.PerusahaanID, SysAkses: profile.data });
        setTimeout(() => {
            this.handleMain();
        }, 500);
        let ColorTheme = localStorage.getItem("ColorTheme") || "light";
        if (ColorTheme == "dark") {
            let cls = document.getElementsByClassName("table");
            for (let i = 0; i < cls.length; i++) {
                cls[i].classList.add("table-dark")
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.handleclick !== this.props.handleclick) this.handleMain();
    }

    async handleMain() {
        let sql = await api("datafile", { PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") {
            let handleclick = this.props.handleclick || this.defaultclick;
            this.setState({ Data: sql.data, handleclick });
        }
    }

    modalHapus(data) {
        this.setState({ ID: data.ID });
        openModal("modalHapus");
    }

    async modalDetail(data) {
        this.setState({ Detail: data });
        openModal("modalDetail");
    }

    handleChange(e, obj) {
        let Detail = this.state.Detail;
        Detail[obj] = e.value;
        this.setState({ Detail });
    }

    async modalForm(data = {}) {
        this.setState({ Detail: data, ID: data.ID });
        openModal("modalForm");
    }

    handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ isDragging: true });
    };

    handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.target === this.dragRef.current) {
            this.setState({ isDragging: false });
        }
    };

    handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ isDragging: false, isUpload: true, uploadCT: 0 });

        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"));
        const totalFiles = files.length;
        let completed = 0;

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = async (ev) => {
                try {
                    let sql = await api("uploadbase64", {
                        file: ev.target.result,
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        PerusahaanID: this.state.PerusahaanID
                    });

                    if (sql.status === "sukses") {
                        this.handleMain();
                    } else {
                        pesan("", sql.pesan, "info");
                    }
                } catch (err) {
                    pesan("Gagal", "Terjadi kesalahan upload", "danger");
                } finally {
                    completed += 1;
                    const percent = Math.round((completed / totalFiles) * 100);
                    this.setState({ uploadCT: percent });

                    if (completed === totalFiles) {
                        this.setState({ isUpload: false });
                    }
                }
            };
            reader.readAsDataURL(file);
        });
    };

    async modalForm(data = {}) {
        this.setState({ Detail: data, ID: data.ID });
        openModal("modalForm");
    }

    defaultclick() {
        console.log("hallo");
        return false;
    }

    render() {
        let { Detail, isDragging } = this.state;
        return (
            <Fragment>
                {
                    this.state.isUpload == false ?
                        this.state.Data.length > 0 ?
                            <div ref={this.dragRef} className={`gallery-container ${isDragging ? "dragover" : ""}`} onDragEnter={this.handleDragEnter} onDragLeave={this.handleDragLeave} onDragOver={this.handleDragOver} onDrop={this.handleDrop}>
                                <div className="gallery-item">
                                    <img src={require('../assets/img/img-upload.png')} alt="Img Upload" onClick={(e) => this.modalForm()} />
                                </div>
                                {this.state.Data.map((div, i) => {
                                    return (
                                        <div className="gallery-item">
                                            <i className="fas fa-trash-alt" style={{ position: "absolute", right: "10px", top: "10px", color: "red" }} onClick={() => this.modalHapus(div)}></i>
                                            <img src={host + 'file/' + div.Link} alt={div.Nama} onClick={() => this.state.handleclick(div) || this.defaultclick()} />
                                        </div>
                                    )
                                })}
                            </div> : <div className='centered-img-container' onDragEnter={this.handleDragEnter} onDragLeave={this.handleDragLeave} onDragOver={this.handleDragOver} onDrop={this.handleDrop} onClick={(e) => this.modalForm()}>
                                <center>
                                    <img src={require('../assets/img/img-upload.png')} style={{ maxWidth: '90%', maxHeight: '90%' }} />
                                    <p></p>
                                    <b>Drop / Click disini untuk upload</b>
                                </center>
                            </div> :
                        <div className="d-flex justify-content-center align-items-center">
                            <div>
                                <div className="access-denied-title">Sedang Meng Uploas</div>
                                <div className="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow={this.state.uploadCT} aria-valuemin="0" aria-valuemax="100">
                                    <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${this.state.uploadCT}%` }}></div>
                                </div>
                            </div>
                        </div>
                }
                <Modal id='modalForm' title="Upload File" form={true} validationRef={this.validationReff} onSubmit={(e) => DxSubmitForm(e, this.validationReff, { crud: "uploadfile", fn: () => this.handleMain(this.state.PerusahaanID) })} >
                    <ModalBody>
                        <input type='hidden' name='PerusahaanID' value={this.state.PerusahaanID} />
                        <DxFormInput label='Nama' name='Nama' value={Detail.Nama || ""} onChange={(e) => this.handleChange(e, 'Nama')} required={true} />
                        <FormInput type="file" label='File' name='File' value={Detail.File || ""} onChange={(e) => this.handleChange(e.target, 'File')} required={true} />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalForm">
                        <button type='submit' className='btn btn-default'><i className='fas fa-save'></i> Simpan</button>
                    </ModalFooter>
                </Modal>

                <ModalDelete title="Konfirmasi" id='modalHapus' act='hapus' ID={this.state.ID} onSubmit={(e) => submitForm(e, { crud: "hapusfile", fn: () => this.handleMain(this.state.PerusahaanID), debug: true })} />
            </Fragment >
        )
    }
}

export default Dashboard;