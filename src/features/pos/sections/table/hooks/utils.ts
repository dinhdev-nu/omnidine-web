import type { TableListItem, TableRecord } from "@/types/domain/table"

export const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min
  if (value > max) return max
  return value
}

const normalizeTableId = (table: { id?: string; _id?: string }) =>
  table.id ?? table._id ?? ""

export const getDefaultPosition = (index: number) => {
  const column = index % 4
  const row = Math.floor(index / 4)
  return {
    x: 90 + column * 170,
    y: 60 + row * 160,
  }
}

export const toTableFromListItem = (
  item: TableListItem
): TableListItem | null => {
  const id = normalizeTableId(item)
  if (!id) return null

  return {
    ...item,
    _id: id,
  }
}

export const toTableFromRecord = (item: TableRecord): TableListItem | null => {
  const id = normalizeTableId(item)
  if (!id) return null

  return {
    _id: id,
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
