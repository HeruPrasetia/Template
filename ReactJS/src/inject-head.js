// src/inject-head.js
import { api, host } from './Modul';
export const injectFaviconAndManifest = async (domain) => {
    let profile = await api("getProfile", { Path: window.location.pathname, isMenu: true });
    document.title = "CRM " + profile.profile.Nama;
    const head = document.getElementsByTagName("head")[0];

    // Favicon
    const favicon = document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/png";
    favicon.href = host + "file/" + profile.profile.Logo;
    head.appendChild(favicon);

    const description = document.createElement("meta");
    description.name = "description";
    description.content = profile.profile.Keterangan;
    head.appendChild(description);

    const color = document.createElement("meta");
    color.name = "theme-color";
    color.content = profile.profile.ColorDefault;
    head.appendChild(color);

    // Manifest
    const manifest = document.createElement("link");
    manifest.rel = "manifest";
    manifest.href = profile.profile.Manifest;
    head.appendChild(manifest);
};
