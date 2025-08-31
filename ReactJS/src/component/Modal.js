import React, { useEffect, useRef } from "react";
import { ValidationGroup } from 'devextreme-react/validation-group';
import { pesan } from "../Modul";

export const Modal = ({
    children,
    id = "modal",
    className = "",
    title = "",
    form = false,
    onSubmit,
    validationRef,
    onClose
}) => {
    const modalRef = useRef(null);

    useEffect(() => {
        if (onClose && modalRef.current) {
            const modalEl = modalRef.current;

            // Buat instance Bootstrap Modal (pastikan sudah load bootstrap.js)
            const handler = () => onClose();

            modalEl.addEventListener('hidden.bs.modal', handler);

            return () => {
                modalEl.removeEventListener('hidden.bs.modal', handler);
            };
        }
    }, [onClose]);

    if (!form) {
        return (
            <div ref={modalRef} className="modal fade" id={id} tabIndex="-1" aria-labelledby={id} aria-hidden="true">
                <div className={`modal-dialog modal-dialog-centered ${className}`}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">{title}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={modalRef} className="modal fade" id={id} tabIndex="-1" aria-labelledby={id} aria-hidden="true">
            <div className={`modal-dialog modal-dialog-centered ${className}`}>
                <div className="modal-content">
                    <ValidationGroup ref={validationRef}>
                        <form onSubmit={onSubmit} className='needs-validation' noValidate>
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">{title}</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            {children}
                        </form>
                    </ValidationGroup>
                </div>
            </div>
        </div>
    );
};

export const ModalBody = ({ children }) => {
    return (
        <div className="modal-body">
            {children}
        </div>
    );
};

export const ModalFooter = ({ children, btnClose = false }) => {
    return (
        <div className="modal-footer">
            {btnClose && <button type="button" className="btn btn-sm btn-secondary" data-bs-dismiss="modal" id={btnClose}>Tutup</button>}
            {children}
        </div>
    );
};

export const ModalDelete = ({ id = "modalHapus", onSubmit, title, ID, act = "hapus" }) => {
    return (
        <Modal id={id} form={true} onSubmit={onSubmit} title={title}>
            <ModalBody>
                <input type='hidden' name="ID" value={ID} />
                <input type='hidden' name="act" value={act} />
                <h6>Apakah anda yakin akan menghapus data ini !!</h6>
            </ModalBody>
            <ModalFooter btnClose={`btnTutupModal${id}`}>
                <button type="submit" className="btn btn-danger" id='btnSimpan'><i className="fas fa-trash-alt"></i> Hapus</button>
            </ModalFooter>
        </Modal>
    )
}

export const ModalAksesNotif = () => {
    const handleRequestPermission = () => {
        if ("Notification" in window) {
            Notification.requestPermission().then((result) => {
                if (result === "granted") {
                    new Notification("Terima kasih! Notifikasi sudah diaktifkan 🚀");
                    window.location.reload();
                }
            });
        } else {
            pesan("", "Browser tidak mendukung notifikasi 😢", "error");
        }
    };

    const handleTolak = () => {
        localStorage.setItem("Kulonuwun", "ditolak");
        pesan("", "Sedih kamu menolak akses nya 🥲", "error");
    }

    return (
        <Modal id="modalNotif" form={false} title="Izin Mengirim Pesan">
            <ModalBody>
                <h6>Untuk pengalaman lebih baik berikan kami untuk mengirim pesan ke kamu 😃</h6>
            </ModalBody>
            <ModalFooter>
                <button type="submit" className="btn btn-danger" id="btnTolakAkses" data-bs-dismiss="modal" onClick={() => handleTolak("ditolak")}><i className="fa-regular fa-thumbs-down" /> Jangan Berikan</button>
                <button type="submit" className="btn btn-default" onClick={() => handleRequestPermission()}><i className="fa-regular fa-thumbs-up" /> Berikan</button>
            </ModalFooter>
        </Modal>
    )
}