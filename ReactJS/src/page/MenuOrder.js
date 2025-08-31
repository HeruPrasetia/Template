import React, { Fragment } from 'react';
import { submitForm, openModal, cekProfile, api, DivAksesDitolak, VideoCard, DivExpired } from '../Modul';
import RendTables from '../component/RendTable';
import { Modal, ModalDelete, ModalBody, ModalFooter } from '../component/Modal';
import { FormInput, FormSwitch } from '../component/FormInput';
import { Row, Row6 } from '../component/Rows';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SysAkses: {},
            Data: [],
            Field: [],
            Detail: {},
            DataPenjualan: [],
            PerusahaanID: 0
        };
    }

    async componentDidMount() {
        let profile = await cekProfile();
        let Field = [
            { cap: "", sort: "", type: "opsi" },
            { cap: "SKU", sort: "SKU", type: "str" },
            { cap: "Nama", sort: "Nama", type: "str" },
            { cap: "Jenis", sort: "Jenis", type: "str" },
            { cap: "Qty", sort: "Qty", type: "number" },
            { cap: "Harga", sort: "Harga", type: "number" },
            { cap: "Keterangan", sort: "Keterangan", type: "str" }
        ];
        this.setState({ Field: Field, PerusahaanID: profile.data.PerusahaanID, SysAkses: profile.data });

        this.handleMain(profile.PerusahaanID);
        let ColorTheme = localStorage.getItem("ColorTheme") || "light";
        if (ColorTheme == "dark") {
            let cls = document.getElementsByClassName("table");
            for (let i = 0; i < cls.length; i++) {
                cls[i].classList.add("table-dark")
            }
        }
    }

    async handleMain(PerusahaanID = 0) {
        let sql = await api("dataproduk", { PerusahaanID: PerusahaanID });
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
        Detail[obj] = e.target.value;
        this.setState({ Detail });
    }

    async modalForm(data = {}) {
        this.setState({ Detail: data, ID: data.ID });
        openModal("modalForm");
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
                                    <div className="main-title">Data Produk</div>
                                    <button className='btn btn-default' onClick={() => this.modalForm({ ID: "", IsAiActive: 0 })}>Tambah Produk</button>
                                </div>
                                <RendTables
                                    tbody={this.state.Data}
                                    thead={this.state.Field}
                                    opt={[
                                        { icon: "fas fa-edit", fn: (e) => this.modalForm(e) },
                                        { icon: "fas fa-trash-alt", fn: (e) => this.modalHapus(e) },
                                        { icon: "fas fa-info-circle", fn: (e) => this.modalDetail(e) }
                                    ]}
                                    group={[{ sort: "Kategori", cap: "Kategori" }]}
                                />
                                <VideoCard link={this.state.SysAkses.LinkTutorial} />
                            </div>
                            : <DivAksesDitolak />}
                </div>

                <Modal id='modalForm' className='modal-lg' title={ID == "" ? "Tambah Produk" : "Edit Produk"} form={true} onSubmit={(e) => submitForm(e, { crud: "crudproduk", fn: () => this.handleMain(this.state.PerusahaanID) })} >
                    <ModalBody>
                        <input type='hidden' name='act' value={ID == "" ? "tambah" : "edit"} />
                        <input type='hidden' name='ID' value={ID} />
                        <input type='hidden' name='PerusahaanID' value={this.state.PerusahaanID} />
                        <Row>
                            <Row6><FormInput label='Kode / SKU' name='SKU' value={Detail.SKU || ""} onChange={(e) => this.handleChange(e)} required={true} /></Row6>
                            <Row6><FormInput label='Nama' name='Nama' value={Detail.Nama || ""} onChange={(e) => this.handleChange(e)} required={true} /></Row6>

                            <Row6><FormInput type="number" label='Qty / Jumlah' name='Qty' value={Detail.Qty || "0"} onChange={(e) => this.handleChange(e)} required={true} /></Row6>
                            <Row6><FormInput type="number" label='Harga' name='Harga' value={Detail.Harga || "0"} onChange={(e) => this.handleChange(e)} required={true} /></Row6>

                            <Row6> <FormInput type='select' label='Jenis' name='Jenis' value={Detail.Jenis || ""} onChange={(e) => this.handleChange(e)} required={true} data={[
                                { Nama: "Barang", ID: "Barang" },
                                { Nama: "Jasa", ID: "Jasa" },
                            ]} /></Row6>
                            <Row6><FormInput type="text" label='Kategori' name='Kategori' value={Detail.Kategori || ""} onChange={(e) => this.handleChange(e)} required={true} /></Row6>
                        </Row>

                        <FormInput type="textarea" label='Keterangan' name='Keterangan' value={Detail.Keterangan || ""} onChange={(e) => this.handleChange(e)} />
                        <FormInput type='select' label='Status' name='Status' value={Detail.Status || ""} onChange={(e) => this.handleChange(e)} required={true} data={[
                            { Nama: "Ready", ID: "Aktif" },
                            { Nama: "Tidak Ready", ID: "Draft" }
                        ]} />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalForm">
                        <button type='submit' className='btn btn-default'><i className='fas fa-save'></i> Simpan</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalDetail' className='modal-lg' title='Detail Kontak' >
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
