import React from "react";
import Button from "./Button";

interface ButtonWithLabelProps {
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "submit" | "reset" | "button";
  clasName?: string;
  disabled?: boolean;
}

const ButtonWithLabel: React.FC<ButtonWithLabelProps> = ({
  label,
  onClick,
  type,
  clasName,
  disabled,
}) => {
  return (
    <Button
      className={`${clasName} font-bold py-2 w-48 rounded-xl text-sm focus:shadow-outline ${
        disabled ? `bg-primary-hover` : `bg-primary`
      }`}
      activeClassName={"bg-primary-hover"}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};

export default ButtonWithLabel;
