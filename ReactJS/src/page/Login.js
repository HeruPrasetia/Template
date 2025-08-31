import React from 'react';
import { api, pesan, openModal, host, isJson, DxSubmitForm } from '../Modul';
import { ValidationGroup } from 'devextreme-react/validation-group';
import { DxFormInput } from '../component/FormInput';
import { Modal, ModalBody, ModalFooter } from '../component/Modal';
import BG2 from '../assets/img/bg-2.png';
import CardProduk from '../component/CardProduk';
import CardPayment from '../component/CardPayment';
import FormRegister from '../component/FormRegister';
import LoginGoogle from '../component/GoogleLogin'
import '../Login.css';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Email: "",
            Pwd: "",
            clsLogin: "",
            btnLogin: false,
            Profile: this.props.Profile,
            DataPaket: [],
            DetailPaket: {},
            Detail: {}
        };
        this.validationReff = React.createRef();
        this.validationRegister = React.createRef();
        this.validationReset = React.createRef();
        this.validationPayment = React.createRef();
    }

    componentDidMount() {
        this.setState({ Profile: this.props.Profile });
    }

    componentDidUpdate(prev) {
        if (prev.Profile != this.props.Profile) this.setState({ Profile: this.props.Profile });
    }

    async handleLogin(e) {
        e.preventDefault();
        e.stopPropagation();
        let Form = e.target;
        let btn = Form.querySelector('button[type="submit"]');
        btn.disabled = true;
        let i = btn.querySelector('i');
        let oldCls = i.className;
        i.className = "spinner-border spinner-border-sm text-light";
        const result = this.validationReff.current?.instance.validate();
        if (result.isValid) {
            let data = new FormData(e.target);
            data.append("Domain", window.location.hostname);
            fetch(host + "loginapp", {
                method: 'POST',
                body: data,
            }).then(response => response.text()).then(res => {
                if (isJson(res)) {
                    let hasil = JSON.parse(res);
                    if (hasil.status === "sukses") {
                        localStorage.setItem("TokenUserWA", hasil.Token);
                        window.location.reload();
                    } else {
                        btn.disabled = false;
                        i.className = oldCls;
                        pesan("Login Gagal", hasil.pesan, "info");
                    }
                } else {
                    btn.disabled = false;
                    i.className = oldCls;
                    pesan("Login Gagal", "Terjadi kesalahan", "info");
                }
            }).catch((error) => {
                btn.disabled = false;
                i.className = oldCls;
                console.log("Error: " + error);
            });
        } else {
            btn.disabled = false;
            i.className = oldCls;
        }
    }

    handleVisible(e) {
        let cls = e.target;
        let edtPwd = document.getElementById('edtPwd');
        if (edtPwd.type == "password") {
            cls.classList.remove("fa-eye-slash");
            cls.classList.add("fa-eye");
            edtPwd.type = "text";
        } else {
            cls.classList.add("fa-eye-slash");
            cls.classList.remove("fa-eye");
            edtPwd.type = "password";
        }
    }

    async handleModalPaket() {
        let sql = await api("datapaket", { IsTrial: "1", PaketType: "Register" });
        if (sql.status == "sukses") this.setState({ DataPaket: sql.data, Detail: this.state.Profile, Service: sql.Service }, openModal("modalPaket"));
    }

    async handlePilihPaket(data) {
        this.setState({ Detail: {}, DetailPaket: data }, () => {
            document.getElementById('btnTutupModalPaket').click();
            openModal("modalRegister");
        });
    }

    handleChange(e, obj) {
        let Detail = this.state.Detail;
        Detail[obj] = e.value;
        this.setState({ Detail });
    }

    render() {
        let { Profile } = this.state;
        return (
            <section>
                <div className="row">
                    <div className="col-md-8">
                        <div className="div-img-top">
                            {
                                this.state.Profile.LogoPanjang ?
                                    <img src={host + "file/" + this.state.Profile.LogoPanjang} className="logo" alt="Logo" />
                                    :
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                            }
                        </div>
                        <div className="card-form">
                            <ValidationGroup ref={this.validationReff}>
                                <form id="formLogin" className="needs-validation" onSubmit={(e) => this.handleLogin(e)} noValidate>
                                    <h4>Login</h4>
                                    <h6>Selamat datang  di {this.state.Profile.Nama}</h6>
                                    <DxFormInput type='email' name='Email' label='Alamat Email' value={this.state.Email} onChange={(e) => this.setState({ Email: e.value })} required={true} />
                                    <DxFormInput type='password' name='Pwd' label='Kata Sandi' value={this.state.Pwd} onChange={(e) => this.setState({ Pwd: e.value })} required={true} />
                                    <span className='d-flex justify-content-end btn btn-link' onClick={() => {
                                        this.setState({ Detail: { Email: "" } }, openModal("modal"));
                                    }}>Lupa Password?</span>
                                    <button className=" btn btn-lg w-100 btn-default" id="btnLogin" type='submit'>
                                        <i className='fas fa-login'></i> Login
                                    </button>
                                </form>
                            </ValidationGroup>
                            <p></p>
                            <LoginGoogle />
                            <button onClick={() => this.handleModalPaket()} className="btn btn-link">Register Sekarang</button>
                        </div>
                    </div>
                    <div className="col-md-4" style={{ padding: "0px" }}>
                        <div className="bg-side" style={{ backgroundImage: `url("${host + 'file/' + this.state.Profile.Sidebar}")` }}>
                            <img src={Profile.Login == "none" ? BG2 : host + 'file/' + Profile.Login} className="img-side-bottom"></img>
                        </div>
                    </div>
                    <div id='divPesan'></div>
                </div>

                <Modal id='modalPaket' className='modal-fullscreen' title="Paket Unggulan">
                    <ModalBody>
                        <div style={{ minWidth: "200px", overflowX: "auto" }}>
                            <div className='d-flex justift-content-start align-items-center gap-2'>
                                {
                                    this.state.DataPaket.map((div, i) => {
                                        return <CardProduk opt={div} handleclick={(opt) => this.handlePilihPaket(opt)} />
                                    })
                                }
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalPaket" />
                </Modal>

                <Modal id='modalRegister' title="Silahkan isi data diri" validationRef={this.validationRegister} form={true} onSubmit={(e) => DxSubmitForm(e, this.validationRegister, { crud: "registerapp", fn: (data) => window.location.href = `./konfirmasipayment/${data.DocNumber}` })} >
                    <ModalBody>
                        <FormRegister Paket={this.state.DetailPaket} />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupMidalRegister">
                        <button className='btn btn-default' type='submit'><i className="fas fa-sign-in-alt"></i> Daftar</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalPayment' title="Konfirmasi Pembayaran" validationRef={this.validationPayment} form={true} onSubmit={(e) => DxSubmitForm(e, this.validationPayment, { crud: "reqresetpwd", fn: () => pesan("", "Permintaan Sudah di kirim ke " + this.state.Detail.Email, "info") })} >
                    <ModalBody>
                        <CardPayment />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalPayment">
                        <button className='btn btn-danger' type='submit'><i className="fas fa-lock-open"></i> Kirim Permintaan</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modal' title="Lupa Password" validationRef={this.validationReset} form={true} onSubmit={(e) => DxSubmitForm(e, this.validationReset, { crud: "reqresetpwd", fn: () => pesan("", "Permintaan Sudah di kirim ke " + this.state.Detail.Email, "info") })} >
                    <ModalBody>
                        <DxFormInput label='Masukan Alamat Email Terdaftar' name="Email" placeholder='Silahkan isi nama' value={this.state.Detail.Email || ""} onChange={(e) => this.handleChange(e, 'Email')} required={true} />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupMidalReset">
                        <button className='btn btn-danger' type='submit'><i className="fas fa-lock-open"></i> Kirim Permintaan</button>
                    </ModalFooter>
                </Modal>
            </section>
        )
    }
}

export default Login;