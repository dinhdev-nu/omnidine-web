import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { Switch } from "@/components/ui/switch"
import { Clock3 } from "lucide-react"
import { DEFAULT_DAILY_OPERATING_HOUR, weekDays } from "../../constants"
import type { DayKey } from "../../constants"
import type { OperatingHoursSectionProps } from "./registration-form.types"

export function OperatingHoursSection({
  formData,
  changeOperatingClosed,
  changeOperatingTime,
}: OperatingHoursSectionProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base font-medium">Giờ hoạt động</CardTitle>
        <CardDescription>
          Thiết lập operating_hours theo từng ngày trong tuần
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3">
          {weekDays.map((day) => {
            const dayId = day.id as DayKey
            const hours =
              formData.operating_hours[dayId] ?? DEFAULT_DAILY_OPERATING_HOUR

            return (
              <div
                key={day.id}
                className="flex flex-col gap-4 rounded-lg border border-border bg-secondary/30 p-3 sm:flex-row sm:items-center"
              >
                <div className="sm:w-24">
                  <p className="text-sm font-medium text-muted-foreground">
                    {day.full}
                  </p>
                </div>

                <div className="flex min-w-[130px] items-center gap-2">
                  <Switch
                    aria-label={`Đóng cửa ${day.full}`}
                    checked={hours.closed}
                    onCheckedChange={(checked) =>
                      changeOperatingClosed(dayId, checked)
                    }
                  />
                  <span className="text-sm text-muted-foreground">
                    Đóng cửa
                  </span>
                </div>

                <div className="grid flex-1 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-3">
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <InputGroupText>
                        <Clock3 className="size-4 text-muted-foreground" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      aria-label={`Giờ mở cửa ${day.full}`}
                      type="time"
                      value={hours.open}
                      onChange={(event) =>
                        changeOperatingTime(dayId, "open", event.target.value)
                      }
                      disabled={hours.closed}
                    />
                  </InputGroup>

                  <span className="text-muted-foreground">—</span>

                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <InputGroupText>
                        <Clock3 className="size-4 text-muted-foreground" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      aria-label={`Giờ đóng cửa ${day.full}`}
                      type="time"
                      value={hours.close}
                      onChange={(event) =>
                        changeOperatingTime(dayId, "close", event.target.value)
                      }
                      disabled={hours.closed}
                    />
                  </InputGroup>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
