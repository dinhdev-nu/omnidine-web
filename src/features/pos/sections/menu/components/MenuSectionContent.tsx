import { MenuDialogs } from "./MenuDialogs"
import { MenuContent } from "./MenuContent"
import { MenuFiltersPanel } from "./MenuFiltersPanel"
import { MenuLoadingState } from "./MenuLoadingState"
import { MenuPageHeader } from "./MenuPageHeader"
import { MenuPagination } from "./MenuPagination"
import { MenuResultsSummary } from "./MenuResultsSummary"
import type { MenuSectionViewProps } from "./menu-section-content.types"

export function MenuSectionContent({ controller }: MenuSectionViewProps) {
  if (controller.isLoadingData) {
    return <MenuLoadingState />
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <MenuPageHeader controller={controller} />
      <MenuFiltersPanel controller={controller} />
      <MenuResultsSummary controller={controller} />
      <MenuContent controller={controller} />
      <MenuPagination controller={controller} />
      <MenuDialogs controller={controller} />
    </div>
  )
}
