import React, { lazy, Suspense, Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { api, pesan, Token, host, openModal, submitForm } from './Modul';
import Profile from './assets/img/profile.png';
import './App.css';
import { Modal, ModalBody, ModalFooter, ModalAksesNotif } from './component/Modal';
import { FormInput } from './component/FormInput';
import { SocketProvider } from "./SocketProvider.js";
import { requestForToken } from './firebase';

// PAGE
const BtnLiveChat = lazy(() => import('./component/LiveChat'));
const Payment = lazy(() => import('./page/Payment'));
const Login = lazy(() => import('./page/Login'));
const Dashboard = lazy(() => import('./page/Dashboard'));
const MenuChat = lazy(() => import('./page/MenuChat'));
const MenuKontak = lazy(() => import('./page/MenuKontak'));
const MenuBlash = lazy(() => import('./page/MenuBlash'));
const MenuProduk = lazy(() => import('./page/MenuProduk'));
const MenuPengiriman = lazy(() => import('./page/MenuPengiriman'));
const MenuTag = lazy(() => import('./page/MenuTag'));
const MenuScrap = lazy(() => import('./page/MenuScrap'));
const MenuPelanggan = lazy(() => import('./page/MenuPelanggan'));
const MenuFileManager = lazy(() => import('./page/MenuFileManager'));
const MenuLead = lazy(() => import('./page/MenuLead'));
const MenuPayment = lazy(() => import('./page/MenuPayment'));
const MenuInstagram = lazy(() => import('./page/MenuInstagram'));
const MenuFitur = lazy(() => import('./page/MenuFitur'));
const MenuTermdate = lazy(() => import('./page/MenuTermdate'));
const MenuMenu = lazy(() => import('./page/MenuManu'));
const MenuUser = lazy(() => import('./page/MenuUser'));
const LiveChat = lazy(() => import('./page/MenuLiveChat'));
const LiveChatClient = lazy(() => import('./page/MenuLiveChatClient'));
const Calendar = lazy(() => import('./page/Calendar.js'));
const Register = lazy(() => import('./page/Register.js'));
const Promo = lazy(() => import('./page/MenuPromo.js'));
const Affiliet = lazy(() => import('./page/MenuIsAffiliate.js'));
const HistoryChat = lazy(() => import('./page/MenuHistoryChat.js'));
const MenuBilling = lazy(() => import('./page/MenuBilling.js'));
const MenuPrompt = lazy(() => import('./page/MenuPrompt.js'));

function App() {
  class Main extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        Menu: [],
        Group: [],
        CurePage: [],
        NamaLokasi: "Pusat",
        NamaUser: "Heru Prasetia",
        divSetting: [],
        detailSetting: [],
        clsLoading: "fas fa-save",
        btnSubmit: false,
        iconTheme: "fas fa-moon",
        show: false,
        notification: { title: '', body: '' },
        tokenFound: false,
        Profile: {},
        Login: {},
        Password: "",
        NewPassword: "",
        RePassword: '',
        IsPartner: false,
        DataFitur: [],
        sidebarHidden: false
      };
    }

    async componentDidMount() {
      let sql = await api("getProfile", { isMenu: true });
      document.documentElement.style.setProperty('--color-primary', sql.profile.ColorDefault);
      document.documentElement.style.setProperty('--color-primary-variant', sql.profile.ColorSecodary);
      window.sessionStorage.setItem("color", sql.profile.ColorDefault);
      document.getElementById('scriptMidtrans').dataset.clientKey = sql.profile.PaymentClientKey;
      document.getElementById('scriptMidtrans').src = sql.profile.PaymentMode == "Trial" ? "https://app.sandbox.midtrans.com/snap/snap.js" : "https://app.midtrans.com/snap/snap.js";
      let ColorTheme = localStorage.getItem("ColorTheme") || "light";
      this.setState({ iconTheme: ColorTheme == "light" ? "fas fa-moon" : "fas fa-sun", NamaUser: sql.data.Nama, Profile: sql.profile, Login: sql.data, Menu: sql.Menu, Group: sql.Group, IsPartner: sql.data.IsPartner });

      this.handleResize();
      window.addEventListener("resize", this.handleResize);

      if (ColorTheme == "dark") {
        document.getElementById("theme-link").href = "https://cdn.jsdelivr.net/npm/devextreme@23.2/dist/css/dx.material.blue.dark.compact.css";
      } else {
        document.getElementById("theme-link").href = sql.profile.Style;
      }
      if (ColorTheme == "dark") {
        document.body.classList.add('dark-theme');
        let cls = document.getElementsByClassName("table");
        for (let i = 0; i < cls.length; i++) {
          cls[i].classList.add("table-dark");
        }
        let clsOffCanvas = document.getElementsByClassName("offcanvas");
        for (let i = 0; i < clsOffCanvas.length; i++) {
          clsOffCanvas[i].classList.add("text-bg-dark");
        }
        let clsCard = document.getElementsByClassName("card");
        for (let i = 0; i < clsCard.length; i++) {
          clsCard[i].classList.add("text-bg-dark");
        }
      }
      if (window.location.hostname != "localhost") console.clear();

      if ("Notification" in window) {
        console.log(Notification.permission);
        let Kulonuwun = localStorage.getItem("Kulonuwun");
        setTimeout(() => {
          if (Kulonuwun != "ditolak" && Notification.permission == "default") openModal("modalNotif");
          if (Notification.permission == "granted") {
            let FirebaseToken = localStorage.getItem("FirebaseToken");
            if (!FirebaseToken) requestForToken(this.setTokenFound);
          }
        }, 3000);
      }
    }

    setTokenFound = async (tokenFound, token) => {
      if (tokenFound) {
        localStorage.setItem("FirebaseToken", token);
        await api("updatefirebasetoken", { FirebaseToken: token }, true);
        this.setState({ tokenFound });
      }
    };

    handleResize = () => {
      if (window.innerWidth <= 768) {
        this.setState({ sidebarHidden: true }, this.applySidebarState);
      }
    };

    handleColaps = () => {
      this.setState(
        (prevState) => ({ sidebarHidden: !prevState.sidebarHidden }),
        this.applySidebarState
      );
    };

    applySidebarState = () => {
      const sidebar = document.getElementById("sidebar");
      if (!sidebar) return;
      if (this.state.sidebarHidden) {
        sidebar.classList.add("hide");
        if (window.innerWidth <= 768) document.getElementById('tampil').style.display = "block";
      } else {
        sidebar.classList.remove("hide");
        if (window.innerWidth <= 768) document.getElementById('tampil').style.display = "none";
      }
    };

    handlePilihMenu(Menu, Title) {
      let clsMenu = document.getElementsByClassName("menu");
      for (let i = 0; i < clsMenu.length; i++) clsMenu[i].classList.remove("active");
      document.getElementById(Menu).classList.add("active");
      document.title = Title;
      this.handleResize();
    }

    async handleLogout() {
      let sql = await api("logoutapp", {});
      if (sql.status == "sukses") {
        localStorage.clear();
        window.location.href = "/";
      } else {
        pesan("", sql.pesan, "error");
      }
    }

    handleChangeTheme() {
      let ColorTheme = localStorage.getItem("ColorTheme") || "light";
      if (ColorTheme == "light") {
        localStorage.setItem("ColorTheme", "dark");
        document.getElementById("theme-link").href = "https://cdn.jsdelivr.net/npm/devextreme@23.2/dist/css/dx.darkviolet.css";
        this.setState({ iconTheme: "fas fa-sun" });
      } else {
        localStorage.setItem("ColorTheme", "light");
        document.getElementById("theme-link").href = "https://cdn.jsdelivr.net/npm/devextreme@23.2/dist/css/dx.material.blue.light.css";
        this.setState({ iconTheme: "fas fa-moon" });
      }
      document.body.classList.toggle('dark-theme');
      let cls = document.getElementsByClassName("table");
      for (let i = 0; i < cls.length; i++) {
        cls[i].classList.toggle("table-dark")
      }
    }

    handleCariMenu(val) {
      if (val !== "") {

      } else {
        let Menu = this.state.Menu, Group = [
          { Nama: "Konten", Icon: "fas fa-images", Posisi: "konten", Active: false },
          { Nama: "Master", Icon: "fas fa-th-list", Posisi: "master", Active: false }
        ];
        for (let menu of Menu) {
          Menu.push(menu);
          for (let gg in Group) if (Group[gg].Posisi == menu.Posisi) Group[gg].Active = true;
        }
      }
    }

    async handleModalFitur() {
      window.location.href = "./fitur";
    }

    render() {
      let { Menu, Group } = this.state;
      return (
        <SocketProvider IsPartner={this.state.IsPartner}>
          <Router>
            <div className="wrapper">
              <nav id="sidebar" className="sidebar" style={{ backgroundImage: `url('${host + 'file/' + this.state.Profile.Sidebar}')` }}>
                <div className="sidebar-header cursor" onClick={() => window.location.href = "/"}>
                  {
                    this.state.Profile.LogoPanjang ?
                      <Fragment>
                        <img src={host + "file/" + this.state.Profile.LogoPanjang} style={{ width: "100%" }} className="logo-panjang" id='imgLogoPanjang' />
                        <img src={host + "file/" + this.state.Profile.Logo} style={{ width: "50px", height: "50px" }} className="logo" id='imgLogo' />
                      </Fragment>
                      :
                      <center>
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </center>
                  }
                </div>
                <div className="transbox">
                  <ul className="list-unstyled components" id="ulMenu">
                    {
                      Group.map((ul, i) => {
                        return (
                          <li key={i}>
                            <a href={`#GroupMenu${ul.GroupID}`} data-bs-toggle="collapse" aria-expanded="false" className="dropdown-toggle d-flex align-items-center gap-2" key={ul.GroupID}>
                              <i className={ul.Icon}></i>
                              <span className="nama-menu">{ul.Nama}</span>
                            </a>
                            <ul className="collapse list-unstyled" id={`GroupMenu${ul.GroupID}`}>
                              {
                                Menu.map((li, ii) => {
                                  if (li.GroupID == ul.Path) {
                                    return (
                                      <li className="menu" id={li.ID} key={li.ID} onClick={() => this.handlePilihMenu(li.ID, li.Nama)}>
                                        <Link to={li.Path} className='menu-list'>
                                          <i className={li.Icon}></i> <span className="nama-menu">{li.Nama}</span>
                                        </Link>
                                      </li>
                                    )
                                  }
                                })
                              }
                            </ul>
                          </li>
                        )
                      })
                    }
                    {
                      Menu.map((mm, i) => {
                        if (mm.GroupID == 0) {
                          return (
                            <li className="menu" id={mm.ID} key={mm.ID} onClick={() => this.handlePilihMenu(mm.ID, mm.Nama)}>
                              <Link to={mm.Path} className='menu-list'>
                                <i className={mm.Icon}></i> <span className="nama-menu">{mm.Nama}</span>
                              </Link>
                            </li>
                          )
                        }
                      })
                    }
                  </ul>
                </div>
              </nav >
              <div id="content">
                <nav className="navbar">
                  <div className="container-fluid d-flex nav-container">
                    <button type="button" id="sidebarCollapse" className="btn btn-sm nav-menu" onClick={() => this.handleColaps()}> <i className="fas fa-bars"></i> </button>
                    <div className="d-flex justify-content-end align-items-center nav-menu-items">
                      <button type="button" className="btn align-items-center nav-menu" style={{ position: "relative" }} onClick={() => this.handleModalFitur()}>
                        <i className="fas fa-envelope-square"></i>
                      </button>
                      <button type="button" className="btn align-items-center nav-menu" style={{ position: "relative" }} onClick={() => this.handleChangeTheme()}>
                        <i className={this.state.iconTheme}></i>
                      </button>
                      <div className="dropdown ">
                        <button className="dropdown-toggle nav-profile" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          <div className="nav-profile-photo">
                            <img src={Profile} />
                          </div>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow-lg dropdown-menu-dark" style={{ minWidth: "14rem", fontSize: "0.9rem", maxHeight: "440px", overflowY: "auto" }}>
                          <li className="dropdown-item">
                            <a><b>Login Sebagai : {this.state.IsPartner == true ? <span className='badge bg-primary'>Partner</span> : ""}</b></a>
                            <br></br>
                            <p className="mt-2 d-flex justify-content-start align-items-center gap-2">
                              <i className="fas fa-user"></i> <span id='spanUserName'>{this.state.NamaUser}</span>
                            </p>
                          </li>
                          <li className="dropdown-item" onClick={() => openModal("modalPassword")}>
                            <div className="mt-2 d-flex justify-content-start align-items-center gap-2">
                              <i className="fas fa-unlock-alt"></i> Ganti Password
                            </div>
                          </li>
                          <li>
                            <hr className="dropdown-divider"></hr>
                          </li>
                          <li><span onClick={() => this.handleLogout()} className="dropdown-item text-center"><i className="fas fa-logout"></i> Keluar</span></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </nav>
                <div style={{ height: "fit-content", border: "none" }} id="tampil">
                  <Suspense fallback={<div className='d-flex justify-content-center align-items-center' style={{ height: "90vh" }}>
                    <img src={require('./assets/img/loader.gif')} />
                  </div>}>
                    <Routes>
                      <Route path="/" element={<Dashboard page="Home" />} />
                      <Route path="/dashboard" element={<Dashboard page="Home" />} />
                      <Route path="/chat" element={<MenuChat />} />
                      <Route path="/ig" element={<MenuInstagram />} />
                      <Route path="/kontak" element={<MenuKontak />} />
                      <Route path="/blash" element={<MenuBlash />} />
                      <Route path="/produk" element={<MenuProduk />} />
                      <Route path="/pengiriman" element={<MenuPengiriman />} />
                      <Route path="/tag" element={<MenuTag />} />
                      <Route path="/scrap" element={<MenuScrap />} />
                      <Route path="/client" element={<MenuPelanggan />} />
                      <Route path="/filemanager" element={<MenuFileManager />} />
                      <Route path="/fitur" element={<MenuFitur />} />
                      <Route path="/lead/:id?" element={<MenuLead />} />
                      <Route path="/payment/:id?" element={<MenuPayment />} />
                      <Route path="/termdate" element={<MenuTermdate />} />
                      <Route path="/menu" element={<MenuMenu />} />
                      <Route path="/user" element={<MenuUser />} />
                      <Route path="/livechat" element={<LiveChat />} />
                      <Route path="/livechatclient" element={<LiveChatClient />} />
                      <Route path="/historychat" element={<HistoryChat />} />
                      <Route path="/billing" element={<MenuBilling />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/promo" element={<Promo />} />
                      <Route path="/afiliet" element={<Affiliet />} />
                      <Route path="/prompt" element={<MenuPrompt />} />
                      <Route path="/konfirmasipayment/:id?" element={<Payment Profile={this.state.Profile} />} />
                    </Routes>
                  </Suspense>
                </div>
                <div id="divPesan"></div>
                <Suspense>
                  {
                    this.state.IsPartner == false ? <BtnLiveChat Profile={this.state.Profile} /> : ""
                  }
                </Suspense>
              </div>
            </div>

            <Modal id="modalPassword" form={true} onSubmit={(e) => submitForm(e, { crud: "gantipassword", fn: () => window.location.reload() })}>
              <ModalBody>
                <FormInput type='password' name='Password' placeholder='Password Lama' label='Password Lama' value={this.state.Password} onChange={(e) => this.setState({ Password: e.target.value })} required={true} />
                <FormInput type='password' name='NewPassword' placeholder='Password Baru' label='Password Baru' value={this.state.NewPassword} onChange={(e) => this.setState({ NewPassword: e.target.value })} required={true} />
                <FormInput type='password' name='RePassword' placeholder='Ulangi Password Baru' label='Ulangi Password Baru' value={this.state.RePassword} onChange={(e) => this.setState({ RePassword: e.target.value })} required={true} />
              </ModalBody>
              <ModalFooter btnClose="btnTutupModalPassword">
                <button className='btn btn-danger' type='submit'><i className='fas fa-save'></i> Simpan</button>
              </ModalFooter>
            </Modal>

            <Modal id='modalFitur' form={false} title="Fitur Fitur" className='modal-lg'>
              <ModalBody>
                {
                  this.state.DataFitur
                }
              </ModalBody>
              <ModalFooter btnClose="btnTutupModalFitur" />
            </Modal>

            <ModalAksesNotif />
          </Router>
        </SocketProvider>
      )
    }
  }

  class MainNoLogin extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        Profile: {},
        Ready: false,
      };
    }

    async componentDidMount() {
      let sql = await api("getProfile", { Path: window.location.pathname });
      this.setState({
        Profile: sql.profile,
        Ready: true
      });
      document.getElementById("theme-link").href = sql.profile.Style;
      document.documentElement.style.setProperty('--color-primary', sql.profile.ColorDefault);
      document.documentElement.style.setProperty('--color-primary-variant', sql.profile.ColorSecodary);
      document.getElementById('scriptMidtrans').dataset.clientKey = sql.profile.PaymentClientKey;
      document.getElementById('scriptMidtrans').src = sql.profile.PaymentMode == "Trial" ? "https://app.sandbox.midtrans.com/snap/snap.js" : "https://app.midtrans.com/snap/snap.js";
      if (window.location.hostname != "localhost") console.clear();
    }

    render() {
      if (!this.state.Ready) {
        return (
          <div className='d-flex justify-content-center align-items-center' style={{ height: "90vh" }}>
            <img src={require('./assets/img/loader.gif')} alt="Loading..." />
          </div>
        );
      }

      return (
        <Router>
          <Suspense fallback={<div className='d-flex justify-content-center align-items-center' style={{ height: "90vh" }}>
            <img src={require('./assets/img/loader.gif')} alt="Loading..." />
          </div>}>
            <Routes>
              <Route path="/" element={<Login Profile={this.state.Profile} />} />
              <Route path="/login" element={<Login Profile={this.state.Profile} />} />
              <Route path="/konfirmasipayment/:id?" element={<Payment Profile={this.state.Profile} />} />
              <Route path="/register/:paket?" element={<Register Profile={this.state.Profile} />} />
            </Routes>
          </Suspense>
        </Router>
      );
    }
  }

  if (Token) {
    return <Main />
  } else {
    return <MainNoLogin />
  }
}

export default App;
