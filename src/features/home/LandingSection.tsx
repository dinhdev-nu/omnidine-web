import type { ReactNode } from "react"

type SectionHeadingProps = {
  badge: string
  title: string
  titleHint: string
  description: string
}

type PricingPlanBase = {
  price: string
  name: string
  billing: string
  features: string[]
  ctaHref: string
}

type StandardPricingPlan = PricingPlanBase & {
  variant: "standard"
}

type PopularPricingPlan = PricingPlanBase & {
  variant: "popular"
  badge: string
}

type PricingPlan = StandardPricingPlan | PopularPricingPlan

type FaqEntry = {
  question: string
  answer: string
}

const PRICING_PLANS: PricingPlan[] = [
  {
    variant: "standard",
    price: "Miễn phí",
    name: "Gói Trải nghiệm",
    billing: "Dùng thử 14 ngày",
    features: [
      "Quản lý 1 điểm bán hàng.",
      "Tối đa 5 tài khoản nhân viên.",
      "Thiết lập Menu điện tử (QR).",
      "Báo cáo thống kê cơ bản.",
      "Hỗ trợ kỹ thuật giờ hành chính.",
    ],
    ctaHref: "/auth/register",
  },
  {
    variant: "popular",
    badge: "Phổ biến",
    price: "499.000đ/tháng",
    name: "Gói Tiêu chuẩn",
    billing: "Thanh toán hàng năm",
    features: [
      "Quản lý tối đa 3 chi nhánh.",
      "Không giới hạn tài khoản nhân viên.",
      "Tích hợp màn hình bếp (KDS).",
      "Báo cáo phân tích chuyên sâu.",
      "Hỗ trợ kỹ thuật ưu tiên 24/7.",
    ],
    ctaHref: "/auth/register",
  },
  {
    variant: "standard",
    price: "Liên hệ",
    name: "Gói Chuỗi (Enterprise)",
    billing: "Thanh toán theo hợp đồng",
    features: [
      "Quản lý không giới hạn chi nhánh.",
      "Tùy chỉnh luồng nghiệp vụ riêng biệt.",
      "Tích hợp ERP & phần mềm bên thứ 3.",
      "Phân tích dữ liệu bằng AI.",
      "Cam kết hỗ trợ giải quyết sự cố 24/7.",
    ],
    ctaHref: "/auth/register",
  },
]

const FAQS: FaqEntry[] = [
  {
    question: "Hệ thống OmniDine phù hợp với mô hình nhà hàng nào?",
    answer:
      "OmniDine được thiết kế linh hoạt để đáp ứng từ nhà hàng, quán ăn gia đình đơn lẻ đến hệ thống chuỗi nhà hàng lớn nhiều chi nhánh, cũng như quán cafe - trà sữa.",
  },
  {
    question: "Dữ liệu kinh doanh có được bảo mật không?",
    answer:
      "Hoàn toàn bảo mật. Chúng tôi sử dụng tiêu chuẩn bảo mật điện toán đám mây cao nhất, mã hoá dữ liệu đầu cuối. Dữ liệu của bạn được sao lưu định kỳ và an toàn tuyệt đối.",
  },
  {
    question: "Hệ thống có hỗ trợ tuỳ chỉnh thêm tính năng riêng không?",
    answer:
      "Có. Đối với Gói Chuỗi (Enterprise), chúng tôi cung cấp giải pháp tuỳ biến nghiệp vụ sâu sát theo quy trình kiểm soát và quản lý riêng của doanh nghiệp.",
  },
  {
    question: "Quy trình hỗ trợ xử lý kỹ thuật diễn ra như thế nào?",
    answer:
      "Chúng tôi hỗ trợ liên tục qua nhiều kênh (Zalo, Hotline, Email). Đội ngũ kỹ thuật 24/7 (với các gói từ Tiêu chuẩn) sẽ tiếp nhận và xử lý sự cố trong vòng tối đa 30 phút.",
  },
  {
    question: "Tôi cần làm gì để bắt đầu dùng thử?",
    answer:
      "Rất đơn giản! Chỉ cần nhấn vào nút Đăng ký, làm theo hướng dẫn trong 3 bước để khởi tạo nhà hàng đầu tiên và hệ thống sẽ mở ra giao diện để bạn thiết lập Menu.",
  },
]

function SectionHeading({
  badge,
  title,
  titleHint,
  description,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col items-center gap-3 self-center">
      <h3 className="flex min-h-7 items-center justify-center gap-2 rounded-full bg-[--surface-secondary] px-3.5 pb-px text-sm font-medium text-[--text-tertiary] md:text-base dark:bg-[--dark-surface-secondary] dark:text-[--dark-text-tertiary]">
        {badge}
      </h3>
      <div className="flex max-w-[800px] flex-col items-center justify-center gap-1 self-center [&>*]:text-center [&>*]:text-3xl [&>*]:font-medium [&>*]:text-pretty md:[&>*]:text-4xl">
        <h4 title={titleHint}>{title}</h4>
      </div>
      <p className="max-w-screen-md text-center text-lg font-light text-pretty text-[--text-tertiary] md:text-xl dark:text-[--dark-text-tertiary]">
        {description}
      </p>
    </div>
  )
}

function FeatureCheckIcon() {
  return (
    <svg
      className="mt-0.5 size-4 shrink-0 lg:size-5"
      fill="none"
      height={15}
      viewBox="0 0 15 15"
      width={15}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M11.47 3.73C11.76 3.92 11.84 4.3 11.65 4.59L7.4 11.09C7.3 11.25 7.14 11.35 6.95 11.37C6.77 11.39 6.59 11.34 6.45 11.21L3.7 8.71C3.45 8.48 3.43 8.08 3.66 7.83C3.89 7.57 4.29 7.56 4.55 7.79L6.75 9.79L10.6 3.91C10.79 3.62 11.18 3.54 11.47 3.73Z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
    </svg>
  )
}

function PlanFeatureList({ features }: { features: string[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {features.map((feature) => (
        <li
          key={feature}
          className="flex items-start gap-3 text-sm text-[--text-secondary] lg:text-base dark:text-[--dark-text-secondary]"
        >
          <FeatureCheckIcon />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  )
}

function PricingCard({ children }: { children: ReactNode }) {
  return (
    <article className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-[--border] dark:border-[--dark-border]">
      {children}
    </article>
  )
}

function PricingCardHeader({
  children,
  price,
  planName,
  billing,
}: {
  children?: ReactNode
  price: string
  planName: string
  billing: string
}) {
  return (
    <header className="flex flex-col gap-4 px-8 pt-10 pb-0">
      {children}
      <span className="text-center text-3xl font-medium lg:text-4xl">
        {price}
      </span>
      <div className="flex flex-col">
        <h5 className="text-center text-lg font-medium lg:text-xl">
          {planName}
        </h5>
        <p className="text-center text-sm text-[--text-tertiary] lg:text-base dark:text-[--dark-text-tertiary]">
          {billing}
        </p>
      </div>
    </header>
  )
}

function PricingCardBody({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 !pb-12 lg:p-8">
      {children}
    </div>
  )
}

function PricingCardFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="relative flex w-full items-center self-stretch p-8 pt-0">
      {children}
    </footer>
  )
}

function DefaultPlanCta({ href }: { href: string }) {
  return (
    <a
      className="z-10 inline-flex h-11 w-full shrink-0 items-center justify-center gap-1 rounded-full border border-[--border] bg-[--surface-secondary] px-5 text-sm font-normal text-[--text-primary] ring-[--control] outline-hidden outline-0 hover:bg-[--surface-tertiary] focus-visible:ring-2 md:text-base dark:border-[--dark-border] dark:bg-[--dark-surface-secondary] dark:text-[--dark-text-primary] dark:hover:bg-[--dark-surface-tertiary]"
      href={href}
    >
      Bắt đầu ngay
    </a>
  )
}

function AccentPlanCta({ href }: { href: string }) {
  return (
    <a
      className="z-10 inline-flex h-11 w-full shrink-0 items-center justify-center gap-1 rounded-full border-[--accent-600] bg-[--accent-500] px-5 text-sm font-normal text-[--text-on-accent-primary] ring-[--control] outline-hidden outline-0 hover:bg-[--accent-600] focus-visible:ring-2 md:text-base"
      href={href}
    >
      Đăng ký dùng thử
    </a>
  )
}

function PopularPlanGlow() {
  return (
    <svg
      className="pointer-events-none absolute top-0 left-0 h-full w-full origin-bottom scale-[2.0] text-[--accent-500]"
      fill="none"
      viewBox="0 0 312 175"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_6956_27669)">
        <path
          d="M-41 398C-41 372 -35.92 346.25 -26.04 322.23C-16.17 298.21 -1.69 276.38 16.55 257.99C34.8 239.61 56.46 225.02 80.3 215.07C104.14 205.12 129.69 200 155.5 200C181.31 200 206.86 205.12 230.7 215.07C254.54 225.02 276.2 239.61 294.45 257.99C312.69 276.38 327.17 298.21 337.04 322.23C346.92 346.25 352 372 352 398L-41 398Z"
          fill="currentColor"
        ></path>
      </g>
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height={598}
          id="filter0_f_6956_27669"
          width={793}
          x={-241}
          y={0}
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix"></feFlood>
          <feBlend
            in="SourceGraphic"
            in2="BackgroundImageFix"
            mode="normal"
            result="shape"
          ></feBlend>
          <feGaussianBlur
            result="effect1_foregroundBlur_6956_27669"
            stdDeviation={100}
          ></feGaussianBlur>
        </filter>
      </defs>
    </svg>
  )
}

function StandardPricingCard({ plan }: { plan: StandardPricingPlan }) {
  return (
    <PricingCard>
      <PricingCardHeader
        price={plan.price}
        planName={plan.name}
        billing={plan.billing}
      />
      <PricingCardBody>
        <PlanFeatureList features={plan.features} />
      </PricingCardBody>
      <PricingCardFooter>
        <DefaultPlanCta href={plan.ctaHref} />
      </PricingCardFooter>
    </PricingCard>
  )
}

function PopularPricingCard({ plan }: { plan: PopularPricingPlan }) {
  return (
    <PricingCard>
      <PricingCardHeader
        price={plan.price}
        planName={plan.name}
        billing={plan.billing}
      >
        <span className="absolute top-4 left-1/2 -translate-x-1/2 bg-[--surface-primary] text-center text-xs font-medium text-[--accent-500] lg:text-sm dark:bg-[--dark-surface-primary]">
          {plan.badge}
        </span>
      </PricingCardHeader>
      <PricingCardBody>
        <PlanFeatureList features={plan.features} />
      </PricingCardBody>
      <PricingCardFooter>
        <PopularPlanGlow />
        <AccentPlanCta href={plan.ctaHref} />
      </PricingCardFooter>
    </PricingCard>
  )
}

function FaqItem({ question, answer }: FaqEntry) {
  return (
    <li className="flex flex-col gap-1.5">
      <p className="leading-relaxed font-medium tracking-tighter sm:text-lg">
        {question}
      </p>
      <p className="text-sm leading-relaxed tracking-tight text-[--text-tertiary] sm:text-base dark:text-[--dark-text-tertiary]">
        {answer}
      </p>
    </li>
  )
}

export default function LandingSection() {
  return (
    <>
      <section
        className="relative container mx-auto flex scroll-mt-20 flex-col items-center gap-10 px-6 py-14 md:py-[72px] xl:max-w-screen-xl"
        id="pricing"
      >
        <SectionHeading
          badge="Vượt Trội"
          title="Bảng giá đơn giản. Công cụ mạnh mẽ."
          titleHint="Bảng giá đơn giản. Công cụ mạnh mẽ."
          description="Cơ hội để đẩy nhanh tiến độ làm việc nhóm với các gói cước có sẵn."
        />
        <div className="flex flex-col gap-5 self-stretch lg:flex-row">
          {PRICING_PLANS.map((plan) => {
            if (plan.variant === "popular") {
              return <PopularPricingCard key={plan.name} plan={plan} />
            }

            return <StandardPricingCard key={plan.name} plan={plan} />
          })}
        </div>
      </section>

      <section
        id="support"
        className="relative container mx-auto flex scroll-mt-20 flex-col items-center gap-10 px-6 py-14 md:py-[72px]"
      >
        <SectionHeading
          badge="Câu hỏi thường gặp"
          title="Giải đáp các thắc mắc chung"
          titleHint="Giải đáp các thắc mắc chung"
          description="Lắng nghe tư vấn và hỗ trợ từ đội ngũ OmniDine."
        />
        <ul className="mx-auto flex w-full grid-cols-3 flex-col place-content-start items-start gap-8 self-stretch lg:grid lg:gap-14 lg:px-24">
          {FAQS.map((faq) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
          {Array.from({ length: 4 }).map((_, idx) => (
            <p key={`faq-placeholder-${idx}`} />
          ))}
        </ul>
      </section>
    </>
  )
}
