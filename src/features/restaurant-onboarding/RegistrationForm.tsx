import {
  useCreateRestaurantActions,
  useCreateRestaurantMeta,
  useCreateRestaurantState,
} from "./FormProvider"
import { BrandIdentitySection } from "./components/registration-form/BrandIdentitySection"
import { LocationContactSection } from "./components/registration-form/LocationContactSection"
import { MediaSection } from "./components/registration-form/MediaSection"
import { OperatingHoursSection } from "./components/registration-form/OperatingHoursSection"

function FormIntroHeader() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground">
        Đăng ký nhà hàng
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Mang hương vị của bạn đến với thế giới. Điền thông tin bên dưới để thiết
        lập trang định danh chuyên nghiệp.
      </p>
    </div>
  )
}

export function RegistrationForm() {
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
    <div className="animate-in space-y-6 duration-300 fade-in slide-in-from-bottom-2">
      <FormIntroHeader />

      <BrandIdentitySection
        formData={formData}
        errors={errors}
        setField={setField}
        changeTextField={changeTextField}
        slugCheckStatus={slugCheckStatus}
      />

      <MediaSection
        logoPreview={logoPreview}
        coverPreview={coverPreview}
        galleryPreviews={galleryPreviews}
        uploadImage={uploadImage}
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

      <OperatingHoursSection
        formData={formData}
        changeOperatingClosed={changeOperatingClosed}
        changeOperatingTime={changeOperatingTime}
      />
    </div>
  )
}
