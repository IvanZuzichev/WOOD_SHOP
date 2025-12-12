import { memo, useState, ChangeEvent, FocusEvent, InputHTMLAttributes } from "react";

interface PasswordProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onFocus' | 'onBlur' | 'type'> {
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  bgColor?: string;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}

export const Password = memo(({
  value = "",
  onChange,
  placeholder = "",
  className = "",
  required = false,
  disabled = false,
  bgColor = "#f1f0ee", // Цвет фона по умолчанию для страницы входа
  onFocus,
  onBlur,
  ...props
}: PasswordProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleMouseEnter = () => {
    if (!isFocused && !value && !disabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="h-[36px] rounded-[6px] shrink-0 w-full box-border flex items-center overflow-clip pb-[10px] pt-[9px] px-[10px]">
          <input
            type="password"
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

Password.displayName = "Password";