import React, { Fragment } from 'react';
import { submitForm, openModal, cekProfile, api, DivAksesDitolak, DxSubmitForm, saiki, DivExpired } from '../Modul';
import RendTables from '../component/RendTable';
import { Modal, ModalDelete, ModalBody, ModalFooter } from '../component/Modal';
import { Row, Row6 } from '../component/Rows';
import { DxFormInput } from '../component/FormInput';
import imgUpload from '../assets/img/img-upload.png';
import imgLoading from '../assets/img/loading-upload.gif';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SysAkses: {},
            Data: [],
            Field: [
                { cap: "", sort: "", type: "opsi" },
                { cap: "Kode", sort: "Kode", type: "str" },
                { cap: "Nama", sort: "Nama", type: "str" },
                { cap: "NoReff", sort: "Noreff", type: "str" },
                { cap: "Keterangan", sort: "Keterangan", type: "str" },
                { cap: "Jenis Transaksi", sort: "Jenis", type: "str" },
                { cap: "Jenis Potongan", sort: "JenisNominal", type: "str" },
                { cap: "Nominal", sort: "Nominal", type: "str" },
                { cap: "Kuota", sort: "Kuota", type: "str" },
                { cap: "Dipakai", sort: "Penggunaan", type: "str" },
                { cap: "Tanggal Aktif", sort: "StartDate", type: "date" },
                { cap: "Tanggal Berahir", sort: "EndDate", type: "date" },
                { cap: "Status", sort: "Status", type: "str" },
            ],
            Detail: {},
            ID: "",
            ChangeImg: "tidak",
            DataPaket: []
        };
        this.validationForm = React.createRef();
    }

    async componentDidMount() {
        let profile = await cekProfile();
        this.setState({ PerusahaanID: profile.data.PerusahaanID, SysAkses: profile.Akses }, this.handleMain);
        let ColorTheme = localStorage.getItem("ColorTheme") || "light";
        if (ColorTheme == "dark") {
            let cls = document.getElementsByClassName("table");
            for (let i = 0; i < cls.length; i++) {
                cls[i].classList.add("table-dark")
            }
        }
    }

    async handleMain() {
        let sql = await api("datapromo", { PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") this.setState({ Data: sql.data });
    }

    modalHapus(data) {
        this.setState({ ID: data.ID });
        openModal("modalHapus");
    }

    async modalForm(data = { Images: imgUpload }) {
        let sql = await api("detailpromo", { ID: data.ID });
        if (sql.status == "sukses") {
            this.setState({ Detail: sql.data || data, DataPaket: sql.paket, ID: data.ID }, () => {
                openModal("modalForm");
            })
        }
    }

    handleChange(e, obj) {
        let Detail = this.state.Detail;
        if (obj == "LinkTutorial") {
            Detail[obj] = this.convertToEmbed(e.value);
        } else {
            Detail[obj] = e.value;
        }
        this.setState({ Detail });
    }

    handlePilihBG(e) {
        let Detail = this.state.Detail;
        Detail.Images = imgLoading;
        this.setState({ Detail })
        let files = e.target.files;
        for (let i = 0; i < files.length; i++) {
            let reader = new FileReader();
            let file = files[i];
            reader.onload = async () => {
                try {
                    Detail.Images = reader.result;
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
                                    <div className="main-title">Master Promo</div>
                                    <button className='btn btn-default' onClick={(e) => this.modalForm({ ID: "" })}>Tambah</button>
                                </div>
                                <RendTables
                                    tbody={this.state.Data}
                                    thead={this.state.Field}
                                    opt={[
                                        { icon: "fas fa-edit", fn: (e) => this.modalForm(e) },
                                        { icon: "fas fa-trash-alt", color: "text-danger", fn: (e) => this.modalHapus(e) }
                                    ]}
                                />
                            </div>
                            : <DivAksesDitolak />}
                </div>

                <Modal id='modalForm' title={Detail.ID == "" ? "Tambah Menu" : "Edit Promo"} validationRef={this.validationForm} form={true} onSubmit={(e) => DxSubmitForm(e, this.validationForm, { crud: "crudpromo", fn: () => this.handleMain(this.state.PerusahaanID) })} >
                    <ModalBody>
                        <input type='hidden' name='PerusahaanID' value={this.state.PerusahaanID} />
                        <input type='hidden' name='ID' value={Detail.ID} />
                        <input type='hidden' name='act' value={Detail.ID == "" ? "tambah" : "edit"} />
                        <Row>
                            <Row6><DxFormInput label='Kode Promo' name='Kode' value={Detail.Kode || ""} onChange={(e) => this.handleChange(e, 'Kode')} required={true} /></Row6>
                            <Row6><DxFormInput label='Nama Promo' name='Nama' value={Detail.Nama || ""} onChange={(e) => this.handleChange(e, 'Nama')} required={true} /></Row6>
                            <Row6><DxFormInput type="date" label='Tanggal Aktif' name='StartDate' value={Detail.StartDate || saiki()} onChange={(e) => this.handleChange(e, 'StartDate')} required={true} /></Row6>
                            <Row6><DxFormInput type="date" label='Tanggal Berahir' name='EndDate' value={Detail.EndDate || saiki()} onChange={(e) => this.handleChange(e, 'EndDate')} required={true} /></Row6>
                            <Row6>
                                <DxFormInput type="select" label='Jenis Transaksi' name='Jenis' value={Detail.Jenis || "Register"} onChange={(e) => this.handleChange(e, 'Jenis')} required={true} data={[
                                    { ID: "Register", Nama: "Register" },
                                    { ID: "Perpanjang", Nama: "Perpanjang" },
                                ]} />
                            </Row6>
                            <Row6>
                                <DxFormInput type="select" label='Jenis Nominal' name='JenisNominal' value={Detail.JenisNominal || "Nominal"} onChange={(e) => this.handleChange(e, 'JenisNominal')} required={true} data={[
                                    { ID: "Nominal", Nama: "Nominal" },
                                    { ID: "Persen", Nama: "Persen" },
                                ]} />
                            </Row6>
                            <Row6><DxFormInput type="number" label='Nominal' name='Nominal' value={Detail.Nominal || "0"} onChange={(e) => this.handleChange(e, 'Nominal')} required={true} /></Row6>
                            <Row6><DxFormInput type="number" label='Kuota' name='Kuota' value={Detail.Kuota || "0"} onChange={(e) => this.handleChange(e, 'Kuota')} required={true} /></Row6>
                            <Row6><DxFormInput type="text" label='No. Reff' name='NoReff' value={Detail.NoReff || ""} onChange={(e) => this.handleChange(e, 'NoReff')} /></Row6>
                            <Row6><DxFormInput type="select" label='Status' name='Status' value={Detail.Status || "Aktif"} onChange={(e) => this.handleChange(e, 'Status')} required={true} data={[
                                { ID: "Aktif", Nama: "Aktif" },
                                { ID: "Draft", Nama: "Tidak Aktif" },
                            ]} /></Row6>
                            <Row6><DxFormInput type="select" label='Paket' name='PaketID' value={Detail.PaketID || "0"} onChange={(e) => this.handleChange(e, 'PaketID')} data={this.state.DataPaket} /></Row6>
                        </Row>
                        <DxFormInput type="textarea" label='Keterangan' name='Keterangan' value={Detail.Keterangan || ""} onChange={(e) => this.handleChange(e, 'Keterangan')} />
                        <div className='form-group'>
                            <label>Gambar Produk</label>
                            <p></p>
                            <label>
                                <input name='Images' type='file' accept='image/*' className='d-none' onChange={(e) => this.handlePilihBG(e, "BuktiTfPelanggan")} />
                                <img src={Detail.Images != 'none' ? Detail.Images : imgUpload} htmlFor="BuktiTfPelanggan" style={{ width: "200px", height: "200px", objectFit: "cover" }} />
                            </label>
                        </div>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalForm">
                        <button type='submit' className='btn btn-default'><i className='fas fa-save'></i> Simpan</button>
                    </ModalFooter>
                </Modal>

                <ModalDelete title="Konfirmasi" id='modalHapus' act='hapus' ID={this.state.ID} onSubmit={(e) => submitForm(e, { crud: "crudpromo", fn: () => this.handleMain(this.state.PerusahaanID), debug: true })} />
            </Fragment>
        )
    }

}

export default Dashboard;
