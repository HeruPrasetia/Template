import React, { Suspense } from "react";
import { DxSubmitForm } from "../Modul.js";
import { DxFormInput } from './FormInput';
const ValidationGroup = React.lazy(() => import('devextreme-react/validation-group'));

export default class ModalFormPelanggan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Service: {},
            Singkatan: {},
            DataSingkatan: []
        };
        this.validationForm = React.createRef();
    }

    componentDidMount() {
        this.setState({
            Service: this.props.Service || {},
            Singkatan: this.props.Singkatan || {},
            DataSingkatan: this.props.Singkatan
                ? Object.entries(this.props.Singkatan).map(([Singkatan, Penjelasan]) => ({
                    Singkatan,
                    Penjelasan,
                }))
                : []
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.Service !== this.props.Service || prevProps.Singkatan !== this.props.Singkatan) {
            this.handleUpdate();
        }
    }

    handleUpdate() {
        let Service = this.props.Service || {};
        let Singkatan = this.props.Singkatan || {};
        let DataSingkatan = Object.entries(Singkatan).map(([Singkatan, Penjelasan]) => ({
            Singkatan,
            Penjelasan,
        }));
        this.setState({ Service, Singkatan, DataSingkatan });
    }

    handleChangeService(e, obj) {
        const Service = {
            ...this.state.Service,
            [obj]: e.value
        };
        this.setState({ Service });
    }

    handleChangeSingkatan = (index, field, value) => {
        const DataSingkatan = [...this.state.DataSingkatan];
        DataSingkatan[index][field] = value;
        this.setState({ DataSingkatan });
    };

    handleDeleteSingkatan = (index) => {
        const DataSingkatan = this.state.DataSingkatan.filter((_, i) => i !== index);
        this.setState({ DataSingkatan });
    };

    render() {
        let { Service, DataSingkatan } = this.state;
        let temp = {};
        for (let dd of DataSingkatan) temp[dd.Singkatan] = dd.Penjelasan;
        return (
            <Suspense>
                <ValidationGroup ref={this.validationForm}>
                    <form onSubmit={(e) => DxSubmitForm(e, this.validationForm, { crud: "crudpartner", fn: () => this.props.submit(this.state.DataSingkatan) })} className='needs-validation' noValidate>
                        <input type="hidden" name="act" value="edit setting" />
                        <input type="hidden" name="DataSingkatan" value={JSON.stringify(temp)} />
                        <input type="hidden" name="AiTutorial" value="" />
                        <DxFormInput type='text' label='Google Script' name='GoogleScript' value={Service.GoogleScript} onChange={(e) => this.handleChangeService(e, 'GoogleScript')} placeholder='Google Script' />
                        <DxFormInput type='text' label='Meta Script' name='MetaScript' value={Service.MetaScript} onChange={(e) => this.handleChangeService(e, 'MetaScript')} placeholder='Meta Script' />
                        <DxFormInput type='text' label='TikTok Script' name='TiktokScript' value={Service.TiktokScript} onChange={(e) => this.handleChangeService(e, 'TiktokScript')} placeholder='TikTok Script' />
                        <DxFormInput type='text' label='Snap Script' name='SnapScript' value={Service.SnapScript} onChange={(e) => this.handleChangeService(e, 'SnapScript')} placeholder='Snap Script' />
                        <DxFormInput type='textarea' label='Prompt AI CS' name='AiCustomer' value={Service.AiCustomer} onChange={(e) => this.handleChangeService(e, 'AiCustomer')} placeholder='Prompt Untuk AI CS' />
                        <DxFormInput type='textarea' label='Pesan Registrasi Berhasil' name='PesanRegistrasi' value={Service.PesanRegistrasi} onChange={(e) => this.handleChangeService(e, 'PesanRegistrasi')} placeholder='Pesan ketika pelanggan berhasil registrasi' />

                        <h5>Daftar Singkatan Kata <i className="fa-solid fa-circle-plus color-default cursor" onClick={() => {
                            let Singkatan = [{ Singkatan: "", Penjelasan: "" }];
                            for (let dd of DataSingkatan) Singkatan.push(dd);
                            this.setState({ DataSingkatan: Singkatan });
                        }} /></h5>
                        <div className="table-respondive" style={{ maxHeight: "200px", overflowY: "auto" }}>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Singkatan</th>
                                        <th>Arti</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        DataSingkatan.map((item, i) => (
                                            <tr key={i}>
                                                <td>
                                                    <i className="fas fa-trash-alt text-danger" style={{ cursor: "pointer" }} onClick={() => this.handleDeleteSingkatan(i)} />
                                                </td>
                                                <td>
                                                    <input value={item.Singkatan} className="form-control form-control-sm" required onChange={(e) => this.handleChangeSingkatan(i, "Singkatan", e.target.value)} />
                                                </td>
                                                <td>
                                                    <input value={item.Penjelasan} className="form-control form-control-sm" required onChange={(e) => this.handleChangeSingkatan(i, "Penjelasan", e.target.value)} />
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                        <button type='submit' className='btn btn-default w-100'>
                            <i className='fas fa-save'></i> Simpan Perubahan
                        </button>
                    </form>
                </ValidationGroup>
            </Suspense>
        )
    }
}
