import { useState } from "react";
import { useTranslation } from "react-i18next";

const useConfirmModel = () => {
  const { t } = useTranslation("common");
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const openConfirm = ({ title, message, onConfirm }) => {
    setConfirmState({
      isOpen: true,
      title: title || t("ConfirmAction", { defaultValue: "Confirm Action" }),
      message: message || t("ConfirmDeleteMessage", { defaultValue: "Are you sure you want to proceed?" }),
      onConfirm,
    });
  };

  const closeConfirm = () => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = async () => {
    try {
      if (typeof confirmState.onConfirm === "function") {
        await confirmState.onConfirm();
      }
    } finally {
      closeConfirm();
    }
  };

  return {
    confirmState,
    openConfirm,
    closeConfirm,
    handleConfirm,
  };
};

export default useConfirmModel;
