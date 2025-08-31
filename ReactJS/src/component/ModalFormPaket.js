import React, { Fragment, createRef } from "react";
import { Modal, ModalBody, ModalFooter } from '../component/Modal';
import { DxFormInput, FormSwitch } from '../component/FormInput';
import { Row, Row6 } from '../component/Rows.js'
import { DxSubmitForm } from "../Modul.js";

export default class ModalFormPaket extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Detail: {},
            ID: ""
        };
        this.validationFormPaket = React.createRef();
    }

    componentDidMount() {
        this.setState({ Detail: this.props.Detail, ID: this.props.ID });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.Detail !== this.props.Detail) this.setState({ Detail: this.props.Detail, ID: this.props.ID });
    }

    handleChange(e, obj) {
        let Detail = this.state.Detail;
        Detail[obj] = e.value;
        this.setState({ Detail });
    }

    render() {
        let { Detail, ID } = this.state;
        return (
            <Modal id='modalFormPaket' className='modal-lg' title={ID == "" ? "Tambah Paket" : "Edit Paket"} validationRef={this.validationFormPaket} form={true} onSubmit={(e) => DxSubmitForm(e, this.validationFormPaket, { crud: "crudpaket", fn: () => this.props.submit() })} >
                <ModalBody>
                    <input type='hidden' name='act' value={ID == "" ? "tambah paket" : "edit paket"} />
                    <input type='hidden' name='ID' value={ID} />
                    <input type='hidden' name='IsFavorit' value={Detail.IsFavorit || 0} />
                    <Row>
                        <Row6><DxFormInput type='select' label='Jenis Paket' name='PaketType' value={Detail.PaketType || ""} onChange={(e) => this.handleChange(e, 'PaketType')} data={[
                            { ID: "Register", Nama: "Register" },
                            { ID: "Top Up", Nama: "Tup Up" },
                        ]} required={true} /></Row6>
                        <Row6><DxFormInput label='Nama' name='Nama' value={Detail.Nama || ""} onChange={(e) => this.handleChange(e, 'Nama')} required={true} /></Row6>
                        <Row6><DxFormInput type='number' label='Harga' name='Harga' value={Detail.Harga || "100000"} onChange={(e) => this.handleChange(e, 'Harga')} required={true} /></Row6>
                        {
                            Detail.PaketType == "Register" ?
                                <Fragment>
                                    <Row6><DxFormInput type="number" label='Jumlah Device / Agent AI' name='MaxDevice' value={Detail.MaxDevice || "1"} onChange={(e) => this.handleChange(e, 'MaxDevice')} required={true} /></Row6>
                                    <Row6><DxFormInput type="number" label='Kuota AI Response' name='KuotaAi' value={Detail.KuotaAi || "1000"} onChange={(e) => this.handleChange(e, 'KuotaAi')} required={true} /></Row6>
                                    <Row6><DxFormInput type='number' label='Kuota Gambar Extractor' name='KuotaImg' value={Detail.KuotaImg || "100"} onChange={(e) => this.handleChange(e, 'KuotaImg')} required={true} /></Row6>

                                    <Row6><DxFormInput type='number' label='Kuota Voice Notes' name='KuotaVn' value={Detail.KuotaVn || "100"} onChange={(e) => this.handleChange(e, 'KuotaVn')} required={true} /></Row6>
                                    <Row6><DxFormInput type='number' label='Kuota Scrap Data' name='KuotaScrap' value={Detail.KuotaScrap || "1000"} onChange={(e) => this.handleChange(e, 'KuotaScrap')} required={true} /></Row6>
                                    <Row6><DxFormInput type='number' label='Kuota Broadcast' name='KuotaBlash' value={Detail.KuotaBlash || "1000"} onChange={(e) => this.handleChange(e, 'KuotaBlash')} required={true} /></Row6>

                                    <Row6><DxFormInput type='select' label='SkemaPerpanjangan' name='SkemaPerpanjangan' value={Detail.SkemaPerpanjangan || "Reset Kuota"} onChange={(e) => this.handleChange(e, 'SkemaPerpanjangan')} required={true} data={[
                                        { ID: "Reset Kuota", Nama: "Reset Kuota" },
                                        { ID: "Akumulasi Kuota", Nama: "Akumulasi Kuota" }
                                    ]} /></Row6>
                                    <Row6><DxFormInput type='number' label='Masa Aktif (Dalam Hari)' name='MasaAktif' value={Detail.MasaAktif || "30"} onChange={(e) => this.handleChange(e, 'MasaAktif')} required={true} /></Row6>
                                    <Row6><DxFormInput type='number' label='Diskon' name='Diskon' value={Detail.Diskon || "0"} onChange={(e) => this.handleChange(e, 'Diskon')} required={true} /></Row6>
                                    <Row6><DxFormInput type='number' label='Nomor Urut' name='IsOrder' value={Detail.IsOrder || "0"} onChange={(e) => this.handleChange(e, 'IsOrder')} required={true} /></Row6>
                                    <Row6><DxFormInput type='link' label='Link' name='Link' value={Detail.Link || ""} onChange={(e) => this.handleChange(e, 'Link')} /></Row6>
                                    <Row6><DxFormInput type='select' label='Apakah Paket Trial' name='IsTrial' value={Detail.IsTrial || 0} onChange={(e) => this.handleChange(e, 'IsTrial')} data={[
                                        { ID: 0, Nama: "Tidak" },
                                        { ID: 1, Nama: "Ya" },
                                    ]} required={true} /></Row6>
                                    <Row6><DxFormInput type='select' label='AI Agent' name='AIAgent' value={Detail.AIAgent || "Gemini"} onChange={(e) => this.handleChange(e, 'AIAgent')} data={[
                                        { ID: "Gemini", Nama: "Gemini" },
                                        { ID: "ChatGPT", Nama: "ChatGPT" },
                                        { ID: "Deepseek", Nama: "Deepseek" },
                                    ]} required={true} /></Row6>
                                </Fragment>
                                : <Fragment>
                                    <Row6><DxFormInput type='select' label='Jenis Top Up' name='JenisTopUp' value={Detail.JenisTopUp || "Chat"} onChange={(e) => this.handleChange(e, 'JenisTopUp')} data={[
                                        { ID: "Chat", Nama: "Chat" },
                                        { ID: "Broadcast", Nama: "Broadcast" },
                                        { ID: "Voice Extractor", Nama: "Voice Extractor" },
                                        { ID: "Scrap", Nama: "Scrap" },
                                        { ID: "Image Extractor", Nama: "Image Extractor" },
                                        { ID: "Wa Agent", Nama: "Wa Agent" },
                                        { ID: "Live Chat Agent", Nama: "Live Chat Agent" },
                                    ]} required={true} /></Row6>
                                    <Row6><DxFormInput type='number' label='Jumlah Top Up' name='JumlahTopUp' value={Detail.JumlahTopUp || "0"} onChange={(e) => this.handleChange(e, 'JumlahTopUp')} required={true} /></Row6>
                                </Fragment>
                        }
                        <Row6><DxFormInput type='select' label='Status' name='Status' value={Detail.Status || "Draft"} onChange={(e) => this.handleChange(e, 'Status')} required={true} data={[
                            { ID: "Draft", Nama: "Draft" },
                            { ID: "Aktif", Nama: "Aktif" }
                        ]} /></Row6>
                    </Row>
                    <DxFormInput type='textarea' label='Keterangan' name='Keterangan' value={Detail.Keterangan || ""} onChange={(e) => this.handleChange(e, 'Keterangan')} required={true} />
                    <FormSwitch id='chkFavorit' label='Paket Favorit' checked={Detail.IsFavorit} onChange={(e) => {
                        let Detail = this.state.Detail;
                        Detail.IsFavorit = e.target.checked == true ? 1 : 0;
                        this.setState({ Detail });
                    }} />
                    <div className='form-group'>
                        <label>Banner / Gambar</label>
                        <p></p>
                        <label>
                            <input name='Image' type='file' accept='image/*' className='d-none' onChange={(e) => this.handlePilihImagePaket(e, "Image")} />
                            <img src={this.state.Detail.Image} htmlFor="Image" style={{ width: "100px", height: "100px" }} />
                        </label>
                    </div>
                </ModalBody>
                <ModalFooter btnClose="btnTutupModalFormPaket">
                    <button type='submit' className='btn btn-default'><i className='fas fa-save'></i> Simpan</button>
                </ModalFooter>
            </Modal>
        )
    }
}