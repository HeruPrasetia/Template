import React, { Fragment, lazy, Suspense } from 'react';
import { submitForm, openModal, cekProfile, api, DivAksesDitolak, DxSubmitForm, DivExpired } from '../Modul';
import { Modal, ModalDelete, ModalBody, ModalFooter } from '../component/Modal';
import { FormControl, DxFormInput, FormSwitch, FormTextarea } from '../component/FormInput';
import { Row, Row6 } from '../component/Rows'

const RendTables = lazy(() => import('../component/RendTable'));

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SysAkses: {},
            Data: [],
            Field: [
                { cap: "", sort: "", type: "opsi" },
                { cap: "Nama", sort: "Nama", type: "str" },
                { cap: "LinkTutorial", sort: "LinkTutorial", type: "link" },
                { cap: "Tutorial", sort: "Tutorial", type: "str" },
                { cap: "No.Urut", sort: "IsOrder", type: "str" },
                { cap: "Menu Partner", sort: "IsPartner", type: "boolean2" },
                { cap: "Jenis Group", sort: "IsGroup", type: "boolean2" },
                { cap: "Group", sort: "Group", type: "str" },
                { cap: "Status", sort: "Status", type: "boolean" },
            ],
            Step: [],
            Detail: {},
            ID: ""
        };
        this.validationForm = React.createRef();
    }

    async componentDidMount() {
        let profile = await cekProfile();
        this.setState({ PerusahaanID: profile.data.PerusahaanID, SysAkses: profile.data }, this.handleMain);
        let ColorTheme = localStorage.getItem("ColorTheme") || "light";
        if (ColorTheme == "dark") {
            let cls = document.getElementsByClassName("table");
            for (let i = 0; i < cls.length; i++) {
                cls[i].classList.add("table-dark")
            }
        }
    }

    async handleMain() {
        let sql = await api("datamenu", { PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") this.setState({ Data: sql.data });
    }

    modalHapus(data) {
        this.setState({ ID: data.ID }, openModal("modalHapus"));
    }

    handleChange(e, obj) {
        let Detail = this.state.Detail;
        if (obj == "LinkTutorial") {
            Detail[obj] = this.convertToEmbed(e.value);
        } else {
            Detail[obj] = e.value;
        }
        this.setState({ Detail });
    }

    async modalForm(data = {}) {
        this.setState({ Detail: data, ID: data.ID, Step: data.Step == null ? [] : data.Step });
        openModal("modalForm");
    }

    convertToEmbed(url) {
        try {
            const urlObj = new URL(url);
            const videoId = urlObj.searchParams.get('v');

            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            } else {
                if (url.includes('youtu.be/')) {
                    const id = url.split('youtu.be/')[1].split(/[?&]/)[0];
                    return `https://www.youtube.com/embed/${id}`;
                }

                if (url.includes('/embed/')) {
                    return url;
                }

                return null;
            }
        } catch (err) {
            return null;
        }
    }

    handleChangeStep(i, val, obj) {
        let Step = this.state.Step;
        Step[i][obj] = val;
        this.setState({ Step });
    }

    handleDragStart = (e, index) => {
        this.draggedItemIndex = index;
    };

    handleDragOver = (e, index) => {
        e.preventDefault();
    };

    handleDrop = (e, index) => {
        e.preventDefault();
        const Step = [...this.state.Step];
        const draggedItem = Step[this.draggedItemIndex];

        Step.splice(this.draggedItemIndex, 1);
        Step.splice(index, 0, draggedItem);

        this.setState({ Step });
    };


    render() {
        let { Detail, ID } = this.state;
        return (
            <Fragment>
                <div className="main-body">
                    {this.state.SysAkses.Aktif < 0 ? <DivExpired /> :
                        this.state.SysAkses.LinkTutorial != "Akses Ditolak" ?
                            <div className="div-content mt-1">
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div className="main-title">Master Menu</div>
                                    <button className='btn btn-default' onClick={(e) => this.modalForm({ ID: "" })}>Tambah</button>
                                </div>
                                <Suspense>
                                    <RendTables
                                        tbody={this.state.Data}
                                        thead={this.state.Field}
                                        opt={[
                                            { icon: "fas fa-edit", fn: (e) => this.modalForm(e) },
                                            { icon: "fas fa-trash-alt", color: "text-danger", fn: (e) => this.modalHapus(e) }
                                        ]}
                                    />
                                </Suspense>
                            </div>
                            : <DivAksesDitolak />}
                </div>

                <Modal id='modalForm' className='modal-lg' title={Detail.ID == "" ? "Tambah Menu" : "Edit Menu"} validationRef={this.validationForm} form={true} onSubmit={(e) => DxSubmitForm(e, this.validationForm, { crud: "crudmenu", fn: () => this.handleMain(this.state.PerusahaanID) })} >
                    <ModalBody>
                        <input type='hidden' name='PerusahaanID' value={this.state.PerusahaanID} />
                        <input type='hidden' name='ID' value={Detail.ID} />
                        <input type='hidden' name='IsGroup' value={Detail.IsGroup} />
                        <input type='hidden' name='IsPartner' value={Detail.IsPartner} />
                        <input type='hidden' name='Step' value={JSON.stringify(this.state.Step)} />
                        <input type='hidden' name='act' value={Detail.ID == "" ? "tambah" : "edit"} />
                        <Row>
                            <Row6><DxFormInput label='Menu ID' name='MenuID' value={Detail.MenuID || ""} onChange={(e) => this.handleChange(e, 'MenuID')} required={true} /></Row6>
                            <Row6><DxFormInput label='Path' name='Path' value={Detail.Path || ""} onChange={(e) => this.handleChange(e, 'Path')} required={true} /></Row6>
                            <Row6><DxFormInput label='Nama' name='Nama' value={Detail.Nama || ""} onChange={(e) => this.handleChange(e, 'Nama')} required={true} /></Row6>
                            <Row6><DxFormInput type="select" label='Jenis Icon' name='IconType' value={Detail.IconType || "Icon"} onChange={(e) => this.handleChange(e, 'IconType')} required={true} data={[
                                { ID: "Icon", Nama: "Icon" },
                                { ID: "Img", Nama: "Images" },
                            ]} /></Row6>
                            <Row6><DxFormInput label='Icon' name='Icon' value={Detail.Icon || ""} onChange={(e) => this.handleChange(e, 'Icon')} required={true} /></Row6>
                            <Row6><DxFormInput label='No. Urut' name='IsOrder' value={Detail.IsOrder || "1"} onChange={(e) => this.handleChange(e, 'IsOrder')} required={true} /></Row6>
                            <Row6><DxFormInput type="link" label='Link Tutorial' name='LinkTutorial' value={Detail.LinkTutorial || ""} onChange={(e) => this.handleChange(e, 'LinkTutorial')} /></Row6>
                            <Row6><DxFormInput type="select" label='Status' name='Status' value={Detail.Status || 1} onChange={(e) => this.handleChange(e, 'Status')} required={true} data={[
                                { ID: 1, Nama: "Aktif" },
                                { ID: 0, Nama: "Tidak Aktif" },
                            ]} /></Row6>
                            <Row6><DxFormInput label='Group Induk' name='GroupID' value={Detail.GroupID || ""} onChange={(e) => this.handleChange(e, 'GroupID')} /></Row6>
                        </Row>
                        <FormSwitch label='Menu Untuk Parter' id='chkIsPartner' checked={Detail.IsPartner} onChange={(e) => {
                            let Detail = this.state.Detail;
                            Detail.IsPartner = e.target.checked == true ? 1 : 0;
                            this.setState({ Detail });
                        }} />
                        <FormSwitch label='Menu Group' id='chkIsGroup' checked={Detail.IsGroup} onChange={(e) => {
                            let Detail = this.state.Detail;
                            Detail.IsGroup = e.target.checked == true ? 1 : 0;
                            this.setState({ Detail });
                        }} />
                        <DxFormInput type="textarea" label='Tutorial' name='Tutorial' value={Detail.Tutorial || ""} onChange={(e) => this.handleChange(e, 'Tutorial')} />
                        <h6>Step Tutorial</h6>
                        <button className='btn btn-default' type='button' onClick={() => {
                            let Step = this.state.Step;
                            Step.push({ "content": "", "target": "" });
                            this.setState({ Step });
                        }}>Tambah Step</button>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th width="50px"></th>
                                    <th width="200px">Target</th>
                                    <th>Penjelasan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.Step.map((tr, i) => {
                                        return (<tr key={i}
                                            draggable
                                            onDragStart={(e) => this.handleDragStart(e, i)}
                                            onDragOver={(e) => this.handleDragOver(e, i)}
                                            onDrop={(e) => this.handleDrop(e, i)}>
                                            <td><i className='fas fa-trash-alt' onClick={(e) => {
                                                let Step = this.state.Step;
                                                let temp = [];
                                                for (let ii in Step) if (i != ii) temp.push(Step[ii]);
                                                this.setState({ Step: temp })
                                            }} style={{ color: "red" }}></i></td>
                                            <td><FormControl value={tr.target} onChange={(e) => this.handleChangeStep(i, e.target.value, "target")} /></td>
                                            <td><FormControl value={tr.content} onChange={(e) => this.handleChangeStep(i, e.target.value, "content")} /></td>
                                        </tr>)
                                    })
                                }
                            </tbody>
                        </table>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalForm">
                        <button type='submit' className='btn btn-default'><i className='fas fa-save'></i> Simpan</button>
                    </ModalFooter>
                </Modal>

                <ModalDelete title="Konfirmasi" id='modalHapus' act='hapus' ID={this.state.ID} onSubmit={(e) => submitForm(e, { crud: "crudmenu", fn: () => this.handleMain(), debug: true })} />
            </Fragment >
        )
    }

}

export default Dashboard;
