import React from "react";

interface RadioSelectionProps {
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
  optionLabels: { [key: string]: string };
}

const RadioSelection: React.FC<RadioSelectionProps> = ({
  options,
  selectedValue,
  onChange,
  optionLabels,
}) => {
  return (
    <div className="p-4">
      {options.map((option) => (
        <div
          key={option}
          className="mb-2 cursor-pointer"
          onClick={() => onChange(option)}
        >
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="radio-selection"
              value={option}
              checked={selectedValue === option}
              onChange={() => onChange(option)}
              className="appearance-none h-4 w-4 border border-text rounded-full checked:bg-primary checked:border-primary mr-2 cursor-pointer"
            />
            <span className="font-medium">{optionLabels[option]}</span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioSelection;
