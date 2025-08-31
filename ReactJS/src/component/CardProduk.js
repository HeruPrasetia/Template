import { host, numberFormat, useImageRegionColors, getTextColorByBg } from '../Modul.js';
import '../produk.css';
import imgAI from '../assets/img/AI.png';
import imgScrap from '../assets/img/scrap.png';
import imgImagesAI from '../assets/img/img.png';
import imgVN from '../assets/img/vn.png';
import imgBC from '../assets/img/bc.png';

function CardProduk({ opt, handleclick }) {
    const imageUrl = host + "file/" + opt.Image;
    const { top, left, bottom, error, loading } = useImageRegionColors(imageUrl);

    let gradient = 'white';
    let textColor = '#000';
    if (!loading && !error && top && left && bottom) {
        gradient = `linear-gradient(135deg, ${top}, ${left}, ${bottom})`;
        textColor = getTextColorByBg(top);
    }

    return (
        <div className="product-card shadow" onClick={() => handleclick(opt)} style={{ background: gradient }}>
            {
                opt.IsTrial === 1 ? <div className="badge-produk">Trial</div> :
                    opt.IsFavorit === 1 ? <div className="badge-produk">Hot</div> : ""
            }
            <div className="product-tumb" style={{ background: "transparent" }}>
                <img src={imageUrl} alt={opt.Nama} />
            </div>
            <div className="product-details">
                <span className="product-catagory" style={{ color: textColor }}>{opt.Nama}</span>
                <h4><a href="#" style={{ color: textColor }}>{opt.Nama}</a></h4>
                <p style={{ color: textColor }}>{opt.Keterangan}</p>
                <div className="row">
                    {
                        opt.IsTrial === 0 &&
                        <div className="col-md-6 product-price">
                            {
                                opt.Diskon > 0 && <small>Rp. {numberFormat(opt.Harga)}</small>
                            }
                            <br />
                            Rp. {numberFormat(opt.Harga - opt.Diskon)}
                        </div>
                    }
                    {
                        opt.PaketType == "Register" ?

                            <div className="col-md-6">
                                <div className='d-flex justify-content-start align-items-center gap-2' style={{ color: textColor }}>
                                    <img src={imgAI} width="20" height="20" /> {opt.KuotaAi} AI Response
                                </div>
                                <div className='d-flex justify-content-start align-items-center gap-2' style={{ color: textColor }}>
                                    <img src={imgImagesAI} width="20" height="20" /> {opt.KuotaImg} Image Extractor
                                </div>
                                <div className='d-flex justify-content-start align-items-center gap-2' style={{ color: textColor }}>
                                    <img src={imgVN} width="20" height="20" /> {opt.KuotaVn} Voice Notes
                                </div>
                                <div className='d-flex justify-content-start align-items-center gap-2' style={{ color: textColor }}>
                                    <img src={imgBC} width="20" height="20" /> {opt.KuotaBlash} Broadcast
                                </div>
                                <div className='d-flex justify-content-start align-items-center gap-2' style={{ color: textColor }}>
                                    <img src={imgScrap} width="20" height="20" /> {opt.KuotaBlash} Scrap Data
                                </div>
                            </div>
                            : <div>
                                {
                                    opt.JenisTopUp == "Chat" ?
                                        <div className='d-flex justify-content-start align-items-center gap-2' style={{ color: textColor }}>
                                            <img src={imgAI} width="20" height="20" /> {opt.JumlahTopUp} AI Response
                                        </div> :
                                        opt.JenisTopUp == "Image Extractor" ?
                                            <div className='d-flex justify-content-start align-items-center gap-2' style={{ color: textColor }}>
                                                <img src={imgImagesAI} width="20" height="20" /> {opt.JumlahTopUp} Image Extractor
                                            </div> :
                                            opt.JenisTopUp == "Voice Extractor" ?
                                                <div className='d-flex justify-content-start align-items-center gap-2' style={{ color: textColor }}>
                                                    <img src={imgVN} width="20" height="20" /> {opt.JumlahTopUp} Voice Notes
                                                </div> :
                                                opt.JenisTopUp == "Broadcast" ?
                                                    <div className='d-flex justify-content-start align-items-center gap-2' style={{ color: textColor }}>
                                                        <img src={imgBC} width="20" height="20" /> {opt.JumlahTopUp} Broadcast
                                                    </div> : opt.JenisTopUp == "Scrap" ?
                                                        <div className='d-flex justify-content-start align-items-center gap-2' style={{ color: textColor }}>
                                                            <img src={imgScrap} width="20" height="20" /> {opt.JumlahTopUp} Scrap Data
                                                        </div> : ""
                                }
                            </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default CardProduk;