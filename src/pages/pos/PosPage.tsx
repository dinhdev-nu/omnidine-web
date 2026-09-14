import React, { Suspense, lazy, useEffect, useReducer, useState } from "react"
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom"
import PosLayout from "@/layouts/pos/PosLayout"
import { POS_BASE_PATH } from "@/routes/pos-route-config"
import { PosProvider } from "@/features/pos/contexts/PosContext"
import { usePosContext } from "@/features/pos/contexts/usePosContext"
import { Spinner } from "@/features/pos/ui/Spinner"
import RejectToPreviousPage from "@/components/navigation/RejectToPreviousPage"
import { fetchPosInit } from "@/services/pos"
import { toAppError } from "@/services/core/error"
import type { AppError } from "@/services/core/types"
import type { PosInitData } from "@/types/domain/pos-init"
import type { PosContextType } from "@/features/pos/contexts/pos-context"

const MainPosSection = lazy(
  () => import("@/features/pos/sections/main-pos/MainPosSection")
)
const TableSection = lazy(
  () => import("@/features/pos/sections/table/TableSection")
)
const PaymentSection = lazy(
  () => import("@/features/pos/sections/payment/PaymentSection")
)
const OrderSection = lazy(
  () => import("@/features/pos/sections/order/OrderSection")
)
const MenuSection = lazy(
  () => import("@/features/pos/sections/menu/MenuSection")
)
const StaffSection = lazy(
  () => import("@/features/pos/sections/staff/StaffSection")
)

function PosSectionLoadingFallback() {
  return (
    <output
      aria-label="Đang tải khu vực POS"
      className="flex min-h-[320px] items-center justify-center text-muted-foreground"
    >
      <Spinner className="size-5" />
    </output>
  )
}

type POSSection = "main-pos" | "table" | "payment" | "order" | "menu" | "staff"

const PAYMENT_ROUTE_PATTERN = /^\/payments\/([^/]+)$/

const ROUTE_TO_SECTION: Record<string, POSSection> = {
  "": "main-pos",
  "/": "main-pos",
  "/tables": "table",
  "/table": "table",
  "/payments": "payment",
  "/payment": "payment",
  "/orders": "order",
  "/order": "order",
  "/menu": "menu",
  "/staff": "staff",
}

const SECTION_TO_ROUTE_SUFFIX: Record<POSSection, string> = {
  "main-pos": "",
  table: "/tables",
  payment: "/payments",
  order: "/orders",
  menu: "/menu",
  staff: "/staff",
}

type PosInitAction =
  | { type: "loading" }
  | { type: "success"; data: PosInitData }
  | { type: "error"; error: AppError }

const initialPosContextValue: PosContextType = {
  data: null,
  loading: true,
  error: null,
}

function posInitReducer(
  state: PosContextType,
  action: PosInitAction
): PosContextType {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true, error: null }
    case "success":
      return { data: action.data, loading: false, error: null }
    case "error":
      return { data: null, loading: false, error: action.error }
    default:
      return state
  }
}

const getPosSubPath = (pathname: string, slug: string) => {
  const posPrefix = `${POS_BASE_PATH}/${slug}`

  if (!pathname.startsWith(posPrefix)) {
    return pathname
  }

  const subPath = pathname.slice(posPrefix.length)
  return subPath || "/"
}

const normalizePosSubPath = (subPath: string) => {
  if (PAYMENT_ROUTE_PATTERN.test(subPath)) {
    return "/payments"
  }

  return subPath
}

const getPaymentOrderIdFromSubPath = (subPath: string) => {
  const match = subPath.match(PAYMENT_ROUTE_PATTERN)
  return match?.[1] ?? null
}

const PosPageContent: React.FC<{ slug: string }> = ({ slug }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { loading, error } = usePosContext()

  const [isOperational, setIsOperational] = useState(true)
  const subPath = getPosSubPath(pathname, slug)
  const normalizedSubPath = normalizePosSubPath(subPath)
  const paymentOrderId = getPaymentOrderIdFromSubPath(subPath)
  const activeSection = ROUTE_TO_SECTION[normalizedSubPath] ?? "main-pos"

  const handleToggleOperational = React.useCallback(() => {
    setIsOperational((prev) => !prev)
  }, [])

  const handleSectionChange = React.useCallback(
    (section: string) => {
      const normalizedSection = section as POSSection

      const targetSuffix = SECTION_TO_ROUTE_SUFFIX[normalizedSection] ?? ""
      const targetPath = `${POS_BASE_PATH}/${slug}${targetSuffix}`
      if (pathname !== targetPath) {
        navigate(targetPath)
      }
    },
    [navigate, pathname, slug]
  )

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Loading POS data...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return <RejectToPreviousPage />
  }

  if (!ROUTE_TO_SECTION[normalizedSubPath]) {
    return <Navigate to={`${POS_BASE_PATH}/${slug}`} replace />
  }

  let sectionContent: React.ReactNode
  switch (activeSection) {
    case "main-pos":
      sectionContent = <MainPosSection />
      break
    case "table":
      sectionContent = <TableSection />
      break
    case "payment":
      sectionContent = <PaymentSection orderId={paymentOrderId} />
      break
    case "order":
      sectionContent = <OrderSection />
      break
    case "menu":
      sectionContent = <MenuSection />
      break
    case "staff":
      sectionContent = <StaffSection />
      break
    default:
      sectionContent = <MainPosSection />
      break
  }

  return (
    <PosLayout
      isOperational={isOperational}
      onToggleOperational={handleToggleOperational}
      activeSection={activeSection}
      onSectionChange={handleSectionChange}
    >
      <Suspense fallback={<PosSectionLoadingFallback />}>
        {sectionContent}
      </Suspense>
    </PosLayout>
  )
}

const PosPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const currentSlug = slug?.trim() ?? ""
  const [posContextValue, dispatchPosInit] = useReducer(
    posInitReducer,
    initialPosContextValue
  )

  useEffect(() => {
    let isActive = true

    const loadPosInit = async () => {
      if (!currentSlug) {
        if (isActive) {
          dispatchPosInit({
            type: "error",
            error: { message: "POS slug is required" },
          })
        }
        return
      }

      try {
        dispatchPosInit({ type: "loading" })
        const result = await fetchPosInit(currentSlug)
        if (isActive) {
          dispatchPosInit({ type: "success", data: result })
        }
      } catch (error) {
        if (isActive) {
          dispatchPosInit({
            type: "error",
            error: toAppError(error, "Failed to fetch POS init data"),
          })
        }
      }
    }

    void loadPosInit()

    return () => {
      isActive = false
    }
  }, [currentSlug])

  if (!currentSlug) {
    return <RejectToPreviousPage />
  }

  return (
    <PosProvider value={posContextValue}>
      <PosPageContent slug={currentSlug} />
    </PosProvider>
  )
}

export default PosPage
