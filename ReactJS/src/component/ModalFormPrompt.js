import React, { createRef } from "react";
import { Modal, ModalBody, ModalFooter } from '../component/Modal';
import { DxFormInput } from '../component/FormInput';
import { DxSubmitForm } from "../Modul.js";

export default class ModalFormPaket extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Detail: {},
            ID: "",
            PerusahaanID: ""
        };
        this.validationForm = createRef();
    }

    componentDidMount() {
        this.setState({ Detail: this.props.Detail, ID: this.props.ID, PerusahaanID: this.props.PerusahaanID });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.Detail !== this.props.Detail) this.setState({ Detail: this.props.Detail, ID: this.props.ID, PerusahaanID: this.props.PerusahaanID });
    }

    handleChange(e, obj) {
        let Detail = this.state.Detail;
        Detail[obj] = e.value;
        this.setState({ Detail });
    }

    render() {
        let { Detail, ID } = this.state;
        return (
            <Modal id='modalFormPrompt' className='modal-xl' title={ID == "" ? "Tambah Propmt" : "Edit Prompt"} form={true} validationRef={this.validationForm} onSubmit={(e) => DxSubmitForm(e, this.validationForm, { crud: "crudprompt", fn: () => this.props.submit() })} >
                <ModalBody>
                    <input type='hidden' name='act' value={ID == "" ? "tambah" : "edit"} />
                    <input type='hidden' name='ID' value={ID} />
                    <input type='hidden' name='PerusahaanID' value={this.state.PerusahaanID} />
                    <DxFormInput label='Nama Prompt' name='Nama' value={Detail.Nama || ""} onChange={(e) => this.handleChange(e, 'Nama')} required={true} />
                    <DxFormInput type="textarea" label='Prompt' name='Prompt' value={Detail.Prompt || ""} height="500" onChange={(e) => this.handleChange(e, 'Prompt')} required={true} />
                </ModalBody>
                <ModalFooter btnClose="btnTutupModalForm">
                    <button type='submit' className='btn btn-default' id='btnSave'><i className='fas fa-save'></i> Simpan</button>
                </ModalFooter>
            </Modal>
        )
    }
}