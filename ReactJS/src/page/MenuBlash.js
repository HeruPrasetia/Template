import React, { Fragment } from 'react';
import { host, saiki, api, DxSubmitForm, submitForm, openModal, cekProfile, exportData, importData, pesan, DivAksesDitolak, DivExpired, VideoCard } from '../Modul';
import RendTables from '../component/RendTable';
import { Modal, ModalDelete, ModalBody, ModalFooter } from '../component/Modal';
import { FormInput, DxFormInput, createTag } from '../component/FormInput';
import { Row, Row6 } from '../component/Rows';
import FileManager from '../component/FileManager';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SysAkses: {},
            Data: [],
            Field: [],
            Detail: {},
            DataChat: [],
            PerusahaanID: 0,
            DataDevice: [],
            DataKontak: [],
            Kontak: [],
            DataFile: [],
            Attach: "none",
            IsShowFile: false
        };
        this.validationForm = React.createRef();
    }

    async componentDidMount() {
        let profile = await cekProfile();
        let Field = [
            { cap: "", sort: "", type: "opsi" },
            { cap: "Nama", sort: "Nama", type: "str" },
            { cap: "WhatsApp", sort: "Device", type: "str" },
            { cap: "Jenis", sort: "Jadwal", type: "str" },
            { cap: "Kategori", sort: "JenisJadwal", type: "str" },
            { cap: "Status", sort: "Status", type: "str" }
        ];
        this.setState({ Field: Field, PerusahaanID: profile.data.PerusahaanID, SysAkses: profile.data }, this.handleMain);

        let ColorTheme = localStorage.getItem("ColorTheme") || "light";
        if (ColorTheme == "dark") {
            let cls = document.getElementsByClassName("table");
            for (let i = 0; i < cls.length; i++) {
                cls[i].classList.add("table-dark")
            }
        }
    }

    async handleMain() {
        let sql = await api("datablash", { PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") this.setState({ Data: sql.data });
    }

    modalHapus(data) {
        this.setState({ UserID: data.ID });
        openModal("modalHapus");
    }

    async modalDetail(data) {
        let sql = await api("detailblash", { ID: data.ID });
        if (sql.status == "sukses") {
            this.setState({ Detail: sql.data });
            openModal("modalDetail");
        }
    }

    handleChange(e, obj) {
        let Detail = this.state.Detail;
        Detail[obj] = e.value;
        this.setState({ Detail });
    }

    async modalForm(data) {
        let sql = await api("detailblash", { ID: data.ID, PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") {
            let Kontak = [];
            if (sql.data) {
                let data = sql.data;
                if (data.DataKontak == "Sebagian") {
                    Kontak = data.Kontak == "" ? [] : JSON.parse(sql.data.Kontak);
                } else if (data.DataKontak == "Label") {
                    setTimeout(() => {
                        let tag = data.LabelKontak;
                        let tagContainer = document.getElementById("edtTagTarget-container");
                        tagContainer.querySelectorAll(".tag").forEach(element => element.remove());
                        if (tag != "") for (let tg of tag.split("#")) if (tg != '') createTag("#" + tg, "edtTagTarget");
                    }, 1000);
                }
            }
            let Attach = "none";
            if (sql.data) {
                Attach = sql.data.Attach;
            }
            this.setState({ Detail: sql.data || { DeviceID: 0 }, ID: data.ID || "", DataDevice: sql.device, Kontak: Kontak, Attach: Attach });
            openModal("modalForm");
        }
    }

    modalImport() {
        openModal("modalImport");
    }

    async handleGetKontak(e) {
        let sql = await api("getkontak", { Telp: "6281234779772" });
    }

    async handleModalKontak() {
        let sql = await api("datakontak", { PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") {
            this.setState({ DataKontak: sql.data });
            openModal("modalKontak");
        }
    }

    handlePilihKontak(e, data, i) {
        let chk = document.getElementById(`tableKontak${data.ID}`);
        let Menu = this.state.DataKontak;
        let Akses = [];
        for (let dd in Menu) {
            if (Menu[dd].ID == data.ID) {
                Menu[dd].checked = chk.checked;
            }
            if (Menu[dd].checked == true) Akses.push({
                ID: Menu[dd].ID,
                Nama: Menu[dd].Nama,
                Telp: Menu[dd].Telp,
                Alamat: Menu[dd].Alamat,
            });
        }
        this.setState({ DataKontak: Menu, Kontak: Akses });
    }

    handleDownloadContoh() {
        let data = [{ Nama: "pelanggan", Telp: "62" }]
        let Field = [{ cap: "Nama", sort: "Nama", type: "str" }, { cap: "Telp", sort: "Telp", type: "str" }];
        exportData(data, "Contoh Import Kontak", Field);
    }

    async handleImportData(e) {
        let data = await importData(e.target.files[0]);
        this.setState({ DataKontak: data });
    }

    handleDeleteKontak(e) {
        let DataKontak = this.state.DataKontak;
        let tmp = [];
        for (let i of DataKontak) if (i.Telp != e.Telp) tmp.push(i);
        this.setState({ DataKontak: tmp });
    }

    handleHapusKontak(e) {
        let Kontak = this.state.Kontak;
        let tmp = [];
        for (let i of Kontak) if (i.Telp != e.Telp) tmp.push(i);
        this.setState({ Kontak: tmp });
    }

    handleImportKontak(e) {
        e.preventDefault();
        if (this.state.DataKontak.length > 0) {
            let DataKontak = this.state.DataKontak;
            this.setState({ Kontak: DataKontak });
            document.getElementById('btnTutupModalImport').click();
        } else {
            pesan("Gagal", "Silahkan pilih kontak", "error");
        }
    }

    handlePilihAllKontak(e) {
        let DataKontak = this.state.DataKontak;
        let Temp = [];
        for (let dd in DataKontak) {
            DataKontak[dd].checked = e.target.checked == true ? 1 : 0;
            Temp.push(DataKontak[dd]);
        }
        this.setState({ DataKontak: Temp, Kontak: e.target.checked == true ? DataKontak : [] });
    }

    render() {
        let { Detail, ID } = this.state;
        let PlaceHolder = `
        Gunakan kata @nama untuk mengganti dengan nama dari master kontak. 
        @alamat akan di ganti dengan alamat dari master kontak.
        
        Contoh format spintext : Kamu {Hebat|Pintar|Luarbiasa} sekali.
        kalau spintext dalam spintext {Kamu {Pintar|Cerdas}|Luar Biasa} Sekali.
        `;
        let DayArr = { DAY: "Hari", HOUR: "Jam", WEEK: "Minggu" };

        return (
            <Fragment>
                <div className="main-body">
                    {
                        this.state.SysAkses.Aktif < 0 ? <DivExpired /> :
                            this.state.SysAkses.LinkTutorial != "Akses Ditolak" ?
                                <div className="div-content mt-1">
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div className="main-title">Campaign / Broadcast</div>
                                        <div className='d-flex justify-content-end align-items-center gap-2'>
                                            <button className='btn btn-default' onClick={() => this.modalForm({ ID: "", DeviceID: "" })}>Tambah Skema</button>
                                        </div>
                                    </div>
                                    <RendTables
                                        tbody={this.state.Data}
                                        thead={this.state.Field}
                                        opt={[
                                            { icon: "fas fa-edit", fn: (e) => this.modalForm(e) },
                                            { icon: "fas fa-trash", color: "text-danger", fn: (e) => this.modalHapus(e) }
                                        ]}
                                    />
                                    <VideoCard link={this.state.SysAkses.LinkTutorial} />
                                </div> : <DivAksesDitolak />
                    }
                </div>

                <Modal id='modalForm' className='modal-xl' title={ID == "" ? "Tambah Campaign" : "Edit Campaign"} validationRef={this.validationForm} form={true} onSubmit={(e) => DxSubmitForm(e, this.validationForm, { crud: "crudblash", fn: () => this.handleMain(this.state.PerusahaanID) })} >
                    <ModalBody>
                        <Row>
                            <Row6>
                                <input type='hidden' name='act' value={ID == "" ? "tambah" : "edit"} />
                                <input type='hidden' name='ID' value={ID} />
                                <input type='hidden' name='PerusahaanID' value={this.state.PerusahaanID} />
                                <input type='hidden' name='Attach' value={this.state.Attach} />
                                <input type='hidden' name='Kontak' value={JSON.stringify(this.state.Kontak)} />
                                <DxFormInput type='select' label='Device / Whatsapp' name='DeviceID' value={Detail.DeviceID || ""} required={true}
                                    onChange={(e) => {
                                        let Detail = this.state.Detail;
                                        Detail.DeviceID = e.value;
                                        this.setState({ Detail });
                                    }}
                                    data={this.state.DataDevice} />
                                <DxFormInput label='Nama' name='Nama' value={Detail.Nama || ""} onChange={(e) => this.handleChange(e, 'Nama')} required={true} />
                                <DxFormInput type='select' label='Jenis Campaign / Broadcast' name='Jadwal' value={Detail.Jadwal || ""} required={true}
                                    onChange={(e) => {
                                        let Detail = this.state.Detail;
                                        Detail.Jadwal = e.value;
                                        this.setState({ Detail });
                                    }}
                                    data={[
                                        { Nama: "Jadwal", ID: "Jadwal" },
                                        { Nama: "Follow Up", ID: "Follow Up" },
                                    ]} />
                                {
                                    Detail.Jadwal == "Jadwal" ?
                                        <Row>
                                            <Row6><DxFormInput type="date" label='Tanggal Kirim' name='Tanggal' value={Detail.Tanggal || saiki()} onChange={(e) => this.handleChange(e, 'Tanggal')} required={true} /></Row6>
                                            <Row6><DxFormInput type="time" label='Jam Kirim' name='Jam' value={Detail.Jam || "08:00"} onChange={(e) => this.handleChange(e, 'Jam')} required={true} /></Row6>
                                        </Row>
                                        :
                                        <Fragment>
                                            <DxFormInput type='select' label='Jenis Follow Up' name='JenisJadwal' value={Detail.JenisJadwal || ""} required={true}
                                                onChange={(e) => {
                                                    let Detail = this.state.Detail;
                                                    Detail.JenisJadwal = e.value;
                                                    this.setState({ Detail });
                                                }}
                                                data={[
                                                    { Nama: "Jam", ID: "HOUR" },
                                                    { Nama: "Hari", ID: "DAY" },
                                                    { Nama: "Minggu", ID: "WEEK" },
                                                ]} />
                                            <Row>
                                                <Row6><DxFormInput type='select' label='Triger' name='Triger' value={Detail.Triger || "Pelanggan Tidak Response"} required={true}
                                                    onChange={(e) => {
                                                        let Detail = this.state.Detail;
                                                        Detail.Triger = e.value;
                                                        this.setState({ Detail });
                                                    }}
                                                    data={[
                                                        { Nama: "Pelanggan Tidak Response", ID: "Pelanggan Tidak Response" },
                                                        { Nama: "Jatuh Tempo Pelanggan", ID: "Jatuh Tempo Pelanggan" },
                                                    ]} /></Row6>
                                                <Row6><DxFormInput label={`Berapa ${DayArr[Detail.JenisJadwal]} ${Detail.Triger == "Pelanggan Tidak Response" ? "Setelah" : "Sebelum"}`} name='TermDate' value={Detail.TermDate || 1} onChange={(e) => this.handleChange(e, 'TermDate')} required={true} /></Row6>
                                            </Row>
                                        </Fragment>
                                }
                                <DxFormInput type='textarea' label='Pesan' rows='10' name='Pesan' value={Detail.Pesan || ""} placeholder={PlaceHolder} onChange={(e) => this.handleChange(e, 'Pesan')} required={true} />
                                <DxFormInput type='select' label='Status' name='Status' value={Detail.Status || "Draft"} required={true}
                                    onChange={(e) => {
                                        let Detail = this.state.Detail;
                                        Detail.Status = e.value;
                                        this.setState({ Detail });
                                    }}
                                    data={[
                                        { Nama: "Draft", ID: "Draft" },
                                        { Nama: "Aktif", ID: "Aktif" },
                                        { Nama: "Batal", ID: "Batal" },
                                        { Nama: "Selesai", ID: "Selesai" },
                                    ]} />
                                <p></p>
                                <h6>Attach File</h6>
                                <button type='button' className='btn btn-default-soft' onClick={async (e) => {
                                    let sql = await api("datafile", { PerusahaanID: this.state.PerusahaanID });
                                    if (sql.status == "sukses") {
                                        this.setState({ DataFile: sql.data });
                                        openModal("modalFile");
                                    }
                                }}><i className="fas fa-paperclip"></i> Pilih File</button>
                                <p></p>
                                {
                                    this.state.Attach == "none" ? "" :
                                        <div className='card shadow'>
                                            <div className='card-body'>
                                                <div className='d-flex justify-content-between align-items-center'>
                                                    <div>
                                                        <img src={host + "file/" + this.state.Attach} width="50px" height="50px" /> <spam>{this.state.Attach}</spam>
                                                    </div>
                                                    <i className='fas fa-trash-alt' onClick={(e) => this.setState({ Attach: "none" })}></i>
                                                </div>
                                            </div>
                                        </div>
                                }
                            </Row6>
                            <Row6>
                                <h6>Target</h6>
                                <DxFormInput type='select' label='Jenis Target' name='DataKontak' value={Detail.DataKontak || ""} required={true}
                                    onChange={(e) => {
                                        let Detail = this.state.Detail;
                                        Detail.DataKontak = e.value;
                                        this.setState({ Detail });
                                    }}
                                    data={[
                                        { Nama: "Sebagian", ID: "Sebagian" },
                                        { Nama: "Label", ID: "Label" },
                                        { Nama: "Semua", ID: "Semua" }
                                    ]} />
                                {Detail.DataKontak == "Sebagian" ?
                                    <Fragment>
                                        <p></p>
                                        <div className='d-flex justify-content-start gap-2'>
                                            <button type='button' className='btn btn-default' onClick={() => this.handleModalKontak()}>Pilih Kontak</button>
                                            <button type='button' className='btn btn-default' onClick={() => openModal("modalImport")}>Import Kontak</button>
                                        </div>
                                        <RendTables
                                            tbody={this.state.Kontak}
                                            thead={[
                                                { cap: "", type: "", type: "opsi" },
                                                { cap: "Nama", sort: "Nama", type: "str" },
                                                { cap: "WhatsApp", sort: "Telp", type: "str" },
                                            ]}
                                            opt={[
                                                { icon: "fas fa-trash", fn: (e) => this.handleHapusKontak(e) }
                                            ]}

                                        />
                                    </Fragment> : Detail.DataKontak == "Label" ?
                                        <Fragment>
                                            <FormInput type='tag' id='edtTagTarget' label='Kelompok / Label' name='LabelKontak' value={Detail.LabelKontak || ""} onChange={(e) => this.handleChange(e, 'LabelKontak')} PerusahaanID={this.state.PerusahaanID} />
                                        </Fragment>
                                        :
                                        ""
                                }
                            </Row6>
                        </Row>
                        <button className='btn btn-link' type='button' onClick={() => openModal("modalTermCondition")}>Term & Conditions</button>
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalForm">
                        <button type='submit' className='btn btn-default'><i className='fas fa-save'></i> Simpan</button>
                    </ModalFooter>
                </Modal>

                <Modal id="modalTermCondition" className='modal-xl' title="Term & Condition Penggunaan Broadcast">
                    <ModalBody>
                        <b>Penting:</b> Penggunaan fitur broadcast WhatsApp secara masif dan berlebihan sangat berisiko. Kami tidak bertanggung jawab jika akun Anda diblokir oleh WhatsApp karena aktivitas yang melanggar kebijakan penggunaan mereka.
                        <p></p>
                        <b>Peringatan Penggunaan Broadcast WhatsApp</b>
                        <p></p>
                        Penggunaan fitur broadcast WA harus dilakukan dengan bijak. Harap diperhatikan bahwa pengiriman pesan broadcast dalam jumlah yang sangat besar dan frekuensi yang terlalu sering berpotensi melanggar kebijakan WhatsApp.
                        <br></br>
                        Risiko utama dari pelanggaran ini adalah pemblokiran akun WA Anda, baik sementara maupun permanen. Kami menghimbau Anda untuk menggunakan fitur ini secara bertanggung jawab untuk menghindari konsekuensi tersebut. Kami tidak dapat memberikan ganti rugi atau bantuan teknis jika akun Anda terkena sanksi oleh pihak WhatsApp.

                        <p></p>
                        <b>Syarat & Ketentuan Penggunaan Broadcast WhatsApp</b>
                        <br></br>
                        <b>Batasan Penggunaan:</b> Pengguna menyadari bahwa penggunaan fitur broadcast WA harus sesuai dengan kebijakan penggunaan yang ditetapkan oleh WhatsApp. Pengguna dilarang mengirim pesan broadcast dalam jumlah masif dan dalam waktu singkat karena hal ini dapat dianggap sebagai spam.
                        <br></br>
                        <b>Tanggung Jawab Pengguna:</b> Seluruh tanggung jawab atas penggunaan fitur broadcast, termasuk risiko pemblokiran akun, sepenuhnya berada pada pengguna. Kami tidak bertanggung jawab atas kerugian atau sanksi apa pun yang dialami oleh pengguna akibat melanggar kebijakan WhatsApp.
                        <br></br>
                        <b>Bukan Tanggung Jawab Kami:</b> Kami tidak memiliki kewenangan atau kendali atas kebijakan yang diterapkan oleh pihak WhatsApp. Setiap tindakan pemblokiran akun yang dilakukan oleh WhatsApp adalah di luar tanggung jawab kami.
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupmodalTermCondition" />
                </Modal>

                <Modal id='modalFile' title="File Manager" className='modal-xl' form={false} onClose={() => this.setState({ IsShowFile: false })}>
                    <ModalBody>
                        {
                            this.state.IsShowFile &&
                            <FileManager handleclick={(fil) => {
                                this.setState({ Attach: fil.Link, IsShowFile: false });
                                document.getElementById('btnTutupModalFile').click();
                            }} />
                        }
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalFile" />
                </Modal>

                <Modal id='modalImport' className='modal-lg' title="Import Kontak" form={true} onSubmit={(e) => this.handleImportKontak(e)} >
                    <ModalBody>
                        <div className='input-group'>
                            <input type='file' className='form-control' onChange={(e) => this.handleImportData(e)} accept=".xls, .xlsx" />
                            <button type='button' className='btn btn-default' onClick={(e) => this.handleDownloadContoh()}><i className='fas fa-download'></i> Contoh Format</button>
                        </div>
                        <RendTables
                            tbody={this.state.DataKontak}
                            thead={[
                                { cap: "", sort: "", type: "opsi" },
                                { cap: "Nama", sort: "Nama", type: "str" },
                                { cap: "Telp", sort: "Telp", type: "str" },
                            ]}
                            opt={[
                                { icon: "fas fa-trash", fn: (e) => this.handleDeleteKontak(e) }
                            ]}
                        />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalImport">
                        <button type='submit' className='btn btn-default'><i className='fas fa-upload'></i> Import</button>
                    </ModalFooter>
                </Modal>

                <Modal id='modalKontak' className='modal-lg' title='Data Kontak' form={true} onSubmit={(e) => this.handleSimpahKontak(e)} >
                    <ModalBody>
                        <RendTables
                            tbody={this.state.DataKontak}
                            id="tableKontak"
                            thead={[
                                { cap: "Pilih Semua", sort: "checked", type: "checkbox", fn: (e) => this.handlePilihAllKontak(e), fnitem: (e, data, i) => this.handlePilihKontak(e, data, i) },
                                { cap: "Nama", sort: "Nama", type: "str" },
                                { cap: "WhatsApp", sort: "Telp", type: "str" },
                            ]}
                        />
                    </ModalBody>
                    <ModalFooter btnClose="btnTutupModalDetail" />
                </Modal>

                <ModalDelete title="Konfirmasi" id='modalHapus' act='hapus' ID={this.state.UserID} onSubmit={(e) => submitForm(e, { crud: "crudblash", fn: () => this.handleMain(this.state.PerusahaanID), debug: true })} />
            </Fragment>
        )
    }

}

export default Dashboard;
