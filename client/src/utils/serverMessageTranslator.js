export const getTranslatedServerMessage = (message, t) => {
  if (!message || typeof message !== "string") return null;

  const normalized = message.trim().toLowerCase();

  const map = {
    "email does not exist": t("EmailDoesNotExist"),
    "email doesn't exist": t("EmailDoesNotExist"),
    "email doesn't exists": t("EmailDoesNotExist"),
    "email not found": t("EmailDoesNotExist"),
    "invalid email or password": t("InvalidEmailOrPassword"),
    "invalid credentials": t("InvalidEmailOrPassword"),
    "user not found": t("UserNotFound"),
    "user not returned from server": t("UserNotReturnedFromServer"),
    "no dashboard assigned to this account": t("NoDashboardAssigned"),
    "invalid or expired reset link": t("InvalidOrExpiredResetLink"),
  };

  return map[normalized] || message;
};
