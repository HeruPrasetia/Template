import { host, useImageRegionColors, getTextColorByBg } from '../Modul.js';

function FeatureCard({ Img, Nama, Penjelasan }) {
    const imageUrl = host + "file/" + Img;

    const { top, left, bottom, error, loading } = useImageRegionColors(imageUrl);

    let gradient = 'white';
    let textColor = '#000';
    if (!loading && !error && top && left && bottom) {
        gradient = `linear-gradient(135deg, ${top}, ${left}, ${bottom})`;
        textColor = getTextColorByBg(top);
    }

    return (
        <div style={{
            background: gradient,
            borderRadius: '12px',
            padding: '20px',
            color: textColor,
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        }} className='d-flex justify-content-start align-items-center gap-2'>
            <img src={imageUrl} alt="Card Image" style={{ width: '100px', borderRadius: '8px' }} crossOrigin="anonymous" />
            <div>
                <h3>{Nama}</h3>
                <p>{Penjelasan}</p>
            </div>
        </div>
    );
}

export default FeatureCard;