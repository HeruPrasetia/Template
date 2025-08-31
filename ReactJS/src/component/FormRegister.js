import { Row, Row6 } from './Rows.js';
import { DxFormInput, FormControl } from './FormInput.js';
import React, { Fragment } from 'react';
import { api, numberFormat, pesan } from '../Modul.js';

class CardRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Detail: { Reff: "", NilaiPromo: 0 },
            Paket: {}
        };
    }

    componentDidMount() {
        this.setState({ Paket: this.props.Paket });
    }

    componentDidUpdate(prev) {
        if (prev.Paket !== this.props.Paket) this.setState({ Paket: this.props.Paket });
    }

    async handleCekPromo() {
        let Paket = this.state.Paket;
        if (this.state.Detail.Reff == "") return pesan("Gagal", "Silahkan masukan Kode Promo", "error");
        let sql = await api("cekpromo", { PaketID: Paket.ID, Jenis: "Register", Kode: this.state.Detail.Reff });
        if (sql.status == "sukses") {
            let Promo = sql.data;
            let Diskon = 0;
            if (Promo.JenisNominal == "Nominal") {
                Diskon = Promo.Nominal;
            } else {
                Diskon = Promo.Nominal / 100 * Paket.Harga;
            }
            let Detail = this.state.Detail;
            Detail.NilaiPromo = Diskon;
            this.setState({ Detail });
        } else {
            pesan("Gagal", sql.pesan, "error");
        }
    }

    handleChange(e, obj) {
        let Detail = this.state.Detail;
        Detail[obj] = e.value;
        this.setState({ Detail });
    }

    render() {
        let { Paket, Detail } = this.state;
        return (
            <Fragment>
                <input type='hidden' name='PaketID' value={Paket.ID} />
                <input type='hidden' name='NilaiPromo' value={Detail.NilaiPromo} />
                <input type='hidden' name='DataPaket' value={JSON.stringify(Paket)} />
                <DxFormInput label='Nama' name="Nama" placeholder='Silahkan isi nama' value={Detail.Nama || ""} onChange={(e) => this.handleChange(e, 'Nama')} required={true} />
                <DxFormInput label='Email' name="Email" placeholder='Silahkan isi Email' value={Detail.Email || ""} onChange={(e) => this.handleChange(e, 'Email')} required={true} />
                <DxFormInput type='number' label='No.WhatsApp' name="Telp" placeholder='Silahkan isi Telp' value={Detail.Telp || ""} onChange={(e) => {
                    let Detail = this.state.Detail;
                    let val = e.value.toString();
                    val = val.replace(/\D/g, '');
                    if (val.startsWith("0")) {
                        val = "62" + val.substring(1);
                    } else if (!val.startsWith("62")) {
                        val = "62" + val;
                    }

                    Detail.Telp = val;
                    this.setState({ Detail });
                }}
                    required={true} />
                <DxFormInput type='textarea' label='Alamat' name="Alamat" placeholder='Silahkan isi Alamat' value={Detail.Alamat || ""} onChange={(e) => this.handleChange(e, 'Alamat')} required={false} />
                <Row>
                    <Row6><DxFormInput type='password' name="Password" label='Password' placeholder='Silahkan isi Password' value={Detail.Password || ""} onChange={(e) => this.handleChange(e, 'Password')} required={true} /></Row6>
                    <Row6><DxFormInput type='password' name="RePassword" label='Ulangi Password' placeholder='Silahkan isi Password' value={Detail.RePassword || ""} onChange={(e) => this.handleChange(e, 'RePassword')} required={true} /></Row6>
                </Row>
                <div className='input-group' style={({ disabled: Paket.IsTrial == 1 ? true : false })}>
                    <FormControl label='Kode Referal' name="Reff" placeholder='Silahkan isi Kode Refferal' value={Detail.Reff || ""} onChange={(e) => this.handleChange(e.target, 'Reff')} disabled={Paket.IsTrial == 1 ? true : false} />
                    <button type='button' className='btn btn-sm btn-default' onClick={() => this.handleCekPromo()} disabled={Paket.IsTrial == 1 ? true : false}>Cek</button>
                </div>
                <p></p>
                <table className='table table-striped'>
                    <tbody>
                        <tr>
                            <td width="150px">Nama Paket</td>
                            <td>:</td>
                            <td>{Paket.Nama}</td>
                        </tr>
                        <tr>
                            <td width="150px">Harga</td>
                            <td>:</td>
                            <td>{numberFormat(Paket.Harga)}</td>
                        </tr>
                        <tr>
                            <td width="150px">Diskon</td>
                            <td>:</td>
                            <td>{numberFormat(Paket.Diskon)}</td>
                        </tr>
                        <tr>
                            <td width="150px">Voucher / Promo</td>
                            <td>:</td>
                            <td>{numberFormat(Detail.NilaiPromo)}</td>
                        </tr>
                        <tr>
                            <td width="150px">Total</td>
                            <td>:</td>
                            <td>{numberFormat(Paket.Harga - (Paket.Diskon + Detail.NilaiPromo))}</td>
                        </tr>
                    </tbody>
                </table>
            </Fragment>
        );
    }
}

export default CardRegister;