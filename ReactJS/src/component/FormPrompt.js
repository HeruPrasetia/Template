import React, { Fragment } from 'react';
import { DxFormInput, FormControl } from './FormInput.js';
import { api, pesan, saiki } from '../Modul.js';
import { Row, Row6 } from './Rows.js';
import '../Chat.css';

class CardPayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            PenjelasanProduk: "",
            HasilPrompt: "",
            PesanTest: "",
            DataHistory: [],
            Detail: {},
            NamaBrand: '',
            JenisProduk: 'Jasa',
            HargaRange: '',
            Website: '',
            Sosmed: '',
            JamOperasional: '',
            NoTelp: '',
            Alamat: '',
            GayaBahasa: '',
            PakaiEmoji: '',
            JawabanPanjang: 'Pendek & cepat',
            SapaanPembuka: '',
            SapaanPenutup: '',
            SOPKomplain: '',
            SOPStokKosong: '',
            SOPDiluarTopik: '',
            BolehDataSensitif: 'Ya',
            SOPTidakTahu: '',
            JawabanMarah: '',
            JawabanMintaDiskon: '',
            JawabanRefund: '',
            JawabanIseng: '',
            Identitas: '',
            Garansi: '',
            Slogan: '',
            FAQ: [{ Pertanyaan: "", Jawaban: "" }],
            IDPrompt: ""
        };
    }

    componentDidMount() {
        this.setState({ DataHistory: this.props.History, Detail: this.props.Detail });
    }

    componentDidUpdate(prev) {
        if (prev.Detail != this.props.Detail) this.setState({ DataHistory: this.props.History, Detail: this.props.Detail });
    }

    async buatPrompt(e) {
        let btn = e.target;
        btn.disabled = true;
        btn.innerHTML = 'Membuat Prompt Anda . . .';
        const S = this.state;

        let text = `
        Perkenalkan diri sebagai "${S.Identitas}" jika ini adalah pesan pertama.
        jangan ulangi sapaan jika sudah ada pesan sebelumnya.

        Nama brand / toko: "${S.NamaBrand}".
        Kami menjual produk/layanan: "${S.JenisProduk}" dengan kisaran harga: "${S.HargaRange}".
        Website resmi: ${S.Website || '-'}, sosial media: ${S.Sosmed || '-'}, nomor WhatsApp resmi: ${S.NoTelp || '-'}.
        Alamat toko/kantor: ${S.Alamat || '-'}.
        Gaya bahasa yang digunakan: ${S.GayaBahasa || '-'}, pakai emoji: ${S.PakaiEmoji || '-'}, jawaban: ${S.JawabanPanjang || '-'}.
        Sapaan pembuka: "${S.SapaanPembuka || '-'}", sapaan penutup: "${S.SapaanPenutup || '-'}".
        Slogan brand: "${S.Slogan || '-'}".

        Penjelasan produk & ketentuan lengkap:
        ${S.PenjelasanProduk || '-'}

        SOP jika ada komplain: ${S.SOPKomplain || '-'}
        SOP jika stok kosong: ${S.SOPStokKosong || '-'}
        SOP jika pertanyaan di luar topik: ${S.SOPDiluarTopik || '-'}
        Jika AI tidak tahu jawaban: ${S.SOPTidakTahu || '-'}
        Boleh minta data sensitif? ${S.BolehDataSensitif || '-'}

        Respon khusus:
        - Jika pelanggan marah: ${S.JawabanMarah || '-'}
        - Jika minta diskon lebih: ${S.JawabanMintaDiskon || '-'}
        - Jika minta refund/retur: ${S.JawabanRefund || '-'}
        - Jika iseng / tidak serius: ${S.JawabanIseng || '-'}

        Garansi / after sales: ${S.Garansi || '-'}

        Informasi / aturan tambahan :

        ${S.PenjelasanProduk}

        FAQ yang sering ditanyakan:
        ${S.FAQ.map((f, i) => `Q: ${f.Pertanyaan} \nA: ${f.Jawaban}`).join('\n')}
        `;
        let sql = await api("generateprompt", { PenjelasanProduk: text });
        if (sql.status == "sukses") {
            this.setState({ HasilPrompt: sql.data });
            btn.disabled = false;
            btn.innerHTML = 'Generate Promopt';
        } else {
            pesan("gagal", sql.pesan, "error");
            btn.disabled = false;
            btn.innerHTML = 'Generate Promopt';
        }
    }

    async handleSendTest() {
        if (this.state.HasilPrompt == "") return pesan("Gagal", "Silahkan isi Prompt Terlebih dahulu", "warning");
        if (this.state.PesanTest == "") return pesan("Gagal", "Silahkan masukan pesan Terlebih dahulu", "warning");
        let sql = await api("testprompt", {
            Pesan: this.state.PesanTest,
            Prompt: this.state.HasilPrompt,
            ID: this.state.Detail.ID,
            From: this.state.Detail.SessionsID,
            PerusahaanID: this.state.Detail.PerusahaanID
        });
        if (sql.status == "sukses") {
            this.setState({ DataHistory: sql.data, PesanTest: "" });
        } else {
            pesan("Gagal", sql.pesan, "warning");
        }
    }

    async handleSimpanPrompt() {
        if (this.state.NamaPrompt == "") return pesan("Silahkan masukan nama prompt");
        let sql = await api("crudprompt", { act: this.state.IDPrompt == "" ? "tambah" : "edit", ID: this.state.IDPrompt, Prompt: this.state.HasilPrompt, Nama: this.state.NamaPrompt, PerusahaanID: this.state.Detail.PerusahaanID });
        if (sql.status == "sukses") {
            pesan("", sql.pesan);
            this.setState({ IDPrompt: sql.ID });
        } else {
            pesan("", sql.pesan, "error");
        }
    }

    render() {
        let S = this.state;
        return (
            <Row>
                <Row6>
                    <Row>
                        <Row6><DxFormInput label="Perkenalkan Diri Sebagai" value={S.Identitas} onChange={(e) => this.setState({ Identitas: e.value })} /></Row6>
                        <Row6><DxFormInput label="Nama Brand / Toko" value={S.NamaBrand} onChange={(e) => this.setState({ NamaBrand: e.value })} required={true} /></Row6>
                        <Row6><DxFormInput label="Jenis Produk / Layanan" value={S.JenisProduk} onChange={(e) => this.setState({ JenisProduk: e.value })} /></Row6>
                        <Row6><DxFormInput label="Kisaran Harga Produk" value={S.HargaRange} onChange={(e) => this.setState({ HargaRange: e.value })} placeholder='Contoh: Rp 50.000–200.000' /></Row6>
                        <Row6><DxFormInput label="Website Resmi" value={S.Website} onChange={(e) => this.setState({ Website: e.value })} /></Row6>
                        <Row6><DxFormInput label="Sosial Media (IG / FB / TikTok)" value={S.Sosmed} onChange={(e) => this.setState({ Sosmed: e.value })} /></Row6>
                        <Row6><DxFormInput label="Nomor Telepon / WhatsApp Resmi" value={S.NoTelp} onChange={(e) => this.setState({ NoTelp: e.value })} /></Row6>
                        <Row6><DxFormInput label="Alamat Toko / Kantor" value={S.Alamat} onChange={(e) => this.setState({ Alamat: e.value })} /></Row6>
                        <Row6><DxFormInput type='select' label="Gaya Bahasa" value={S.GayaBahasa} onChange={(e) => this.setState({ GayaBahasa: e.value })} data={[
                            { ID: "Formal", Nama: "Formal" },
                            { ID: "Santai", Nama: "Santai" },
                            { ID: "Campur", Nama: "Campur" },
                        ]} /></Row6>
                        <Row6><DxFormInput type='select' label="Pakai Emoji? (Ya / Tidak)" value={S.PakaiEmoji} onChange={(e) => this.setState({ PakaiEmoji: e.value })} data={[
                            { ID: "Ya", Nama: "Ya" },
                            { ID: "Tidak", Nama: "Tidak" }
                        ]} /></Row6>
                        <Row6><DxFormInput type='select' label="Jawaban Panjang / Pendek" value={S.JawabanPanjang} onChange={(e) => this.setState({ JawabanPanjang: e.value })} data={[
                            { ID: "Pendek & cepat", Nama: "Pendek & cepat" },
                            { ID: "Detail & lengkap", Nama: "Detail & lengkap" }
                        ]} /></Row6>
                        <Row6><DxFormInput label="Sapaan Pembuka" value={S.SapaanPembuka} onChange={(e) => this.setState({ SapaanPembuka: e.value })} placeholder='Contoh: Halo Kak, selamat datang!' /></Row6>
                        <Row6><DxFormInput label="Sapaan Penutup" value={S.SapaanPenutup} onChange={(e) => this.setState({ SapaanPenutup: e.value })} placeholder='Contoh: Terima kasih sudah menghubungi kami!' /></Row6>
                        <Row6><DxFormInput type='select' label="Boleh minta data sensitif? (Ya / Tidak)" value={S.BolehDataSensitif} onChange={(e) => this.setState({ BolehDataSensitif: e.value })} data={[
                            { ID: "YA", Nama: "YA" },
                            { ID: "TIDAK", Nama: "TIDAK" }
                        ]} /></Row6>
                        <Row6><DxFormInput label="Slogan brand" value={S.Slogan} onChange={(e) => this.setState({ Slogan: e.value })} /></Row6>
                        <Row6></Row6>
                        <Row6></Row6>
                    </Row>

                    <DxFormInput type='textarea' label="SOP saat ada komplain" value={S.SOPKomplain} onChange={(e) => this.setState({ SOPKomplain: e.value })} />

                    <DxFormInput type='textarea' label="SOP saat stok kosong" value={S.SOPStokKosong} onChange={(e) => this.setState({ SOPStokKosong: e.value })} />

                    <DxFormInput type='textarea' label="SOP jika pertanyaan di luar topik" value={S.SOPDiluarTopik} onChange={(e) => this.setState({ SOPDiluarTopik: e.value })} />

                    <DxFormInput label="Jika AI tidak tahu jawaban" value={S.SOPTidakTahu} onChange={(e) => this.setState({ SOPTidakTahu: e.value })} placeholder='Contoh: Akan dicek dulu / Alihkan ke CS manusia' />

                    <DxFormInput type='textarea' label="Jawaban saat pelanggan marah" value={S.JawabanMarah} onChange={(e) => this.setState({ JawabanMarah: e.value })} />

                    <DxFormInput type='textarea' label="Jawaban saat minta diskon lebih" value={S.JawabanMintaDiskon} onChange={(e) => this.setState({ JawabanMintaDiskon: e.value })} />

                    <DxFormInput type='textarea' label="Jawaban saat minta refund / retur" value={S.JawabanRefund} onChange={(e) => this.setState({ JawabanRefund: e.value })} />

                    <DxFormInput type='textarea' label="Jawaban saat pelanggan iseng" value={S.JawabanIseng} onChange={(e) => this.setState({ JawabanIseng: e.value })} />

                    <DxFormInput label="Garansi / after sales" value={S.Garansi} onChange={(e) => this.setState({ Garansi: e.value })} />

                    <DxFormInput type='textarea' label="Penjelasan Produk" value={S.PenjelasanProduk} onChange={(e) => this.setState({ PenjelasanProduk: e.value })} required={true} placeholder='Silahkan masukandetail informasi dari perusahaan / usaha anda \n mulai dari Nama, Alamat Telp \n jenis usaha, nama nama produk beserta cara pesan dan ketenetuan ketentuan lain nya' />
                    <b>FAQ / Pertanyaan Paling Umum</b>
                    <p></p>
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
                                S.FAQ.map((tr, i) => {
                                    return (
                                        <tr>
                                            <td style={{ width: "50px" }}>
                                                <div className='d-flex justify-content-start gap-2'>

                                                    <i className='fas fa-trash-alt' style={{ color: "red" }} onClick={() => {
                                                        let FAQ = this.state.FAQ;
                                                        let Temp = [];
                                                        for (let ii in FAQ) if (i != ii) Temp.push(FAQ[i]);
                                                        this.setState({ FAQ: Temp });
                                                    }}></i>
                                                    {
                                                        i == S.FAQ.length - 1 && <i className="fas fa-square-plus" onClick={() => {
                                                            let FAQ = this.state.FAQ;
                                                            FAQ.push({ Pertanyaan: "", Jawaban: "" });
                                                            this.setState({ FAQ });
                                                        }} />
                                                    }
                                                </div>
                                            </td>
                                            <td><FormControl placeholder="Pertanyaan" value={tr.Pertanyaan} onChange={(e) => {
                                                let FAQ = this.state.FAQ;
                                                FAQ[i].Pertanyaan = e.target.value;
                                                this.setState({ FAQ });
                                            }} /></td>
                                            <td><FormControl placeholder="Jawaban" value={tr.Jawaban} onChange={(e) => {
                                                let FAQ = this.state.FAQ;
                                                FAQ[i].Jawaban = e.target.value;
                                                this.setState({ FAQ });
                                            }} /></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </Row6>
                <Row6>
                    <DxFormInput type='textarea' label="Hasil Prompt" value={S.HasilPrompt} height="500" onChange={(e) => this.setState({ HasilPrompt: e.value })} required={true} />
                    <p></p>
                    <button type='button' className='btn btn-default w-100' onClick={(e) => this.buatPrompt(e)}>Generate Prompt</button>
                    {
                        S.HasilPrompt !== "" &&
                        <Fragment>
                            <p></p>
                            <DxFormInput name='Prompt' label='Simpan Prompt Sebagai' placeholder='Nama Prompt' value={S.NamaPrompt || `Text Prompt ${saiki()}`} onChange={(e) => this.setState({ NamaPrompt: e.value })} />
                            <button type='button' className='btn btn-default w-100' onClick={(e) => this.handleSimpanPrompt(e)}>Simpan Prompt</button>
                        </Fragment>
                    }
                    <p></p>
                    <h6>Live Test</h6>
                    <div className="chat-wrapper">
                        <div className="chat-container">
                            {S.DataHistory.map((msg, index) => (
                                <div key={index} className={`chat-bubble ${msg.UserType === 'Admin' ? 'chat-right' : 'chat-left'}`}>
                                    {msg.Pesan}
                                </div>
                            ))}
                        </div>
                        <div className="chat-input-area">
                            <input type="text" placeholder="Tulis pesan..." className="chat-input"
                                value={S.PesanTest}
                                onChange={(e) => this.setState({ PesanTest: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && this.handleSendTest()
                                }
                            />
                            <button className="chat-send-button" onClick={() => this.handleSendTest()}>Kirim</button>
                            <button className="chat-reset-button" onClick={async () => {
                                let sql = await api("resetchat", { ID: S.Detail.ID, Telp: S.Detail.SessionsID });
                                if (sql.status == "sukses") {
                                    this.setState({ DataHistory: [] });
                                    pesan("Sukses", sql.pesan, "info");
                                }
                            }}>Reset</button>
                        </div>
                    </div>
                </Row6>
            </Row>
        );
    }
}

export default CardPayment;