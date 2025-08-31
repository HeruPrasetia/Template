import React, { Fragment } from 'react';
import { api, pesan, DxSubmitForm } from '../Modul';
import withRouter from "../withRouter";
import { ValidationGroup } from 'devextreme-react/validation-group';
import FormRegister from '../component/FormRegister';

class Login extends React.Component {
    constructor(props) {
        super(props);
        const params = new URLSearchParams(window.location.search);
        const paket = params.get("paket");
        this.state = {
            Email: "",
            SysAkses: {},
            Pwd: "",
            Profile: {},
            paket: paket || "",
            id: "",
            Detail: {},
            Data: {}
        };
        this.validationReff = React.createRef();
    }

    async componentDidMount() {
        let { paket } = this.props.params;
        if (paket == undefined) window.location.href = '../';
        let sql = await api("getProfile", { service: true });
        if (sql.status == "sukses") {
            document.documentElement.style.setProperty('--color-primary', sql.profile.ColorDefault);
            this.setState({ Profile: sql.profile, SysAkses: sql.data, paket: paket }, async () => {
                let Paket = await api("detailpaket", { Link: paket });
                if (Paket.status == "sukses") {
                    if (!Paket.data) window.location.href = '../';
                    this.setState({ Data: Paket.data });
                } else {
                    pesan("", "Paket tidak di temukan", 'error');
                    if (!Paket.data) window.location.href = '../';
                }
            });
        }
    }

    render() {
        return (
            <div className='container d-flex justify-content-center vh-100 align-items-center' style={{ overflowY: "auto" }}>
                <div className='card shadow' style={{ borderRadius: "20px", maxHeight: "90vh", overflowY: "auto" }}>
                    <div className='card-body'>
                        <h5 style={{ textAlign: "Center" }}>Registrasi</h5>
                        <p></p>
                        <span>Silahkan isi data berikut : </span>
                        <p></p>
                        <ValidationGroup ref={this.validationReff}>
                            <form onSubmit={(e) => DxSubmitForm(e, this.validationReff, { crud: "registerapp", fn: (data) => window.location.href = `../konfirmasipayment/${data.DocNumber}` })} >
                                <FormRegister Paket={this.state.Data} />
                                <p></p>
                                <button className="btn btn-default w-100" type='submit'><i className='fas fa-save' style={{ paddingRight: "10px" }} /> Daftar</button>
                            </form>
                        </ValidationGroup>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Login);