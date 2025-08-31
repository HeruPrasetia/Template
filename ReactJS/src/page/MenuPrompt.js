import React, { Fragment, lazy } from 'react';
import { openModal, cekProfile, api, DivAksesDitolak, VideoCard, DivExpired, submitForm } from '../Modul';
import { ModalDelete } from '../component/Modal';

const RendTables = lazy(() => import('../component/RendTable'));
const ModalFormPrompt = lazy(() => import('../component/ModalFormPrompt.js'));

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SysAkses: {},
            Data: [],
            Field: [
                { cap: "", sort: "", type: "opsi" },
                { cap: "Nama", sort: "Nama", type: "str" },
                { cap: "Tanggal Buat", sort: "TimeCreated", type: "datetime" },
                { cap: "Tanggal Edit", sort: "TimeUpdated", type: "datetime" },
            ],
            Detail: {},
            PerusahaanID: 0,
        };
        this.validationForm = React.createRef();
        this.validationInput = React.createRef();
    }

    async componentDidMount() {
        let profile = await cekProfile();
        this.setState({ PerusahaanID: profile.data.PerusahaanID, SysAkses: profile.data }, this.handleMain);
    }

    async handleMain() {
        let sql = await api("dataprompt", { PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") this.setState({ Data: sql.data });
    }

    modalHapus(data) {
        this.setState({ Detail: data });
        openModal("modalHapus");
    }

    async modalForm(data = { ID: "" }) {
        let sql = await api("detailprompt", { ID: data.ID });
        if (sql.status == "sukses") this.setState({ Detail: sql.data || data, ID: data.ID }, () => openModal("modalFormPrompt"));
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
                                        <label id='lblTitle'>Master Prompt</label>
                                    </div>
                                    <button className='btn btn-default' onClick={(e) => this.modalForm()} id='btnAdd'>Tambah Prompt</button>
                                </div>

                                <RendTables
                                    tbody={this.state.Data}
                                    thead={this.state.Field}
                                    opt={[
                                        { icon: "fas fa-edit", fn: (e) => this.modalForm(e) },
                                        { icon: "fas fa-comments-dollar", fn: (e) => this.modalLiveTest(e) },
                                        { icon: "fas fa-trash-alt", color: "text-danger", fn: (e) => this.modalHapus(e) },
                                    ]}
                                    id="TableDataLabel"
                                />
                                <VideoCard link={this.state.SysAkses.LinkTutorial} />
                            </div>
                            : <DivAksesDitolak />}
                </div>


                <ModalFormPrompt Detail={Detail} ID={ID} PerusahaanID={this.state.PerusahaanID} submit={() => this.handleMain()} />
                <ModalDelete id='modalHapus' title="Konfirmasi" act="hapus" ID={this.state.Detail.ID} onSubmit={(e) => submitForm(e, { crud: "crudprompt", fn: () => this.handleMain() })} />
            </Fragment>
        )
    }

}

export default Dashboard;
