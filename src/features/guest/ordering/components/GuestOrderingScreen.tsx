import RejectToPreviousPage from "@/components/navigation/RejectToPreviousPage"

import "@/layouts/pos/pos.css"

import { GuestOrderingView } from "./GuestOrderingView"
import {
  useGuestOrderingController,
  type GuestOrderingProps,
} from "../hooks/useGuestOrderingController"

const GuestOrderingScreen = (props: GuestOrderingProps) => {
  const controller = useGuestOrderingController(props)

  if (controller.tableError || controller.menuError) {
    return <RejectToPreviousPage />
  }

  return <GuestOrderingView controller={controller} />
}

export default GuestOrderingScreen
