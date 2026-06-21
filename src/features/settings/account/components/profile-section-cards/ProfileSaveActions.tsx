import { Button } from "@/components/ui/button"
import { Check, RefreshCw } from "lucide-react"
import type { ProfileSectionViewProps } from "./profile-section-card.types"

export function ProfileSaveActions({ controller }: ProfileSectionViewProps) {
  const { isSavingProfile, isLoadingProfile, handleSave } = controller
  return (
    <div className="flex justify-end">
      <Button
        onClick={handleSave}
        disabled={isSavingProfile || isLoadingProfile}
      >
        {isSavingProfile ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Đang lưu...
          </>
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" />
            Lưu thay đổi
          </>
        )}
      </Button>
    </div>
  )
}
