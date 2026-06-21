function getRandomAvatarPlaceholder(): string {
  const variants = [
    "iVBORw0KGg.png",
    "iVBORw0KGg_2.png",
    "iVBORw0KGg_3.png",
    "iVBORw0KGg_4.png",
    "iVBORw0KGg_5.png",
  ]
  const idx = Math.floor(Math.random() * variants.length)
  return `/assets/home/${variants[idx]}`
}

type AvatarUser = {
  avatar_url?: string | null
  avatar?: string | null
  profileImage?: string | null
}

export function resolveUserAvatar(user: AvatarUser | null): string {
  return (
    (user?.avatar_url || user?.avatar || user?.profileImage) ??
    getRandomAvatarPlaceholder()
  )
}
