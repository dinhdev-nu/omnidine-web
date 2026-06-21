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
    <div className="space-y-4">
      <Input
        label="Tên món ăn"
        type="text"
        value={formData.name}
        onChange={(e) => onFieldChange("name", e.target.value)}
        error={errors.name}
        required
        placeholder="Nhập tên món ăn"
      />

      <Input
        label="Mô tả"
        type="text"
        value={formData.description}
        onChange={(e) => onFieldChange("description", e.target.value)}
        placeholder="Mô tả ngắn về món ăn"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Giá (VNĐ)"
          type="text"
          value={formData.price}
          onChange={(e) => onFieldChange("price", e.target.value)}
          error={errors.price}
          required
          placeholder="0"
        />

        <Select
          label="Danh mục"
          options={categoryOptions}
          value={formData.category}
          onChange={(event) => onFieldChange("category", event.target.value)}
          error={errors.category}
          required
          placeholder="Chọn danh mục"
        />
      </div>

      {!isEditing && (
        <Input
          label="Thứ tự hiển thị"
          type="number"
          min={0}
          step={1}
          value={formData.sortOrder}
          onChange={(e) => onFieldChange("sortOrder", e.target.value)}
          placeholder="Để trống để hệ thống tự sắp xếp"
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Trạng thái"
          options={STATUS_OPTIONS}
          value={formData.status}
          onChange={(event) => onFieldChange("status", event.target.value)}
          placeholder="Chọn trạng thái"
        />

        <Select
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
