import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  CheckCircle2,
  CircleX,
  Globe,
  Link as LinkIcon,
  Loader2,
  Store,
} from "lucide-react"
import { cuisineTypes, PRICE_RANGES } from "../../constants"
import type { BrandIdentitySectionProps } from "./registration-form.types"
import {
  EMPTY_SELECT_VALUE,
  fromSelectValue,
  toSelectValue,
} from "./registration-form.select-utils"
import { FieldError } from "./FieldError"

export function BrandIdentitySection({
  formData,
  errors,
  setField,
  changeTextField,
  slugCheckStatus,
}: BrandIdentitySectionProps) {
  const normalizedSlug = (formData.slug ?? "").trim()
  const shouldShowSlugIndicator = normalizedSlug.length > 0

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Định danh thương hiệu
        </CardTitle>
        <CardDescription>
          Tên gọi, mô tả, website và loại hình nhà hàng
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">
            Tên nhà hàng <span className="text-destructive">*</span>
          </Label>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <InputGroupText>
                <Store className="size-4 text-muted-foreground" />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="name"
              name="name"
              autoComplete="organization"
              value={formData.name}
              onChange={changeTextField}
              placeholder="VD: The Continental"
              data-invalid={!!errors.name}
            />
          </InputGroup>
          <FieldError message={errors.name} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <LinkIcon className="size-4 text-muted-foreground" />
                  <span className="border-r border-border pr-2 text-xs">
                    omnidine.vn/r/
                  </span>
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="slug"
                name="slug"
                value={formData.slug ?? ""}
                onChange={changeTextField}
                placeholder="the-continental"
                spellCheck={false}
                autoCapitalize="none"
                autoCorrect="off"
                aria-invalid={slugCheckStatus === "taken" || !!errors.slug}
              />
              {shouldShowSlugIndicator && (
                <InputGroupAddon
                  align="inline-end"
                  className="pointer-events-none"
                >
                  {slugCheckStatus === "checking" && (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  )}
                  {slugCheckStatus === "available" && (
                    <CheckCircle2 className="size-4 text-emerald-600" />
                  )}
                  {slugCheckStatus === "taken" && (
                    <CircleX className="size-4 text-destructive" />
                  )}
                </InputGroupAddon>
              )}
            </InputGroup>
            <FieldError message={errors.slug} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website chính thức</Label>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <Globe className="size-4 text-muted-foreground" />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="website"
                name="website"
                type="url"
                autoComplete="url"
                spellCheck={false}
                value={formData.website ?? ""}
                onChange={changeTextField}
                placeholder="yourdomain.com"
              />
            </InputGroup>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cuisine_type">Loại ẩm thực</Label>
            <Select
              value={toSelectValue(formData.cuisine_type)}
              onValueChange={(value) =>
                setField("cuisine_type", fromSelectValue(value))
              }
            >
              <SelectTrigger id="cuisine_type" className="w-full">
                <SelectValue placeholder="Chọn ẩm thực" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={0}
                className="w-[var(--radix-select-trigger-width)]"
              >
                <SelectItem value={EMPTY_SELECT_VALUE}>Chưa chọn</SelectItem>
                {cuisineTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Mức giá (1-4)</Label>
            <div className="flex gap-2">
              {PRICE_RANGES.map((priceRange) => (
                <button
                  key={priceRange}
                  type="button"
                  onClick={() =>
                    setField(
                      "price_range",
                      formData.price_range === priceRange
                        ? undefined
                        : priceRange
                    )
                  }
                  aria-pressed={formData.price_range === priceRange}
                  className={cn(
                    "inline-flex h-8 flex-1 items-center justify-center rounded-lg border text-sm font-bold transition-all focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
                    formData.price_range === priceRange
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-background text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {"₫".repeat(priceRange)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description ?? ""}
            onChange={changeTextField}
            placeholder="Giới thiệu ngắn về nhà hàng của bạn…"
            className="min-h-[120px] resize-y bg-background"
          />
          <p className="text-right text-xs text-muted-foreground">
            {(formData.description ?? "").length} ký tự
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
