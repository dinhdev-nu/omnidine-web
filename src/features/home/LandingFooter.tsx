type FooterNavLink = {
  label: string
  href: string
  target: "_blank" | "_self"
}

type SocialLink = {
  alt: string
  href: string
  src: string
}

const FOOTER_LINKS: FooterNavLink[] = [
  { label: "Tài liệu", href: "/#features", target: "_self" },
  { label: "Hỗ trợ", href: "/#support", target: "_self" },
  {
    label: "Chính sách bảo mật",
    href: "/#support",
    target: "_self",
  },
  {
    label: "Điều Khoản",
    href: "/#support",
    target: "_self",
  },
]

const SOCIAL_LINKS: SocialLink[] = [
  {
    alt: "GitHub",
    href: "/#github",
    src: "/assets/home/landing-icon-01.svg",
  },
  {
    alt: "X",
    href: "/#x",
    src: "/assets/home/landing-icon-02.svg",
  },
  {
    alt: "Discord",
    href: "/#discord",
    src: "/assets/home/landing-icon-03.svg",
  },
  {
    alt: "Linkedin",
    href: "/#linkedin",
    src: "/assets/home/landing-icon-04.svg",
  },
]

function FooterTextLink({ link }: { link: FooterNavLink }) {
  return (
    <a
      className="shrink-0 gap-1 rounded-full px-2 font-light font-normal tracking-tight text-[--text-tertiary] ring-[--control] outline-hidden outline-0 hover:text-[--text-primary] focus-visible:ring-2 dark:text-[--dark-text-secondary] dark:hover:text-[--dark-text-primary]"
      href={link.href}
      target={link.target}
    >
      {link.label}
    </a>
  )
}

function SocialIconLink({ link }: { link: SocialLink }) {
  return (
    <li className="shrink-0 sm:first:ml-auto">
      <a
        className="block aspect-square shrink-0 gap-1 rounded-full p-0.5 font-normal ring-[--control] outline-hidden outline-0 hover:brightness-75 focus-visible:ring-2 dark:brightness-50 dark:hover:brightness-75"
        href={link.href}
        target="_blank"
      >
        <img
          alt={link.alt}
          data-nimg={1}
          decoding="async"
          height={24}
          loading="lazy"
          src={link.src}
          style={{ color: "transparent" }}
          width={24}
        />
      </a>
    </li>
  )
}

function ThemeLightButton() {
  return (
    <button
      type="button"
      aria-label="light theme"
      className="!flex !size-6 shrink-0 items-center justify-center gap-1 rounded-full !p-[3px] font-normal text-[--text-secondary] ring-[--control] outline-hidden outline-0 hover:bg-[--surface-secondary] hover:text-[--text-primary] focus-visible:ring-2 data-[selected='true']:bg-[--surface-tertiary] data-[selected='true']:text-[--text-primary] dark:text-[--dark-text-secondary] dark:hover:bg-[--dark-surface-secondary] dark:hover:text-[--dark-text-primary] dark:data-[selected='true']:bg-[--dark-surface-tertiary] dark:data-[selected='true']:text-[--dark-text-primary]"
      data-selected="false"
    >
      <svg
        fill="none"
        height={16}
        viewBox="0 0 15 15"
        width={16}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clipRule="evenodd"
          d="M7.5 0C7.78 0 8 0.22 8 0.5V2.5C8 2.78 7.78 3 7.5 3C7.22 3 7 2.78 7 2.5V0.5C7 0.22 7.22 0 7.5 0ZM2.2 2.2C2.39 2 2.71 2 2.9 2.2L4.32 3.61C4.51 3.81 4.51 4.12 4.32 4.32C4.12 4.51 3.81 4.51 3.61 4.32L2.2 2.9C2 2.71 2 2.39 2.2 2.2ZM0.5 7C0.22 7 0 7.22 0 7.5C0 7.78 0.22 8 0.5 8H2.5C2.78 8 3 7.78 3 7.5C3 7.22 2.78 7 2.5 7H0.5ZM2.2 12.8C2 12.61 2 12.29 2.2 12.1L3.61 10.68C3.81 10.49 4.12 10.49 4.32 10.68C4.51 10.88 4.51 11.19 4.32 11.39L2.9 12.8C2.71 13 2.39 13 2.2 12.8ZM12.5 7C12.22 7 12 7.22 12 7.5C12 7.78 12.22 8 12.5 8H14.5C14.78 8 15 7.78 15 7.5C15 7.22 14.78 7 14.5 7H12.5ZM10.68 4.32C10.49 4.12 10.49 3.81 10.68 3.61L12.1 2.2C12.29 2 12.61 2 12.8 2.2C13 2.39 13 2.71 12.8 2.9L11.39 4.32C11.19 4.51 10.88 4.51 10.68 4.32ZM8 12.5C8 12.22 7.78 12 7.5 12C7.22 12 7 12.22 7 12.5V14.5C7 14.78 7.22 15 7.5 15C7.78 15 8 14.78 8 14.5V12.5ZM10.68 10.68C10.88 10.49 11.19 10.49 11.39 10.68L12.8 12.1C13 12.29 13 12.61 12.8 12.8C12.61 13 12.29 13 12.1 12.8L10.68 11.39C10.49 11.19 10.49 10.88 10.68 10.68ZM5.5 7.5C5.5 6.4 6.4 5.5 7.5 5.5C8.6 5.5 9.5 6.4 9.5 7.5C9.5 8.6 8.6 9.5 7.5 9.5C6.4 9.5 5.5 8.6 5.5 7.5ZM7.5 4.5C5.84 4.5 4.5 5.84 4.5 7.5C4.5 9.16 5.84 10.5 7.5 10.5C9.16 10.5 10.5 9.16 10.5 7.5C10.5 5.84 9.16 4.5 7.5 4.5Z"
          fill="currentColor"
          fillRule="evenodd"
        ></path>
      </svg>
    </button>
  )
}

function ThemeSystemButton() {
  return (
    <button
      type="button"
      aria-label="system theme"
      className="!flex !size-6 shrink-0 items-center justify-center gap-1 rounded-full !p-[3px] font-normal text-[--text-secondary] ring-[--control] outline-hidden outline-0 hover:bg-[--surface-secondary] hover:text-[--text-primary] focus-visible:ring-2 data-[selected='true']:bg-[--surface-tertiary] data-[selected='true']:text-[--text-primary] dark:text-[--dark-text-secondary] dark:hover:bg-[--dark-surface-secondary] dark:hover:text-[--dark-text-primary] dark:data-[selected='true']:bg-[--dark-surface-tertiary] dark:data-[selected='true']:text-[--dark-text-primary]"
      data-selected="true"
    >
      <svg
        fill="none"
        height={16}
        viewBox="0 0 15 15"
        width={16}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clipRule="evenodd"
          d="M7.5 0.88C3.84 0.88 0.88 3.84 0.88 7.5C0.88 11.16 3.84 14.12 7.5 14.12C11.16 14.12 14.12 11.16 14.12 7.5C14.12 3.84 11.16 0.88 7.5 0.88ZM7.5 1.83C4.37 1.83 1.83 4.37 1.83 7.5C1.83 10.63 4.37 13.17 7.5 13.17V1.83Z"
          fill="currentColor"
          fillRule="evenodd"
        ></path>
      </svg>
    </button>
  )
}

function ThemeDarkButton() {
  return (
    <button
      type="button"
      aria-label="dark theme"
      className="!flex !size-6 shrink-0 items-center justify-center gap-1 rounded-full !p-[3px] font-normal text-[--text-secondary] ring-[--control] outline-hidden outline-0 hover:bg-[--surface-secondary] hover:text-[--text-primary] focus-visible:ring-2 data-[selected='true']:bg-[--surface-tertiary] data-[selected='true']:text-[--text-primary] dark:text-[--dark-text-secondary] dark:hover:bg-[--dark-surface-secondary] dark:hover:text-[--dark-text-primary] dark:data-[selected='true']:bg-[--dark-surface-tertiary] dark:data-[selected='true']:text-[--dark-text-primary]"
      data-selected="false"
    >
      <svg
        fill="none"
        height={16}
        viewBox="0 0 15 15"
        width={16}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clipRule="evenodd"
          d="M2.9 0.5C2.9 0.28 2.72 0.1 2.5 0.1C2.28 0.1 2.1 0.28 2.1 0.5V1.1H1.5C1.28 1.1 1.1 1.28 1.1 1.5C1.1 1.72 1.28 1.9 1.5 1.9H2.1V2.5C2.1 2.72 2.28 2.9 2.5 2.9C2.72 2.9 2.9 2.72 2.9 2.5V1.9H3.5C3.72 1.9 3.9 1.72 3.9 1.5C3.9 1.28 3.72 1.1 3.5 1.1H2.9V0.5ZM5.9 3.5C5.9 3.28 5.72 3.1 5.5 3.1C5.28 3.1 5.1 3.28 5.1 3.5V4.1H4.5C4.28 4.1 4.1 4.28 4.1 4.5C4.1 4.72 4.28 4.9 4.5 4.9H5.1V5.5C5.1 5.72 5.28 5.9 5.5 5.9C5.72 5.9 5.9 5.72 5.9 5.5V4.9H6.5C6.72 4.9 6.9 4.72 6.9 4.5C6.9 4.28 6.72 4.1 6.5 4.1H5.9V3.5ZM1.9 6.5C1.9 6.28 1.72 6.1 1.5 6.1C1.28 6.1 1.1 6.28 1.1 6.5V7.1H0.5C0.28 7.1 0.1 7.28 0.1 7.5C0.1 7.72 0.28 7.9 0.5 7.9H1.1V8.5C1.1 8.72 1.28 8.9 1.5 8.9C1.72 8.9 1.9 8.72 1.9 8.5V7.9H2.5C2.72 7.9 2.9 7.72 2.9 7.5C2.9 7.28 2.72 7.1 2.5 7.1H1.9V6.5ZM8.54 0.98L8.25 0.94C8.03 0.92 7.91 1.17 8.03 1.34C8.17 1.54 8.3 1.76 8.42 1.97C8.92 2.9 9.2 3.97 9.2 5.1C9.2 8.37 6.82 11.09 3.7 11.61C3.46 11.65 3.21 11.68 2.96 11.69C2.75 11.7 2.63 11.95 2.78 12.11C2.85 12.18 2.92 12.25 2.99 12.31L3.06 12.38L3.32 12.6L3.51 12.75L3.63 12.84L3.81 12.97L3.99 13.09C4.11 13.17 4.24 13.24 4.36 13.31L4.62 13.44L4.89 13.56L5.19 13.68L5.43 13.77C5.57 13.81 5.7 13.85 5.84 13.89C5.94 13.92 6.05 13.94 6.15 13.96C6.28 13.99 6.41 14.01 6.54 14.03L6.85 14.07L7.12 14.09C7.25 14.1 7.37 14.1 7.5 14.1C11.15 14.1 14.1 11.15 14.1 7.5C14.1 7.25 14.09 7 14.06 6.76L14.03 6.48C13.99 6.26 13.95 6.04 13.89 5.83C13.82 5.57 13.74 5.31 13.64 5.07L13.53 4.8L13.45 4.64L13.38 4.49C13.22 4.18 13.04 3.88 12.83 3.6L12.68 3.4L12.48 3.16L12.32 2.98L12.2 2.86L12.04 2.7L11.81 2.5L11.49 2.24L11.25 2.06L10.96 1.87L10.63 1.69L10.31 1.52L10.19 1.47L9.95 1.37L9.68 1.27L9.43 1.18L9.1 1.09L8.84 1.03L8.54 0.98ZM10.4 5.3C10.4 4.28 10.2 3.3 9.83 2.41C11.76 3.29 13.1 5.24 13.1 7.5C13.1 10.59 10.6 13.1 7.5 13.1C6.64 13.1 5.82 12.9 5.08 12.55C6.54 12.09 7.81 11.21 8.74 10.04C8.88 10.23 9.1 10.35 9.35 10.35C9.76 10.35 10.1 10.01 10.1 9.6C10.1 9.24 9.85 8.94 9.52 8.87C9.58 8.75 9.64 8.63 9.69 8.51C9.88 8.63 10.11 8.7 10.35 8.7C11.04 8.7 11.6 8.14 11.6 7.45C11.6 6.76 11.04 6.2 10.35 6.2C10.39 5.9 10.4 5.6 10.4 5.3Z"
          fill="currentColor"
          fillRule="evenodd"
        ></path>
      </svg>
    </button>
  )
}

export default function LandingFooter() {
  return (
    <>
      <footer
        className="border-t border-[--border] py-16 dark:border-[--dark-border]"
        data-sf-nesting-track-id="1.68"
      >
        <div
          className="container mx-auto grid grid-cols-2 grid-rows-[auto_auto_auto] place-items-start items-center gap-y-7 px-6 sm:grid-cols-[1fr_auto_1fr] sm:grid-rows-2 sm:gap-x-3 sm:gap-y-16"
          data-sf-nesting-track-id="1.68.1"
        >
          <svg
            aria-label="Homepage"
            className="lucide lucide-link"
            data-sf-nesting-track-id="1.68.1.1"
            fill="none"
            height={24}
            href="/"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
            width={24}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <img
            alt="Logo"
            className="hidden h-6 w-auto max-w-[200px] object-contain dark:block"
            data-nimg={1}
            data-sf-nesting-track-id="1.68.1.1.3"
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
            data-sf-nesting-track-id="1.68.1.1.4"
            decoding="async"
            height={20}
            src="data:,"
            style={{ color: "transparent", aspectRatio: "101/20" }}
            width={101}
          />
          <nav className="col-start-1 row-start-2 flex flex-col gap-x-2 gap-y-3 self-center sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:flex-row sm:items-center sm:place-self-center md:gap-x-4 lg:gap-x-8">
            {FOOTER_LINKS.map((link) => (
              <FooterTextLink key={link.label} link={link} />
            ))}
          </nav>
          <div className="col-start-2 row-start-1 flex items-center gap-3 self-center justify-self-end sm:col-span-1 sm:col-start-3 sm:row-start-1">
            <p className="hidden text-[--text-tertiary] sm:block dark:text-[--dark-text-tertiary]">
              Giao Diện
            </p>
            <div className="flex gap-0.5 rounded-full border border-[--border] bg-[--surface-primary] p-1 text-center dark:border-[--dark-border] dark:bg-[--dark-surface-primary]">
              <ThemeLightButton />
              <ThemeSystemButton />
              <ThemeDarkButton />
            </div>
            <p />
          </div>
          <p className="col-span-2 text-sm text-pretty text-[--text-tertiary] sm:col-span-1 dark:text-[--dark-text-tertiary]">
            @ 2025 OmniDine Corp. All rights reserved.
          </p>
          <ul className="col-span-2 col-start-1 row-start-3 flex w-full items-center gap-x-3.5 gap-y-4 sm:col-span-1 sm:col-start-3 sm:row-start-2 sm:w-auto sm:flex-wrap sm:justify-self-end">
            {SOCIAL_LINKS.map((link) => (
              <SocialIconLink key={link.alt} link={link} />
            ))}
          </ul>
          <p />
        </div>
      </footer>
    </>
  )
}
