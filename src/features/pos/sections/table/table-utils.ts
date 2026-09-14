import type { TableListItem, TableRecord } from "@/types/domain/table"

export const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min
  if (value > max) return max
  return value
}

export const getDefaultPosition = (index: number) => {
  const column = index % 4
  const row = Math.floor(index / 4)
  return {
    x: 90 + column * 170,
    y: 60 + row * 160,
  }
}

export const toTableFromRecord = (item: TableRecord): TableListItem | null => {
  if (!item.id) return null

  return {
    id: item.id,
    table_number: item.table_number,
    name: item.name,
    capacity: item.capacity,
    status: item.status,
    is_active: item.is_active,
    has_qr: Boolean(item.qr_code),
    qr_code: item.qr_code,
    qr_url: null,
    notes: item.notes ?? null,
  }
}
