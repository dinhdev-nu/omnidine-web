import {
  ProfileDisplayOptionsCard,
  ProfileInfoCard,
  ProfileSaveActions,
  ProfileSocialLinksCard,
} from "./components/ProfileSectionCards"
import { useProfileSectionController } from "./hooks/useProfileSectionController"

export function ProfileSection() {
  const controller = useProfileSectionController()

  return (
    <div className="animate-in space-y-6 duration-300 motion-reduce:animate-none fade-in slide-in-from-bottom-2">
      <ProfileInfoCard controller={controller} />
      <ProfileSocialLinksCard controller={controller} />
      <ProfileDisplayOptionsCard controller={controller} />
      <ProfileSaveActions controller={controller} />
    </div>
  )
}
