import { memo, useState, ChangeEvent, FocusEvent } from "react";

interface EmailProps {
  value?: string;
  id: string;
  name: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  bgColor?: string;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}

export const Email = memo(({
  value = "",
  name = "",
  id = "",
  onChange,
  placeholder = "",
  className = "",
  required = false,
  disabled = false,
  bgColor = "#e4e2df", // Цвет фона по умолчанию для страницы входа
  onFocus,
  onBlur,
  ...props
}: EmailProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const bgClass = bgColor === "#e4e2df" ? "bg-[#e4e2df]" : bgColor === "#f1f0ee" ? "bg-[#f1f0ee]" : "bg-white";
  const hoverBgClass = bgColor === "#e4e2df" ? "bg-[#e4e2df]" : bgColor === "#f1f0ee" ? "bg-[#f1f0ee]" : "bg-[#E4E2DF]";

  return (
    <div className={`w-full relative ${className}`}>
      <div 
        className={`flex flex-col items-start rounded-[8px] transition-all ${
          isHovered && !isFocused && !value && !disabled
            ? hoverBgClass
            : bgClass
        } ${disabled ? "opacity-60" : ""}`}
        onMouseEnter={() => !isFocused && !value && !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="h-[36px] rounded-[6px] shrink-0 w-full box-border flex items-center overflow-clip pb-[10px] pt-[9px] px-[10px]">
          <input
            type="email"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            className={`w-full bg-transparent border-none outline-none text-[14px] font-inter font-medium text-[#888888] placeholder:text-[#888888] caret-[#9B1E1C] leading-[1.2] ${disabled ? "cursor-not-allowed" : ""}`}
            {...props}
          />
        </div>
      </div>
    </div>
  );
});

Email.displayName = "Email";