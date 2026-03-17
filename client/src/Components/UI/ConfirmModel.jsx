import React from "react";
import { useTranslation } from "react-i18next";

const ConfirmModel = ({ isOpen, title, message, onConfirm, onCancel }) => {
  const { t } = useTranslation("common");
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onCancel}   // click on background closes modal
    >
      <div
        className="bg-white w-[400px] rounded-lg shadow-xl p-6"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
      >
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          {title || t("ConfirmAction", { defaultValue: "Confirm Action" })}
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          {message || t("ConfirmDeleteMessage", { defaultValue: "Are you sure you want to delete this item?" })}
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          {/* Cancel */}
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
          >
            {t("Cancel", { defaultValue: "Cancel" })}
          </button>

          {/* Delete */}
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition"
          >
            {t("Delete", { defaultValue: "Delete" })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModel;