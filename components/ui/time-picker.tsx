"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type TimePickerProps = {
  id?: string
  name?: string
  className?: string
  value?: string // 24h format: HH:mm
  defaultValue?: string
  onChange?: (value: string) => void
  minuteStep?: number
}

function parse24h(value?: string) {
  if (!value) return null
  const [h, m] = value.split(":").map((v) => Number(v))
  if (Number.isNaN(h) || Number.isNaN(m)) return null
  const period = h >= 12 ? "PM" : "AM"
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return { hour12, minute: m, period }
}

function to24h(hour12: number, minute: number, period: "AM" | "PM") {
  let h = hour12 % 12
  if (period === "PM") h += 12
  return `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
}

export function TimePicker({
  id,
  name,
  className,
  value,
  defaultValue,
  onChange,
  minuteStep = 5,
}: TimePickerProps) {
  const parsedDefault = React.useMemo(
    () => parse24h(value ?? defaultValue ?? undefined) ?? { hour12: 9, minute: 0, period: "AM" as const },
    [value, defaultValue]
  )

  const [open, setOpen] = React.useState(false)
  const [hour12, setHour12] = React.useState<number>(parsedDefault.hour12)
  const [minute, setMinute] = React.useState<number>(parsedDefault.minute)
  const [period, setPeriod] = React.useState<"AM" | "PM">(parsedDefault.period as "AM" | "PM")

  // Sync from controlled value
  React.useEffect(() => {
    if (value) {
      const p = parse24h(value)
      if (p) {
        setHour12(p.hour12)
        setMinute(p.minute)
        setPeriod(p.period as "AM" | "PM")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const display = React.useMemo(() => {
    const mm = String(minute).padStart(2, "0")
    return `${hour12}:${mm} ${period}`
  }, [hour12, minute, period])

  const commit = React.useCallback(
    (h: number, m: number, p: "AM" | "PM") => {
      const next = to24h(h, m, p)
      onChange?.(next)
    },
    [onChange]
  )

  const minutes = React.useMemo(() => {
    const out: number[] = []
    for (let i = 0; i < 60; i += Math.max(1, Math.min(30, minuteStep))) out.push(i)
    return out
  }, [minuteStep])

  const setNow = () => {
    const d = new Date()
    const h24 = d.getHours()
    const p: "AM" | "PM" = h24 >= 12 ? "PM" : "AM"
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12
    const m = Math.round(d.getMinutes() / minuteStep) * minuteStep
    setHour12(h12)
    setMinute(m % 60)
    setPeriod(p)
    commit(h12, m % 60, p)
    setOpen(false)
  }

  const hiddenValue = to24h(hour12, minute, period)

  return (
    <div className={cn("w-full", className)}>
      {name ? <input type="hidden" id={id} name={name} value={hiddenValue} readOnly /> : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "border-input focus-visible:border-ring focus-visible:ring-ring/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]",
              "data-[state=open]:ring-2 data-[state=open]:ring-ring/50"
            )}
          >
            <span className="text-left">{display}</span>
            <Clock className="size-4 opacity-60" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" sideOffset={8} className="w-[min(92vw,20rem)] p-3">
          <div className="grid grid-cols-3 gap-2">
            <Select
              value={String(hour12)}
              onValueChange={(v) => {
                const h = Number(v)
                setHour12(h)
                commit(h, minute, period)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Hr" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <SelectItem key={h} value={String(h)}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={String(minute)}
              onValueChange={(v) => {
                const m = Number(v)
                setMinute(m)
                commit(hour12, m, period)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent>
                {minutes.map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    {String(m).padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={period}
              onValueChange={(v) => {
                const p = v as "AM" | "PM"
                setPeriod(p)
                commit(hour12, minute, p)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={setNow}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Now
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border px-3 py-1.5 text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default TimePicker


