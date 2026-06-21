import { COMPANY_LOGOS, HERO_AVATAR_SRCS } from "./landing-main.data"

export function LandingHeroSection() {
  return (
    <section className="relative min-h-[calc(630px-var(--header-height))] overflow-hidden pb-10">
      <div className="absolute top-0 left-0 z-0 grid h-full w-full grid-cols-[clamp(28px,10vw,120px)_auto_clamp(28px,10vw,120px)] border-b border-[--border] dark:border-[--dark-border]">
        <div className="col-span-1 flex h-full items-center justify-center"></div>
        <div className="col-span-1 flex h-full items-center justify-center border-x border-[--border] dark:border-[--dark-border]"></div>
        <div className="col-span-1 flex h-full items-center justify-center"></div>
      </div>
      <figure className="pointer-events-none absolute -bottom-[70%] left-1/2 z-0 block aspect-square w-[520px] -translate-x-1/2 rounded-full bg-[--accent-500-40] blur-[200px]"></figure>
      <figure className="pointer-events-none absolute top-[64px] left-[4vw] z-20 hidden aspect-square w-[32vw] rounded-full bg-[--surface-primary] opacity-50 blur-[100px] md:block dark:bg-[--dark-surface-primary]"></figure>
      <figure className="pointer-events-none absolute right-[7vw] bottom-[-50px] z-20 hidden aspect-square w-[30vw] rounded-full bg-[--surface-primary] opacity-50 blur-[100px] md:block dark:bg-[--dark-surface-primary]"></figure>
      <div className="relative z-10 flex flex-col divide-y divide-[--border] pt-[35px] dark:divide-[--dark-border]">
        <div className="flex flex-col items-center justify-end">
          <div className="flex items-center gap-2 !border !border-b-0 border-[--border] px-4 py-2 dark:border-[--dark-border]">
            <div className="flex -space-x-2 rtl:space-x-reverse">
              {HERO_AVATAR_SRCS.map((src) => (
                <img
                  key={src}
                  alt="Avatar"
                  className="size-7 shrink-0 rounded-full border-2 border-[--surface-primary] object-cover dark:border-[--dark-surface-primary]"
                  data-nimg={1}
                  decoding="async"
                  height={28}
                  src={src}
                  style={{ color: "transparent" }}
                  width={28}
                />
              ))}
            </div>
            <p className="text-sm tracking-tight text-[--text-tertiary] dark:text-[--dark-text-tertiary]">
              1,254 đối tác tin dùng
            </p>
          </div>
        </div>
        <div>
          <div className="mx-auto flex min-h-[288px] max-w-[80vw] shrink-0 flex-col items-center justify-center gap-2 px-2 py-4 sm:px-16 lg:px-24">
            <h1 className="!max-w-screen-lg text-center text-[clamp(32px,7vw,64px)] leading-none font-medium tracking-[-1.44px] text-pretty text-[--text-primary] md:tracking-[-2.16px] dark:text-[--dark-text-primary]">
              Quản Lý Chuỗi Nhà Hàng Đa Chi Nhánh
            </h1>
            <h2 className="text-md max-w-2xl text-center text-pretty text-[--text-tertiary] md:text-lg dark:text-[--dark-text-tertiary]">
              OmniDine là hệ thống quản lý chuyên nghiệp giúp bạn tự động hoá
              việc đặt món của khách hàng, chuẩn hoá quy trình phục vụ và nắm
              bắt báo cáo ngay tại thời gian thực.
            </h2>
          </div>
        </div>
        <div className="flex items-start justify-center px-8 sm:px-24">
          <div className="flex w-full max-w-[80vw] flex-col items-center justify-start md:!max-w-[392px]">
            <a
              className="max-w-sm:!border-x-0 flex inline-flex !h-14 h-8 w-full shrink-0 flex-col items-center justify-center gap-1 rounded-full rounded-none border !border-x !border-y-0 border-[--border] !bg-transparent bg-[--surface-secondary] px-3.5 !text-base text-sm font-normal text-[--text-primary] ring-[--control] outline-hidden outline-0 backdrop-blur-xl transition-colors duration-150 hover:!bg-black/5 hover:bg-[--surface-tertiary] focus-visible:ring-2 md:px-5 dark:border-[--dark-border] dark:bg-[--dark-surface-secondary] dark:text-[--dark-text-primary] dark:hover:!bg-white/5 dark:hover:bg-[--dark-surface-tertiary]"
              href="/auth/register"
            >
              Dùng Thử Ngay
            </a>
            <a
              className="flex inline-flex !h-14 h-8 w-full shrink-0 flex-col items-center justify-center gap-1 rounded-full rounded-none border-[--accent-600] bg-[--accent-500] px-3.5 !text-base text-sm font-normal text-[--text-on-accent-primary] ring-[--control] outline-hidden outline-0 hover:bg-[--accent-600] focus-visible:ring-2 md:px-5"
              href="/public/restaurants"
            >
              Trải Nghiệm Hệ Thống
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function CompanyLogosSection() {
  return (
    <section className="relative flex flex-col items-center gap-10 py-14 md:py-[72px]">
      <h2 className="text-center tracking-tight text-[--dark-text-tertiary] opacity-50">
        Các chuỗi nhà hàng đang dùng hệ thống
      </h2>
      <div className="no-scrollbar flex max-w-full justify-center overflow-auto">
        <div className="from-surface-primary dark:from-dark-surface-primary sf-hidden pointer-events-none absolute top-0 left-0 h-full w-[30vw] bg-transparent bg-linear-to-r xl:hidden"></div>
        <div className="from-surface-primary dark:from-dark-surface-primary sf-hidden pointer-events-none absolute top-0 right-0 h-full w-[30vw] bg-transparent bg-linear-to-l xl:hidden"></div>
        <div className="companies-module__fhyRlW__scrollbar flex shrink-0 items-center gap-4 px-6 lg:gap-6 lg:px-12">
          {COMPANY_LOGOS.map((logo) => (
            <figure
              key={logo.alt}
              className="flex h-16 items-center px-2 py-3 lg:p-4"
            >
              <img
                alt={logo.alt}
                className="w-24 lg:w-32"
                data-nimg={1}
                decoding="async"
                height={20}
                loading="lazy"
                src={logo.src}
                style={{ color: "transparent" }}
                width={32}
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
