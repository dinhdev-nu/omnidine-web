import { AUTH_ROUTE_PATHS } from "@/features/auth/constants"
import { SETTINGS_DEFAULT_PATH } from "@/routes/settings-route-config"
import { useAuthStore } from "@/stores/auth-store"

export default function LandingHeader() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const trialHref = accessToken
    ? SETTINGS_DEFAULT_PATH
    : AUTH_ROUTE_PATHS.register

  return (
    <>
      <header className="sticky top-0 left-0 z-[110] flex w-full flex-col border-b border-[--border] bg-[--surface-primary] dark:border-[--dark-border] dark:bg-[--dark-surface-primary]">
        <div className="flex h-[--header-height] bg-[--surface-primary] dark:bg-[--dark-surface-primary]">
          <div className="container mx-auto grid w-full grid-cols-[1fr_max-content_1fr] place-items-center content-center items-center px-6 *:first:justify-self-start">
            <a
              className="flex shrink-0 items-center gap-1 rounded-full font-normal ring-[--control] ring-offset-2 outline-hidden outline-0 focus-visible:ring-2"
              href="/"
            >
              <img
                alt="Logo"
                className="sf-hidden hidden h-6 w-auto max-w-[200px] object-contain dark:block"
                data-nimg={1}
                decoding="async"
                height={20}
                src="data:,"
                style={{ color: "transparent", aspectRatio: "101/20" }}
                width={101}
              />
              <img
                alt="logo"
                className="h-6 w-auto max-w-[200px] object-contain dark:hidden"
                data-nimg={1}
                decoding="async"
                height={20}
                src="/assets/home/brand-logo.png"
                style={{ color: "transparent", aspectRatio: "101/20" }}
                width={101}
              />
            </a>
            <nav
              aria-label="Main"
              className="relative z-1 hidden flex-col justify-center lg:flex"
              data-orientation="horizontal"
              dir="ltr"
            >
              <div style={{ position: "relative" }}>
                <ul
                  className="flex flex-1 gap-0.5 px-4"
                  data-orientation="horizontal"
                  dir="ltr"
                >
                  <li className="relative items-center gap-0.5">
                    <button
                      type="button"
                      aria-controls="radix-_r_0_-content-radix-_r_1_"
                      aria-expanded="false"
                      className="inline-flex shrink-0 items-center gap-1 rounded-full pr-2 pb-px pl-3 font-normal tracking-tight ring-[--control] outline-hidden outline-0 hover:bg-[--surface-tertiary] focus-visible:ring-2 lg:h-7 dark:hover:bg-[--dark-surface-tertiary]"
                      data-radix-collection-item=""
                      data-state="closed"
                      id="radix-_r_0_-trigger-radix-_r_1_"
                    >
                      <span className="cursor-default">Tính năng</span>
                      <svg
                        className="text-[--text-tertiary] dark:text-[--dark-text-tertiary]"
                        fill="none"
                        height={15}
                        viewBox="0 0 15 15"
                        width={15}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M3.14 6.16C3.32 5.96 3.64 5.95 3.84 6.14L7.5 9.56L11.16 6.14C11.36 5.95 11.68 5.96 11.86 6.16C12.05 6.36 12.04 6.68 11.84 6.86L7.84 10.61C7.65 10.8 7.35 10.8 7.16 10.61L3.16 6.86C2.96 6.68 2.95 6.36 3.14 6.16Z"
                          fill="currentColor"
                          fillRule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </li>
                  <li>
                    <a
                      className="inline-flex h-6 shrink-0 items-center justify-center gap-1 rounded-full px-3 pb-px font-normal tracking-tight ring-[--control] outline-hidden outline-0 hover:bg-[--surface-tertiary] focus-visible:ring-2 lg:h-7 dark:hover:bg-[--dark-surface-tertiary]"
                      data-radix-collection-item=""
                      href="/#pricing"
                    >
                      Bảng Giá
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
            <div className="hidden items-center gap-2 !justify-self-end lg:flex">
              <a
                className="inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-full border border-[--border] bg-[--surface-secondary] !px-3.5 px-3.5 text-sm font-normal text-[--text-primary] ring-[--control] outline-hidden outline-0 hover:bg-[--surface-tertiary] focus-visible:ring-2 md:px-5 dark:border-[--dark-border] dark:bg-[--dark-surface-secondary] dark:text-[--dark-text-primary] dark:hover:bg-[--dark-surface-tertiary]"
                href={AUTH_ROUTE_PATHS.login}
              >
                Đăng Nhập
              </a>
              <a
                className="inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-full border-[--accent-600] bg-[--accent-500] !px-3.5 px-3.5 text-sm font-normal text-[--text-on-accent-primary] ring-[--control] outline-hidden outline-0 hover:bg-[--accent-600] focus-visible:ring-2 md:px-5"
                href={trialHref}
              >
                Dùng Thử Miễn Phí
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
