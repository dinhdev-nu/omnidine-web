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
        question:
            "Hệ thống có hỗ trợ tuỳ chỉnh thêm tính năng riêng không?",
        answer:
            "Có. Đối với Gói Chuỗi (Enterprise), chúng tôi cung cấp giải pháp tuỳ biến nghiệp vụ sâu sát theo quy trình kiểm soát và quản lý riêng của doanh nghiệp.",
    },
    {
        question:
            "Quy trình hỗ trợ xử lý kỹ thuật diễn ra như thế nào?",
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
                d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
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
            className="z-10 inline-flex h-9 w-full shrink-0 items-center justify-center gap-1 rounded-full border border-[--border] bg-[--surface-secondary] px-5 text-sm font-normal text-[--text-primary] ring-[--control] outline-hidden outline-0 hover:bg-[--surface-tertiary] focus-visible:ring-2 md:h-10 md:text-base dark:border-[--dark-border] dark:bg-[--dark-surface-secondary] dark:text-[--dark-text-primary] dark:hover:bg-[--dark-surface-tertiary]"
            href={href}
        >
            Bắt đầu ngay
        </a>
    )
}

function AccentPlanCta({ href }: { href: string }) {
    return (
        <a
            className="z-10 inline-flex h-9 w-full shrink-0 items-center justify-center gap-1 rounded-full border-[--accent-600] bg-[--accent-500] px-5 text-sm font-normal text-[--text-on-accent-primary] ring-[--control] outline-hidden outline-0 hover:bg-[--accent-600] focus-visible:ring-2 md:h-10 md:text-base"
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
                    d="M-41 398C-41 371.998 -35.9174 346.251 -26.0424 322.229C-16.1673 298.206 -1.69321 276.379 16.5535 257.993C34.8002 239.607 56.4622 225.022 80.3027 215.072C104.143 205.121 129.695 200 155.5 200C181.305 200 206.857 205.121 230.697 215.072C254.538 225.022 276.2 239.607 294.446 257.993C312.693 276.379 327.167 298.206 337.042 322.229C346.917 346.251 352 371.998 352 398L-41 398Z"
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
                className="relative container mx-auto flex flex-col items-center gap-10 px-6 py-14 md:py-[72px] xl:max-w-screen-xl"
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

            <section className="relative container mx-auto flex flex-col items-center gap-10 px-6 py-14 md:py-[72px]">
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
