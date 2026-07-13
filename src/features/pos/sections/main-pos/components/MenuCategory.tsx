import Icon from "@/components/AppIcon"

import Button from "../../../ui/Button"

interface Category {
  id: string
  name: string
  icon?: string
  description?: string | null
  itemCount?: number
  imageUrl?: string | null
}

interface MenuCategoryProps {
  categories: Category[]
  activeCategory: string
  onCategoryChange: (id: string) => void
}

const MenuCategory = ({
  categories,
  activeCategory,
  onCategoryChange,
}: MenuCategoryProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto overscroll-x-contain pb-2 scrollbar-hide">
      {categories.map((category) => {
        const hasImage = Boolean(category.imageUrl)
        const isActive = activeCategory === category.id

        return (
          <Button
            key={category.id}
            variant={isActive ? "default" : "outline"}
            size="sm"
            aria-pressed={isActive}
            onClick={() => onCategoryChange(category.id)}
            className={`relative h-auto w-50 shrink-0 overflow-hidden px-3 py-2.5 text-left hover-scale ${
              hasImage ? "border-white/30" : ""
            } ${
              !hasImage && isActive
                ? "!border-primary !bg-primary !text-primary-foreground"
                : ""
            } ${!hasImage && !isActive ? "!text-foreground" : ""}`}
            style={
              hasImage
                ? {
                    backgroundImage: `url(${category.imageUrl})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }
                : undefined
            }
          >
            {hasImage ? (
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/45"
              />
            ) : null}

            <span className="relative z-10 flex w-full flex-col gap-1.5">
              <span className="flex min-w-0 items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2">
                  {category.icon ? (
                    <Icon
                      name={category.icon}
                      size={14}
                      aria-hidden="true"
                      className={
                        hasImage
                          ? "text-white"
                          : isActive
                            ? "text-primary-foreground"
                            : "text-foreground"
                      }
                    />
                  ) : null}
                  <span
                    className={`truncate font-medium ${
                      hasImage
                        ? "text-white"
                        : isActive
                          ? "text-primary-foreground"
                          : "text-foreground"
                    }`}
                  >
                    {category.name}
                  </span>
                </span>
                <span
                  className={`shrink-0 text-[11px] ${
                    hasImage
                      ? "rounded bg-black/35 px-1.5 py-0.5 text-white"
                      : isActive
                        ? "text-primary-foreground/90"
                        : "text-muted-foreground"
                  }`}
                >
                  {category.itemCount ?? 0} món
                </span>
              </span>

              {category.description ? (
                <span
                  className={`line-clamp-1 break-words text-[11px] ${
                    hasImage
                      ? "text-white/90"
                      : isActive
                        ? "text-primary-foreground/85"
                        : "text-muted-foreground"
                  }`}
                >
                  {category.description}
                </span>
              ) : null}
            </span>
          </Button>
        )
      })}
    </div>
  )
}

export default MenuCategory
