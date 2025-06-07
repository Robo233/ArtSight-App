import React, { useState } from "react";
import { faLanguage, faPalette } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import HeaderWithSettingsAndTitle from "../../../shared/navigation/headers/HeaderWithSettingsAndTitle";
import LanguageSettings from "../components/LanguageSettings";
import ThemeSettings from "../components/ThemeSettings";
import Modal from "../components/Modal";
import PageTitle from "../../../shared/components/PageTitle";
import ButtonWithLabelAndIcon from "../../../shared/buttons/ButtonWithLabelAndIcon";

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [isThemeModalVisible, setThemeModalVisible] = useState(false);

  const onLanguageSelectionClose = () => {
    setLanguageModalVisible(false);
  };

  return (
    <>
      <HeaderWithSettingsAndTitle
        title={t("shared.settings")}
        displayBackButton
      />
      <PageTitle title={`${t("shared.settings")}`} />
      <div className="pt-[80px] responsive-container flex flex-col">
        <ButtonWithLabelAndIcon
          onClick={() => setLanguageModalVisible(true)}
          icon={faLanguage}
          title={t("settings.language")}
        />

        <hr className="border-t border-text my-2 w-[97.5%] mx-auto" />

        <ButtonWithLabelAndIcon
          onClick={() => setThemeModalVisible(true)}
          icon={faPalette}
          title={t("settings.theme")}
        />
      </div>
      <Modal
        isVisible={isLanguageModalVisible}
        onClose={onLanguageSelectionClose}
        titleKey={"settings.language"}
      >
        <LanguageSettings />
      </Modal>
      <Modal
        isVisible={isThemeModalVisible}
        onClose={() => setThemeModalVisible(false)}
        titleKey="settings.theme"
      >
        <ThemeSettings />
      </Modal>
    </>
  );
};

export default Settings;
