import React, { useState, useEffect, } from 'react';
import * as XLSX from "xlsx/dist/xlsx.mini.min.js";
import notify from "devextreme/ui/notify";
import ColorThief from 'color-thief-browser';

export let Dommain = window.location.hostname;
export let host = window.location.hostname === "localhost" ? "http://localhost:3001/" : "https://wapi.naylatools.com/";
export let WsHost = window.location.hostname === "localhost" ? "ws://localhost:3003" : "wss://ws.naylatools.com";
// export let Dommain = 'apps.bantuwin.id';
// export let WsHost = "ws://ws.naylatools.com";
// export let host = "https://wapi.naylatools.com/";

export const Token = localStorage.getItem("TokenUserWA");

export function pesan(title = "", message = "", type = "info") {
    notify({
        message: message,
        position: {
            my: "bottom center",
            at: "bottom center",
            of: window
        },
        minWidth: 300,
        width: 'auto',
        height: 'auto',
        closeOnClick: true,
        closeOnSwipe: true,
        displayTime: 3000,
        animation: {
            show: { type: 'fade', duration: 400, from: 0, to: 1 },
            hide: { type: 'fade', duration: 400, to: 0 }
        }
    }, type);
}


export function getTextColorByBg(bgColor) {
    if (!bgColor) return '#000';
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000' : '#fff';
}


export function useImagePalette(src, count = 4) {
    const [colors, setColors] = useState([]);

    useEffect(() => {
        if (!src) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;

        img.onload = () => {
            const colorThief = new ColorThief();
            try {
                const palette = colorThief.getPalette(img, count);
                const rgb = palette.map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`);
                setColors(rgb);
            } catch (e) {
                console.error("Gagal ambil warna:", e);
                setColors([]);
            }
        };

        img.onerror = () => {
            console.error("Gagal load gambar:", src);
            setColors([]);
        };
    }, [src, count]);

    return colors;
}

export function useImageRegionColors(src, jarak = 10) {
    const [colors, setColors] = useState({
        top: null,
        left: null,
        bottom: null
    });

    useEffect(() => {
        if (!src) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const getColorAt = (x, y, w = 20, h = 20) => {
                const region = ctx.getImageData(x, y, w, h);
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                tempCanvas.width = w;
                tempCanvas.height = h;
                tempCtx.putImageData(region, 0, 0);
                return new ColorThief().getColor(tempCanvas);
            };

            try {
                const topColor = getColorAt(img.width / 2 - jarak, 0);
                const leftColor = getColorAt(0, img.height / 2 - jarak);
                const bottomColor = getColorAt(img.width / 2 - jarak, img.height - 20);

                setColors({
                    top: `rgb(${topColor.join(',')})`,
                    left: `rgb(${leftColor.join(',')})`,
                    bottom: `rgb(${bottomColor.join(',')})`
                });
            } catch (err) {
                console.error("Gagal ambil warna:", err);
            }
        };
    }, [src]);

    return colors;
}

export function spinText(text) {
    const pattern = /\{([^{}]+?)\}/;

    while (pattern.test(text)) {
        text = text.replace(pattern, (_, match) => {
            const options = match.split('|');
            return options[Math.floor(Math.random() * options.length)];
        });
    }

    return text;
}

export const TampilBulan = function (date) {
    let bulan = date.substring(5);
    let tahun = date.substring(0, 4);
    let BulanIndo = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agust", "Sept", "Okt", "Nov", "Des"];
    let hasil = `${BulanIndo[bulan - 1]} ${tahun}`;
    return hasil;
}

export const parseJsonArr = function (str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return [];
    }
}

export async function cekProfile() {
    let sql = await api("getProfile", { Path: window.location.pathname, isMenu: false });
    if (sql.status == "gagal") handleLogout();

    return sql;
}

export async function handleLogout() {
    let sql = await api("logoutapp", {});
    if (sql.status == "sukses") {
        localStorage.clear();
        window.location.href = "/";
    }
}

export const saiki = function (first = null) {
    var today = new Date();
    var dd = first == null ? today.getDate() : first;
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) { dd = '0' + dd; }
    if (mm < 10) { mm = '0' + mm; }
    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

export function openModal(ID, fn = false) {
    let modal = new window.bootstrap.Modal(document.getElementById(ID), {});
    modal.show("#" + ID);
    if (fn != false) fn();
}

export const isJson = function (str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export const setCookie = function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export const getCookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export const YYMMDD = function (date) {
    var d = new Date(date),
        month = '' + (d.getMonth()),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

export const tanggalIndo = function (data, time = false) {
    let d = new Date(data);
    if (isNaN(d.getTime())) return '';

    let year = d.getFullYear();
    let month = ('0' + (d.getMonth() + 1)).slice(-2);
    let day = ('0' + d.getDate()).slice(-2);

    let hasil = [year, month, day].join('-');
    if (hasil === "0000-00-00" || hasil == null) return hasil;

    const BulanIndo = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    let tgl = hasil.substring(8, 10);
    let bln = hasil.substring(5, 7);
    let thn = hasil.substring(2, 4);

    let result = `${tgl} ${BulanIndo[parseInt(bln, 10) - 1]} ${thn}`;

    if (time === true) {
        let jam = ('0' + d.getHours()).slice(-2);
        let menit = ('0' + d.getMinutes()).slice(-2);
        let detik = ('0' + d.getSeconds()).slice(-2);
        result += ` ${jam}:${menit}:${detik}`;
    }

    return result;
};

export const randomRgb = () => {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
}

export const getDayOfMonth = function (month, year) {
    var date = new Date(Date.UTC(year, month, 1));
    var days = [];
    while (date.getUTCMonth() === month) {
        days.push(YYMMDD(new Date(date)));
        date.setUTCDate(date.getUTCDate() + 1);
    }
    return days;
}

export const getLastDay = (y, m) => {
    var d = new Date(y, m, 0);
    return `${y}-${m}-${d.getDate()}`;
}

export const getAllDay = function (date) {
    var month = date.substring(5, 7);
    var year = date.substring(0, 4);
    var d = new Date(year, month, 0).getDate();
    let day = [];
    for (let i = 1; i <= d; i++)  day.push(`${year}-${month}-${i}`);
    return day;
}

export const numberFormat = function (ini) {
    var formatter = new Intl.NumberFormat("en-GB", { style: "decimal" });
    var nmr = 0;
    if (isNaN(ini)) {
        nmr = 0;
    } else {
        nmr = ini;
    }
    return formatter.format(nmr.toString().replace(/,/g, ""));
}

export const execFunction = function (functionName, context = window) {
    let args = Array.prototype.slice.call(arguments, 2);
    let namespaces = functionName.split(".");
    let func = namespaces.pop();
    for (let i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
}

export function DxSubmitForm(e, ref, opt) {
    e.preventDefault();
    e.stopPropagation();
    let Form = e.target;
    let btn = Form.querySelector('button[type="submit"]');
    btn.disabled = true;
    let i = btn.querySelector('i');
    let oldCls = i.className;
    i.className = "spinner-border spinner-border-sm text-light";
    let btnClose = opt.close ? document.getElementById(opt.close) : Form.querySelector('button[data-bs-dismiss="modal"]');
    const result = ref.current?.instance.validate();
    if (result.isValid) {
        let data = new FormData(Form);
        data.append("Domain", Dommain);
        data.append("Token", Token);
        fetch(host + opt.crud, {
            method: 'POST',
            body: data,
        }).then(response => response.text()).then(hasil => {
            if (Dommain == "localhost" && opt.debug == true) console.log(hasil);
            if (isJson(hasil)) {
                let sql = JSON.parse(hasil);
                if (sql.status === "sukses") {
                    pesan("", sql.pesan, "info");
                    opt.fn.bind(Form)(sql);
                    btn.disabled = false;
                    i.className = oldCls;
                    if (btnClose) btnClose.click();
                } else {
                    pesan("", sql.pesan, "error");
                    btn.disabled = false;
                    i.className = oldCls;
                }
            } else {
                pesan("", "Terjadi kesalahan", "error");
                btn.disabled = false;
                i.className = oldCls;
            }
        }).catch((error) => {
            console.log("Error: " + error);
            btn.disabled = false;
            i.className = oldCls;
        }).finally(() => {
            btn.disabled = false;
            i.className = oldCls;
        });
    } else {
        btn.disabled = false;
        i.className = oldCls;
    }
}

export function submitForm(e, opt) {
    e.preventDefault();
    e.stopPropagation();
    let Form = e.target;
    let btn = Form.querySelector('button[type="submit"]');
    btn.disabled = true;
    let i = btn.querySelector('i');
    let oldCls = i ? i.className : "";
    if (i) i.className = "spinner-border spinner-border-sm text-light";
    let btnClose = opt.close ? document.getElementById(opt.close) : Form.querySelector('button[data-bs-dismiss="modal"]');
    if (Form.checkValidity()) {
        let data = new FormData(Form);
        data.append("Token", Token);
        data.append("Domain", Dommain);
        fetch(host + opt.crud, {
            method: 'POST',
            body: data,
        }).then(response => response.text()).then(hasil => {
            if (Dommain == "localhost" && opt.debug == true) console.log(hasil);
            if (isJson(hasil)) {
                let sql = JSON.parse(hasil);
                if (sql.status === "sukses") {
                    pesan("Proses Success", sql.pesan, "info");
                    opt.fn.bind(Form)();
                    btn.disabled = false;
                    if (i) i.className = oldCls;
                    if (btnClose) btnClose.click();
                } else {
                    pesan("Proses Gagal", sql.pesan, "error");
                    btn.disabled = false;
                    if (i) i.className = oldCls;
                }
            } else {
                pesan("Proses Gagal", "Terjadi kesalahan", "error");
                btn.disabled = false;
                if (i) i.className = oldCls;
            }
        }).catch((error) => {
            console.log("Error: " + error);
            btn.disabled = false;
            if (i) i.className = oldCls;
        }).finally(() => {
            btn.disabled = false;
            if (i) i.className = oldCls;
        });
    } else {
        Form.classList.add('was-validated');
        btn.disabled = false;
        if (i) i.className = oldCls;
    }
}

export const api = function (url, data, debug = false) {
    try {
        data.Token = Token;
        data.Domain = Dommain;
        return new Promise((resolve, reject) => {
            fetch(encodeURI(host + url), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            }).then(response => response.text()).then(hasil => {
                if (Dommain === "localhost" && debug === true) console.log(hasil);
                if (isJson(hasil)) {
                    resolve(JSON.parse(hasil));
                } else {
                    resolve({ status: "gagal", pesan: "Terjadi Kesalahan" });
                }
            }).catch((error) => {
                reject(error)
            });
        });
    } catch (e) {
        pesan("Terjadi Kesalahan", "Mohon maaf terjadi kesalahan saat load data" + e, "error");
        console.log(e);
    }
}

export const DivAksesDitolak = ({ }) => {
    return (
        <div className="access-denied-container">
            <div className="access-denied-icon">🚫</div>
            <div className="access-denied-title">Akses Ditolak</div>
            <div className="access-denied-message">Anda tidak memiliki izin untuk mengakses halaman ini. silahkan upgrade paket</div>
        </div>
    )
};

export const DivExpired = () => {
    return (
        <div className="access-denied-container">
            <div className="access-denied-icon">📅</div>
            <div className="access-denied-title">Akun Expired</div>
            <div className="access-denied-message">Langganan anda sudah berakhir, Silahkan lakukan perpanjangan untuk menggunakan aplikasi<span className='btn btn-link' onClick={() => window.location.href = "./billing"}>Pilih Paket</span></div>
        </div>
    )
};

export const VideoCard = ({ link = "" }) => {
    const [isBouncing, setIsBouncing] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = async (e) => {
        e.stopPropagation();
        setIsVisible(false);
    };

    const handleStopBounce = () => setIsBouncing(false);

    if (!isVisible) return null;
    if (link != "") {
        return (
            <div className={`video-card ${isBouncing ? 'bounce' : ''}`}>
                <button className="close-btn" onClick={handleClose}>×</button>

                {isBouncing && (
                    <div className="overlay" onClick={handleStopBounce}>
                        <button className="play-btn">▶</button>
                    </div>
                )}

                <iframe
                    src={link}
                    title="YouTube tutorial"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        );
    } else {
        return "";
    }
};

export function convertToBase64(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        // img.crossOrigin = 'Anonymous'; // Set crossOrigin agar bisa mengakses gambar dari domain lain
        img.src = url;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0, img.width, img.height);

            try {
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = error => {
            reject(error);
        };
    });
}

export function extensionBase64(base64String) {
    const binaryData = atob(base64String.split(',')[1]);
    const header = binaryData.slice(0, 4);
    let extension = null;
    switch (header) {
        case '\x89PNG':
            extension = 'png';
            break;
        case 'GIF8':
            extension = 'gif';
            break;
        case '\xFF\xD8\xFF':
            extension = 'jpg';
            break;
        default:
            extension = 'dat';
            break;
    }
    return extension;
}

export function sizeBase64(base64String) {
    const base64WithoutMetadata = base64String.split(',')[1];
    const blob = atob(base64WithoutMetadata);
    const arrayBuffer = new ArrayBuffer(blob.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < blob.length; i++) {
        uint8Array[i] = blob.charCodeAt(i);
    }

    const blobData = new Blob([uint8Array]);
    const fileSizeBytes = blobData.size;
    const fileSizeKB = fileSizeBytes / 1024;

    return {
        sizeBytes: fileSizeBytes,
        sizeKB: Math.round(fileSizeKB)
    };
}

export function compressImageBase64(inputBase64, outputFormat, quality) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = inputBase64;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const compressedBase64 = canvas.toDataURL(`image/${outputFormat}`, quality);
            resolve(compressedBase64);
        };
        img.onerror = (error) => {
            reject(error);
        };
    });
}

export function resizeImageBase64(inputBase64, targetWidth, targetHeight, ext = "jpeg") {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = inputBase64;

        img.onload = () => {
            const aspectRatio = img.width / img.height;
            let newWidth, newHeight;
            if (targetWidth / targetHeight > aspectRatio) {
                newWidth = targetHeight * aspectRatio;
                newHeight = targetHeight;
            } else {
                newWidth = targetWidth;
                newHeight = targetWidth / aspectRatio;
            }

            const canvas = document.createElement('canvas');

            canvas.width = newWidth;
            canvas.height = newHeight;

            const ctx = canvas.getContext('2d');

            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            const resizedBase64 = canvas.toDataURL('image/' + ext);

            resolve(resizedBase64);
        };
        img.onerror = (error) => {
            reject(error);
        };
    });
}

export async function exportData(data, title, columns) {
    try {
        let arr = [columns.map((col) => col.cap)];

        data.forEach((item) => {
            let innerRowData = columns.map((col) => item[col.sort]);
            arr.push(innerRowData);
        });

        var filename = `${title}.xlsx`;
        var ws_name = "Data";
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.aoa_to_sheet(arr);

        XLSX.utils.book_append_sheet(wb, ws, ws_name);

        XLSX.writeFile(wb, filename);
    } catch (error) {
        console.error('Error exporting data:', error);
    }
}

export function importData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(sheet);

                json.forEach((row) => {
                    Object.keys(row).forEach((key) => {
                        row[key] = String(row[key]).replaceAll("'", '');
                        row[key] = String(row[key]).replaceAll('"', '');
                        row[key] = String(row[key]).replaceAll('`', '');
                    });
                });

                resolve(json);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsArrayBuffer(file);
    });
}

export function excelSerialToDate(serial) {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const days = parseInt(serial, 10);
    const date = new Date(excelEpoch.getTime() + days * 86400000);
    const yy = String(date.getFullYear());
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
}

export function excelStringToDate(str) {
    const date = new Date(str);
    if (isNaN(date)) return ''; // Handle invalid format
    const yy = String(date.getFullYear());
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
}

export function convertExcelDate(input) {
    if (!input) return '';
    if (!isNaN(input)) {
        // Angka → serial date
        return excelSerialToDate(input);
    } else {
        // String → date string
        return excelStringToDate(input);
    }
}

export function openFile(e, compress = false) {
    return new Promise((resolve, reject) => {
        let files = e.target.files;
        let promises = [];

        for (let i = 0; i < files.length; i++) {
            promises.push(processFile(files[i], compress));
        }

        Promise.all(promises)
            .then((hasil) => {
                resolve(hasil);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function processFile(file, compress) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        let fileExtension = file.name.split('.').pop().toLowerCase();
        let fileSizeKB = Math.round(file.size / 1024);

        reader.onload = async () => {
            try {
                let baru = fileSizeKB > 600 && compress == true ? await compressImageBase64(reader.result, fileExtension, 0.8) : reader.result;
                let img = new Image();
                img.src = baru;

                img.onload = async () => {
                    let width = fileSizeKB > 600 && compress ? img.width / 5 : img.width;
                    let height = fileSizeKB > 600 && compress ? img.height / 5 : img.height;
                    let newRes = fileSizeKB > 600 && compress == true ? await resizeImageBase64(baru, height, width, fileExtension) : baru;
                    resolve({ img: newRes, width: width, height: height, size: fileSizeKB, ext: fileExtension });
                };
            } catch (error) {
                console.error('Error compressing image:', error.message);
                reject(error);
            }
        };

        reader.readAsDataURL(file);
    });
}

export function detailGambar(gambar) {
    let detail = {};
    let img = new Image();
    img.src = gambar;
    img.onload = async () => {
        let size = sizeBase64(gambar).sizeKB;
        let ext = extensionBase64(gambar);
        let width = img.width;
        let height = img.height;
        detail = { size: size, width: width, height: height, ext: ext };
    };
    return detail;
}