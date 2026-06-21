const numberFormatter = new Intl.NumberFormat("vi-VN")

const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

export const formatCurrency = (amount: number): string =>
  numberFormatter.format(amount ?? 0)

export const formatDateTime = (timestamp?: string): string => {
  if (!timestamp) return "N/A"
  return dateTimeFormatter.format(new Date(timestamp))
}
