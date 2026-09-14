import { MenuIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AUTH_ROUTE_PATHS } from "@/features/auth/constants"
import { SETTINGS_DEFAULT_PATH } from "@/routes/settings-route-config"
import { useAuthStore } from "@/stores/auth-store"

const navigationLinks = [
  { label: "Tính năng", href: "/#features" },
  { label: "Bảng Giá", href: "/#pricing" },
]

export default function LandingHeader() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const trialHref = accessToken
    ? SETTINGS_DEFAULT_PATH
    : AUTH_ROUTE_PATHS.register

  return (
    <header className="sticky top-0 left-0 z-[110] flex w-full flex-col border-b border-[--border] bg-[--surface-primary] dark:border-[--dark-border] dark:bg-[--dark-surface-primary]">
      <div className="flex h-[--header-height] bg-[--surface-primary] dark:bg-[--dark-surface-primary]">
        <div className="container mx-auto flex w-full items-center justify-between px-4 sm:px-6 lg:grid lg:grid-cols-[1fr_max-content_1fr] lg:place-items-center lg:content-center">
          <a
            aria-label="Trang chủ OmniDine"
            className="flex min-h-11 shrink-0 items-center gap-1 rounded-full font-normal ring-[--control] ring-offset-2 outline-hidden outline-0 focus-visible:ring-2 lg:justify-self-start"
            href="/"
          >
            <img
              alt="OmniDine"
              className="h-6 w-auto max-w-[200px] object-contain dark:invert"
              decoding="async"
              height={20}
              src="/assets/home/brand-logo.png"
              width={121}
            />
          </a>

          <nav
            aria-label="Điều hướng chính"
            className="relative z-1 hidden justify-center lg:flex"
          >
            <ul className="flex flex-1 gap-0.5 px-4">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <a
                    className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1 rounded-full px-3 font-normal tracking-tight ring-[--control] outline-hidden outline-0 hover:bg-[--surface-tertiary] focus-visible:ring-2 dark:hover:bg-[--dark-surface-tertiary]"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-2 !justify-self-end lg:flex">
            <a
              className="inline-flex h-11 shrink-0 items-center justify-center gap-1 rounded-full border border-[--border] bg-[--surface-secondary] px-3.5 text-sm font-normal text-[--text-primary] ring-[--control] outline-hidden outline-0 hover:bg-[--surface-tertiary] focus-visible:ring-2 md:px-5 dark:border-[--dark-border] dark:bg-[--dark-surface-secondary] dark:text-[--dark-text-primary] dark:hover:bg-[--dark-surface-tertiary]"
              href={AUTH_ROUTE_PATHS.login}
            >
              Đăng Nhập
            </a>
            <a
              className="inline-flex h-11 shrink-0 items-center justify-center gap-1 rounded-full border-[--accent-600] bg-[--accent-500] px-3.5 text-sm font-normal text-[--text-on-accent-primary] ring-[--control] outline-hidden outline-0 hover:bg-[--accent-600] focus-visible:ring-2 md:px-5"
              href={trialHref}
            >
              Dùng Thử Miễn Phí
            </a>
          </div>

          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Mở menu điều hướng"
                  className="inline-flex size-11 touch-manipulation items-center justify-center rounded-full border border-[--border] bg-[--surface-secondary] text-[--text-primary] ring-[--control] outline-hidden outline-0 focus-visible:ring-2 dark:border-[--dark-border] dark:bg-[--dark-surface-secondary] dark:text-[--dark-text-primary]"
                >
                  <MenuIcon aria-hidden="true" className="size-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="z-[120] min-w-56 p-2 motion-reduce:animate-none motion-reduce:transition-none"
              >
                {navigationLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild className="min-h-11 px-3">
                    <a href={link.href}>{link.label}</a>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="min-h-11 px-3">
                  <a href={AUTH_ROUTE_PATHS.login}>Đăng Nhập</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="min-h-11 px-3 font-medium text-[--accent-500]">
                  <a href={trialHref}>Dùng Thử Miễn Phí</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
