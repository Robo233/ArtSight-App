import React, { useRef, useEffect } from "react";
import Button from "../buttons/Button";
import NavigationButton from "../buttons/NavigationButton";

interface Option {
  name: string;
  value?: string;
  selected?: boolean;
  url?: string;
}

interface CustomDropdownProps {
  options: Option[];
  isOpen: boolean;
  onClose: () => void;
  onOptionClick?: (option: Option, index: number) => void;
  dropdownDirection?: "up" | "down";
  containerClassName?: string;
  containerRef?: React.RefObject<HTMLElement>;
}

const CustomDropdown = ({
  options,
  isOpen,
  onClose,
  onOptionClick,
  containerClassName,
  dropdownDirection = "down",
  containerRef,
}: CustomDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const container = containerRef?.current;
      if (container && !container.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, containerRef]);

  if (!isOpen) return null;

  return (
    <div
      className={`${containerClassName}  z-10 bg-background absolute border border-text rounded-l mb-2 ${
        dropdownDirection === "up" ? "bottom-full mb-2" : "top-full mt-2"
      } `}
      ref={dropdownRef}
    >
      {options.map((option, index) =>
        option.url ? (
          <NavigationButton
            key={option.name}
            url={option.url}
            className={`block w-auto whitespace-nowrap text-left px-4 py-2 ${
              option.selected ? "text-text-hover" : "text-text"
            }`}
            activeClassName="text-text-hover"
          >
            {option.name}
          </NavigationButton>
        ) : (
          <Button
            key={option.name}
            onClick={() => {
              onOptionClick?.(option, index);
              onClose();
            }}
            className={`block w-auto whitespace-nowrap text-left px-4 py-2 ${
              option.selected ? "text-text-hover" : "text-text"
            }`}
            activeClassName="text-text-hover"
          >
            {option.name}
          </Button>
        )
      )}
    </div>
  );
};

export default CustomDropdown;
