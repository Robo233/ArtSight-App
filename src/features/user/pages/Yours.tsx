import { t } from "i18next";
import ProtectedEntityList from "../../../shared/components/ProtectedEntityList";
import {
  HEADER_FOOTER_HEIGHT,
  HEADER_FOOTER_VERTICAL_OFFSET,
} from "../../../shared/utils/constants";
import Button from "../../../shared/buttons/Button";
import CustomDropdown from "../../../shared/components/CustomDropdown";
import { useEffect, useRef, useState } from "react";
import { isAuthenticated } from "../../../shared/services/auth";
import isMobile from "../../../shared/utils/isMobile";

const yoursConfig = {
  additionalParams: {
    isCreatedByUser: "true",
  },
};

const Yours = () => {
  const [isOpen, setOpen] = useState(false);
  const options = [
    { name: t("shared.artwork"), url: "artwork/add" },
    { name: t("shared.artist"), url: "artist/add" },
    { name: t("shared.artworkDetail"), url: "artworkDetail/add" },
    { name: t("shared.exhibition"), url: "exhibition/add" },
    { name: t("shared.genre"), url: "genre/add" },
  ];
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = isAuthenticated();
    setAuthenticated(auth);
  }, []);
  return (
    <div className="relative">
      <ProtectedEntityList
        title={t("shared.yours")}
        config={yoursConfig}
        loginMessageKey="yours.loginMessage"
        noEntitiesKey="yours.noEntities"
      />
      {authenticated && (
        <div
          className="fixed bottom-4 right-4"
          ref={dropdownContainerRef}
          style={
            isMobile()
              ? {
                  bottom: `${
                    HEADER_FOOTER_HEIGHT + HEADER_FOOTER_VERTICAL_OFFSET
                  }px`,
                }
              : undefined
          }
        >
          <Button
            onClick={() => setOpen(!isOpen)}
            activeClassName="[&>div]:bg-primary-hover"
          >
            <div className="transition-smooth bg-primary w-12 h-12 rounded-full flex items-center justify-center">
              <span className="text-2xl cursor-pointer select-none">+</span>
            </div>
          </Button>
          <CustomDropdown
            options={options}
            dropdownDirection="up"
            isOpen={isOpen}
            onClose={() => setOpen(false)}
            containerClassName="right-0"
            containerRef={dropdownContainerRef}
          />
        </div>
      )}
    </div>
  );
};

export default Yours;
