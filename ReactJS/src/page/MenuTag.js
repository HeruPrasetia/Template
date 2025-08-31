import React, { Fragment } from 'react';
import { DxSubmitForm, submitForm, openModal, cekProfile, api, DivAksesDitolak, VideoCard, DivExpired } from '../Modul';
import RendTables from '../component/RendTable';
import { Modal, ModalBody, ModalFooter } from '../component/Modal';
import { FormInput, DxFormInput } from '../component/FormInput';
import { Row, Row6 } from '../component/Rows';
import Tutorial from '../component/Tutorial';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SysAkses: {},
            Data: [],
            Field: [
                { cap: "", sort: "", type: "opsi" },
                { cap: "Nama Label", sort: "TagName", type: "str" },
                { cap: "Jumlah Produk / Kontak", sort: "CT", type: "str" },
            ],
            Detail: {},
            PerusahaanID: 0,
            DataDetailTag: [],
            DataItem: [],
            FieldDetailTag: [],
            Step1: [],
            RunStep: false,
            StepForm: [],
            RunStepForm: false
        };
        this.validationForm = React.createRef();
        this.validationInput = React.createRef();
    }

    async componentDidMount() {
        let profile = await cekProfile();
        let Step = profile.data.Step;
        let Step1 = [], StepForm = [];
        if (Step != "") {
            for (let i in Step) {
                if (i <= 2) Step1.push(Step[i]);
                if (i > 2) StepForm.push(Step[i]);
            }
        }
        this.setState({ PerusahaanID: profile.data.PerusahaanID, SysAkses: profile.data, Step1, StepForm }, this.handleMain);

        let ColorTheme = localStorage.getItem("ColorTheme") || "light";
        if (ColorTheme == "dark") {
            let cls = document.getElementsByClassName("table");
            for (let i = 0; i < cls.length; i++) {
                cls[i].classList.add("table-dark")
            }
        }
    }

    async handleMain() {
        let sql = await api("datatag", { PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") this.setState({ Data: sql.data });
    }

    modalHapus(data) {
        this.setState({ Detail: data });
        openModal("modalHapus");
    }

    handleChange(e, obj) {
        let Detail = this.state.Detail;
        Detail[obj] = e.value;
        this.setState({ Detail });
    }

    async modalForm(data = {}) {
        let sql = await api("detailtag", { TagName: data.TagName, PerusahaanID: data.PerusahaanID, ItemType: data.ItemType });
        if (sql.status == "sukses") {
            let Field = [
                { cap: "", sort: "checked", type: "checkbox", fn: (e) => this.handlePilihItemAll(e), fnitem: (e, data, i) => this.handlePilihItem(e, data, i) },
                { cap: "Nama", sort: "Nama", type: "str" },
                { cap: "Telp", sort: "Telp", type: "str" },
            ];
            if (data.ItemType == "produk") {
                Field = [
                    { cap: "", sort: "checked", type: "checkbox", fn: (e) => this.handlePilihItemAll(e), fnitem: (e, data, i) => this.handlePilihItem(e, data, i) },
                    { cap: "SKU", sort: "SKU", type: "str" },
                    { cap: "Nama", sort: "Nama", type: "str" },
                    { cap: "Kategori", sort: "Kategori", type: "str" },
                    { cap: "Keterangan", sort: "Keterangan", type: "str" },
                ];
            }
            let DataItem = sql.detail.filter(x => x.checked == 1);

            this.setState({ Detail: sql.data, ID: data.ID, FieldDetailTag: Field, DataDetailTag: sql.detail, DataItem });
            openModal("modalForm");
        }
    }

    handlePilihItemAll(e) {
        let DataDetailTag = this.state.DataDetailTag;
        let Temp = [];
        for (let dd in DataDetailTag) {
            DataDetailTag[dd].checked = e.target.checked == true ? 1 : 0;
            Temp.push(DataDetailTag[dd]);
        }
        this.setState({ DataDetailTag: Temp, DataItem: e.target.checked == true ? Temp : [] });
    }

    handlePilihItem(e, tabel, i) {
        let chk = document.getElementById(`${tabel}${e.ID}`);
        let Menu = this.state.DataDetailTag;
        let Akses = [];
        for (let dd in Menu) {
            if (Menu[dd].ID == e.ID) Menu[dd].checked = chk.checked;
            if (Menu[dd].checked == true) Akses.push({ ID: Menu[dd].ID });
        }
        this.setState({ DataDetailTag: Menu, DataItem: Akses });
    }

    modalAddLabel() {
        this.setState({
            Detail: { ItemType: "", TagName: "" },
            DataDetailTag: [],
            DataItem: [],
            FieldDetailTag: []
        });

        openModal("modalAddTag", () => {
            setTimeout(() => {
                this.setState({ RunStepForm: true })
            }, 1000);
        });
    }

    async modalDetailTag(data) {
        let sql = await api("detailtag", { TagName: data.TagName, ItemType: data.ItemType, PerusahaanID: this.state.PerusahaanID, allData: "Tidak" });
        if (sql.status == "sukses") {
            let Field = [
                { cap: "Nama", sort: "Nama", type: "str" },
                { cap: "Telp", sort: "Telp", type: "str" },
            ];
            if (data.ItemType == "produk") {
                Field = [
                    { cap: "SKU", sort: "SKU", type: "str" },
                    { cap: "Nama", sort: "Nama", type: "str" },
                    { cap: "Kategori", sort: "Kategori", type: "str" },
                    { cap: "Keterangan", sort: "Keterangan", type: "str" },
                ];
            }
            this.setState({
                DataDetailTag: sql.detail,
                FieldDetailTag: Field
            })
            openModal("modalDetail");
        }
    }

    render() {
        let { Detail, ID } = this.state;
        return (
            <Fragment>
                <div className="main-body">
                    {this.state.SysAkses.Aktif < 0 ? <DivExpired /> :
                        this.state.SysAkses.LinkTutorial != "Akses Ditolak" ?
                            <div className="div-content mt-1">
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div className="main-title">
                                        <label id='lblTitle'>Master Label / Tag</label>
                                        <button className='btn btn-link' onClick={() => {
                                            this.setState({ RunStep: true });
                                            setTimeout(() => {
                                                let Btn = document.getElementsByClassName("react-joyride__beacon");
                                                for (let i = 0; i < Btn.length; i++) Btn[i].click();
                                            }, 200);
                                        }}><i className='fas fa-info-circle'></i></button>
                                    </div>
                                    <button className='btn btn-default' onClick={(e) => this.modalAddLabel()} id='btnAdd'>Tambah Label</button>
                                </div>

                                <RendTables
                                    tbody={this.state.Data}
                                    thead={this.state.Field}
                                    opt={[
                                        { icon: "fas fa-edit", fn: (e) => this.modalForm(e) },
                                        { icon: "fas fa-info-circle", fn: (e) => this.modalDetailTag(e) },
                                        { icon: "fas fa-trash-alt", color: "text-danger", fn: (e) => this.modalHapus(e) },
                                    ]}
                                    group={[
                                        { cap: "Jenis Item", sort: "ItemType" }
                                    ]}
                                    id="TableDataLabel"
                                />
                                <VideoCard link={this.state.SysAkses.LinkTutorial} />
                                {this.state.SysAkses.Step != "" ? <Tutorial data={this.state.Step1} run={this.state.RunStep} /> : ""}
                            </div>
                            : <DivAksesDitolak />}
                </div>

                <Modal id='modalAddTag' className='modal-lg' title="Tambah Label" form={true} validationRef={this.validationForm} onSubmit={(e) => DxSubmitForm(e, this.validationForm, { crud: "crudtag", fn: () => this.handleMain(this.state.PerusahaanID) })} >
                    <ModalBody>
                        <input type='hidden' name='act' value="tambah" />
                        <input type='hidden' name='PerusahaanID' value={this.state.PerusahaanID} />
                        <input type='hidden' name='DataItem' value={JSON.stringify(this.state.DataItem)} />
                        <Row>
                            <Row6><DxFormInput id='edtTagName' label='Nama Label' name='NewTagName' value={Detail.NewTagName || Detail.TagName} onChange={(e) => this.handleChange(e, 'TagName')} required={true} /></Row6>
                            <Row6>
                                <DxFormInput id='edtJenis' type='select' label="Jenis Label" name='ItemType' value={Detail.ItemType} onChange={async (e) => {
                                    let ItemType = e.value;
                                    let sql = await api("dataitem", { ItemType, PerusahaanID: this.state.PerusahaanID });
                                    if (sql.status == "sukses") {
                                        let Field = [
                                            { cap: "", sort: "checked", type: "checkbox", fn: (e) => this.handlePilihItemAll(e), fnitem: (e, data, i) => this.handlePilihItem(e, data, i) },
                                            { cap: "Nama", sort: "Nama", type: "str" },
                                            { cap: "Telp", sort: "Telp", type: "str" },
                                        ];
                                        if (ItemType == "produk") {
                                            Field = [
                                                { cap: "", sort: "checked", type: "checkbox", fn: (e) => this.handlePilihItemAll(e), fnitem: (e, data, i) => this.handlePilihItem(e, data, i) },
                                                { cap: "SKU", sort: "SKU", type: "str" },
                                                { cap: "Nama", sort: "Nama", type: "str" },
                                                { cap: "Kategori", sort: "Kategori", type: "str" },
                                                { cap: "Keterangan", sort: "Keterangan", type: "str" },
                                            ];
                                        }
                                        let Detail = this.state.Detail;
                                        Detail.ItemType = ItemType;
                                        this.setState({ FieldDetailTag: Field, DataDetailTag: sql.data, Detail });
                                    }
                                }} data={[
                                    { ID: "kontak", Nama: "Kontak" },
                                    { ID: "produk", Nama: "Produk" },
                                ]} required={true} />
                            </Row6>
                        </Row>

                        <p></p>
                        <RendTables
                            tbody={this.state.DataDetailTag}
                            thead={this.state.FieldDetailTag}
                            id="tableAdd"
                        />
                        {this.state.SysAkses.Step != "" ? <Tutorial data={this.state.StepForm} run={this.state.RunStepForm} /> : ""}
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalForm">
                        <button type='submit' className='btn btn-default' id='btnSave'><i className='fas fa-save'></i> Simpan</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalForm' className='modal-lg' title="Edit Label" form={true} validationRef={this.validationInput} onSubmit={(e) => DxSubmitForm(e, this.validationInput, { crud: "crudtag", fn: () => this.handleMain(this.state.PerusahaanID) })} >
                    <ModalBody>
                        <input type='hidden' name='act' value="edit" />
                        <input type='hidden' name='TagName' value={Detail.TagName} />
                        <input type='hidden' name='ItemName' value={Detail.ItemName} />
                        <input type='hidden' name='ItemType' value={Detail.ItemType} />
                        <input type='hidden' name='PerusahaanID' value={this.state.PerusahaanID} />
                        <input type='hidden' name='DataItem' value={JSON.stringify(this.state.DataItem)} />
                        <DxFormInput label='Nama Label' name='NewTagName' value={Detail.NewTagName || Detail.TagName} onChange={(e) => this.handleChange(e, 'NewTagName')} required={true} />
                        <p></p>
                        <RendTables
                            tbody={this.state.DataDetailTag}
                            thead={this.state.FieldDetailTag}
                            id="tabelEdit"
                        />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalForm">
                        <button type='submit' className='btn btn-default'><i className='fas fa-save'></i> Simpan</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalDetail' title="Detail Label"  >
                    <ModalBody>
                        <RendTables
                            tbody={this.state.DataDetailTag}
                            thead={this.state.FieldDetailTag}
                        />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalDetail" />
                </Modal>

                <Modal id='modalHapus' title='Konfirmasi' form={true} onSubmit={(e) => submitForm(e, { crud: "crudtag", fn: () => this.handleMain(this.state.PerusahaanID) })} >
                    <ModalBody>
                        <input type='hidden' name='act' value="hapus" />
                        <input type='hidden' name='TagName' value={Detail.TagName} />
                        <input type='hidden' name='ItemName' value={Detail.ItemName} />
                        <input type='hidden' name='ItemType' value={Detail.ItemType} />
                        <input type='hidden' name='PerusahaanID' value={this.state.PerusahaanID} />
                        <h6>Apakah anda yakin akan menghapus label ini!</h6>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalHapus" >
                        <button type='submit' className='btn btn-danger'><i className='fas fa-trash-alt'></i> Hapus</button>
                    </ModalFooter>
                </Modal>
            </Fragment>
        )
    }

}

export default Dashboard;
