import Icon from "@/components/AppIcon"
import {
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Button from "../../../../ui/Button"

interface StaffFormHeaderProps {
  title: string
  icon: string
  isCloseDisabled: boolean
}

export function StaffFormHeader({
  title,
  icon,
  isCloseDisabled,
}: StaffFormHeaderProps) {
  return (
    <DialogHeader className="border-b border-border p-4 pr-16 text-left sm:p-6 sm:pr-20">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Icon name={icon} size={20} color="white" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <DialogTitle className="text-lg leading-snug font-semibold break-words text-foreground sm:text-xl">
            {title}
          </DialogTitle>
          <DialogDescription className="mt-1 leading-relaxed">
            Nhập thông tin hồ sơ, tài khoản và quyền truy cập của nhân viên.
          </DialogDescription>
        </div>
      </div>

      <DialogClose asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={isCloseDisabled}
          aria-label="Đóng biểu mẫu nhân viên"
          className="absolute top-2 right-2 sm:top-4 sm:right-4"
        >
          <Icon name="X" size={20} aria-hidden="true" />
        </Button>
      </DialogClose>
    </DialogHeader>
  )
}
