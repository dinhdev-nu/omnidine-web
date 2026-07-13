import * as React from "react"
import { cn } from "@/lib/utils"
import Icon from "@/components/AppIcon"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: React.ReactNode
  description?: React.ReactNode
  error?: React.ReactNode
  wrapperClassName?: string
  options?: Array<{ value: string; label: string }>;
  placeholder?: string
  searchable?: boolean
}

const EMPTY_OPTIONS: NonNullable<SelectProps["options"]> = []

function Select({
  className,
  id,
  label,
  description,
  error,
  required,
  wrapperClassName,
  options = EMPTY_OPTIONS,
  children,
  placeholder,
  searchable: _searchable,
  "aria-describedby": ariaDescribedBy,
  ...props
}: SelectProps) {
  void _searchable

  const generatedId = React.useId()
  const selectId = id ?? generatedId
  const descriptionId = `${selectId}-description`
  const errorId = `${selectId}-error`
  const feedbackId = error ? errorId : description ? descriptionId : undefined
  const describedBy =
    [ariaDescribedBy, feedbackId].filter(Boolean).join(" ") || undefined

  const selectElement = (
    <div className="relative">
      <select
        id={selectId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(
          "h-11 w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-10 text-sm",
          "transition-colors outline-none motion-reduce:transition-none",
          "focus:border-ring focus:ring-2 focus:ring-ring/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus:border-destructive focus:ring-destructive/20",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option key="__placeholder__" value="" disabled>
            {placeholder}
          </option>
        )}
        {options.length > 0
          ? options.map((opt, idx) => (
            <option key={`${opt.value}-${idx}`} value={opt.value}>
              {opt.label}
            </option>
          ))
          : children}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
      </div>
    </div>
  )

  if (!label && !description && !error) {
    return selectElement
  }

  return (
    <div className={cn("space-y-2", wrapperClassName)}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
      )}

      {selectElement}

      {error ? (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : (
        description && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )
      )}
    </div>
  )
}

export default Select;
