import React from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineClose } from "react-icons/ai";
import Button from "./Button";

const ConfirmModel = ({ isOpen, title, message, onConfirm, onCancel }) => {
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.language === "ps";
  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onCancel}
    >
      <div
        className="modal-card w-[400px] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close-button" onClick={onCancel}>
          <AiOutlineClose size={18} />
        </button>
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          {title || t("ConfirmAction", { defaultValue: "Confirm Action" })}
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          {message || t("ConfirmDeleteMessage", { defaultValue: "Are you sure you want to delete this item?" })}
        </p>

        {/* Buttons */}
        <div className={`flex flex-col sm:flex-row ${isRTL ? "sm:justify-start" : "sm:justify-end"} gap-3`}>
          <Button
            variant="secondary"
            onClick={onCancel}
            className="min-w-[110px]"
          >
            {t("Cancel", { defaultValue: "Cancel" })}
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            className="min-w-[110px]"
          >
            {t("Delete", { defaultValue: "Delete" })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModel;