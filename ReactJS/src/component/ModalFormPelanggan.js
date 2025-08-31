import React, { Suspense } from "react";
import { Modal, ModalBody, ModalFooter } from '../component/Modal';
import { DxFormInput } from '../component/FormInput';
import { Row, Row6 } from '../component/Rows.js'
import { DxSubmitForm, saiki } from "../Modul.js";
const RendTables = React.lazy(() => import('./RendTable'));

export default class ModalFormPelanggan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Detail: {},
            ID: "",
            Menu: [],
            MenuList: []
        };
        this.validationForm = React.createRef();
    }

    componentDidMount() {
        this.setState({ Detail: this.props.Detail, ID: this.props.ID, Menu: this.props.Menu, MenuList: this.props.MenuList });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.Detail !== this.props.Detail || prevProps.Menu !== this.props.Menu) this.setState({ Detail: this.props.Detail, ID: this.props.ID, Menu: this.props.Menu, MenuList: this.props.MenuList });
    }

    handleChange(e, obj) {
        let Detail = this.state.Detail;
        Detail[obj] = e.value;
        this.setState({ Detail });
    }

    handleCheckAll(e) {
        let chk = e.target;
        let Menu = this.state.Menu;
        let Akses = [];
        for (let dd in Menu) {
            Menu[dd].checked = chk.checked;
            if (chk.checked == true) Akses.push(Menu[dd]);
        }
        this.setState({ Menu: Menu, MenuList: Akses });
    }

    handlePilihMenu(e, data, i) {
        let chk = document.getElementById(`tableKontak${data.ID}`);
        let Menu = this.state.Menu;
        let Akses = [];
        for (let dd in Menu) {
            if (Menu[dd].ID == data.ID) {
                Menu[dd].checked = chk.checked;
            }
            if (Menu[dd].checked == true) Akses.push(Menu[dd]);
        }
        this.setState({ Menu: Menu, MenuList: Akses });
    }

    render() {
        let { Detail, ID } = this.state;
        return (
            <Modal id='modalForm' className='modal-lg' title={ID == "" ? "Tambah Pelanggan" : "Edit Pelanggan"} validationRef={this.validationForm} form={true} onSubmit={(e) => DxSubmitForm(e, this.validationForm, { crud: "crudclient", fn: () => this.props.submit() })} >
                <ModalBody>
                    <input type='hidden' name='act' value={ID == "" ? "tambah" : "edit"} />
                    <input type='hidden' name='ID' value={ID} />
                    <input type='hidden' name='MenuList' value={JSON.stringify(this.state.MenuList)} />
                    <Row>
                        <Row6><DxFormInput label='Nama' name='Nama' value={Detail.Nama || ""} onChange={(e) => this.handleChange(e, 'Nama')} required={true} /></Row6>
                        <Row6><DxFormInput type='text' label='Telp' name='Telp' value={Detail.Telp || "62"} onChange={(e) => this.handleChange(e, 'Telp')} required={true} /></Row6>

                        <Row6><DxFormInput label='Email' name='Email' value={Detail.Email || ""} onChange={(e) => this.handleChange(e, 'Email')} required={true} /></Row6>
                        <Row6><DxFormInput label='Alamat' name='Alamat' value={Detail.Alamat || ""} onChange={(e) => this.handleChange(e, 'Alamat')} required={true} /></Row6>

                        <Row6><DxFormInput type='date' label='Tanggal Aktif' name='Aktif' value={Detail.Aktif || saiki()} onChange={(e) => this.handleChange(e, 'Aktif')} required={true} disabled={ID == "" ? false : true} /></Row6>
                        <Row6><DxFormInput type='date' label='Tanggal Berakhir' name='Sampai' value={Detail.Sampai || saiki()} onChange={(e) => this.handleChange(e, 'Sampai')} required={true} disabled={ID == "" ? false : true} /></Row6>

                        <Row6><DxFormInput type='number' label='Jumlah Device WA' name='MaxDevice' value={Detail.MaxDevice || "1"} onChange={(e) => this.handleChange(e, 'MaxDevice')} required={true} /></Row6>
                        <Row6><DxFormInput type='text' label='No. Referal' name='Reff' value={Detail.Reff || ""} onChange={(e) => this.handleChange(e, 'Reff')} /></Row6>
                    </Row>

                    <h6>Menu</h6>
                    <Suspense>
                        <RendTables
                            thead={[
                                { cap: "", sort: "checked", type: "checkbox", fn: (e) => this.handleCheckAll(e), fnitem: (e, data, i) => this.handlePilihMenu(e, data, i) },
                                { cap: "Nama", sort: "Nama", type: "str" }
                            ]}
                            tbody={this.state.Menu}
                            id="tableKontak"
                        />
                    </Suspense>
                </ModalBody>
                <ModalFooter btnClose="btnTutupModalForm">
                    <button type='submit' className='btn btn-default'><i className='fas fa-save'></i> Simpan</button>
                </ModalFooter>
            </Modal>
        )
    }
}