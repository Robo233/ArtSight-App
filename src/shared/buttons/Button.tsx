import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  activeClassName?: string;
  inactiveClassName?: string;
}

const Button: React.FC<ButtonProps> = ({
  activeClassName = "",
  inactiveClassName = "",
  className = "",
  children,
  disabled,
  ...props
}) => {
  const [isActive, setIsActive] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const handleMouseDown = () => {
    setIsPressed(true);
    setIsActive(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    setIsActive(false);
  };

  const handleMouseEnter = () => {
    setIsActive(true);
  };

  const handleMouseLeave = () => {
    setIsActive(false);
  };

  const handleTouchStart = () => {
    setIsPressed(true);
    setIsActive(true);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    setIsActive(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPressed) return;
    const touch = e.touches[0];
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    if (
      !(
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      )
    ) {
      setIsActive(false);
    }
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      className={`transition-smooth outline-none focus:outline-none border-none ${className} ${
        isActive ? activeClassName : inactiveClassName
      }`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
