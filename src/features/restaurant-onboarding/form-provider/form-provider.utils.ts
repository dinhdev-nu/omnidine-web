import { uploadMultipleFiles, uploadSingleFile } from "@/services/uploads"
import type { AppError } from "@/services/core/types"
import { DAY_KEYS, DEFAULT_OPERATING_HOURS } from "../constants"
import type { RestaurantDTO } from "../constants"

export const MAX_GALLERY_ITEMS = 8

export const SLUG_CHECK_DEBOUNCE_MS = 500

function createDefaultOperatingHours() {
  return {
    mon: { ...DEFAULT_OPERATING_HOURS.mon },
    tue: { ...DEFAULT_OPERATING_HOURS.tue },
    wed: { ...DEFAULT_OPERATING_HOURS.wed },
    thu: { ...DEFAULT_OPERATING_HOURS.thu },
    fri: { ...DEFAULT_OPERATING_HOURS.fri },
    sat: { ...DEFAULT_OPERATING_HOURS.sat },
    sun: { ...DEFAULT_OPERATING_HOURS.sun },
  }
}

function createDefaultRestaurantFormData(): RestaurantDTO {
  return {
    name: "",
    slug: "",
    description: "",
    logo_url: "",
    cover_image_url: "",
    gallery_urls: [],
    website: "",
    cuisine_type: "",
    price_range: undefined,
    address: "",
    city: "",
    district: "",
    ward: "",
    latitude: undefined,
    longitude: undefined,
    phone: "",
    email: "",
    timezone: "Asia/Ho_Chi_Minh",
    operating_hours: createDefaultOperatingHours(),
  }
}

export function createInitialRestaurantFormData(
  initialFormData?: Partial<RestaurantDTO>
): RestaurantDTO {
  const defaultFormData = createDefaultRestaurantFormData()

  if (!initialFormData) {
    return defaultFormData
  }

  const nextFormData = { ...defaultFormData }

  for (const [key, value] of Object.entries(initialFormData) as Array<
    [keyof RestaurantDTO, RestaurantDTO[keyof RestaurantDTO]]
  >) {
    if (value !== undefined) {
      nextFormData[key] = value as never
    }
  }

  return {
    ...nextFormData,
    gallery_urls: [...(nextFormData.gallery_urls ?? [])],
    operating_hours:
      nextFormData.operating_hours ?? createDefaultOperatingHours(),
  }
}

function normalizeOptionalString(value: string | undefined) {
  if (!value) return undefined

  const normalized = value.trim()

  return normalized.length > 0 ? normalized : undefined
}

export function buildPayload(formData: RestaurantDTO): RestaurantDTO {
  return {
    ...formData,
    name: formData.name.trim(),
    address: formData.address.trim(),
    city: formData.city.trim(),
    slug: normalizeOptionalString(formData.slug),
    description: normalizeOptionalString(formData.description),
    logo_url: normalizeOptionalString(formData.logo_url),
    cover_image_url: normalizeOptionalString(formData.cover_image_url),
    gallery_urls:
      formData.gallery_urls && formData.gallery_urls.length > 0
        ? formData.gallery_urls
        : undefined,
    website: normalizeOptionalString(formData.website),
    cuisine_type: normalizeOptionalString(formData.cuisine_type),
    district: normalizeOptionalString(formData.district),
    ward: normalizeOptionalString(formData.ward),
    phone: normalizeOptionalString(formData.phone),
    email: normalizeOptionalString(formData.email),
    timezone: normalizeOptionalString(formData.timezone),
    latitude:
      typeof formData.latitude === "number" ? formData.latitude : undefined,
    longitude:
      typeof formData.longitude === "number" ? formData.longitude : undefined,
  }
}

export function hasAtLeastOneOpenDay(formData: RestaurantDTO): boolean {
  return DAY_KEYS.some((day) => !formData.operating_hours[day].closed)
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
        return
      }

      reject(new Error("Cannot read file preview"))
    }
    reader.onerror = () => reject(new Error("Cannot read file preview"))
    reader.readAsDataURL(file)
  })
}

export function getSlugCheckErrorMessage(appError: AppError): string {
  switch (appError.errorCode) {
    case "INVALID_SLUG_FORMAT":
      return "Slug không đúng định dạng (chỉ chữ thường, số và dấu gạch ngang)"
    case "TOO_MANY_REQUESTS":
      return "Bạn đang kiểm tra slug quá nhanh, vui lòng thử lại sau ít giây"
    default:
      return "Không thể kiểm tra slug lúc này"
  }
}

export function getUploadErrorMessage(appError: AppError): string {
  switch (appError.errorCode) {
    case "UPLOAD_002":
      return "Định dạng file không hợp lệ"
    case "UPLOAD_003":
      return "File vượt kích thước cho phép"
    case "RATELIMIT_001":
      return "Bạn thao tác quá nhanh, vui lòng thử lại sau"
    case "AUTH_001":
    case "AUTH_003":
      return "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại"
    case "UPLOAD_001":
      return "Tải ảnh thất bại, vui lòng thử lại"
    default:
      return appError.message || "Không thể tải ảnh lên máy chủ"
  }
}

export function getCreateRestaurantErrorMessage(appError: AppError): string {
  switch (appError.errorCode) {
    case "VALIDATION_ERROR":
      return "Thông tin nhà hàng chưa hợp lệ, vui lòng kiểm tra lại"
    case "CONFLICT_ERROR":
      return "Slug đã tồn tại hoặc dữ liệu bị xung đột"
    case "TOO_MANY_REQUESTS":
      return "Bạn đã vượt giới hạn tạo nhà hàng, vui lòng thử lại sau"
    case "UNAUTHORIZED":
    case "TOKEN_EXPIRED":
    case "AUTH_001":
    case "AUTH_003":
      return "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại"
    default:
      if (appError.status === 403) {
        return "Bạn không có quyền tạo thêm nhà hàng hoặc đã vượt giới hạn tài khoản"
      }

      return appError.message || "Không thể tạo nhà hàng"
  }
}

export async function uploadByCount(files: File[]) {
  if (files.length === 1) {
    const item = await uploadSingleFile(files[0])
    return [item]
  }

  return uploadMultipleFiles(files)
}
