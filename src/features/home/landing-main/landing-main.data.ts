import type React from "react"

export type Testimonial = {
  text: string
  name: string
  role: string
  avatarSrc: string
  companyAlt: string
  companySrc: string
  companyWidth: number
  avatarStyle?: React.CSSProperties
}

export type CompanyLogo = {
  alt: string
  src: string
}

export type CommunicationFeature = {
  imageSrc: string
  title: string
  description: string
  bullets: string[]
}

export type IconFeature = {
  iconAlt: string
  iconSrc: string
  title: string
  description: string
}

export const TESTIMONIALS: Testimonial[] = [
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

export const HERO_AVATAR_SRCS = [
  "/assets/home/avatar-placeholder-3.png",
  "/assets/home/avatar-placeholder-4.png",
  "/assets/home/avatar-placeholder-5.png",
]

export const COMPANY_LOGOS: CompanyLogo[] = [
  { alt: "ProLine", src: "/assets/home/landing-icon-07.svg" },
  { alt: "Hues", src: "/assets/home/landing-icon-05.svg" },
  { alt: "Greenish", src: "/assets/home/landing-icon-06.svg" },
  { alt: "Cloud", src: "/assets/home/landing-icon-08.svg" },
  { alt: "Volume", src: "/assets/home/landing-icon-09.svg" },
  { alt: "PinPoint", src: "/assets/home/landing-icon-10.svg" },
]

export const COMMUNICATION_FEATURES: CommunicationFeature[] = [
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

export const MANAGEMENT_FEATURES: IconFeature[] = [
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

export const COLLABORATION_FEATURES: IconFeature[] = [
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

export const PRODUCTIVITY_FEATURES: IconFeature[] = [
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
