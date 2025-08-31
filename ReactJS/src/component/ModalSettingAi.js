import React, { Fragment, Suspense, lazy } from "react";
import { Modal, ModalBody, ModalFooter } from './Modal.js';
import { DxFormInput, FormInput, FormSwitch } from './FormInput.js';
import { submitForm, api, openModal } from '../Modul.js'
import { Row, Row6 } from './Rows.js';

const FormPrompt = lazy(() => import('./FormPrompt.js'));

export default class ModalSettingAi extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Detail: {},
            DataPrompt: [],
            PerusahaanID: "",
            DataHistory: []
        };
        this.validationForm = React.createRef();
    }

    componentDidMount() {
        this.setState({ Detail: this.props.Detail, PerusahaanID: this.props.PerusahaanID }, this.handleMain);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.Detail !== this.props.Detail || prevProps.ID !== this.props.ID) {
            this.setState({ Detail: this.props.Detail, PerusahaanID: this.props.PerusahaanID }, this.handleMain);
        }
    }

    async handleMain() {
        let sql = await api("dataprompt", { PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") this.setState({ DataPrompt: sql.data })
    }

    handleChange(e) {
        let Detail = this.state.Detail;
        Detail[e.target.name] = e.target.value;
        this.setState({ Detail });
    }

    async handleChangePrompt(e) {
        if (e.value !== "") {
            let sql = await api('detailprompt', { ID: e.value });
            if (sql.status == "sukses" && sql.data) {
                let Detail = this.state.Detail;
                Detail.PromptID = e.value;
                Detail.Otak = sql.data.Prompt;
                this.setState({ Detail });
            }
        }
    }

    render() {
        let { Detail } = this.state;
        return (
            <Fragment>
                <Modal id='modalSettingAI' className='modal-xl' title="Setting AI Asisten" form={true} onSubmit={(e) => submitForm(e, { crud: "settingai", fn: () => this.props.submit() })}>
                    <ModalBody>
                        <input type='hidden' name="ID" value={Detail.ID} />
                        <input type='hidden' name="IsAiActive" value={Detail.IsAiActive || 0} />
                        <input type='hidden' name="IsUsingBot" value={Detail.IsUsingBot || 0} />
                        <input type='hidden' name="IsSwitch" value={Detail.IsSwitch || 0} />
                        <DxFormInput type='text' name='Produk' label="Nama Produk / Jasa" placeholder='Isi Informasi mengenai nama produk / jasa anda' value={Detail.Produk || ""} onChange={(e) => this.setState({ Nama: e.value })} required={true} />
                        <FormInput type='textarea' name='ClosingText' rows={10} label="Kalimat atau kata-kata minta kirim katalog" placeholder='Gunakan enter untuk memisah antar kalimat' value={Detail.ClosingText || ""} onChange={(e) => this.handleChange(e)} required={true} />
                        <p></p>
                        <DxFormInput type="select" name="PromptID" label="Master Prompt" value={Detail.PromptID} onChange={(e) => this.handleChangePrompt(e)} data={this.state.DataPrompt} />
                        <FormInput type='textarea' name='Otak' rows={30} label="Informasi Untuk AI" placeholder='Silahkan isi Informasi untuk di pelajari oleh AI' value={Detail.Otak || ""} onChange={(e) => this.handleChange(e)} required={true} />
                        <h6 className='btn btn-link' onClick={async (e) => {
                            let sql = await api("historychat", { Telp: Detail.ID, ID: Detail.ID });
                            if (sql.status == "sukses") {
                                this.setState({ DataHistory: sql.data });
                                openModal("modalGeneratePrompt");
                                document.getElementById('btnTutupModalSettingAI').click();
                            }
                        }}>Butuh Bantuan Buat Prompt?</h6>
                        <p></p>
                        <div className='d-flex gap-2'>
                            <FormSwitch id='chkIsAiActive' label={Detail.IsAiActive == 1 ? "AI Aktif" : "AI Tidak Aktif"} onChange={(e) => {
                                let data = this.state.Detail;
                                data.IsAiActive = e.target.checked == true ? 1 : 0;
                                this.setState({ Detail: data });
                            }} checked={Detail.IsAiActive} />
                            <FormSwitch id='chkIsUsingBot' label={Detail.IsUsingBot == 1 ? "Bot Aktif" : "Bot Tidak Aktif"} onChange={(e) => {
                                let data = this.state.Detail;
                                data.IsUsingBot = e.target.checked == true ? 1 : 0;
                                this.setState({ Detail: data });
                            }} checked={Detail.IsUsingBot} />
                        </div>
                        <FormSwitch id='chkIsSwitch' label={Detail.IsSwitch == 1 ? "Otomatis Switch Aktif" : "Otomatis Switch Mati"} onChange={(e) => {
                            let data = this.state.Detail;
                            data.IsSwitch = e.target.checked == true ? 1 : 0;
                            this.setState({ Detail: data });
                        }} checked={Detail.IsSwitch} />
                        <Row>
                            <Row6><FormInput type='time' name='TimeStart' label="Waktu Aktif" value={Detail.TimeStart || "17:00"} onChange={(e) => this.handleChange(e)} required={true} /></Row6>
                            <Row6><FormInput type='time' name='TimeEnd' label="Waktu Mati" value={Detail.TimeEnd || "07:00"} onChange={(e) => this.handleChange(e)} required={true} /></Row6>
                        </Row>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalSettingAI">
                        <button className='btn btn-default' type='submit'><i className='fas fa-save'></i>Simpan</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalGeneratePrompt' className='modal-xl' form={false} title="Generate Prompt">
                    <ModalBody>
                        <Suspense><FormPrompt History={this.state.DataHistory} Detail={Detail} /></Suspense>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalPrompt" />
                </Modal>
            </Fragment>
        )
    }
}