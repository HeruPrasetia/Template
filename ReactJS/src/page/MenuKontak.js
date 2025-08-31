import React, { Fragment } from 'react';
import { pesan, submitForm, DxSubmitForm, openModal, cekProfile, importData, exportData, api, DivAksesDitolak, DivExpired, VideoCard } from '../Modul';
import RendTables from '../component/RendTable';
import { Modal, ModalDelete, ModalBody, ModalFooter } from '../component/Modal';
import { DxFormInput, FormInput, FormSwitch, createTag } from '../component/FormInput';
import Tutorial from '../component/Tutorial';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SysAkses: {},
            Data: [],
            Field: [
                { cap: "", sort: "", type: "opsi" },
                { cap: "Nama", sort: "Nama", type: "str" },
                { cap: "WhatsApp", sort: "Telp", type: "str" },
                { cap: "Dijawab AI", sort: "IsAiActive", type: "checkbox", fn: (e) => this.handleSetAllAI(e), fnitem: (e, data, i) => this.handleSetAI(e, data, i) },
                { cap: "Keterangan", sort: "Keterangan", type: "str" },
                { cap: "Label", sort: "Tag", type: "tag" }
            ],
            Detail: {},
            DataChat: [],
            DataKontak: [],
            PerusahaanID: 0,
            Step1: [],
            RunStep: false,
            StepForm: [],
            RunStepForm: false,
            StepImport: [],
            RunStepImport: false
        };
        this.validationForm = React.createRef();
    }

    async componentDidMount() {
        let profile = await cekProfile();
        let Step1 = [], StepForm = [], StepImport = [];
        if (profile.data.Step != "") {
            let Step = profile.data.Step;
            for (let i in Step) {
                if (i <= 5) Step1.push(Step[i]);
                if (i > 5 && i <= 10) StepForm.push(Step[i]);
                if (i > 10 && i <= 14) StepImport.push(Step[i]);
            }

        }
        this.setState({ PerusahaanID: profile.data.PerusahaanID, SysAkses: profile.data, Step1, StepForm, StepImport }, this.handleMain);
        let ColorTheme = localStorage.getItem("ColorTheme") || "light";
        if (ColorTheme == "dark") {
            let cls = document.getElementsByClassName("table");
            for (let i = 0; i < cls.length; i++) {
                cls[i].classList.add("table-dark")
            }
        }
    }

    async handleSetAllAI(e) {
        let sql = await api("crudkontak", { act: "setting ai all", PerusahaanID: this.state.PerusahaanID, IsAiActive: e.target.checked == true ? 1 : 0 });
        if (sql.status == "sukses") this.handleMain();
    }

    async handleSetAI(e, data, i) {
        let sql = await api("crudkontak", { act: "setting ai", ID: data.ID, IsAiActive: e.target.checked == true ? 1 : 0 });
        if (sql.status == "sukses") this.handleMain();
    }

    async handleMain() {
        let sql = await api("datakontak", { PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") this.setState({ Data: sql.data });
    }

    modalHapus(data) {
        this.setState({ UserID: data.ID });
        openModal("modalHapus");
    }

    async modalDetail(data) {
        let sql = await api("detailkontak", { ID: data.ID, PerusahaanID: data.PerusahaanID });
        if (sql.status == "sukses") {
            this.setState({ DataChat: sql.chat, Detail: sql.data });
            openModal("modalDetail");
        }
    }

    handleChange(e, obj) {
        let Detail = this.state.Detail;
        Detail[obj] = e.value;
        this.setState({ Detail });
    }

    async modalForm(data = {}) {
        this.setState({ Detail: data, ID: data.ID });
        let tag = data.Tag;
        let tagContainer = document.getElementById("edtTagKontak-container");
        tagContainer.querySelectorAll(".tag").forEach(element => element.remove());

        if (tag != "") for (let tg of tag.split("#")) if (tg != '') createTag("#" + tg, "edtTagKontak");
        openModal("modalForm", () => {
            setTimeout(() => {
                this.setState({ RunStepForm: true });
            }, 1000);
        });
    }

    modalImport() {
        openModal("modalImport", () => {
            setTimeout(() => {
                this.setState({ RunStepImport: true });
            }, 1000);
        });
    }

    async handleImportKontak(e) {
        e.preventDefault();
        let Form = e.target;
        let btn = Form.querySelector('button[type="submit"]');
        btn.disabled = true;
        let i = btn.querySelector('i');
        let oldCls = i ? i.className : "";
        if (i) i.className = "spinner-border spinner-border-sm text-light";
        if (this.state.DataKontak.length > 0) {
            let sql = await api("crudkontak", { act: "import", DataKontak: JSON.stringify(this.state.DataKontak), PerusahaanID: this.state.PerusahaanID });
            if (sql.status == "sukses") {
                pesan("sukses", sql.pesan, "info");
                this.handleMain(this.state.PerusahaanID);
                btn.disabled = false;
                i.className = oldCls;
                document.getElementById('btnTutupModalImport').click();
            } else {
                btn.disabled = false;
                i.className = oldCls;
                pesan("gagal", sql.pesan, "error");
            }
        } else {
            pesan("Gagal", "Silahkan pilih kontak", "error");
        }
    }

    handleDownloadContoh() {
        let data = [{ Nama: "Pelanggan", Telp: "62", Alamat: "indonesia", Label: "#closing#pelanggan" }]
        let Field = [{ cap: "Nama", sort: "Nama", type: "str" }, { cap: "Telp", sort: "Telp", type: "str" }, { cap: "Alamat", sort: "Alamat", type: "str" }, { cap: "Label", sort: "Label", type: "str" }];
        exportData(data, "Contoh Import Kontak", Field);
    }

    async handleImportData(e) {
        let data = await importData(e.target.files[0]);
        this.setState({ DataKontak: data });
    }

    async handleDownload() {
        await exportData(this.state.Data, `Data master kontak`, this.state.Field);
    }

    render() {
        let { Detail, ID } = this.state;
        return (
            <Fragment>
                <div className="main-body">
                    {this.state.SysAkses.Aktif < 0 ? <DivExpired /> :
                        this.state.SysAkses.LinkTutorial != "Akses Ditolak" ?
                            <div className="div-content mt-1">
                                <div className='row'>
                                    <div className="main-title col-sm-6 col-lg-8 mb-2">
                                        <label id='lblTitle'>Data Kontak</label>
                                        <button className='btn btn-link' onClick={() => {
                                            this.setState({ RunStep: true });
                                            setTimeout(() => {
                                                let Btn = document.getElementsByClassName("react-joyride__beacon");
                                                for (let i = 0; i < Btn.length; i++) Btn[i].click();
                                            }, 200);
                                        }}><i className='fas fa-info-circle'></i></button>
                                    </div>
                                    <div className='col-sm-6 col-lg-4 mb-2'>
                                        <div className='d-flex justify-content-end align-items-center gap-2'>
                                            <button className='btn btn-default w-50' onClick={() => this.modalForm({ ID: "", IsAiActive: 0, Tag: "" })} id='btnAdd'>Tambah Kontak</button>
                                            <button className='btn btn-default w-50' onClick={() => this.modalImport()} id='btnImport'>Import Kontak</button>
                                            <button className='btn btn-default' onClick={() => this.handleDownload()} id='btnDownload'><i className='fas fa-download'></i></button>
                                        </div>
                                    </div>
                                </div>
                                <RendTables
                                    tbody={this.state.Data}
                                    thead={this.state.Field}
                                    id="tableDataKontak"
                                    opt={[
                                        { icon: "fas fa-edit", fn: (e) => this.modalForm(e) },
                                        { icon: "fas fa-info-circle", fn: (e) => this.modalDetail(e) },
                                        { icon: "fas fa-trash-alt", color: "text-danger", fn: (e) => this.modalHapus(e) },
                                    ]}
                                />
                                <VideoCard link={this.state.SysAkses.LinkTutorial} />
                                {this.state.Step1.length > 0 ? <Tutorial data={this.state.Step1} run={this.state.RunStep} /> : ""}
                            </div>
                            : <DivAksesDitolak />}
                </div>

                <Modal id='modalForm' title={ID == "" ? "Tambah Kontak" : "Edit Kontak"} validationRef={this.validationForm} form={true} onSubmit={(e) => DxSubmitForm(e, this.validationForm, { crud: "crudkontak", fn: () => this.handleMain(this.state.PerusahaanID) })} >
                    <ModalBody>
                        <input type='hidden' name='act' value={ID == "" ? "tambah" : "edit"} />
                        <input type='hidden' name='ID' value={ID} />
                        <input type='hidden' name='PerusahaanID' value={this.state.PerusahaanID} />
                        <input type='hidden' name='IsAiActive' value={Detail.IsAiActive} />
                        <DxFormInput id='edtNama' label='Nama' name='Nama' value={Detail.Nama || ""} onChange={(e) => this.handleChange(e, 'Nama')} required={true} />
                        <DxFormInput id='edtTelp' type='text' label='Telp' name='Telp' value={Detail.Telp || "62"} onChange={(e) => this.handleChange(e, 'Telp')} required={true} />
                        <DxFormInput id='edtEmail' type='email' label='Email' name='Email' placeholder='Masukan Alamat Email' value={Detail.Email || ""} onChange={(e) => this.handleChange(e, 'Email')} />
                        <DxFormInput id='edtAlamat' type='textarea' label='Alamat' name='Alamat' placeholder='Masukan alamat' value={Detail.Alamat || ""} onChange={(e) => this.handleChange(e, 'Alamat')} />
                        <FormInput id="edtTagKontak" type='tag' label='Kelompok / Tag' name='Tag' value={Detail.Tag || ""} onChange={(e) => this.handleChange(e, 'Tag')} PerusahaanID={this.state.PerusahaanID} />
                        <FormSwitch id='chkAi' label="Jawab Dengan AI" checked={Detail.IsAiActive || false} onChange={(e) => {
                            let data = this.state.Detail;
                            data.IsAiActive = e.target.checked == true ? 1 : 0;
                            this.setState({ Detail: data });
                        }} />
                        <Tutorial data={this.state.StepForm} run={this.state.RunStepForm} />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalForm">
                        <button type='submit' id='btnSave' className='btn btn-default'><i className='fas fa-save'></i> Simpan</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalImport' className='modal-lg' title="Import Kontak" form={true} onSubmit={(e) => this.handleImportKontak(e)} >
                    <ModalBody>
                        <div className='input-group'>
                            <input type='file' id='edtImportKontak' className='form-control' onChange={(e) => this.handleImportData(e)} accept=".xls, .xlsx" />
                            <button type='button' id='btnTemplateImport' className='btn btn-default' onClick={(e) => this.handleDownloadContoh()}><i className='fas fa-download'></i> Contoh Format</button>
                        </div>
                        <RendTables
                            tbody={this.state.DataKontak}
                            thead={[
                                { cap: "", sort: "", type: "opsi" },
                                { cap: "Nama", sort: "Nama", type: "str" },
                                { cap: "Telp", sort: "Telp", type: "str" },
                                { cap: "Alamat", sort: "Alamat", type: "str" },
                                { cap: "Label", sort: "Label", type: "tag" },
                            ]}
                            opt={[
                                { icon: "fas fa-trash-alt", fn: (e) => this.handleDeleteKontak(e) }
                            ]}
                            id="TabelImport"
                        />
                        <Tutorial data={this.state.StepImport} run={this.state.RunStepImport} />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalImport">
                        <button type='submit' className='btn btn-default' id='btnSaveImport'><i className='fas fa-upload'></i> Import</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalDetail' className='modal-lg' title='Detail Kontak' >
                    <ModalBody>
                        <table className='table table-striped'>
                            <tbody>
                                <tr>
                                    <td>Nama</td>
                                    <td>:</td>
                                    <td>{Detail.Nama}</td>
                                </tr>
                                <tr>
                                    <td>Telp</td>
                                    <td>:</td>
                                    <td>{Detail.Telp}</td>
                                </tr>
                                <tr>
                                    <td>Keterangan</td>
                                    <td>:</td>
                                    <td>{Detail.Keterangan}</td>
                                </tr>
                            </tbody>
                        </table>
                        <h6>History Chat</h6>
                        <RendTables
                            tbody={this.state.DataChat}
                            thead={[
                                { cap: "Waktu", sort: "Waktu", type: "datetime" },
                                { cap: "Pesan", sort: "Pesan", type: "str" },
                                { cap: "Dijawab AI", sort: "IsAi", type: "boolean2" }
                            ]}
                        />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalDetail" />
                </Modal>

                <ModalDelete title="Konfirmasi" id='modalHapus' act='hapus' ID={this.state.UserID} onSubmit={(e) => submitForm(e, { crud: "crudkontak", fn: () => this.handleMain(this.state.PerusahaanID), debug: true })} />
            </Fragment >
        )
    }

}

export default Dashboard;
