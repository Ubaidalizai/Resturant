import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "../../configs/axios.config";

const languages = [
  { code: "en", label: "EN" },
  { code: "ps", label: "PS" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ps";

  const setLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("hotel_lang", lang);
    axios.defaults.headers.common["Accept-Language"] = lang;

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ps" ? "rtl" : "ltr";
  };

  useEffect(() => {
    const lang = localStorage.getItem("hotel_lang") || "en";
    setLanguage(lang);
  }, []);

  return (
    <div className={`fixed top-4 ${isRTL ? "left-4" : "right-4"} z-50 flex items-center gap-2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur`}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`w-9 h-9 flex items-center justify-center rounded-full text-xs font-semibold transition hover:bg-yellow-200 ${
            i18n.resolvedLanguage === lang.code ? "bg-yellow-500 text-white" : "text-gray-700"
          }`}
          title={lang.label}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
