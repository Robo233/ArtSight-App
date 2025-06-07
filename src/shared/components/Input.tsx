import React, { forwardRef } from "react";
import Tooltip from "./Tooltip";

interface InputProps {
  id?: string;
  label?: string;
  tooltipKey?: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  multiple?: boolean;
  className?: string;
  accept?: string;
  value?: any;
  name?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  width?: string;
  height?: string;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      id,
      label,
      tooltipKey,
      type,
      placeholder,
      required,
      multiple,
      className = "",
      accept,
      value,
      name,
      style = {},
      disabled,
      width = "280px",
      height = "auto",
      onChange,
    },
    ref
  ) => {
    const inputClassName = `bg-background mt-1 block px-2 py-2 border ${
      disabled ? "text-text-hover border-text-hover" : "text-text border-text"
    } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${className}`;

    const combinedStyle = {
      ...style,
      width: width,
      height: height,
    };

    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor={id}
            className={`text-light text-sm font-medium ${
              disabled ? "text-text-hover" : "text-text"
            }`}
          >
            {label}
          </label>
          {tooltipKey && <Tooltip tooltipKey={tooltipKey} />}
        </div>
        {type === "textarea" ? (
          <textarea
            id={id}
            placeholder={placeholder}
            name={name}
            className={inputClassName}
            value={value}
            onChange={onChange}
            style={combinedStyle}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={5}
            disabled={disabled}
          />
        ) : (
          <input
            type={type}
            id={id}
            placeholder={placeholder}
            name={name}
            className={`h-[50px] ${inputClassName}`}
            accept={accept}
            required={required}
            multiple={multiple}
            value={value}
            onChange={onChange}
            style={combinedStyle}
            ref={ref as React.Ref<HTMLInputElement>}
            disabled={disabled}
          />
        )}
      </div>
    );
  }
);

export default Input;
