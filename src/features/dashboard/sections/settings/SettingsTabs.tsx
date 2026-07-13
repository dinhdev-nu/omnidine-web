import type { KeyboardEvent } from "react"
import { tabs } from "./settings-section.data"
import type { SettingsTabsProps } from "./settings-section.types"

const navigationKeys = new Set(["ArrowLeft", "ArrowRight", "Home", "End"])

export function SettingsTabs({
  activeTab,
  onActiveTabChange,
}: SettingsTabsProps) {
  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (!navigationKeys.has(event.key)) return

    event.preventDefault()
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : event.key === "ArrowRight"
            ? (index + 1) % tabs.length
            : (index - 1 + tabs.length) % tabs.length
    const nextTab = tabs[nextIndex]
    onActiveTabChange(nextTab.id)

    const tabButtons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]'
    )
    tabButtons?.[nextIndex]?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label="Các nhóm cài đặt"
      className="grid w-full grid-cols-2 gap-2 rounded-lg border border-border bg-secondary p-1 sm:flex sm:w-fit sm:flex-wrap"
    >
      {tabs.map((tab, index) => {
        const Icon = tab.icon
        const isActive = tab.id === activeTab
        return (
          <button
            type="button"
            key={tab.id}
            id={`settings-tab-${tab.id}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`settings-panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onActiveTabChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`flex min-h-11 min-w-0 touch-manipulation items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-[background-color,color] motion-reduce:transition-none sm:px-4 ${
              isActive
                ? "bg-card text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            <span className="min-w-0 truncate">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
