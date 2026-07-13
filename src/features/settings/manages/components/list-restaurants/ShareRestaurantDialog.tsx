import { useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { OwnerRestaurantListItem } from "@/types/domain/restaurant"
import { QRCodeSVG } from "qrcode.react"
import { copyShareLink } from "./list-restaurants.utils"

export function ShareRestaurantDialog({
  shareTarget,
  shareMode,
  sharePublicUrl,
  sharePosUrl,
  onShareModeChange,
  onClose,
}: {
  shareTarget: OwnerRestaurantListItem | null
  shareMode: "public" | "pos"
  sharePublicUrl: string
  sharePosUrl: string
  onShareModeChange: (mode: "public" | "pos") => void
  onClose: () => void
}) {
  const returnFocusRef = useRef<HTMLElement | null>(null)

  return (
    <Dialog
      open={Boolean(shareTarget)}
      onOpenChange={(isOpen) => !isOpen && onClose()}
    >
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={false}
        onOpenAutoFocus={() => {
          returnFocusRef.current = document.activeElement as HTMLElement | null
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          returnFocusRef.current?.focus()
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Chia sẻ nhà hàng
          </DialogTitle>
          <DialogDescription>
            Có 2 liên kết chia sẻ: trang công khai và trang POS.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <Tabs
            value={shareMode}
            onValueChange={(value) =>
              onShareModeChange(value === "pos" ? "pos" : "public")
            }
          >
            <TabsList className="h-11 w-full gap-1 border border-border bg-secondary p-1">
              <TabsTrigger
                value="public"
                className="flex-1 data-[state=active]:bg-card data-[state=active]:text-foreground"
              >
                Công khai
              </TabsTrigger>
              <TabsTrigger
                value="pos"
                className="flex-1 data-[state=active]:bg-card data-[state=active]:text-foreground"
              >
                POS
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <div
              className="flex w-[200%] transition-transform duration-300 ease-out motion-reduce:transition-none"
              style={{
                transform:
                  shareMode === "public"
                    ? "translateX(0%)"
                    : "translateX(-50%)",
              }}
            >
              <div className="w-1/2 p-3">
                <p className="mb-3 text-sm font-medium text-foreground">
                  Liên kết công khai
                </p>
                <div className="mb-3 flex justify-center rounded-lg border border-border bg-background p-3">
                  <QRCodeSVG value={sharePublicUrl} size={140} includeMargin />
                </div>
                <div className="flex flex-col gap-2 min-[375px]:flex-row">
                  <Input
                    value={sharePublicUrl}
                    readOnly
                    aria-label="Liên kết công khai của nhà hàng"
                  />
                  <Button
                    variant="default"
                    onClick={() => copyShareLink(sharePublicUrl, "Công khai")}
                  >
                    Sao chép
                  </Button>
                </div>
              </div>

              <div className="w-1/2 border-l border-border p-3">
                <p className="mb-3 text-sm font-medium text-foreground">
                  Liên kết POS
                </p>
                <div className="mb-3 flex justify-center rounded-lg border border-border bg-background p-3">
                  <QRCodeSVG value={sharePosUrl} size={140} includeMargin />
                </div>
                <div className="flex flex-col gap-2 min-[375px]:flex-row">
                  <Input
                    value={sharePosUrl}
                    readOnly
                    aria-label="Liên kết POS của nhà hàng"
                  />
                  <Button
                    variant="default"
                    onClick={() => copyShareLink(sharePosUrl, "POS")}
                  >
                    Sao chép
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="default" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
