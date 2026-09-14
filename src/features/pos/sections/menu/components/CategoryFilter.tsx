import React from 'react';
import Button from '../../../ui/Button';
import { cn } from '@/lib/utils';
import Image from '@/components/AppImage';

interface Category {
  id: string;
  name: string;
  imageUrl?: string | null;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  itemCounts?: Record<string, number>;
  onAddCategory: () => void;
  onManageCategories: () => void;
}

const EMPTY_ITEM_COUNTS: Record<string, number> = {};

const getBadgeClass = (isSelected: boolean) =>
  cn(
    'ml-2 rounded-full px-2 py-0.5 text-xs',
    isSelected
      ? 'bg-primary-foreground/20 text-primary-foreground'
      : 'bg-muted text-muted-foreground'
  );

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  itemCounts = EMPTY_ITEM_COUNTS,
  onAddCategory,
  onManageCategories,
}) => {
  const allCount = Object.values(itemCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto overscroll-x-contain pb-2"
      role="group"
      aria-label="Lọc nhanh theo danh mục"
      tabIndex={0}
    >
      <Button
        variant={selectedCategory === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onCategoryChange('all')}
        className="flex-shrink-0"
        aria-pressed={selectedCategory === 'all'}
      >
        <span>Tất cả</span>
        {allCount > 0 && (
          <span className={getBadgeClass(selectedCategory === 'all')}>
            {allCount}
          </span>
        )}
      </Button>

      {categories.map((category) => {
        const count = itemCounts[category.id] ?? 0;
        const isSelected = selectedCategory === category.id;

        return (
          <Button
            key={category.id}
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className="max-w-[min(18rem,calc(100vw-4rem))] flex-shrink-0"
            aria-pressed={isSelected}
          >
            {category.imageUrl && (
              <span className="mr-2 size-5 overflow-hidden rounded-full border border-border">
                <Image src={category.imageUrl} alt={category.name} className="h-full w-full object-cover" />
              </span>
            )}
            <span className="truncate">{category.name}</span>
            {count > 0 && (
              <span className={getBadgeClass(isSelected)}>
                {count}
              </span>
            )}
          </Button>
        );
      })}

      <Button
        variant="ghost"
        size="sm"
        className="flex-shrink-0 text-muted-foreground border-dashed"
        iconName="Plus"
        iconPosition="left"
        onClick={onAddCategory}
      >
        Thêm danh mục
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="flex-shrink-0 text-muted-foreground"
        iconName="Settings"
        iconPosition="left"
        onClick={onManageCategories}
      >
        Quản lý danh mục
      </Button>
    </div>
  );
};

export default CategoryFilter;
