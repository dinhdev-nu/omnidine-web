import { MenuDialogs } from "./MenuDialogs"
import { MenuContent } from "./MenuContent"
import { MenuFiltersPanel } from "./MenuFiltersPanel"
import { MenuLoadingState } from "./MenuLoadingState"
import { MenuPageHeader } from "./MenuPageHeader"
import { MenuPagination } from "./MenuPagination"
import { MenuResultsSummary } from "./MenuResultsSummary"
import Button from "../../../ui/Button"
import type { MenuSectionViewProps } from "./menu-section-content.types"

export function MenuSectionContent({ controller }: MenuSectionViewProps) {
  if (controller.isLoadingData) {
    return <MenuLoadingState />
  }

  if (controller.loadError) {
    return (
      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-pretty text-foreground">
          Quản lý thực đơn
        </h1>
        <div
          className="mt-4 flex min-h-48 flex-col items-start justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:p-6"
          role="alert"
        >
          <div>
            <h2 className="font-semibold text-foreground">
              Không thể tải thực đơn
            </h2>
            <p className="mt-1 break-words text-sm text-muted-foreground">
              {controller.loadError}
            </p>
          </div>
          <Button
            variant="outline"
            iconName="RefreshCw"
            iconPosition="left"
            onClick={() => void controller.retry()}
          >
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      <MenuPageHeader controller={controller} />
      <MenuFiltersPanel controller={controller} />
      <MenuResultsSummary controller={controller} />
      <MenuContent controller={controller} />
      <MenuPagination controller={controller} />
      <MenuDialogs controller={controller} />
    </div>
  )
}
