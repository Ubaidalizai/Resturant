import { useState } from "react";

const useConfirmModel = () => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const openConfirm = ({ title, message, onConfirm }) => {
    setConfirmState({
      isOpen: true,
      title: title || "Confirm Action",
      message: message || "Are you sure you want to proceed?",
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
