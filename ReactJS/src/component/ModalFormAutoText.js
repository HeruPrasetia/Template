import React from "react";
import { Modal, ModalBody, ModalFooter } from './Modal.js';
import { FormControl, FormTextarea } from "./FormInput.js";
import { submitForm } from '../Modul.js'

export default class ModalSettinfDevice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            DataAutoText: [],
            DeviceID: "",
            PerusahaanID: ""
        };
        this.validationForm = React.createRef();
    }

    componentDidMount() {
        this.setState({ DeviceID: this.props.DeviceID, DataAutoText: this.props.DataAutoText, PerusahaanID: this.props.PerusahaanID });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.DeviceID !== this.props.DeviceID || prevProps.DataAutoText !== this.props.DataAutoText) {
            this.setState({ DeviceID: this.props.DeviceID, DataAutoText: this.props.DataAutoText, PerusahaanID: this.props.PerusahaanID });
        }
    }

    render() {
        let { DeviceID, PerusahaanID, DataAutoText } = this.state;
        return (
            <Modal id='modalAutoText' className='modal-lg' title="Database Autotext" form={true} onSubmit={(e) => submitForm(e, { crud: "updateautotext", fn: () => this.props.submit() })}>
                <ModalBody>
                    <input type='hidden' name='AutoText' value={JSON.stringify(DataAutoText)} />
                    <input type='hidden' name='DeviceID' value={DeviceID} />
                    <input type='hidden' name='PerusahaanID' value={PerusahaanID} />
                    <div className='table-responsive'>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Pertanyaan</th>
                                    <th>Jawaban</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.DataAutoText.map((td, i) => {
                                        return (<tr key={i}>
                                            <td><i className='fas fa-trash-alt' onClick={() => {
                                                let data = this.state.DataAutoText;
                                                delete data[i];
                                                this.setState({ DataAutoText: data });
                                            }}></i></td>
                                            <td><FormControl value={td.Pertanyaan} required={true} onChange={(e) => {
                                                let data = this.state.DataAutoText;
                                                data[i].Pertanyaan = e.target.value;
                                                this.setState({ DataAutoText: data });
                                            }} /></td>
                                            <td><FormTextarea value={td.Jawaban} required={true} onChange={(e) => {
                                                let data = this.state.DataAutoText;
                                                data[i].Jawaban = e.target.value;
                                                this.setState({ DataAutoText: data });
                                            }} /></td>
                                        </tr>)
                                    })
                                }
                            </tbody>
                        </table>
                        <button className='btn btn-default w-100' type='button' onClick={() => {
                            let data = this.state.DataAutoText;
                            data.push({ Pertanyaan: "", Jawaban: "" });
                            this.setState({ DataAutoText: data });
                        }}>Tambah Data</button>
                    </div>
                </ModalBody>
                <ModalFooter btnClose="btnTutupModalAutoText">
                    <button className='btn btn-default' type='submit'><i className='fas fa-save'></i> Simpan</button>
                </ModalFooter>
            </Modal>
        )
    }
}