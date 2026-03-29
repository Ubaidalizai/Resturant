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
    "food added successfully": t("FoodAddedSuccessfully"),
    "food updated successfully": t("FoodUpdatedSuccessfully"),
    "food deleted successfully": t("FoodDeletedSuccessfully"),
    "failed to add food": t("FailedToAddFood"),
    "failed to update food": t("FailedToUpdateFood"),
    "failed to delete food": t("FailedToDeleteFood"),
    "order failed": t("OrderFailed"),
    "server error while placing order": t("ServerErrorWhilePlacingOrder"),
    "error processing order": t("ErrorProcessingOrder"),
    "category name required": t("CategoryNameRequired"),
    "category added": t("CategoryAdded"),
    "category updated": t("CategoryUpdated"),
    "category deleted": t("CategoryDeleted"),
    "expense added successfully": t("ExpenseAddedSuccessfully"),
    "expense deleted": t("ExpenseDeleted"),
  };

  return map[normalized] || message;
};
