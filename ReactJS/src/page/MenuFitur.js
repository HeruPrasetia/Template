import React, { Fragment } from 'react';
import { api, cekProfile, openModal, submitForm } from '../Modul';
import { Row, Row4 } from '../component/Rows'
import PaletteMatcher from '../component/Card';
import { Modal, ModalBody, ModalFooter } from '../component/Modal';
import { FormInput } from '../component/FormInput';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Data: [],
            Field: [],
            Detail: {},
            Profile: {},
            backgroundColor: '',
            textColor: '#000',
            PerusahaanID: 0
        };
    }

    async componentDidMount() {
        let profile = await cekProfile();
        this.setState({ Profile: profile.data, PerusahaanID: profile.data.PerusahaanID }, this.handleMain);
        let ColorTheme = localStorage.getItem("ColorTheme") || "light";
        if (ColorTheme == "dark") {
            let cls = document.getElementsByClassName("table");
            for (let i = 0; i < cls.length; i++) {
                cls[i].classList.add("table-dark")
            }
        }
    }

    async handleMain() {
        let sql = await api("fitur", { PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") this.setState({ Data: sql.data });
    }

    async handleModalFitur(data) {
        let sql = await api("detailfitur", { ID: data.ID });
        if (sql.status == "sukses") {
            this.setState({ Detail: sql.data, ID: data.ID });
            openModal("modalFitur");
        }
    }

    handleChange(e, obj) {
        let Detail = this.state.Detail;
        Detail[obj] = e.target.value;
        this.setState({ Detail });
    }

    render() {
        let { Detail, ID, Data } = this.state;
        return (
            <Fragment>
                <div className="main-body">
                    <div className="div-content mt-1">
                        <Row>
                            {this.state.Data.map((div, i) => {
                                return (
                                    <Row4 key={i}>
                                        <PaletteMatcher {...div} />
                                    </Row4>
                                )
                            })}
                        </Row>
                    </div>
                </div>

                <Modal id='modalFitur' title={ID == "" ? "Tammbah Fitur" : "Edit Fitur"} form={true} onSubmit={(e) => submitForm(e, { crud: "crudfitur", fn: (e) => this.handleMain(), debug: true })}>
                    <ModalBody>
                        <input type='hidden' name="act" value={ID == "" ? "tambah" : "edit"} />
                        <input type='hidden' name="ID" value={ID} />
                        <FormInput label="Nama" name='Nama' value={Detail.Nama || ""} onChange={(e) => this.handleChange(e, 'Nama')} required={true} />
                        <FormInput type="textarea" label="Penjelasan" name='Penjelasan' value={Detail.Penjelasan || ""} onChange={(e) => this.handleChange(e, 'Penjelasan')} required={true} />
                        <FormInput type="file" label="Images" name='Img' value={Detail.Img || ""} onChange={(e) => this.handleChange(e, 'Img')} required={true} />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalFitur">
                        <button className='btn btn-default' type='submit'><i className='fas fa-save'></i> Simpan</button>
                    </ModalFooter>
                </Modal>
            </Fragment>
        )
    }

}

export default Dashboard;