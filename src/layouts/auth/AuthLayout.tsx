import type { PropsWithChildren } from "react"

export function AuthLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-dvh bg-background">
            <div className="flex min-h-dvh">
                <main className="flex w-full items-center justify-center pt-[calc(1.5rem+env(safe-area-inset-top))] pr-[calc(1rem+env(safe-area-inset-right))] pb-[calc(1.5rem+env(safe-area-inset-bottom))] pl-[calc(1rem+env(safe-area-inset-left))] sm:pr-[calc(2rem+env(safe-area-inset-right))] sm:pl-[calc(2rem+env(safe-area-inset-left))]">{children}</main>
            </div>
        </div>
    )
}
