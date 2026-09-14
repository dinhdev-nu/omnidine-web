import { toast } from "sonner"

export default function LandingNewsletter() {
  return (
    <>
      <section className="py-14 md:py-[72px] flex flex-col items-center gap-10 relative bg-[--surface-secondary] !py-10 dark:bg-[--dark-surface-secondary]">
        <div className="container mx-auto flex flex-col gap-4 px-6 lg:flex-row lg:justify-between">
          <div className="flex flex-1 flex-col items-start gap-1">
            <h5 className="text-xl font-medium lg:text-2xl">
              Nâng Tầm Quản Lý Với OmniDine
            </h5>
            <p className="text text-[--text-tertiary] dark:text-[--dark-text-tertiary] lg:text-lg">
              Tham gia bản tin của chúng tôi để nhận những tin tức đặc quyền và thông báo quan trọng nhất.
            </p>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              toast.info("Đăng ký bản tin hiện chưa khả dụng. Vui lòng thử lại sau.")
            }}
          >
            <div className="relative">
              <input
                className="h-11 w-full rounded-full border border-[--border] py-2 pr-24 pl-4 text-sm text-[--text-primary] outline-hidden placeholder:text-sm placeholder:text-[--text-tertiary] focus-visible:ring-2 focus-visible:ring-[--control] disabled:opacity-50 dark:border-[--dark-border] dark:text-[--dark-text-primary] dark:placeholder-[--dark-text-tertiary]"
                id="MTskZ6YnzTzluaWN1Nbuw"
                aria-label="Email"
                name="email"
                autoComplete="email"
                placeholder="john@gmail.com"
                required
                type="email"
                defaultValue=""
              />
              <button
                className="absolute top-0 right-0 inline-flex h-11 shrink-0 items-center justify-center gap-1 rounded-full border border-[--dark-border] bg-[--text-primary] px-4 text-sm font-normal text-[--surface-primary] ring-[--control] outline-hidden outline-0 transition-colors hover:bg-[--dark-surface-tertiary] focus-visible:ring-2 motion-reduce:transition-none peer-disabled:opacity-50 dark:border-[--border] dark:bg-[--dark-text-primary] dark:text-[--dark-surface-primary] dark:hover:bg-[--surface-tertiary]"
                type="submit"
                title="Đăng ký bản tin hiện chưa khả dụng"
              >
                Gửi
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
