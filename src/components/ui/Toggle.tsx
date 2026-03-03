import { cn } from "@/lib/utils";

interface ToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
}

export function Toggle({ label, checked, onChange, disabled = false, id }: ToggleProps) {
  const toggleId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <label
      htmlFor={toggleId}
      className={cn(
        "inline-flex items-center gap-3 cursor-pointer select-none",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      <button
        id={toggleId}
        role="switch"
        type="button"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]",
          checked ? "bg-[var(--color-primary-500)]" : "bg-[var(--border-default)]"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm",
            "transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out)]",
            checked && "translate-x-5"
          )}
        />
      </button>
      {label && (
        <span className="text-sm text(--text-primary)">{label}</span>
      )}
    </label>
  );
}
