import Icon from "@/components/AppIcon"
import Button from "../../../../ui/Button"

// ── Component ─────────────────────────────────────────────────────────────────

interface StaffFormHeaderProps {
  title: string
  icon: string
  onClose: () => void
}

export function StaffFormHeader({
  title,
  icon,
  onClose,
}: StaffFormHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <Icon name={icon} size={20} color="white" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="hover-scale"
      >
        <Icon name="X" size={20} />
      </Button>
    </div>
  )
}
