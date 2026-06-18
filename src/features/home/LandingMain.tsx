import React from "react"

type Testimonial = {
  text: string
  name: string
  role: string
  avatarSrc: string
  companyAlt: string
  companySrc: string
  companyWidth: number
  avatarStyle?: React.CSSProperties
}

type CompanyLogo = {
  alt: string
  src: string
}

type CommunicationFeature = {
  imageSrc: string
  title: string
  description: string
  bullets: string[]
}

type IconFeature = {
  iconAlt: string
  iconSrc: string
  title: string
  description: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    text: "“Từ ngày dùng OmniDine để quản lý hệ thống bán hàng, mọi thông tin\ntừ quầy tính tiền lên bếp đều diễn ra cực kì chính xác và minh bạch.\nCửa hàng đạt hiệu suất cao với hàng trăm đơn đặt.”",
    name: "Emilia Trần",
    role: "Chủ thương hiệu, Cơm Tấm ABC",
    avatarSrc: "/assets/home/avatar-placeholder-3.png",
    companyAlt: "PinPoint",
    companySrc: "/assets/home/landing-icon-10.svg",
    companyWidth: 48,
  },
  {
    text: "“Chúng tôi kiểm soát mọi chi nhánh hiệu quả hơn rất nhiều.\nViệc quản lý nhân viên và báo cáo doanh thu tập trung về 1 màn hình\ngiúp theo dõi và phân tích chiến lược nhanh hơn bao giờ hết.”",
    name: "Bảo Phát",
    role: "Điều hành, Phở Phát Phát",
    avatarSrc: `/assets/home/avatar-placeholder-2.png`,
    companyAlt: "Hues",
    companySrc: `/assets/home/landing-icon-05.svg`,
    companyWidth: 48,
  },
  {
    text: "“Tương tác đặt hàng online mượt mà và menu số siêu việt.\nHệ thống này không chỉ nâng tầm tính chuyên nghiệp của cửa hàng\nmà còn tối ưu hoá dịch vụ khiến khách hàng rất hài lòng.”",
    name: "Rachel Kim",
    role: "Quản lý, Bếp chay Xinh",
    avatarSrc: `/assets/home/avatar-placeholder-1.png`,
    companyAlt: "Greenish",
    companySrc: `/assets/home/landing-icon-06.svg`,
    companyWidth: 48,
  },
]

const HERO_AVATAR_SRCS = [
  "/assets/home/avatar-placeholder-3.png",
  "/assets/home/avatar-placeholder-4.png",
  "/assets/home/avatar-placeholder-5.png",
]

const COMPANY_LOGOS: CompanyLogo[] = [
  { alt: "ProLine", src: "/assets/home/landing-icon-07.svg" },
  { alt: "Hues", src: "/assets/home/landing-icon-05.svg" },
  { alt: "Greenish", src: "/assets/home/landing-icon-06.svg" },
  { alt: "Cloud", src: "/assets/home/landing-icon-08.svg" },
  { alt: "Volume", src: "/assets/home/landing-icon-09.svg" },
  { alt: "PinPoint", src: "/assets/home/landing-icon-10.svg" },
]

const COMMUNICATION_FEATURES: CommunicationFeature[] = [
  {
    imageSrc: "/assets/home/landing-photo-1.jpg",
    title: "Quản Lý Đa Nhà Hàng Tập Trung",
    description:
      "Nền tảng của chúng tôi cung cấp giao diện quản lý thiết yếu để bạn kiểm soát tất cả cửa hàng từ một nơi. Theo dõi trạng thái, thực đơn và nhân viên dễ dàng.",
    bullets: [
      "Quản lý nhiều chi nhánh trong một hệ thống",
      "Giao diện trực quan, dễ theo dõi",
      "Phân quyền nhân viên theo cửa hàng",
    ],
  },
  {
    imageSrc: "/assets/home/landing-photo-2.jpg",
    title: "Menu Số & Đặt Món Trực Tuyến",
    description:
      "Hệ thống menu số tích hợp QR code cho phép khách hàng đặt món nhanh chóng. Dữ liệu được đồng bộ ngay tới bếp và điểm bán hàng.",
    bullets: [],
  },
  {
    imageSrc: "/assets/home/landing-photo-3.jpg",
    title: "Hệ Thống Dữ Liệu An Toàn",
    description:
      "Bảo vệ toàn vẹn dữ liệu doanh thu và thông tin khách hàng với hệ thống bảo mật đám mây đạt chuẩn, quy trình sao lưu liên tục.",
    bullets: [
      "Mã hóa dữ liệu đầu cuối",
      "Kiểm soát luồng thao tác an toàn",
      "Tuân thủ tiêu chuẩn thanh toán",
    ],
  },
]

const MANAGEMENT_FEATURES: IconFeature[] = [
  {
    iconAlt: "Menu",
    iconSrc: "/assets/home/landing-icon-11.svg",
    title: "Quản Lý Thực Đơn",
    description:
      "Cập nhật món ăn, hình ảnh, thay đổi giá theo từng chi nhánh nhanh chóng.",
  },
  {
    iconAlt: "Tables",
    iconSrc: "/assets/home/landing-icon-12.svg",
    title: "Quản Lý Bàn",
    description:
      "Giám sát tình trạng bàn ăn thực tế, hỗ trợ quá trình xếp bàn cho khách.",
  },
  {
    iconAlt: "Staff",
    iconSrc: "/assets/home/landing-icon-13.svg",
    title: "Quản Lý Nhân Viên",
    description:
      "Kiểm soát vai trò thành viên từ thu ngân đến quản lý hệ thống.",
  },
  {
    iconAlt: "Management",
    iconSrc: "/assets/home/landing-icon-14.svg",
    title: "Điểm Bán Hàng",
    description:
      "Tương tác mượt mà trong việc gọi và tính tiền mọi đơn hàng tại quầy.",
  },
  {
    iconAlt: "Đơn hàng",
    iconSrc: "/assets/home/landing-icon-15.svg",
    title: "Quản Lý Đơn Hàng",
    description:
      "Duy trì luồng xử lý đơn minh bạch từ lúc nhận yêu cầu đến khi phục vụ.",
  },
  {
    iconAlt: "Report",
    iconSrc: "/assets/home/landing-icon-16.svg",
    title: "Báo Cáo Thống Kê",
    description:
      "Kiểm soát hiệu suất nhà hàng qua dữ liệu về món bán chạy và doanh thu.",
  },
]

const COLLABORATION_FEATURES: IconFeature[] = [
  {
    iconAlt: "Tương tác thời gian thực",
    iconSrc: "/assets/home/landing-icon-11.svg",
    title: "Tương tác thời gian thực",
    description:
      "Tương tác giao việc liên quán tức thì để duy trì luồng làm việc cho nhân viên.",
  },
  {
    iconAlt: "Lưu giữ dữ liệu",
    iconSrc: "/assets/home/landing-icon-12.svg",
    title: "Lưu Giữ Dữ Liệu",
    description:
      "Lưu lại các thông tin của đơn hàng để trích xuất về sau một cách nhanh chóng và an toàn.",
  },
  {
    iconAlt: "Quản lý công việc",
    iconSrc: "/assets/home/landing-icon-13.svg",
    title: "Quản Lý Công Việc",
    description:
      "Sắp xếp và quản lý toàn bộ các khu vực thông qua những phòng bếp, điểm bán hàng.",
  },
]

const PRODUCTIVITY_FEATURES: IconFeature[] = [
  {
    iconAlt: "Tích Hợp",
    iconSrc: "/assets/home/landing-icon-17.svg",
    title: "Vận Hành Xuyên Suốt",
    description:
      "Quy trình thanh toán và đặt món thông minh giúp phục vụ khách siêu tốc độ.",
  },
  {
    iconAlt: "Quy trình",
    iconSrc: "/assets/home/landing-icon-18.svg",
    title: "Quy Trình Chuẩn Hoá",
    description:
      "Tổ chức và ưu tiến các đơn hàng tùy theo trạng thái, tránh nhầm lẫn hóa đơn.",
  },
  {
    iconAlt: "Quản lý dữ liệu",
    iconSrc: "/assets/home/landing-icon-19.svg",
    title: "Lưu Trữ Dữ Liệu",
    description:
      "Chia sẻ hóa đơn, in phiếu biên nhận và quản lý thông tin khách hoàn hảo.",
  },
  {
    iconAlt: "Dự Trữ Kho",
    iconSrc: "/assets/home/landing-icon-20.svg",
    title: "Thống Kê",
    description:
      "Phân tích nhanh chóng số lượng món hiện hữu và lượng đơn hàng theo thời gian.",
  },
  {
    iconAlt: "Smart Notifications",
    iconSrc: "/assets/home/landing-icon-21.svg",
    title: "Thông Báo Tức Thời",
    description:
      "Nhận ngay báo cáo đơn hàng lúc lên món tại quầy giúp đầu bếp có thông tin.",
  },
  {
    iconAlt: "Phân Tích Cửa Hàng",
    iconSrc: "/assets/home/landing-icon-22.svg",
    title: "Phân Tích Doanh Thu",
    description:
      "Nắm bắt điểm nổi bật kinh doanh dựa trên báo cáo để tối ưu quản lý hoạt động.",
  },
]

function CheckIcon() {
  return (
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
        d="M11.47 3.73C11.76 3.92 11.84 4.3 11.65 4.59L7.4 11.09C7.3 11.25 7.14 11.35 6.95 11.37C6.77 11.39 6.59 11.34 6.45 11.21L3.7 8.71C3.45 8.48 3.43 8.08 3.66 7.83C3.89 7.57 4.29 7.56 4.55 7.79L6.75 9.79L10.6 3.91C10.79 3.62 11.18 3.54 11.47 3.73Z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
    </svg>
  )
}

function CheckListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-4 font-normal text-[--text-secondary] dark:text-[--dark-text-secondary]">
      <span className="flex size-6 items-center justify-center rounded-full bg-[--surface-tertiary] dark:bg-[--dark-surface-tertiary]">
        <CheckIcon />
      </span>
      {children}
    </li>
  )
}

function CommunicationFeatureCard({
  feature,
}: {
  feature: CommunicationFeature
}) {
  return (
    <article className="flex min-h-96 w-full max-w-[380px] flex-col rounded-lg border border-[--border] bg-[--surface-secondary] p-px sm:max-w-full md:w-full md:flex-row md:odd:flex-row-reverse xl:gap-16 dark:border-[--dark-border] dark:bg-[--dark-surface-secondary]">
      <figure className="p-2 md:h-auto md:w-[360px] lg:w-[480px] xl:w-[560px]">
        <img
          alt=""
          className="sf-hidden block hidden aspect-video h-[200px] w-full rounded-lg border border-[--border] object-cover md:h-full dark:block dark:border-[--dark-border]"
          data-nimg={1}
          decoding="async"
          height={374}
          loading="lazy"
          src="data:,"
          style={{ color: "transparent" }}
          width={560}
        />
        <img
          alt=""
          className="block aspect-video h-[200px] w-full rounded-lg border border-[--border] object-cover md:h-full dark:hidden dark:border-[--dark-border]"
          data-nimg={1}
          decoding="async"
          height={374}
          loading="lazy"
          src={feature.imageSrc}
          style={{ color: "transparent" }}
          width={560}
        />
      </figure>
      <div className="flex flex-col gap-8 p-5 pt-6 md:flex-1 md:p-10">
        <div className="flex flex-col items-start gap-2">
          <h5 className="text-2xl font-medium text-[--text-primary] md:text-3xl dark:text-[--dark-text-primary]">
            {feature.title}
          </h5>
          <p className="font-normal text-[--text-secondary] md:text-lg dark:text-[--dark-text-secondary]">
            {feature.description}
          </p>
        </div>
        <ul className="flex flex-col items-start gap-3 pl-2 md:text-lg">
          {feature.bullets.map((bullet) => (
            <CheckListItem key={bullet}>{bullet}</CheckListItem>
          ))}
        </ul>
      </div>
    </article>
  )
}

function ManagementFeatureCard({ feature }: { feature: IconFeature }) {
  return (
    <article className="flex flex-col gap-4 rounded-lg border border-[--border] p-4 [box-shadow:_70px_-20px_130px_0px_rgba(255,255,255,0.05)_inset] dark:border-[--dark-border] dark:[box-shadow:_70px_-20px_130px_0px_rgba(255,255,255,0.05)_inset]">
      <figure className="flex size-9 items-center justify-center rounded-full border border-[--border] bg-[--surface-secondary] p-2 dark:border-[--dark-border] dark:bg-[--dark-surface-secondary]">
        <img
          alt={feature.iconAlt}
          className="dark:invert"
          data-nimg={1}
          decoding="async"
          height={18}
          loading="lazy"
          src={feature.iconSrc}
          style={{ color: "transparent" }}
          width={18}
        />
      </figure>
      <div className="flex flex-col items-start gap-1">
        <h5 className="text-lg font-medium">{feature.title}</h5>
        <p className="text-pretty text-[--text-secondary] dark:text-[--dark-text-secondary]">
          {feature.description}
        </p>
      </div>
    </article>
  )
}

function CollaborationFeatureCard({ feature }: { feature: IconFeature }) {
  return (
    <article className="flex flex-col gap-4">
      <figure className="flex size-9 items-center justify-center rounded-full border border-[--border] bg-[--surface-secondary] p-2 dark:border-[--dark-border] dark:bg-[--dark-surface-secondary]">
        <img
          alt={feature.iconAlt}
          className="dark:invert"
          data-nimg={1}
          decoding="async"
          height={18}
          loading="lazy"
          src={feature.iconSrc}
          style={{ color: "transparent" }}
          width={18}
        />
      </figure>
      <div className="flex flex-col items-start gap-1">
        <h5 className="text-lg font-medium">{feature.title}</h5>
        <p className="text-[--text-tertiary] dark:text-[--dark-text-tertiary]">
          {feature.description}
        </p>
      </div>
    </article>
  )
}

function ProductivityFeatureCard({ feature }: { feature: IconFeature }) {
  return (
    <article className="flex w-[280px] shrink-0 flex-col gap-4 rounded-lg border border-[--border] bg-[--surface-secondary] p-4 lg:w-full lg:flex-row lg:p-5 dark:border-[--dark-border] dark:bg-[--dark-surface-secondary]">
      <figure className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[--surface-tertiary] p-3 dark:bg-[--dark-surface-tertiary]">
        <img
          alt={feature.iconAlt}
          className="dark:invert"
          data-nimg={1}
          decoding="async"
          height={24}
          loading="lazy"
          src={feature.iconSrc}
          style={{ color: "transparent" }}
          width={24}
        />
      </figure>
      <div className="flex flex-col items-start gap-1">
        <h5 className="text-lg font-medium">{feature.title}</h5>
        <p className="text-pretty text-[--text-tertiary] dark:text-[--dark-text-tertiary]">
          {feature.description}
        </p>
      </div>
    </article>
  )
}

export default function LandingMain() {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: "smooth" })
    }
  }

  return (
    <>
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
            Được trang bị hàng loạt các công cụ làm việc nhóm, chia sẻ dữ liệu
            và lưu trữ các file giúp duy trì sự liên tục mượt mà từ lúc nhận cho
            đến khi phát hành sản phẩm.
          </p>
        </div>
        <div className="flex w-full flex-col items-start gap-4 md:order-2 md:grid md:grid-cols-3 md:gap-16">
          {COLLABORATION_FEATURES.map((feature) => (
            <CollaborationFeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>
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
                Hỗ trợ đội ngũ nhân viên duy trì tốc độ và làm việc liền mạch
                khi xử lý hàng trăm đơn hàng một cách nhanh chóng.
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
      <div className="relative overflow-clip">
        <section className="relative container mx-auto flex flex-col items-center gap-10 px-6 py-14 md:py-[72px]">
          <div className="flex w-full flex-col gap-14">
            <div className="flex justify-between">
              <div className="flex flex-col items-start gap-3 self-start self-stretch">
                <div className="flex max-w-[800px] flex-col items-start justify-center gap-1 self-start [&>*]:text-left [&>*]:text-3xl [&>*]:font-medium [&>*]:text-pretty md:[&>*]:text-4xl">
                  <h4 title="Khách hàng nói gì">Hơn 1200 Đối Tác Tin Dùng</h4>
                </div>
              </div>
              <div className="hidden gap-4 sm:flex">
                <button
                  type="button"
                  aria-label="Previous testimonial"
                  onClick={scrollLeft}
                  className="inline-flex !h-auto h-8 shrink-0 items-center justify-center gap-1 rounded-full border border-[--border] bg-[--surface-secondary] px-3.5 px-4 py-2 text-sm font-normal text-[--text-primary] ring-[--control] outline-hidden outline-0 hover:bg-[--surface-tertiary] focus-visible:ring-2 md:px-5 dark:border-[--dark-border] dark:bg-[--dark-surface-secondary] dark:text-[--dark-text-primary] dark:hover:bg-[--dark-surface-tertiary]"
                >
                  <svg
                    className="size-6"
                    fill="none"
                    height={15}
                    viewBox="0 0 15 15"
                    width={15}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="M6.85 3.15C7.05 3.34 7.05 3.66 6.85 3.85L3.71 7H12.5C12.78 7 13 7.22 13 7.5C13 7.78 12.78 8 12.5 8H3.71L6.85 11.15C7.05 11.34 7.05 11.66 6.85 11.85C6.66 12.05 6.34 12.05 6.15 11.85L2.15 7.85C1.95 7.66 1.95 7.34 2.15 7.15L6.15 3.15C6.34 2.95 6.66 2.95 6.85 3.15Z"
                      fill="currentColor"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Next testimonial"
                  onClick={scrollRight}
                  className="inline-flex !h-auto h-8 shrink-0 items-center justify-center gap-1 rounded-full border border-[--border] bg-[--surface-secondary] !px-4 px-3.5 !py-2 text-sm font-normal text-[--text-primary] ring-[--control] outline-hidden outline-0 hover:bg-[--surface-tertiary] focus-visible:ring-2 md:px-5 dark:border-[--dark-border] dark:bg-[--dark-surface-secondary] dark:text-[--dark-text-primary] dark:hover:bg-[--dark-surface-tertiary]"
                >
                  <svg
                    className="size-6"
                    fill="none"
                    height={15}
                    viewBox="0 0 15 15"
                    width={15}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="M8.15 3.15C8.34 2.95 8.66 2.95 8.85 3.15L12.85 7.15C13.05 7.34 13.05 7.66 12.85 7.85L8.85 11.85C8.66 12.05 8.34 12.05 8.15 11.85C7.95 11.66 7.95 11.34 8.15 11.15L11.29 8H2.5C2.22 8 2 7.78 2 7.5C2 7.22 2.22 7 2.5 7H11.29L8.15 3.85C7.95 3.66 7.95 3.34 8.15 3.15Z"
                      fill="currentColor"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="relative">
              <div
                ref={scrollRef}
                className="relative no-scrollbar flex h-full w-full snap-x snap-mandatory gap-10 overflow-x-auto scroll-smooth md:gap-0"
                style={{ scrollSnapType: "x mandatory" }}
              >
                {TESTIMONIALS.map((testimonial) => (
                  <div
                    key={testimonial.name}
                    className="max-w-full min-w-0 shrink-0 grow-0 basis-[min(740px,100%)] snap-center self-stretch md:pr-10"
                  >
                    <article className="embla__slide !last:visible flex h-full w-full min-w-0 transform touch-pan-y touch-pinch-zoom flex-col rounded-xl border border-[--border] select-none [backface-visibility:hidden] dark:border-[--dark-border]">
                      <div className="flex flex-1 items-start border-b border-[--border] px-5 py-[18px] md:px-8 md:py-7 dark:border-[--dark-border]">
                        <blockquote className="text-xl leading-[135%] font-extralight text-pretty whitespace-pre-wrap text-[--text-primary] sm:text-2xl md:text-4xl dark:text-[--dark-text-primary]">
                          {testimonial.text}
                        </blockquote>
                      </div>
                      <div className="flex items-center gap-4 pl-5">
                        <div className="flex flex-1 items-center gap-5 border-r border-[--border] py-4 dark:border-[--dark-border]">
                          {testimonial.avatarStyle ? (
                            <img
                              alt={testimonial.name}
                              className="hidden size-16 rounded-full md:block"
                              data-nimg={1}
                              decoding="async"
                              height={64}
                              loading="lazy"
                              src={testimonial.avatarSrc}
                              style={testimonial.avatarStyle}
                              width={64}
                            />
                          ) : (
                            <img
                              alt={testimonial.name}
                              className="hidden size-16 rounded-full md:block"
                              data-nimg={1}
                              decoding="async"
                              height={64}
                              loading="lazy"
                              src={testimonial.avatarSrc}
                              style={{ color: "transparent" }}
                              width={64}
                            />
                          )}
                          <div className="flex flex-1 flex-col">
                            <h5 className="text-base font-medium md:text-lg">
                              {testimonial.name}
                            </h5>
                            <p className="text-sm text-pretty text-[--text-tertiary] md:text-base dark:text-[--dark-text-tertiary]">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                        <div className="pr-5">
                          <img
                            alt={testimonial.companyAlt}
                            className="w-12 md:w-16"
                            data-nimg={1}
                            decoding="async"
                            height={48}
                            loading="lazy"
                            src={testimonial.companySrc}
                            style={{ color: "transparent" }}
                            width={testimonial.companyWidth}
                          />
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
              <div className="sf-hidden mt-4 flex w-full justify-center gap-2 md:hidden"></div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
