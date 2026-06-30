import { useTranslation } from "react-i18next";

function LanguageSwitcher({ variant = "inline", className = "" }) {
  const { i18n } = useTranslation("common");
  const languages = [
    { code: "en", label: "EN" },
    { code: "ps", label: "PS" },
  ];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    document.documentElement.lang = code;
    document.documentElement.dir = code === "ps" ? "rtl" : "ltr";
  };

  if (variant === "sidebar") {
    return (
      <div className={`erp-sidebar-lang px-3 py-2 ${className}`}>
        <div className="flex items-center gap-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => changeLanguage(lang.code)}
              className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded ${
                i18n.resolvedLanguage === lang.code
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white p-0.5 ${className}`}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => changeLanguage(lang.code)}
          className={`px-2 py-0.5 text-xs font-semibold rounded ${
            i18n.resolvedLanguage === lang.code
              ? "bg-blue-700 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
