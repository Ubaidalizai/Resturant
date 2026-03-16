// localization.util.js
// Simple localization helper for backend responses.

const fallbackLang = "en";

const messages = {
  en: {
    // Errors
    INCORRECT_PASSWORD: "Incorrect password",
    EMAIL_DOES_NOT_EXIST: "Email does not exist",
    EMAIL_ALREADY_EXISTS: "Email already exists",
    USER_NOT_FOUND: "User not found",
    ROLE_DOES_NOT_EXIST: "Role does not exist",
    RESET_TOKEN_HAS_EXPIRED: "Reset token has expired",
    INVALID_RESET_TOKEN: "Invalid reset token",
    INVALID_CREDENTIALS: "Invalid email or password",

    // Success
    USER_REGISTERED_SUCCESSFULLY: "User registered successfully",
    USER_LOGGED_IN_SUCCESSFULLY: "User logged in successfully",
    LOGGED_OUT_SUCCESSFULLY: "Logged out successfully",
    USER_VERIFIED_SUCCESSFULLY: "User verified successfully",
    PASSWORD_RESET_SUCCESSFUL: "Password reset successful",

    // Generic / fallback messages
    SUCCESS: "Success",
    INTERNAL_SERVER_ERROR: "Internal server error",
    SOMETHING_WENT_WRONG: "Something went wrong",
    INVALID_REQUEST: "Invalid request",
    NOT_FOUND: "Not found",
    UNAUTHORIZED: "Unauthorized",
  },
  ps: {
    // Errors
    INCORRECT_PASSWORD: "غلط پاسورډ",
    EMAIL_DOES_NOT_EXIST: "برېښنالیک شتون نلري",
    EMAIL_ALREADY_EXISTS: "برېښنالیک دمخه شتون لري",
    USER_NOT_FOUND: "کارن ونه موندل شو",
    ROLE_DOES_NOT_EXIST: "دنده شتون نلري",
    RESET_TOKEN_HAS_EXPIRED: "د بیا تنظیمولو ټوکن وخت تېر شوی",
    INVALID_RESET_TOKEN: "ناسم بیا تنظیم کولو ټوکن",
    INVALID_CREDENTIALS: "ناسم ایمیل یا پټنوم",

    // Success
    USER_REGISTERED_SUCCESSFULLY: "کارن بریالی ثبت شو",
    USER_LOGGED_IN_SUCCESSFULLY: "کارن بریالی ننووت",
    LOGGED_OUT_SUCCESSFULLY: "بریالی وتل",
    USER_VERIFIED_SUCCESSFULLY: "کارن تایید شو",
    PASSWORD_RESET_SUCCESSFUL: "د پټنوم بیا تنظیم بریالی شو",

    // Generic / fallback messages
    SUCCESS: "بریالی",
    INTERNAL_SERVER_ERROR: "د سرور دننه خطا",
    SOMETHING_WENT_WRONG: "یوه ستونزه پیښه شوه",
    INVALID_REQUEST: "ناسم غوښتنه",
    NOT_FOUND: "موندل شوې نه ده",
    UNAUTHORIZED: "نامجاز",
  },
};

export const toMessageCode = (message) => {
  if (!message || typeof message !== "string") return null;
  // if already a code-like string
  const trimmed = message.trim();
  if (/^[A-Z0-9_]+$/.test(trimmed)) return trimmed;
  return trimmed
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
};

export const getLangFromReq = (req) => {
  if (!req || !req.headers) return fallbackLang;
  const headerLang = req.headers["x-lang"] || req.headers["accept-language"];
  if (!headerLang) return fallbackLang;
  const lang = (Array.isArray(headerLang) ? headerLang[0] : headerLang).split(",")[0].trim().split("-")[0];
  return lang === "ps" ? "ps" : "en";
};

export const translate = (code, lang = fallbackLang) => {
  if (!code) return null;
  const normalizedLang = lang === "ps" ? "ps" : "en";
  const lookup = messages[normalizedLang] || messages[fallbackLang];
  if (!lookup) return null;
  return lookup[code] || lookup[toMessageCode(code)] || null;
};

export const getTranslation = (message, lang) => {
  const code = toMessageCode(message);
  return translate(code, lang) || message;
};
