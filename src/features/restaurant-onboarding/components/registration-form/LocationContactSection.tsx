import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Mail, MapPin, Phone } from "lucide-react"
import { MOCK_DISTRICTS, MOCK_PROVINCES } from "../../constants"
import type { LocationContactSectionProps } from "./registration-form.types"
import {
  EMPTY_SELECT_VALUE,
  fromSelectValue,
  TIMEZONE_OPTIONS,
  toSelectValue,
} from "./registration-form.select-utils"
import { FieldError } from "./FieldError"

export function LocationContactSection({
  formData,
  errors,
  setField,
  changeTextField,
  changeNumberField,
  requestCurrentLocation,
  isLocating,
  locationError,
}: LocationContactSectionProps) {
  const provinceCode = formData.city
    ? (MOCK_PROVINCES.find((option) => option.name === formData.city)?.code ??
      null)
    : null
  const districts = provinceCode ? (MOCK_DISTRICTS[provinceCode] ?? []) : []

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Địa chỉ &amp; Liên hệ
        </CardTitle>
        <CardDescription>
          Thông tin vị trí, toạ độ và thông tin liên hệ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="address">
            Địa chỉ <span className="text-destructive">*</span>
          </Label>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <InputGroupText>
                <MapPin className="size-4 text-muted-foreground" />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="address"
              name="address"
              autoComplete="street-address"
              value={formData.address}
              onChange={changeTextField}
              placeholder="Số nhà, tên toà nhà, đường…"
              data-invalid={!!errors.address}
            />
          </InputGroup>
          <FieldError message={errors.address} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="city">
              Tỉnh/Thành phố <span className="text-destructive">*</span>
            </Label>
            <Select
              value={toSelectValue(formData.city)}
              onValueChange={(value) => {
                const cityValue = fromSelectValue(value)

                setField("city", cityValue)
                setField("district", "")
              }}
            >
              <SelectTrigger id="city" className="w-full">
                <SelectValue placeholder="Chọn tỉnh thành" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={0}
                className="w-[var(--radix-select-trigger-width)]"
              >
                <SelectItem value={EMPTY_SELECT_VALUE}>
                  Chọn tỉnh thành
                </SelectItem>
                {MOCK_PROVINCES.map((option) => (
                  <SelectItem key={option.code} value={option.name}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.city} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="district">Quận/Huyện</Label>
            <Select
              value={toSelectValue(formData.district)}
              onValueChange={(value) =>
                setField("district", fromSelectValue(value))
              }
              disabled={!formData.city}
            >
              <SelectTrigger id="district" className="w-full">
                <SelectValue placeholder="Chọn quận huyện" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={0}
                className="w-[var(--radix-select-trigger-width)]"
              >
                <SelectItem value={EMPTY_SELECT_VALUE}>
                  Chọn quận huyện
                </SelectItem>
                {districts.map((option) => (
                  <SelectItem key={option.code} value={option.name}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={requestCurrentLocation}
            disabled={isLocating}
          >
            {isLocating ? "Đang lấy vị trí..." : "Lấy lại vị trí"}
          </Button>
          {typeof formData.latitude === "number" &&
            typeof formData.longitude === "number" &&
            !locationError && (
              <p className="text-xs text-emerald-600">
                Đã cập nhật tọa độ tự động từ vị trí hiện tại
              </p>
            )}
          {locationError && (
            <p className="text-xs text-muted-foreground">{locationError}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ward">Phường/Xã</Label>
            <Input
              id="ward"
              name="ward"
              value={formData.ward ?? ""}
              onChange={changeTextField}
              placeholder="Phường hoặc xã"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Múi giờ</Label>
            <Select
              value={toSelectValue(formData.timezone)}
              onValueChange={(value) =>
                setField("timezone", fromSelectValue(value))
              }
            >
              <SelectTrigger id="timezone" className="w-full">
                <SelectValue placeholder="Chọn múi giờ" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={0}
                className="w-[var(--radix-select-trigger-width)]"
              >
                <SelectItem value={EMPTY_SELECT_VALUE}>Chọn múi giờ</SelectItem>
                {TIMEZONE_OPTIONS.map((timezoneOption) => (
                  <SelectItem key={timezoneOption} value={timezoneOption}>
                    {timezoneOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <MapPin className="size-4 text-muted-foreground" />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="latitude"
                name="latitude"
                type="number"
                inputMode="decimal"
                autoComplete="off"
                step="any"
                value={formData.latitude ?? ""}
                onChange={(event) =>
                  changeNumberField("latitude", event.target.value)
                }
                placeholder="10.7769"
              />
            </InputGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <MapPin className="size-4 text-muted-foreground" />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="longitude"
                name="longitude"
                type="number"
                inputMode="decimal"
                autoComplete="off"
                step="any"
                value={formData.longitude ?? ""}
                onChange={(event) =>
                  changeNumberField("longitude", event.target.value)
                }
                placeholder="106.7009"
              />
            </InputGroup>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <Mail className="size-4 text-muted-foreground" />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                spellCheck={false}
                value={formData.email ?? ""}
                onChange={changeTextField}
                placeholder="hello@example.com"
              />
            </InputGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Hotline</Label>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <Phone className="size-4 text-muted-foreground" />
                  <span className="border-r border-border pr-2 text-xs">
                    +84
                  </span>
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                value={formData.phone ?? ""}
                onChange={changeTextField}
                placeholder="901 234 567"
              />
            </InputGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
