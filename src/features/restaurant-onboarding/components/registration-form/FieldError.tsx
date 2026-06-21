export function FieldError({ message }: { message?: string }) {
  return message ? (
    <p className="mt-1.5 text-xs font-medium text-destructive">{message}</p>
  ) : null
}
