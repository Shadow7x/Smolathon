import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

interface CustomSelectProps {
  options: { label: string; value: string }[];
  icon?: React.ReactNode;
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
  defaultt?:string;
}

const CustomSelect = ({
  options,
  icon,
  placeholder = "Выберите вариант",
  className,
  onChange,
  defaultt,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>("");
  console.log(defaultt)
  const handleSelect = (value: string) => {
    setSelected(value);
    setIsOpen(false);
    onChange?.(value);
  };

   useEffect(() => {
    console.log(defaultt)
    if (defaultt) {
      setSelected(defaultt);
    }
    onChange?.(defaultt);
  }, [defaultt]);

  return (
    <div className={cn("relative w-full", className)}>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between border border-input bg-transparent px-4 py-1 text-sm transition-colors select-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isOpen ? "rounded-t-2xl rounded-b-none" : "rounded-2xl"
        )}
      >
        <span
          className={cn(
            "truncate",
            selected ? "text-gray-600" : "text-gray-400"
          )}
        >
          {selected
            ? options.find((o) => o.value === selected)?.label
            : placeholder}
        </span>

        <div
          className={cn(
            "flex items-center text-gray-600 pointer-events-none    transition-transform duration-300",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        >
          {icon ?? <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-10 mt-[-1px] w-full rounded-b-2xl border border-input border-t-0 bg-white shadow-lg"
          )}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={cn(
                "px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 text-gray-600",
                selected === opt.value && "bg-gray-50 font-medium"
              )}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
