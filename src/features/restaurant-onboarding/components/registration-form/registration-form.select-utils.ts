export const TIMEZONE_OPTIONS = ["Asia/Ho_Chi_Minh", "Asia/Bangkok", "UTC"]

export const EMPTY_SELECT_VALUE = "__none__"

export function toSelectValue(value?: string) {
  return value && value.trim().length > 0 ? value : EMPTY_SELECT_VALUE
}

export function fromSelectValue(value: string) {
  return value === EMPTY_SELECT_VALUE ? "" : value
}
