import type React from "react"

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

export function CheckListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-4 font-normal text-[--text-secondary] dark:text-[--dark-text-secondary]">
      <span className="flex size-6 items-center justify-center rounded-full bg-[--surface-tertiary] dark:bg-[--dark-surface-tertiary]">
        <CheckIcon />
      </span>
      {children}
    </li>
  )
}
