import Button from "@/features/pos/ui/Button"
import Icon from "@/components/AppIcon"

interface Category {
  id: string;
  name: string;
  icon?: string;
  description?: string | null;
  itemCount?: number;
  imageUrl?: string | null;
}

interface MenuCategoryProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

const MenuCategory = ({
  categories,
  activeCategory,
  onCategoryChange,
}: MenuCategoryProps) => {
  return (
    <div className="scrollbar-hide mb-4 flex gap-2 overflow-x-auto pb-2 [@media(max-height:500px)]:mb-0 [@media(max-height:500px)]:pb-1">
      {categories?.map((category) => {
        const hasImage = Boolean(category?.imageUrl);
        const isActive = activeCategory === category?.id;

        return (
          <Button
            key={category?.id}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            aria-pressed={isActive}
            onClick={() => onCategoryChange(category?.id)}
            className={`hover-scale relative h-auto w-[200px] flex-shrink-0 overflow-hidden px-3 py-2.5 [@media(max-height:500px)]:py-2 ${hasImage ? 'border-white/30' : ''} ${!hasImage && isActive ? '!bg-primary !text-primary-foreground !border-primary' : ''} ${!hasImage && !isActive ? '!text-foreground' : ''}`}
            style={hasImage ? {
              backgroundImage: `url(${category.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            } : undefined}
          >
            {hasImage && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/45" aria-hidden="true" />
            )}

            <div className="w-full space-y-1.5 text-left relative z-10">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  {category?.icon && (
                    <Icon
                      name={category?.icon}
                      size={14}
                      className={hasImage ? 'text-white' : isActive ? 'text-primary-foreground' : 'text-foreground'}
                    />
                  )}
                  <span className={`font-medium truncate ${hasImage ? 'text-white' : isActive ? 'text-primary-foreground' : 'text-foreground'}`}>{category?.name}</span>
                </div>
                <span className={`text-[11px] flex-shrink-0 ${hasImage ? 'text-white bg-black/35 rounded px-1.5 py-0.5' : isActive ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                  {category?.itemCount ?? 0} món
                </span>
              </div>

              {category?.description && (
                <p className={`line-clamp-1 break-words text-[11px] [@media(max-height:500px)]:hidden ${hasImage ? 'text-white/90' : isActive ? 'text-primary-foreground/85' : 'text-muted-foreground'}`}>
                  {category?.description}
                </p>
              )}
            </div>
          </Button>
        );
      })}
    </div>
  );
};

export default MenuCategory;
