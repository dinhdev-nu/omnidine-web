import {
  useCreateRestaurantActions,
  useCreateRestaurantMeta,
  useCreateRestaurantState,
} from "@/features/restaurant-onboarding/FormProvider"
import { BrandIdentitySection } from "@/features/restaurant-onboarding/components/registration-form/BrandIdentitySection"
import { LocationContactSection } from "@/features/restaurant-onboarding/components/registration-form/LocationContactSection"
import { MediaSection } from "@/features/restaurant-onboarding/components/registration-form/MediaSection"
import { OperatingHoursSection } from "@/features/restaurant-onboarding/components/registration-form/OperatingHoursSection"

function FormIntroHeader() {
  return (
    <div>
      <h3 className="text-xl font-semibold text-foreground text-balance">Hồ sơ nhà hàng</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Cập nhật thông tin định danh, hình ảnh, liên hệ và giờ hoạt động của nhà
        hàng.
      </p>
    </div>
  )
}

export function RestaurantProfileRegistrationForm() {
  const { formData, errors } = useCreateRestaurantState()
  const {
    setField,
    changeTextField,
    changeNumberField,
    changeOperatingClosed,
    changeOperatingTime,
    requestCurrentLocation,
    uploadImage,
  } = useCreateRestaurantActions()
  const {
    logoPreview,
    coverPreview,
    galleryPreviews,
    slugCheckStatus,
    isLocating,
    locationError,
  } = useCreateRestaurantMeta()

  return (
    <div className="min-w-0 animate-in space-y-6 duration-300 fade-in slide-in-from-bottom-2 motion-reduce:animate-none [&_[data-slot=input-group]]:border-border [&_[data-slot=input-group]]:bg-background [&_[data-slot=input]]:border-border [&_[data-slot=input]]:bg-background [&_[data-slot=select-trigger]]:border-border [&_[data-slot=select-trigger]]:bg-background">
      <FormIntroHeader />

      <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <BrandIdentitySection
          formData={formData}
          errors={errors}
          setField={setField}
          changeTextField={changeTextField}
          slugCheckStatus={slugCheckStatus}
        />

        <LocationContactSection
          formData={formData}
          errors={errors}
          setField={setField}
          changeTextField={changeTextField}
          changeNumberField={changeNumberField}
          requestCurrentLocation={requestCurrentLocation}
          isLocating={isLocating}
          locationError={locationError}
        />

        <MediaSection
          logoPreview={logoPreview}
          coverPreview={coverPreview}
          galleryPreviews={galleryPreviews}
          uploadImage={uploadImage}
        />

        <OperatingHoursSection
          formData={formData}
          changeOperatingClosed={changeOperatingClosed}
          changeOperatingTime={changeOperatingTime}
        />
      </div>
    </div>
  )
}
