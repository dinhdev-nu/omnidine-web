export type SearchFilters = {
  city: string
  cuisine_type: string
  price_range: string[]
  accepts_online: boolean | null
  radius_km: string
  sort: "name" | "distance"
  lat: number | null
  lng: number | null
}
