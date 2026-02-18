import React from "react";
import { useLanguage } from "@/features/dashboard/context/LanguageContext";
import { Modal } from "./Modal";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel,
    cancelLabel,
    isDestructive = false,
}: ConfirmModalProps) {
    const { t } = useLanguage();
    const finalConfirmLabel = confirmLabel || t("btn_save"); // Default to Save/Confirm
    const finalCancelLabel = cancelLabel || t("btn_cancel");
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-4">
                <p className="text-slate-600">{message}</p>
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        {finalCancelLabel}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm ${
                            isDestructive ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {finalConfirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
