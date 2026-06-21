import {
  COLLABORATION_FEATURES,
  COMMUNICATION_FEATURES,
  MANAGEMENT_FEATURES,
  PRODUCTIVITY_FEATURES,
} from "./landing-main.data"
import {
  CollaborationFeatureCard,
  CommunicationFeatureCard,
  ManagementFeatureCard,
  ProductivityFeatureCard,
} from "./FeatureCards"

export function CommunicationFeaturesSection() {
  return (
    <section
      id="features"
      className="relative container mx-auto flex flex-col items-center gap-10 px-6 py-14 md:py-[72px]"
    >
      <div className="flex flex-col items-center gap-3 self-center">
        <h3 className="flex min-h-7 items-center justify-center gap-2 rounded-full bg-[--surface-secondary] px-3.5 pb-px text-sm font-medium text-[--text-tertiary] md:text-base dark:bg-[--dark-surface-secondary] dark:text-[--dark-text-tertiary]">
          Hệ sinh thái
        </h3>
        <div className="flex max-w-[800px] flex-col items-center justify-center gap-1 self-center [&>*]:text-center [&>*]:text-3xl [&>*]:font-medium [&>*]:text-pretty md:[&>*]:text-4xl">
          <h4>Báo Cáo Phân Tích Thông Minh</h4>
        </div>
        <p className="max-w-screen-md text-center text-lg font-light text-pretty text-[--text-tertiary] md:text-xl dark:text-[--dark-text-tertiary]">
          Kiểm soát hiệu suất chặt chẽ của từng nhân viên cũng như từng cửa
          hàng. Giảm thiểu tỷ lệ sai sót đơn hàng và theo dõi lợi nhuận chính
          xác.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        {COMMUNICATION_FEATURES.map((feature) => (
          <CommunicationFeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </section>
  )
}

export function ManagementFeaturesSection() {
  return (
    <section className="relative container mx-auto flex flex-col items-center gap-10 px-6 py-14 md:py-[72px]">
      <div className="flex flex-col items-center gap-3 self-center">
        <h3 className="flex min-h-7 items-center justify-center gap-2 rounded-full bg-[--surface-secondary] px-3.5 pb-px text-sm font-medium text-[--text-tertiary] md:text-base dark:bg-[--dark-surface-secondary] dark:text-[--dark-text-tertiary]">
          Trọng tâm
        </h3>
        <div className="flex max-w-[800px] flex-col items-center justify-center gap-1 self-center [&>*]:text-center [&>*]:text-3xl [&>*]:font-medium [&>*]:text-pretty md:[&>*]:text-4xl">
          <h4 title="Quản Lý Chuyên Sâu">Giải Pháp Khép Kín</h4>
        </div>
        <p className="max-w-screen-md text-center text-lg font-light text-pretty text-[--text-tertiary] md:text-xl dark:text-[--dark-text-tertiary]">
          Liên kết hoàn hảo giữa khu phục vụ (điểm bán hàng) và hệ thống điều
          hành (trung tâm) với khả năng truy cập thời gian thực.
        </p>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
        {MANAGEMENT_FEATURES.map((feature) => (
          <ManagementFeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
      <div className="flex items-center justify-center gap-3 md:order-3">
        <a
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-full border-[--accent-600] bg-[--accent-500] px-5 text-sm font-normal text-[--text-on-accent-primary] ring-[--control] outline-hidden outline-0 hover:bg-[--accent-600] focus-visible:ring-2 md:h-10 md:text-base"
          href="/auth/register"
        >
          Đăng ký dùng thử
        </a>
        <a
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-full border border-[--border] bg-[--surface-secondary] px-5 text-sm font-normal text-[--text-primary] ring-[--control] outline-hidden outline-0 hover:bg-[--surface-tertiary] focus-visible:ring-2 md:h-10 md:text-base dark:border-[--dark-border] dark:bg-[--dark-surface-secondary] dark:text-[--dark-text-primary] dark:hover:bg-[--dark-surface-tertiary]"
          href="#features"
        >
          Xem thêm
        </a>
      </div>
    </section>
  )
}

export function PerformanceCalloutSection() {
  return (
    <section className="relative container mx-auto flex flex-col items-center gap-10 px-6 py-14 md:py-[72px]">
      <article className="flex flex-col justify-center gap-9 self-stretch rounded-xl bg-[rgba(var(--accent-500),0.1)] p-6 lg:flex-row lg:justify-between lg:p-10 dark:bg-[rgba(var(--accent-600),0.1)]">
        <div className="flex flex-col gap-2">
          <h4 className="text-3xl font-medium text-[--text-primary] lg:text-4xl dark:text-[--dark-text-primary]">
            Đẩy mạnh hiệu suất nhà hàng của bạn với OmniDine
          </h4>
          <p className="text-lg text-[--text-secondary] lg:text-xl dark:text-[--dark-text-secondary]">
            Xoá bỏ hoàn toàn điểm nghẽn bằng nghiệp vụ quản lý hiện đại.
          </p>
        </div>
        <div className="grid grid-cols-2 items-center gap-2 md:flex lg:flex-col">
          <a
            className="inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-full border-[--accent-600] bg-[--accent-500] px-3.5 text-sm font-normal text-[--text-on-accent-primary] ring-[--control] outline-hidden outline-0 hover:bg-[--accent-600] focus-visible:ring-2 md:px-5"
            href="/auth/register"
          >
            Đăng ký
          </a>
          <a
            className="inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-full border border-[--border] bg-[--surface-secondary] px-3.5 text-sm font-normal text-[--text-primary] ring-[--control] outline-hidden outline-0 hover:bg-[--surface-tertiary] focus-visible:ring-2 md:px-5 dark:border-[--dark-border] dark:bg-[--dark-surface-secondary] dark:text-[--dark-text-primary] dark:hover:bg-[--dark-surface-tertiary]"
            href="#support"
          >
            Hỗ trợ
          </a>
        </div>
      </article>
    </section>
  )
}

export function CollaborationSection() {
  return (
    <section className="relative container mx-auto flex flex-col items-center gap-10 px-6 py-14 md:py-[72px]">
      <img
        alt="A group of people with speech bubbles above them"
        className="sf-hidden block hidden rounded-xl border border-[--border] md:order-3 md:w-full dark:block dark:border-[--dark-border]"
        data-nimg={1}
        decoding="async"
        height={600}
        loading="lazy"
        src="data:,"
        style={{ color: "transparent" }}
        width={1216}
      />
      <img
        alt="A group of people with speech bubbles above them"
        className="block rounded-xl border border-[--border] md:order-3 md:w-full dark:hidden dark:border-[--dark-border]"
        data-nimg={1}
        decoding="async"
        height={600}
        loading="lazy"
        src="/assets/home/landing-banner.webp"
        style={{ color: "transparent" }}
        width={1216}
      />
      <div className="flex flex-col items-center gap-3 self-center">
        <h3 className="flex min-h-7 items-center justify-center gap-2 rounded-full bg-[--surface-secondary] px-3.5 pb-px text-sm font-medium text-[--text-tertiary] md:text-base dark:bg-[--dark-surface-secondary] dark:text-[--dark-text-tertiary]">
          Tự Lập Trình Và Dễ Dàng Đồng Bộ
        </h3>
        <div className="flex max-w-[800px] flex-col items-center justify-center gap-1 self-center [&>*]:text-center [&>*]:text-3xl [&>*]:font-medium [&>*]:text-pretty md:[&>*]:text-4xl">
          <h4 title="Khả Năng Vận Hành Xuyên Suốt">
            Khả Năng Vận Hành Xuyên Suốt
          </h4>
        </div>
        <p className="max-w-screen-md text-center text-lg font-light text-pretty text-[--text-tertiary] md:text-xl dark:text-[--dark-text-tertiary]">
          Được trang bị hàng loạt các công cụ làm việc nhóm, chia sẻ dữ liệu và
          lưu trữ các file giúp duy trì sự liên tục mượt mà từ lúc nhận cho đến
          khi phát hành sản phẩm.
        </p>
      </div>
      <div className="flex w-full flex-col items-start gap-4 md:order-2 md:grid md:grid-cols-3 md:gap-16">
        {COLLABORATION_FEATURES.map((feature) => (
          <CollaborationFeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </section>
  )
}

export function ProductivitySection() {
  return (
    <section className="relative flex flex-col items-center gap-10 py-14 md:py-[72px] lg:container lg:mx-auto lg:!flex-row lg:gap-0 lg:p-28">
      <div className="relative top-0 container mx-auto shrink self-stretch px-6 lg:w-1/2 lg:pr-12 lg:pl-0 xl:pr-20">
        <div className="sticky top-[calc(var(--header-height)+40px)] bottom-0 flex flex-col gap-10">
          <div className="flex flex-col items-start gap-3 self-start">
            <h3 className="flex min-h-7 items-center justify-center gap-2 rounded-full bg-[--surface-secondary] px-3.5 pb-px text-sm font-medium text-[--text-tertiary] md:text-base dark:bg-[--dark-surface-secondary] dark:text-[--dark-text-tertiary]">
              Hiệu Suất
            </h3>
            <div className="flex max-w-[800px] flex-col items-start justify-center gap-1 self-start [&>*]:text-left [&>*]:text-3xl [&>*]:font-medium [&>*]:text-pretty md:[&>*]:text-4xl">
              <h4 title="Tối ưu luồng công việc">Tối ưu luồng công việc</h4>
            </div>
            <p className="max-w-screen-md text-left text-lg font-light text-pretty text-[--text-tertiary] md:text-xl dark:text-[--dark-text-tertiary]">
              Hỗ trợ đội ngũ nhân viên duy trì tốc độ và làm việc liền mạch khi
              xử lý hàng trăm đơn hàng một cách nhanh chóng.
            </p>
          </div>
          <div className="flex items-center gap-3 md:order-3">
            <a
              className="inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-full border-[--accent-600] bg-[--accent-500] px-5 text-sm font-normal text-[--text-on-accent-primary] ring-[--control] outline-hidden outline-0 hover:bg-[--accent-600] focus-visible:ring-2 md:h-10 md:text-base"
              href="/public/restaurants"
            >
              Trải nghiệm
            </a>
            <a
              className="inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-full border border-[--border] bg-[--surface-secondary] px-5 text-sm font-normal text-[--text-primary] ring-[--control] outline-hidden outline-0 hover:bg-[--surface-tertiary] focus-visible:ring-2 md:h-10 md:text-base dark:border-[--dark-border] dark:bg-[--dark-surface-secondary] dark:text-[--dark-text-primary] dark:hover:bg-[--dark-surface-tertiary]"
              href="#features"
            >
              Chi tiết
            </a>
          </div>
        </div>
      </div>
      <div className="w-full flex-1 shrink-0 lg:w-1/2 lg:flex-1">
        <div className="no-scrollbar flex gap-10 overflow-auto px-6 lg:flex-col lg:px-0">
          {PRODUCTIVITY_FEATURES.map((feature) => (
            <ProductivityFeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function FinalCalloutSection() {
  return (
    <section className="relative container mx-auto flex flex-col items-center gap-10 px-6 py-14 md:py-[72px]">
      <article className="relative flex flex-col items-center justify-center gap-9 self-stretch overflow-hidden rounded-xl border border-[--border] bg-[--surface-secondary] p-6 dark:border-[--dark-border] dark:bg-[--dark-surface-secondary]">
        <div className="callout-1-module__wLojUq__line absolute top-10 left-0 h-px w-full bg-linear-to-l from-black/40 to-transparent dark:from-white/40 dark:to-transparent"></div>
        <div className="callout-1-module__wLojUq__line absolute bottom-[72px] left-0 h-px w-full bg-linear-to-l from-black/40 to-transparent dark:from-white/40 dark:to-transparent"></div>
        <div className="callout-1-module__wLojUq__line absolute bottom-7 left-0 h-px w-full bg-linear-to-l from-black/40 to-transparent dark:from-white/40 dark:to-transparent"></div>
        <div className="absolute top-0 left-0 z-10 h-full w-full bg-[--surface-secondary] blur-3xl filter dark:bg-[--dark-surface-secondary]"></div>
        <div className="relative z-20 flex flex-col items-center gap-2 text-center">
          <h4 className="text-center text-3xl font-medium tracking-tighter text-[--text-primary] sm:max-w-full sm:px-0 md:text-4xl dark:text-[--dark-text-primary]">
            Đẩy mạnh hiệu suất nhà hàng cùng OmniDine
          </h4>
          <p className="text-lg text-[--text-secondary] md:text-xl dark:text-[--dark-text-secondary]">
            Mọi tính năng mạnh mẽ được hội tụ trong một hệ thống vận hành.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-2">
          <a
            className="inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-full border-[--accent-600] bg-[--accent-500] px-3.5 text-sm font-normal text-[--text-on-accent-primary] ring-[--control] outline-hidden outline-0 hover:bg-[--accent-600] focus-visible:ring-2 md:px-5"
            href="/auth/register"
          >
            Đăng ký
          </a>
          <a
            className="inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-full border border-[--border] bg-[--surface-secondary] px-3.5 text-sm font-normal text-[--text-primary] ring-[--control] outline-hidden outline-0 hover:bg-[--surface-tertiary] focus-visible:ring-2 md:px-5 dark:border-[--dark-border] dark:bg-[--dark-surface-secondary] dark:text-[--dark-text-primary] dark:hover:bg-[--dark-surface-tertiary]"
            href="#features"
          >
            Tìm hiểu thêm
          </a>
        </div>
      </article>
    </section>
  )
}
