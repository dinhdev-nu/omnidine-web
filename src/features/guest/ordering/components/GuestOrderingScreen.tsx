import RejectToPreviousPage from "@/components/navigation/RejectToPreviousPage"
import { Spinner } from "@/components/ui/spinner"

import "@/layouts/pos/pos.css"

import { GuestOrderingView } from "./GuestOrderingView"
import {
  useGuestOrderingController,
  type GuestOrderingProps,
} from "../hooks/useGuestOrderingController"

const GuestOrderingScreen = (props: GuestOrderingProps) => {
  const controller = useGuestOrderingController(props)

  if (controller.isLoading) {
    return (
      <output
        aria-label="Đang tải thực đơn"
        className="pos flex min-h-dvh items-center justify-center gap-3 bg-background p-6 text-sm text-muted-foreground"
      >
        <Spinner className="size-5 motion-reduce:animate-none" />
        <span>Đang tải thực đơn...</span>
      </output>
    )
  }

  if (controller.tableError || controller.menuError) {
    return <RejectToPreviousPage />
  }

  return <GuestOrderingView controller={controller} />
}

export default GuestOrderingScreen
