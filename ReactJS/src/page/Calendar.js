import React, { Fragment } from 'react';
import { api, saiki, cekProfile, DivAksesDitolak, DivExpired } from '../Modul';
import Scheduler from 'devextreme-react/scheduler';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SysAkses: {},
            NamaProfile: "",
            NamaUser: "Heru Prasetia",
            data: [
                {
                    "id": 1,
                    "text": "Tugas 1",
                    "startDate": '2025-01-04 10:30:00',
                    "endDate": '2025-01-04 11:30:00',
                    "description": "Deskripsi tugas 1",
                    "location": "Ruangan 1",
                    "recurrenceRule": "FREQ=DAILY;INTERVAL=1"
                },
                {
                    "id": 2,
                    "text": "Tugas 2",
                    "startDate": '2025-01-04 11:30:00',
                    "endDate": '2025-01-04 13:30:00',
                    "description": "Deskripsi tugas 2",
                    "location": "Ruangan 2"
                }
            ],
            MainTitle: "Dashboard",
            PerusahaanID: 0,
            Tanggal: saiki(),
            DataProduk: [],
            DataUser: []
        };
    }

    async componentDidMount() {
        let Profile = await cekProfile();
        this.setState({ SysAkses: Profile.data, PerusahaanID: Profile.data.PerusahaanID }, async () => {
            let sql = await api("komponencalendar", { PerusahaanID: Profile.data.PerusahaanID });
            if (sql.status == "sukses") this.setState({ DataProduk: sql.Produk, DataUser: sql.User }, this.handleMain)
        });
    }

    async handleMain() {
        let sql = await api("datacalendar", { PerusahaanID: this.state.PerusahaanID, Tanggal: this.state.Tanggal });
        if (sql.status == "sukses") {
            let Data = [];
            for (let dd of sql.data) {
                let DD = dd.Data;
                DD.ID = dd.ID
                Data.push(DD);
            }
            this.setState({ data: Data });
        }
    }

    handleAppointmentRendered = (e) => {
        const color = e.appointmentData.color || '#007bff';
        e.appointmentElement.style.backgroundColor = color;
    };

    handleAddAppointment = async (e) => {
        let data = e.appointmentData;
        let sql = await api("crudcalendar", { act: "tambah", data: JSON.stringify(data), PerusahaanID: this.state.PerusahaanID, UserID: this.state.SysAkses.UserID });
        if (sql.status == "sukses") {
            data.ID = sql.ID;
            let Data = this.state.data;
            Data.push(data);
            this.setState({ data: Data });
        }
    };

    handleUpdateAppointment = async (e) => {
        let newData = e.newData;
        let sql = await api("crudcalendar", { act: "edit", data: JSON.stringify(newData), ID: e.oldData.ID, PerusahaanID: this.state.PerusahaanID, UserID: this.state.SysAkses.UserID });
        if (sql.status == "sukses") {
            let data = this.state.data;
            for (let dd in data) {
                if (data[dd].ID == newData.ID) data[dd] = newData;
            }
            this.setState({ data: data });
        }
    };

    handleDeleteAppointment = async (e) => {
        let newData = e.appointmentData;
        let sql = await api("crudcalendar", { act: "hapus", ID: newData.ID, PerusahaanID: this.state.PerusahaanID, UserID: this.state.SysAkses.UserID });
        if (sql.status == "sukses") {
            let data = this.state.data;
            let tempData = [];
            for (let ii in data) if (data[ii] != newData.ID) tempData.push(data[ii]);
            this.setState({ data: tempData });
        }
    };

    handleDateChange = (e) => {
        const date = e;
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const newDate = `${yyyy}-${mm}-${dd}`;

        this.setState({ Tanggal: newDate }, this.handleMain);
    };

    render() {
        return (
            <Fragment>
                <div className="main-header d-flex justify-content-start align-items-center gap-2">
                    <div className="main-title">Calendar / Agenda Kegiatan</div>
                </div>
                <div className="main-body" style={{ height: "100%", minHeight: "96vh" }}>

                    {this.state.SysAkses.Aktif < 0 ? <DivExpired /> :
                        this.state.SysAkses.LinkTutorial != "Akses Ditolak" ?
                            <div className="div-content mt-1">
                                <Scheduler
                                    dataSource={this.state.data}
                                    views={['day', 'week', 'month']}
                                    defaultCurrentView="day"
                                    startDateExpr="startDate"
                                    endDateExpr="endDate"
                                    defaultCurrentDate={new Date(saiki())}
                                    allowDragging={true}
                                    allowResizing={true}
                                    resources={[
                                        {
                                            fieldExpr: 'color',
                                            useColorAsDefault: true,
                                            dataSource: [
                                                { text: 'Merah Soft', id: '#F28B82', color: '#F28B82' },
                                                { text: 'Pink', id: '#F99FC2', color: '#F99FC2' },
                                                { text: 'Orange', id: '#FBBC04', color: '#FBBC04' },
                                                { text: 'Kuning', id: '#FFF475', color: '#FFF475' },
                                                { text: 'Hijau Soft', id: '#81C995', color: '#81C995' },
                                                { text: 'Turquoise', id: '#A7FFEB', color: '#A7FFEB' },
                                                { text: 'Biru Langit', id: '#AECBFA', color: '#AECBFA' },
                                                { text: 'Biru Laut', id: '#76A7FA', color: '#76A7FA' },
                                                { text: 'Ungu Soft', id: '#D7AEFB', color: '#D7AEFB' },
                                                { text: 'Abu-abu', id: '#E8EAED', color: '#E8EAED' }
                                            ],
                                            label: 'Warna Event'
                                        },
                                        {
                                            fieldExpr: 'ProdukID',
                                            allowMultiple: true,
                                            dataSource: this.state.DataProduk,
                                            label: 'Produk'
                                        },
                                        {
                                            fieldExpr: 'Pic',
                                            allowMultiple: true,
                                            dataSource: this.state.DataUser,
                                            label: 'PIC',
                                            colSpan: 2,
                                        }
                                    ]}
                                    onAppointmentRendered={this.handleAppointmentRendered}
                                    onAppointmentAdding={this.handleAddAppointment}
                                    onAppointmentUpdating={this.handleUpdateAppointment}
                                    onAppointmentDeleting={this.handleDeleteAppointment}
                                    onCurrentDateChange={this.handleDateChange}
                                    height="80vh"
                                />
                            </div>
                            : <DivAksesDitolak />}
                </div>
            </Fragment>
        );
    }
}

export default Dashboard;