import React, { Fragment } from 'react';
import { submitForm, DxSubmitForm, openModal, cekProfile, saiki, api, DivExpired, pesan, importData, exportData, convertExcelDate, DivAksesDitolak, VideoCard } from '../Modul';
import RendTables from '../component/RendTable';
import { Modal, ModalDelete, ModalBody, ModalFooter } from '../component/Modal';
import { FormInput, DxFormInput } from '../component/FormInput';
import DateRangeBox from 'devextreme-react/date-range-box';
import withRouter from "../withRouter";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SysAkses: {},
            Data: [],
            Field: [
                { cap: "", sort: "", type: "opsi" },
                { cap: "Status", sort: "Status", type: "str" }
            ],
            Detail: {},
            DataKontak: [],
            DataChat: [],
            DataPay: {},
            PerusahaanID: 0,
            D1: saiki(),
            D2: saiki(),
            DataImport: [],
            DataBroadCast: [],
            BroadcastID: ""
        };
        this.validationImport = React.createRef();
        this.validationForm = React.createRef();
    }

    async componentDidMount() {
        let profile = await cekProfile();
        this.setState({ PerusahaanID: profile.data.PerusahaanID, SysAkses: profile.data }, this.handleMain);
        let ColorTheme = localStorage.getItem("ColorTheme") || "light";
        if (ColorTheme == "dark") {
            let cls = document.getElementsByClassName("table");
            for (let i = 0; i < cls.length; i++) {
                cls[i].classList.add("table-dark")
            }
        }
    }

    async handleMain() {
        let sql = await api("datatermdate", { PerusahaanID: this.state.PerusahaanID, D1: this.state.D1, D2: this.state.D2 });
        if (sql.status == "sukses") this.setState({ Data: sql.data });
    }

    modalHapus(data) {
        this.setState({ Detail: data });
        openModal("modalHapus");
    }

    async modalDetail(ID, mode = "int") {
        let sql = await api("detailpayment", { ID: ID, mode, PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") {
            this.setState({ Detail: sql.data || {}, DataChat: sql.chat, DataPay: sql.pay || {} });
            openModal("modalDetail");
        }
    }

    onCurrentValueChange = ({ value: [startDate, endDate] }) => {
        this.setState({ D1: startDate, D2: endDate });
    };

    async modalForm(data = { ID: "" }) {
        let sql = await api("detailtermdate", { ID: data.ID });
        if (sql.status == "sukses") {
            this.setState({ Detail: data.ID == "" ? data : sql.data });
            openModal("modalEditTermDate");
        } else {
            pesan(sql.status, sql.pesan, "warning");
        }
    }

    async handleImportData(e) {
        let data = await importData(e.target.files[0]);
        for (let dd in data) {
            data[dd].TermDate = convertExcelDate(data[dd].TermDate);
        }
        this.setState({ DataImport: data });
    }

    handleDownloadContoh() {
        let data = [{ Nama: "pelanggan", Telp: "62", TermDate: saiki() }]
        let Field = [{ cap: "Nama", sort: "Nama", type: "str" }, { cap: "Telp", sort: "Telp", type: "str" }, { cap: "TermDate", sort: "TermDate", type: "date" }];
        exportData(data, "Contoh Import Tagihan", Field);
    }

    handleHapus(data, i) {
        let DataImport = [...this.state.DataImport];
        DataImport.splice(i, 1);
        this.setState({ DataImport });
    }

    async modalEdit(data) {
        let sql = await api("databroadcast", { PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") {
            this.setState({ DataBroadCast: sql.data, Detail: data });
            openModal("modalEdit");
        }
    }

    handleChange(e, obj) {
        let Detail = this.state.Detail;
        Detail[obj] = e.value;
        this.setState({ Detail });
    }

    render() {
        return (
            <Fragment>
                <div className="main-body">
                    {this.state.SysAkses.Aktif < 0 ? <DivExpired /> :
                        this.state.SysAkses.LinkTutorial != "Akses Ditolak" ?
                            <div className="div-content mt-1">
                                <div className='row'>
                                    <div className="main-title col-md-6 mb-2">Data Pelanggan Jatuh Tempo</div>
                                    <div className='col-md-6 mb-2'>
                                        <div className="d-flex justify-content-end align-items-end gap-1">
                                            <DateRangeBox
                                                defaultValue={[this.state.D1, this.state.D2]}
                                                onValueChanged={this.onCurrentValueChange}
                                            />
                                            <button className='btn btn-default' onClick={() => this.handleMain()}><i className='fas fa-search'></i></button>
                                            <button className='btn btn-default' tooltip="Click untuk menambah data" flow="left" onClick={async () => {
                                                let sql = await api("databroadcast", { PerusahaanID: this.state.PerusahaanID });
                                                if (sql.status == "sukses") {
                                                    this.setState({ DataImport: [], DataBroadCast: sql.data });
                                                    openModal("modalImport");
                                                }
                                            }}><i className='fas fa-plus'></i></button>
                                        </div>
                                    </div>
                                </div>
                                <RendTables
                                    tbody={this.state.Data}
                                    thead={this.state.Field}
                                    opt={[
                                        { icon: "fas fa-edit", fn: (e) => this.modalEdit(e) },
                                        { icon: "fas fa-trash-alt", color: "text-danger", fn: (e, i) => this.modalHapus(e, i) }
                                    ]}
                                    group={[
                                        { cap: "Tanggal", sort: "TermDate" },
                                        { cap: "Telp", sort: "Telp" },
                                    ]}
                                />
                                <VideoCard link={this.state.SysAkses.LinkTutorial} />
                            </div>
                            : <DivAksesDitolak />}
                </div>

                <Modal id='modalImport' title='Import Data' form={true} validationRef={this.validationImport} onSubmit={(e) => DxSubmitForm(e, this.validationImport, { crud: "crudtermdate", fn: () => this.handleMain() })} className='modal-lg'>
                    <ModalBody>
                        <div className='input-group'>
                            <input type='file' className='form-control' onChange={(e) => this.handleImportData(e)} accept=".xls, .xlsx" />
                            <button type='button' className='btn btn-default' onClick={() => this.handleDownloadContoh()}><i className='fas fa-download'></i>  Contoh Format</button>
                        </div>
                        <p></p>
                        <DxFormInput type='select' name='BroadcastID' label='Broadcast' required={true} value={this.state.BroadcastID} onChange={(e) => this.setState({ BroadcastID: e.value })} data={this.state.DataBroadCast} />
                        <input type='hidden' value={JSON.stringify(this.state.DataImport)} name='DataImport' />
                        <input type='hidden' value={this.state.PerusahaanID} name='PerusahaanID' />
                        <input type='hidden' value="tambah" name='act' />
                        <p></p>
                        <RendTables
                            thead={[
                                { cap: "", sort: "", type: "opsi" },
                                { cap: "Nama", sort: "Nama", type: "str" },
                                { cap: "Telp", sort: "Telp", type: "str" },
                                { cap: "Jatuh Tempo", sort: "TermDate", type: "date" },
                            ]}
                            tbody={this.state.DataImport}
                            opt={[
                                { icon: "fas fa-trash-alt", color: "text-danger", fn: (e, i) => this.handleHapus(e, i) }
                            ]}
                        />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalImport">
                        <button className='btn btn-default' type='submit'><i className='fas fa-save'></i> Simpan</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalEdit' title='Edit Data' form={true} validationRef={this.validationForm} onSubmit={(e) => DxSubmitForm(e, this.validationForm, { crud: "crudtermdate", fn: () => this.handleMain() })}>
                    <ModalBody>
                        <input type='hidden' value={this.state.PerusahaanID} name='PerusahaanID' />
                        <input type='hidden' value="edit" name='act' />
                        <input type='hidden' name="ID" value={this.state.Detail.ID} />
                        <DxFormInput type='select' name='BroadcastID' label='Broadcast' required={true} value={this.state.Detail.BroadcastID} onChange={(e) => {
                            let Detail = this.state.Detail;
                            Detail.BroadcastID = e.value;
                            this.setState({ Detail });
                        }}
                            data={this.state.DataBroadCast} />
                        <DxFormInput type='text' name='Nama' label='Nama' required={true} value={this.state.Detail.Nama} onChange={(e) => this.handleChange(e, 'Nama')} />
                        <DxFormInput type='text' name='Telp' label='Telp' required={true} value={this.state.Detail.Telp} onChange={(e) => this.handleChange(e, 'Telp')} />
                        <DxFormInput type='date' name='TermDate' label='Tanggal jatuh Tempo' required={true} value={this.state.Detail.TermDate} onChange={(e) => this.handleChange(e, 'TermDate')} />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalEdit">
                        <button className='btn btn-default' type='submit'><i className='fas fa-save'></i> Simpan</button>
                    </ModalFooter>
                </Modal>

                <ModalDelete title="Konfirmasi" id='modalHapus' act='hapus' ID={this.state.Detail.ID} onSubmit={(e) => submitForm(e, { crud: "crudtermdate", fn: () => this.handleMain(), debug: true })} />
            </Fragment>
        )
    }

}

export default withRouter(Dashboard);
