import Input from "../../../ui/Input"
import Select from "../../../ui/Select"
import { FEATURED_OPTIONS, STATUS_OPTIONS } from "./menu-item-modal.constants"
import type { MenuItemDetailsFieldsProps } from "./menu-item-modal.types"

export function MenuItemDetailsFields({
  formData,
  categoryOptions,
  errors,
  isEditing,
  onFieldChange,
}: MenuItemDetailsFieldsProps) {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <Input
        id="menu-item-name"
        name="name"
        label="Tên món ăn"
        type="text"
        autoComplete="off"
        value={formData.name}
        onChange={(e) => onFieldChange("name", e.target.value)}
        error={
          errors.name ? (
            <span id="menu-item-name-error">{errors.name}</span>
          ) : undefined
        }
        aria-describedby={errors.name ? "menu-item-name-error" : undefined}
        required
        placeholder="Nhập tên món ăn"
      />

      <Input
        id="menu-item-description"
        name="description"
        label="Mô tả"
        type="text"
        autoComplete="off"
        value={formData.description}
        onChange={(e) => onFieldChange("description", e.target.value)}
        placeholder="Mô tả ngắn về món ăn"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="menu-item-price"
          name="price"
          label="Giá (VNĐ)"
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          value={formData.price}
          onChange={(e) => onFieldChange("price", e.target.value)}
          error={
            errors.price ? (
              <span id="menu-item-price-error">{errors.price}</span>
            ) : undefined
          }
          aria-describedby={errors.price ? "menu-item-price-error" : undefined}
          required
          placeholder="0"
        />

        <Select
          id="menu-item-category"
          name="category"
          label="Danh mục"
          options={categoryOptions}
          value={formData.category}
          onChange={(event) => onFieldChange("category", event.target.value)}
          error={
            errors.category ? (
              <span id="menu-item-category-error">{errors.category}</span>
            ) : undefined
          }
          aria-describedby={
            errors.category ? "menu-item-category-error" : undefined
          }
          required
          placeholder="Chọn danh mục"
        />
      </div>

      {!isEditing && (
        <Input
          id="menu-item-sort-order"
          name="sortOrder"
          label="Thứ tự hiển thị"
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          value={formData.sortOrder}
          onChange={(e) => onFieldChange("sortOrder", e.target.value)}
          error={
            errors.sortOrder ? (
              <span id="menu-item-sort-order-error">
                {errors.sortOrder}
              </span>
            ) : undefined
          }
          aria-describedby={
            errors.sortOrder ? "menu-item-sort-order-error" : undefined
          }
          placeholder="Để trống để hệ thống tự sắp xếp"
        />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          id="menu-item-status"
          name="status"
          label="Trạng thái"
          options={STATUS_OPTIONS}
          value={formData.status}
          onChange={(event) => onFieldChange("status", event.target.value)}
          placeholder="Chọn trạng thái"
        />

        <Select
          id="menu-item-featured"
          name="featured"
          label="Hiển thị"
          options={FEATURED_OPTIONS}
          value={formData.featured}
          onChange={(event) => onFieldChange("featured", event.target.value)}
          placeholder="Chọn hiển thị"
        />
      </div>
    </div>
  )
}
