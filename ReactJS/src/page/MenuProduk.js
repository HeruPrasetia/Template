import React, { Fragment } from 'react';
import { submitForm, openModal, cekProfile, api, host, DivAksesDitolak, VideoCard, DxSubmitForm, DivExpired } from '../Modul';
import RendTables from '../component/RendTable';
import { Modal, ModalDelete, ModalBody, ModalFooter } from '../component/Modal';
import { DxFormInput, FormSwitch } from '../component/FormInput';
import { Row, Row6 } from '../component/Rows';
import imgUpload from '../assets/img/img-upload.png';
import imgLoading from '../assets/img/loading-upload.gif';
import Tutorial from '../component/Tutorial';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SysAkses: {},
            Data: [],
            Field: [],
            Detail: {},
            DataPenjualan: [],
            PerusahaanID: 0,
            Step1: [],
            RunStep: false,
            StepForm: [],
            RunStepForm: false
        };
        this.validationForm = React.createRef();
    }

    async componentDidMount() {
        let profile = await cekProfile();
        let Step = profile.data.Step;
        let Step1 = [], StepForm = [];
        if (Step != "") {
            for (let i in Step) {
                if (i <= 2) Step1.push(Step[i]);
                if (i > 2) StepForm.push(Step[i]);
            }
        }
        let Field = [
            { cap: "", sort: "", type: "opsi" },
            { cap: "SKU", sort: "SKU", type: "str" },
            { cap: "Nama", sort: "Nama", type: "str" },
            { cap: "Jenis", sort: "Jenis", type: "str" },
            { cap: "Qty", sort: "Qty", type: "number" },
            { cap: "Harga", sort: "Harga", type: "number" },
            { cap: "Keterangan", sort: "Keterangan", type: "str" },
            { cap: "Label", sort: "Tag", type: "tag" }
        ];
        this.setState({ Field: Field, PerusahaanID: profile.data.PerusahaanID, SysAkses: profile.data, Step1, StepForm }, this.handleMain);
        let ColorTheme = localStorage.getItem("ColorTheme") || "light";
        if (ColorTheme == "dark") {
            let cls = document.getElementsByClassName("table");
            for (let i = 0; i < cls.length; i++) {
                cls[i].classList.add("table-dark")
            }
        }
        setTimeout(() => {
            document.getElementById('content').style.overflow = 'auto';
        }, 5000);
    }

    async handleMain() {
        let sql = await api("dataproduk", { PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") this.setState({ Data: sql.data });
    }

    modalHapus(data) {
        this.setState({ UserID: data.ID });
        openModal("modalHapus");
    }

    async modalDetail(data) {
        let sql = await api("detailproduk", { ID: data.ID, PerusahaanID: data.PerusahaanID });
        if (sql.status == "sukses") {
            this.setState({ DataPenjualan: sql.transaksi, Detail: sql.data });
            openModal("modalDetail");
        }
    }

    handleChange(e, obj) {
        let Detail = this.state.Detail;
        Detail[obj] = e.value;
        this.setState({ Detail });
    }

    async modalForm(data = { Image: "none" }) {
        if (data.Image != "none") {
            data.Image = host + "file/" + data.Image;
        }
        this.setState({ Detail: data, ID: data.ID });
        openModal("modalForm", () => {
            setTimeout(() => {
                this.setState({ RunStepForm: true })
            }, 500);
        });
    }

    handlePilihBG(e) {
        let Detail = this.state.Detail;
        Detail.Image = imgLoading;
        this.setState({ Detail })
        let files = e.target.files;
        for (let i = 0; i < files.length; i++) {
            let reader = new FileReader();
            let file = files[i];
            reader.onload = async () => {
                try {
                    Detail.Image = reader.result;
                    this.setState({ ChangeImg: "ya", Detail });
                } catch (error) {
                    console.error('Error compressing image:', error.message);
                }
            };
            reader.readAsDataURL(file);
        }
    }

    render() {
        let { Detail, ID } = this.state;
        return (
            <Fragment>
                <div className="main-body">
                    {this.state.SysAkses.Aktif < 0 ? <DivExpired /> :
                        this.state.SysAkses.LinkTutorial != "Akses Ditolak" ?
                            <div className="div-content mt-1">
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div className="main-title col-md-6 mb-2">
                                        <label id='lblTitle'>Master Produk</label>
                                        <button className='btn btn-link' onClick={() => {
                                            this.setState({ RunStep: true });
                                            setTimeout(() => {
                                                let Btn = document.getElementsByClassName("react-joyride__beacon");
                                                for (let i = 0; i < Btn.length; i++) Btn[i].click();
                                            }, 200);
                                        }}><i className='fas fa-info-circle'></i></button>
                                    </div>
                                    <button className='btn btn-default' id='btnAdd' onClick={() => this.modalForm({ ID: "", IsAiActive: 0, Image: "none" })}>Tambah Produk</button>
                                </div>
                                <RendTables
                                    tbody={this.state.Data}
                                    thead={this.state.Field}
                                    opt={[
                                        { icon: "fas fa-edit", fn: (e) => this.modalForm(e) },
                                        { icon: "fas fa-trash-alt", color: "text-danger", fn: (e) => this.modalHapus(e) },
                                        { icon: "fas fa-info-circle", fn: (e) => this.modalDetail(e) }
                                    ]}
                                    group={[{ sort: "Kategori", cap: "Kategori" }]}
                                    id="TableDataProduk"
                                />
                                <VideoCard link={this.state.SysAkses.LinkTutorial} />
                                {this.state.SysAkses.Step != "" ? <Tutorial data={this.state.Step1} run={this.state.RunStep} /> : ""}
                            </div>
                            : <DivAksesDitolak />}
                </div>

                <Modal id='modalForm' className='modal-lg' title={ID == "" ? "Tambah Produk" : "Edit Produk"} validationRef={this.validationForm} form={true} onSubmit={(e) => DxSubmitForm(e, this.validationForm, { crud: "crudproduk", fn: () => this.handleMain(this.state.PerusahaanID) })} >
                    <ModalBody>
                        <input type='hidden' name='act' value={ID == "" ? "tambah" : "edit"} />
                        <input type='hidden' name='ID' value={ID} />
                        <input type='hidden' name='PerusahaanID' value={this.state.PerusahaanID} />
                        <Row>
                            <Row6><DxFormInput id='edtKode' label='Kode / SKU' name='SKU' value={Detail.SKU || ""} onChange={(e) => this.handleChange(e, 'SKU')} required={true} /></Row6>
                            <Row6><DxFormInput id='edtNama' label='Nama' name='Nama' value={Detail.Nama || ""} onChange={(e) => this.handleChange(e, 'Nama')} required={true} /></Row6>

                            <Row6><DxFormInput id='edtQty' type="number" label='Qty / Jumlah' name='Qty' value={Detail.Qty || "0"} onChange={(e) => this.handleChange(e, 'Qty')} required={true} /></Row6>
                            <Row6><DxFormInput id='edtHarga' type="number" label='Harga' name='Harga' value={Detail.Harga || "0"} onChange={(e) => this.handleChange(e, 'Harga')} required={true} /></Row6>

                            <Row6> <DxFormInput id='edtJenis' type='select' label='Jenis' name='Jenis' value={Detail.Jenis || ""} onChange={(e) => this.handleChange(e, 'Jenis')} required={true} data={[
                                { Nama: "Barang", ID: "Barang" },
                                { Nama: "Jasa", ID: "Jasa" },
                            ]} /></Row6>
                            <Row6><DxFormInput id='edtKategori' type="text" label='Kategori' name='Kategori' value={Detail.Kategori || ""} onChange={(e) => this.handleChange(e, 'Kategori')} required={true} /></Row6>
                        </Row>

                        <DxFormInput type="textarea" id='edtKeterangan' label='Keterangan' name='Keterangan' value={Detail.Keterangan || ""} onChange={(e) => this.handleChange(e, 'Keterangan')} />
                        <DxFormInput type='select' id='edtStatus' label='Status' name='Status' value={Detail.Status || ""} onChange={(e) => this.handleChange(e, 'Status')} required={true} data={[
                            { Nama: "Ready", ID: "Aktif" },
                            { Nama: "Tidak Ready", ID: "Draft" }
                        ]} />
                        <p></p>
                        <div className='form-group'>
                            <label>Gambar Produk</label>
                            <p></p>
                            <label>
                                <input name='Image' type='file' accept='image/*' className='d-none' onChange={(e) => this.handlePilihBG(e, "BuktiTfPelanggan")} />
                                <img src={Detail.Image != 'none' ? Detail.Image : imgUpload} htmlFor="BuktiTfPelanggan" style={{ width: "200px", height: "200px", objectFit: "cover" }} id='imgFoto' />
                            </label>
                        </div>
                        {this.state.SysAkses.Step != "" ? <Tutorial data={this.state.StepForm} run={this.state.RunStepForm} /> : ""}
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalForm">
                        <button type='submit' className='btn btn-default' id='btnSave'><i className='fas fa-save'></i> Simpan</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalDetail' className='modal-lg' title='Detail Produk' >
                    <ModalBody>
                        <table className='table table-striped'>
                            <tbody>
                                <tr>
                                    <td>SKU</td>
                                    <td>:</td>
                                    <td>{Detail.SKU}</td>
                                </tr>
                                <tr>
                                    <td>Nama</td>
                                    <td>:</td>
                                    <td>{Detail.Nama}</td>
                                </tr>
                                <tr>
                                    <td>Jenis</td>
                                    <td>:</td>
                                    <td>{Detail.Jenis}</td>
                                </tr>
                                <tr>
                                    <td>Keterangan</td>
                                    <td>:</td>
                                    <td>{Detail.Keterangan}</td>
                                </tr>
                            </tbody>
                        </table>
                        <h6>History Penjualan</h6>
                        <RendTables
                            tbody={this.state.DataPenjualan}
                            thead={[
                                { cap: "Tanggal", sort: "DocDate", type: "date" },
                                { cap: "Doc. Number", sort: "DocNumber", type: "str" },
                                { cap: "Pelanggan", sort: "CardName", type: "str" },
                                { cap: "Qty", sort: "Qty", type: "number" },
                                { cap: "Diskon", sort: "Diskon", type: "number" },
                                { cap: "Total", sort: "Total", type: "number" }
                            ]}
                        />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalDetail" />
                </Modal>

                <ModalDelete title="Konfirmasi" id='modalHapus' act='hapus' ID={this.state.UserID} onSubmit={(e) => submitForm(e, { crud: "crudproduk", fn: () => this.handleMain(this.state.PerusahaanID), debug: true })} />
            </Fragment>
        )
    }

}

export default Dashboard;
