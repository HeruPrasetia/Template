import React, { Fragment } from 'react';
import { api, cekProfile } from '../Modul';
import { Chart, Series, ArgumentAxis, CommonSeriesSettings, Export, Legend, Margin } from 'devextreme-react/chart';
import PieChart, { Tooltip, Format, Label, Connector } from 'devextreme-react/pie-chart';
import Tutorial from '../component/Tutorial';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Data: [],
            Field: [],
            Detail: {},
            DataChat: [],
            PerusahaanID: 0,
            DataDevice: [],
            DataKontak: [],
            Kontak: [],
            DataLead: [],
            DataStatusLead: [],
            DataPengguaanAi: [],
            DataBroadcast: [],
            DataDevice: [],
            SysAkses: {},
            RunStep: false,
        };
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
        this.setState({ Field: Field, PerusahaanID: profile.data.PerusahaanID, SysAkses: profile.data });
        setTimeout(() => {
            this.handleMain();
        }, 500);
        let ColorTheme = localStorage.getItem("ColorTheme") || "light";
        if (ColorTheme == "dark") {
            let cls = document.getElementsByClassName("table");
            for (let i = 0; i < cls.length; i++) {
                cls[i].classList.add("table-dark")
            }
        }
    }

    async handleMain() {
        let sql = await api("dashboard", { PerusahaanID: this.state.PerusahaanID });
        if (sql.status == "sukses") {
            let output = [];
            let dataAi = [];
            for (let row of sql.data) {
                let item = { tanggal: row.Tanggal };

                for (let d of sql.device) {
                    item[d.Nama] = 0;
                }

                if (row.Jumlah != null && row.Device != null) {
                    let found = sql.device.find(d => d.Nama === row.Device);
                    if (found) {
                        item[found.Nama] = row.Jumlah;
                    }
                }

                output.push(item);
            }
            let jenisUnik = ['Ai', 'Vc', 'Img'];

            for (let dd of sql.device) {
                let obj = { state: dd.Nama };

                for (let jenis of jenisUnik) {
                    let found = sql.dataAI.find(d => d.Nama === dd.Nama && d.Jenis === jenis);
                    obj[jenis] = found ? found.Jumlah : 0;
                }

                dataAi.push(obj);
            }
            this.setState({ DataLead: output, DataDevice: sql.device, DataStatusLead: sql.statusLead, DataPengguaanAi: dataAi, DataBroadcast: sql.broadcast });
        }
    }

    render() {
        return (
            <Fragment>
                <div className="main-body">
                    <div className="div-content mt-1">
                        <div className="main-title col-sm-6 col-lg-8 mb-2">
                            <label id='lblTitle'>Dashboard</label>
                            <button className='btn btn-link' onClick={() => {
                                this.setState({ RunStep: true });
                                setTimeout(() => {
                                    let Btn = document.getElementsByClassName("react-joyride__beacon");
                                    for (let i = 0; i < Btn.length; i++) Btn[i].click();
                                }, 200);
                            }}><i className='fas fa-info-circle'></i></button>
                        </div>
                        <p></p>
                        <div className="row">
                            <div className="col-md-6 mb-2">
                                <div className='card card-shadow' id='cardDataLead'>
                                    <div className='card-body'>
                                        <Chart palette="Harmony Light" title="Data Lead Masuk" dataSource={this.state.DataLead}>
                                            <CommonSeriesSettings argumentField="tanggal" type="stackedarea" />
                                            {
                                                this.state.DataDevice.map((dev, i) => {
                                                    return <Series valueField={dev.Nama} name={dev.Nama} key={i}></Series>
                                                })
                                            }
                                            <Margin bottom={20} />
                                            <ArgumentAxis valueMarginsEnabled={false} />
                                            <Legend verticalAlignment="bottom" horizontalAlignment="center" />
                                            <Export enabled={true} />
                                        </Chart>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mb-2">
                                <div className='card card-shadow' id='cardStatusLead'>
                                    <div className='card-body'>
                                        <PieChart id="pie" type="doughnut" title="Laporan Status Lead" palette="Soft Pastel" dataSource={this.state.DataStatusLead}>
                                            <Series argumentField="Status">
                                                <Label visible={true} format="decimal">
                                                    <Connector visible={true} />
                                                </Label>
                                            </Series>
                                            <Export enabled={true} />
                                            <Legend margin={0} horizontalAlignment="right" verticalAlignment="top" />
                                            <Tooltip enabled={true} customizeTooltip={this.customizeTooltip}>
                                                <Format type="decimal" />
                                            </Tooltip>
                                        </PieChart>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p></p>
                        <div className="row">
                            <div className="col-md-6 mb-2">
                                <div className='card card-shadow' id='cardPenggunaanAI'>
                                    <div className='card-body'>
                                        <Chart id="chart" title="Laporan Penggunaan AI" dataSource={this.state.DataPengguaanAi} onPointClick={this.onPointClick}>
                                            <CommonSeriesSettings argumentField="state" type="bar" hoverMode="allArgumentPoints" selectionMode="allArgumentPoints">
                                                <Label visible={true}>
                                                    <Format type="fixedPoint" precision={0} />
                                                </Label>
                                            </CommonSeriesSettings>
                                            <Series argumentField="state" valueField="Ai" name="Ai Response" />
                                            <Series valueField="Vc" name="Voice Notes" />
                                            <Series valueField="Img" name="Image Extractor" />
                                            <Legend verticalAlignment="bottom" horizontalAlignment="center"></Legend>
                                            <Export enabled={true} />
                                        </Chart>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mb-2">
                                <div className='card card-shadow' id='cardBroadCast'>
                                    <div className='card-body'>
                                        <PieChart id="pie" type="doughnut" title="Laporan Campaign / Broadcast" palette="Soft Pastel" dataSource={this.state.DataBroadcast}>
                                            <Series argumentField="region">
                                                <Label visible={true} format="decimal">
                                                    <Connector visible={true} />
                                                </Label>
                                            </Series>
                                            <Export enabled={true} />
                                            <Legend margin={0} horizontalAlignment="right" verticalAlignment="top" />
                                            <Tooltip enabled={true} customizeTooltip={this.customizeTooltip}>
                                                <Format type="decimal" />
                                            </Tooltip>
                                        </PieChart>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.SysAkses.Step != "" ? <Tutorial data={this.state.SysAkses.Step} run={this.state.RunStep} /> : ""
                }
            </Fragment>
        )
    }

}

export default Dashboard;