import type { PropsWithChildren } from "react"

import {
    LandingFooter,
    LandingGlobalStyles,
    LandingHeader,
    LandingNewsletter,
} from "@/features/home"

export function HomeLayout({ children }: PropsWithChildren) {
    return (
        <>
            <LandingGlobalStyles />
            <a
                href="#main-content"
                className="fixed top-2 left-[-10000px] z-[200] flex min-h-11 items-center rounded-lg bg-[--text-primary] px-4 text-sm font-medium text-[--surface-primary] focus:left-2 dark:bg-[--dark-text-primary] dark:text-[--dark-surface-primary]"
            >
                Chuyển đến nội dung chính
            </a>
            <LandingHeader />
            <main
                id="main-content"
                tabIndex={-1}
                className="min-h-[calc(100svh-var(--header-height))] outline-none"
            >
                {children}
            </main>
            <LandingNewsletter />
            <LandingFooter />
        </>
    )
}
