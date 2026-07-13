export function FieldError({ message }: { message?: string }) {
  return message ? (
    <p role="status" aria-live="polite" className="mt-1.5 text-xs font-medium text-destructive">{message}</p>
  ) : null
}
