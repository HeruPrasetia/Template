import { Row, Row6 } from './Rows.js';
import { DxFormInput } from './FormInput.js';
import React, { Fragment } from 'react';
import imgUpload from '../assets/img/img-upload.png';
import imgLoading from '../assets/img/loading-upload.gif';

class CardPayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Nama: "",
            Telp: "62",
            Keterangan: "",
            BuktiTfPelanggan: imgUpload
        };
    }

    handlePilihImage(e, obj) {
        this.setState({ imgLoading: imgLoading });
        let files = e.target.files;
        let reader = new FileReader();
        let file = files[0];
        reader.onload = async () => this.setState({ BuktiTfPelanggan: reader.result });
        reader.readAsDataURL(file);
    }

    render() {
        return (
            <Fragment>
                <Row>
                    <Row6><DxFormInput label='Nama Pengirim' name='Nama' value={this.state.Nama} onChange={(e) => this.setState({ Nama: e.value })} required={true} /></Row6>
                    <Row6><DxFormInput type='number' label='No Wa Pengirim' name='Telp' value={this.state.Telp} onChange={(e) => {
                        let val = e.value.toString();
                        val = val.replace(/\D/g, '');
                        if (val.startsWith("0")) {
                            val = "62" + val.substring(1);
                        } else if (!val.startsWith("62")) {
                            val = "62" + val;
                        }
                        this.setState({ Telp: val });
                    }} required={true} /></Row6>
                </Row>
                <DxFormInput type="textarea" label='Notes' name='Keterangan' value={this.state.Keterangan} onChange={(e) => this.setState({ Keterangan: e.value })} required={true} />
                <p></p>
                <b>Bukti Transfer</b>
                <p></p>
                <label>
                    <input name='BuktiTfPelanggan' type='file' accept='image/*' className='d-none' onChange={(e) => this.handlePilihImage(e, "BuktiTfPelanggan")} />
                    <img src={this.state.BuktiTfPelanggan} htmlFor="Logo" style={{ width: "200px", height: "200px", objectFit: "cover" }} />
                </label>
            </Fragment>
        );
    }
}

export default CardPayment;