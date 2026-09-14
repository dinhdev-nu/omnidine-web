import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import Button from "../../../../ui/Button"

export interface StaffFormFooterProps {
  isEditMode: boolean
  isDisabled: boolean
  submitIcon: string
  submitText: string
}

export function StaffFormFooter({
  isEditMode,
  isDisabled,
  submitIcon,
  submitText,
}: StaffFormFooterProps) {
  return (
    <DialogFooter className="mx-0 mb-0 rounded-none px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
      <DialogClose asChild>
        <Button
          variant="outline"
          disabled={isDisabled}
          className="w-full sm:w-auto"
        >
          Hủy
        </Button>
      </DialogClose>
      {!isEditMode && (
        <Button
          type="submit"
          variant="default"
          disabled={isDisabled}
          iconName={submitIcon}
          iconPosition="left"
          className="w-full sm:w-auto"
        >
          {submitText}
        </Button>
      )}
    </DialogFooter>
  )
}
