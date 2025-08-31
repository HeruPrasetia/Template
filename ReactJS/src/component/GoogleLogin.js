import { auth, provider, signInWithPopup } from "../firebase";
import { host, api, pesan } from '../Modul';

export default function LoginGoogle() {
    const handleLogin = () => {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const user = result.user;
                let sql = await api("loginappgoogle", { Email: user.email });
                if (sql.status == "sukses") {
                    pesan("Login Berhasil", "Selamat Login Behasil");
                    localStorage.setItem("TokenUserWA", sql.Token);
                    window.location.reload();
                }
            })
            .catch((error) => {
                pesan("Login gagal", error, 'error');
            });
    };

    return (
        <center>
            <button className="google-btn" onClick={handleLogin}>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google icon" />
                Masuk Dengan Google
            </button>
        </center>
    );
}
