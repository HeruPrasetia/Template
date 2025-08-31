import React, { Suspense, Fragment } from "react";
import { Row, Row6, Row4 } from './Rows.js'
import { DxSubmitForm } from "../Modul.js";
import { FormInput, DxFormInput } from './FormInput';
import imgLoading from '../assets/img/loading-upload.gif';
const ValidationGroup = React.lazy(() => import('devextreme-react/validation-group'));

export default class ModalFormPelanggan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Service: {}
        };
        this.validationForm = React.createRef();
    }

    componentDidMount() {
        this.setState({ Service: this.props.Service });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.Service !== this.props.Service) this.setState({ Service: this.props.Service });
    }

    handleChange(e, obj) {
        let Detail = this.state.Detail;
        Detail[obj] = e.value;
        this.setState({ Detail });
    }

    handleChangeService(e, obj) {
        const Service = {
            ...this.state.Service,
            [obj]: e.value
        };
        this.setState({ Service });
    }

    handlePilihImage(e, obj) {
        let Service = this.state.Service;
        Service[obj] = imgLoading;
        let files = e.target.files;
        let reader = new FileReader();
        let file = files[0];
        reader.onload = async () => {
            Service[obj] = reader.result;
            this.setState({ Service });
        };
        reader.readAsDataURL(file);
    }

    render() {
        let { Service } = this.state;
        return (
            <Suspense>
                <ValidationGroup ref={this.validationForm}>
                    <form onSubmit={(e) => DxSubmitForm(e, this.validationForm, { crud: "crudpartner", fn: (e) => window.location.reload() })} className='needs-validation' noValidate>
                        <input type='hidden' name='ID' value={Service.ID} />
                        <input type='hidden' name='act' value="edit service" />
                        <Row>
                            <Row6><DxFormInput label='Nama' name='Nama' value={Service.Nama} onChange={(e) => this.handleChangeService(e, 'Nama')} placeholder='Nama Usaha' required={true} /></Row6>
                            <Row6><DxFormInput type="email" name='Email' label='Alamat Email' value={Service.Email} onChange={(e) => this.handleChangeService(e, 'Email')} placeholder='Email Usaha' required={true} /></Row6>
                            <Row6><DxFormInput label='No. Telp' name='Telp' value={Service.Telp} onChange={(e) => this.handleChangeService(e, 'Telp')} placeholder='Telp Usaha' required={true} /></Row6>
                            <Row6><DxFormInput type='select' label='No. WhatsApp' name='WaID' value={Service.WaID} onChange={(e) => this.handleChangeService(e, 'WaID')} placeholder='No. WhatsApp' data={this.state.DataDevice} required={true} /></Row6>
                        </Row>
                        <DxFormInput type='textarea' label='Alamat' name='Alamat' value={Service.Alamat} onChange={(e) => this.handleChangeService(e, 'Alamat')} placeholder='Alamat Usaha' required={true} />
                        <DxFormInput type='select' label='Style' name='Style' value={Service.Style} onChange={(e) => {
                            document.getElementById("theme-link").href = e.value;
                            let Service = this.state.Service;
                            Service.Style = e.value;
                            this.setState({ Service });
                        }} placeholder='Alamat Usaha' data={this.state.ListCss} required={true} />
                        <b>Setting Payment</b>
                        <p></p>
                        <DxFormInput type='select' label='Jenis Pembayaran' name='PaymentType' value={Service.PaymentType} onChange={(e) => this.handleChangeService(e, 'PaymentType')} data={[
                            { ID: "Manual", Nama: "Manual Konfirmasi" },
                            { ID: "Midtrans", Nama: "Midtrans Payment Getway" },
                        ]} required={true} />
                        {
                            Service.PaymentType == "Midtrans" ?
                                <DxFormInput type="select" label='Mode Payment' name='PaymentMode' value={Service.PaymentMode} onChange={(e) => this.handleChangeService(e, 'PaymentMode')} data={[
                                    { ID: "Trial", Nama: "Uji Coba" },
                                    { ID: "Production", Nama: "Rilis Production" },
                                ]} required={true} />
                                : ""
                        }
                        <Row>
                            {
                                Service.PaymentType == "Midtrans" ?
                                    <Fragment>
                                        <Row6><DxFormInput label='Midtrans Client Key' name='PaymentClientKey' value={Service.PaymentClientKey} onChange={(e) => this.handleChangeService(e, 'PaymentClientKey')} placeholder='Midtrans Client Key' required={true} /></Row6>
                                        <Row6><DxFormInput label='Midtrans Server Key' name='PaymentServerKey' value={Service.PaymentServerKey} onChange={(e) => this.handleChangeService(e, 'PaymentServerKey')} placeholder='Midtrans Server Key' required={true} /></Row6>
                                    </Fragment>
                                    : ""
                            }
                        </Row>
                        <b>Setting Preference</b>
                        <p></p>
                        <Row>
                            <Row6><FormInput type="color" label='Warna Utama' name='ColorDefault' value={Service.ColorDefault} onChange={(e) => {
                                let Service = this.state.Service;
                                Service.ColorDefault = e.target.value;
                                this.setState({ Service });
                            }} required={true} /></Row6>
                            <Row6><FormInput type="color" label='Warna Aksen' name='ColorSecondary' value={Service.ColorSecondary} onChange={(e) => {
                                let Service = this.state.Service;
                                Service.ColorSecondary = e.target.value;
                                this.setState({ Service });
                            }} required={true} /></Row6>
                            <Row4>
                                <div className='form-group'>
                                    <label>Logo</label>
                                    <label className='card shadow'>
                                        <input name='Logo' type='file' accept='image/*' className='d-none' onChange={(e) => this.handlePilihImage(e, "Logo")} />
                                        <img src={Service.Logo} htmlFor="Logo" style={{ width: "100%" }} />
                                    </label>
                                </div>
                            </Row4>
                            <Row4>
                                <div className='form-group'>
                                    <label>Logo Panjang</label>
                                    <label className='card shadow'>
                                        <input name='LogoPanjang' type='file' accept='image/*' className='d-none' onChange={(e) => this.handlePilihImage(e, "LogoPanjang")} />
                                        <img src={Service.LogoPanjang} htmlFor="LogoPanjang" style={{ width: "100%" }} />
                                    </label>
                                </div>
                            </Row4>
                            <Row4>
                                <div className='form-group'>
                                    <label>Background Sidebar</label>
                                    <label className='card shadow'>
                                        <input name='Sidebar' type='file' accept='image/*' className='d-none' onChange={(e) => this.handlePilihImage(e, "Sidebar")} />
                                        <img src={Service.Sidebar} htmlFor="Sidebar" style={{ width: "100%" }} />
                                    </label>
                                </div>
                            </Row4>
                        </Row>
                        <button type='submit' className='btn btn-default w-100'><i className='fas fa-save'></i> Simpan Perubahan</button>
                    </form>
                </ValidationGroup>
            </Suspense>
        )
    }
}