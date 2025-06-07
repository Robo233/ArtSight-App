import React, { useEffect } from "react";
import Section from "../../../shared/components/Section";
import Button from "../../../shared/buttons/Button";
import { useTranslation } from "react-i18next";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  titleKey: string;
}

const Modal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  children,
  titleKey,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background-opacity flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg p-6 w-[90%] max-w-md relative z-10 border-text border-[1px]">
        <Section title={t(titleKey)}></Section>
        {children}
        <Button
          onClick={onClose}
          className="absolute bottom-4 right-4 text-sm text-primary"
          activeClassName="text-primary-hover"
        >
          {t("modal.cancel")}
        </Button>
      </div>
      <div className="absolute inset-0" onClick={onClose}></div>
    </div>
  );
};

export default Modal;
