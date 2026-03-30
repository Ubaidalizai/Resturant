import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import axios from "../configs/axios.config";

import enCommon from "./locales/en/common.json";
import psCommon from "./locales/ps/common.json";

const savedLang = localStorage.getItem("hotel_lang") || "en";

// Ensure axios sends the selected language to the backend
axios.defaults.headers.common["Accept-Language"] = savedLang;

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon
    },
    ps: {
      common: psCommon
    }
  },

  lng: savedLang,
  fallbackLng: "en",

  interpolation: {
    escapeValue: false
  }
});

i18n.on("languageChanged", (lang) => {
  axios.defaults.headers.common["Accept-Language"] = lang;
});

export default i18n;