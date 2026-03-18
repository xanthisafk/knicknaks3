import {
  forwardRef,
  useRef,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
} from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "./Label";
import { CopyButton } from "./CopyButton";

// ===== Shared helpers =====

function renderVisual(
  icon?: LucideIcon,
  emoji?: string,
  className?: string
) {
  const Icon = icon;
  if (Icon) {
    return (
      <Icon
        size={16}
        aria-hidden="true"
        className={cn("shrink-0 text-(--text-tertiary)", className)}
      />
    );
  }
  if (emoji) {
    return (
      <span
        className={cn(
          "font-emoji text-sm leading-none shrink-0 text-(--text-tertiary)",
          className
        )}
        aria-hidden="true"
      >
        {emoji}
      </span>
    );
  }
  return null;
}

// ===== Input =====

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Label icon (lucide) */
  labelIcon?: LucideIcon;
  /** Label emoji */
  labelEmoji?: string;
  /** Tooltip shown on the label info icon */
  labelTooltip?: string;

  /** Leading icon (lucide) — shown before the input */
  leadingIcon?: LucideIcon;
  /** Leading emoji — shown before the input */
  leadingEmoji?: string;
  /** Leading text (e.g. "$", "https://") — shown before the input */
  leadingText?: string | ReactNode;

  /** Trailing icon (lucide) — shown after the input */
  trailingIcon?: LucideIcon;
  /** Trailing emoji — shown after the input */
  trailingEmoji?: string;
  /** Trailing text (e.g. "px", "kg") — shown after the input */
  trailingText?: string | ReactNode;

  error?: string;
  helperText?: string;
}

const inputBase = [
  "w-full bg-transparent text-(--text-primary) text-sm",
  "placeholder:text-(--text-tertiary)",
  // Suppress ALL native focus styles — the wrapper handles the ring
  "outline-none focus:outline-none ring-0 focus:ring-0 border-none focus:border-none",
  "py-2",
  /* Number input: hide default browser spinners — we style our own */
  "[appearance:textfield]",
  "[&::-webkit-outer-spin-button]:appearance-none",
  "[&::-webkit-inner-spin-button]:appearance-none",
].join(" ");

const wrapperBase = [
  "flex items-center gap-2",
  "w-full rounded-md",
  "bg-(--surface-elevated)",
  "border border-(--border-default)",
  "hover:border-(--border-hover)",
  "focus-within:border-(--border-focus) focus-within:ring-2 focus-within:ring-(--ring-color)",
  "transition-colors duration-(--duration-fast)",
  "px-3",
].join(" ");

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      labelIcon,
      labelEmoji,
      labelTooltip,
      leadingIcon,
      leadingEmoji,
      leadingText,
      trailingIcon,
      trailingEmoji,
      trailingText,
      error,
      helperText,
      className,
      id,
      type,
      ...props
    },
    forwardedRef
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    // Internal ref so the number stepper always has a ref to work with,
    // regardless of whether the consumer passes one in.
    const internalRef = useRef<HTMLInputElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLInputElement>;

    const leadingVisual =
      renderVisual(leadingIcon, leadingEmoji) ??
      (leadingText != null ? (
        <span className="text-sm text-(--text-tertiary) whitespace-nowrap select-none">
          {leadingText}
        </span>
      ) : null);

    const trailingVisual =
      renderVisual(trailingIcon, trailingEmoji) ??
      (trailingText != null ? (
        <span className="text-sm text-(--text-tertiary) whitespace-nowrap select-none">
          {trailingText}
        </span>
      ) : null);

    const isNumber = type === "number";

    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && (
          <Label
            htmlFor={inputId}
            text={label}
            icon={labelIcon}
            emoji={labelEmoji}
            tooltip={labelTooltip}
          />
        )}

        <div
          className={cn(
            wrapperBase,
            error &&
            "border-error focus-within:border-error focus-within:ring-error/30"
          )}
        >
          {leadingVisual}

          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(inputBase, isNumber && "tabular-nums")}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...props}
          />

          {/* Number stepper buttons */}
          {isNumber && (
            <div className="flex flex-col -my-1 -mr-1 border-l border-(--border-default)">
              <button
                type="button"
                tabIndex={-1}
                aria-label="Increment"
                className="px-1.5 py-0.5 text-(--text-tertiary) hover:text-(--text-primary) hover:bg-(--surface-secondary) transition-colors cursor-pointer rounded-tr-md text-[10px] leading-none"
                onClick={() => {
                  const el = ref.current;
                  if (el) {
                    el.stepUp();
                    el.dispatchEvent(new Event("input", { bubbles: true }));
                    el.dispatchEvent(new Event("change", { bubbles: true }));
                  }
                }}
              >
                ▲
              </button>
              <button
                type="button"
                tabIndex={-1}
                aria-label="Decrement"
                className="px-1.5 py-0.5 text-(--text-tertiary) hover:text-(--text-primary) hover:bg-(--surface-secondary) transition-colors cursor-pointer rounded-br-md text-[10px] leading-none border-t border-(--border-default)"
                onClick={() => {
                  const el = ref.current;
                  if (el) {
                    el.stepDown();
                    el.dispatchEvent(new Event("input", { bubbles: true }));
                    el.dispatchEvent(new Event("change", { bubbles: true }));
                  }
                }}
              >
                ▼
              </button>
            </div>
          )}

          {/* Trailing adornment — rendered after number stepper (if any) */}
          {trailingVisual}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-error"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-sm text-(--text-tertiary)">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

// ===== Textarea =====

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  /** Label icon (lucide) */
  labelIcon?: LucideIcon;
  /** Label emoji */
  labelEmoji?: string;
  /** Tooltip shown on the label info icon */
  labelTooltip?: string;

  /** Leading icon — shown at top-left inside the textarea wrapper */
  leadingIcon?: LucideIcon;
  /** Leading emoji — shown at top-left inside the textarea wrapper */
  leadingEmoji?: string;
  /** Leading text — shown at top-left inside the textarea wrapper */
  leadingText?: string | ReactNode;

  error?: string;
  helperText?: string;
  allowCopy?: boolean;
}

const textareaBase = [
  "w-full text-(--text-primary) text-sm",
  "placeholder:text-(--text-tertiary)",
  // Suppress ALL native focus styles — the wrapper handles the ring
  "outline-none focus:outline-none ring-0 focus:ring-0 border-none focus:border-none",
  "py-2 min-h-40 resize-y",

].join(" ");

const textareaWrapperBase = [
  "flex gap-2",
  "w-full rounded-md",
  "bg-(--surface-elevated)",
  "border border-(--border-default)",
  "hover:border-(--border-hover)",
  "focus-within:border-(--border-focus) focus-within:ring-2 focus-within:ring-(--ring-color)",
  "transition-colors duration-(--duration-fast)",
  "px-3",
].join(" ");

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      labelIcon,
      labelEmoji,
      labelTooltip,
      leadingIcon,
      leadingEmoji,
      leadingText,
      error,
      allowCopy = true,
      helperText,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    const leadingVisual =
      renderVisual(leadingIcon, leadingEmoji, "mt-2.5") ??
      (leadingText != null ? (
        <span className="text-sm text-(--text-tertiary) whitespace-nowrap select-none mt-2.5">
          {leadingText}
        </span>
      ) : null);

    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        <div className="flex flex-row justify-between">
          {label && (
            <Label
              htmlFor={inputId}
              text={label}
              icon={labelIcon}
              emoji={labelEmoji}
              tooltip={labelTooltip}
            />
          )}

          {allowCopy && <CopyButton text={`${props.value}`} />}
        </div>

        <div
          className={cn(
            textareaWrapperBase,
            props.readOnly ? "bg-(--surface-secondary)" : "bg-(--surface-elevated)",
            error &&
            "border-error focus-within:border-error focus-within:ring-error/30"
          )}
        >
          {leadingVisual}

          <textarea
            ref={ref}
            id={inputId}
            className={cn(textareaBase,

            )}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...props}
          />
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-error"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-sm text-(--text-tertiary)">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";