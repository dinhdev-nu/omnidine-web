export function HeaderDismissLayer({
  show,
  onDismiss,
}: {
  show: boolean
  onDismiss: () => void
}) {
  if (!show) {
    return null
  }

  return (
    <button
      type="button"
      aria-label="Đóng menu"
      className="fixed inset-0 z-1000"
      onClick={onDismiss}
    />
  )
}
