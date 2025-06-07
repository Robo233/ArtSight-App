import React from "react";
import { Link } from "react-router-dom";
import Button, { ButtonProps } from "./Button";

interface NavigationButtonProps extends ButtonProps {
  url?: string;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
  url,
  children,
  ...buttonProps
}) => {
  if (url) {
    if (url.startsWith("tel:") || url.startsWith("mailto:")) {
      return (
        <a href={url} draggable="false">
          <Button {...buttonProps}>{children}</Button>
        </a>
      );
    }
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          draggable="false"
        >
          <Button {...buttonProps}>{children}</Button>
        </a>
      );
    }
    const formattedUrl = url.startsWith("/") ? url : `/${url}`;
    const internalUrl = `${formattedUrl}`;
    return (
      <Link draggable="false" to={internalUrl}>
        <Button {...buttonProps}>{children}</Button>
      </Link>
    );
  }
  return <Button {...buttonProps}>{children}</Button>;
};

export default NavigationButton;
