import type React from "react"

import { MenuSectionContent } from "./components/MenuSectionContent"
import { useMenuSectionController } from "./hooks/useMenuSectionController"

const MenuSection: React.FC = () => {
  const controller = useMenuSectionController()

  return (
    <div>
      <MenuSectionContent controller={controller} />
    </div>
  )
}

export default MenuSection
