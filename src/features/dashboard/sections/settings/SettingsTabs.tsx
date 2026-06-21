import { tabs } from "./settings-section.data"
import type { SettingsTabsProps } from "./settings-section.types"

export function SettingsTabs({
  activeTab,
  onActiveTabChange,
}: SettingsTabsProps) {
  return (
    <div className="flex w-fit gap-2 rounded-lg border border-border bg-secondary p-1">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <button
            type="button"
            key={tab.id}
            onClick={() => onActiveTabChange(tab.id)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              tab.id === activeTab
                ? "bg-card text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
