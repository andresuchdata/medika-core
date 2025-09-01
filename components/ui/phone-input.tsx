"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

type PhoneInputProps = {
  value?: string // E.164-like "+15551234567" or "+62..."
  defaultValue?: string
  onChange?: (next: string) => void
  className?: string
  id?: string
  name?: string
}

const DEFAULT_COUNTRY = "+62"

type Country = { code: string; label: string; flag: string }

const COUNTRY_CODES: Country[] = [
  { code: "+62", label: "Indonesia", flag: "🇮🇩" },
  { code: "+1", label: "United States", flag: "🇺🇸" },
  { code: "+44", label: "United Kingdom", flag: "🇬🇧" },
  { code: "+61", label: "Australia", flag: "🇦🇺" },
  { code: "+65", label: "Singapore", flag: "🇸🇬" },
  { code: "+81", label: "Japan", flag: "🇯🇵" },
  { code: "+91", label: "India", flag: "🇮🇳" },
]

function splitE164(e164?: string): { dial: string; digits: string } {
  if (!e164 || !e164.startsWith("+")) return { dial: DEFAULT_COUNTRY, digits: "" }
  const match = COUNTRY_CODES.sort((a, b) => b.code.length - a.code.length).find((c) => e164.startsWith(c.code))
  if (!match) return { dial: DEFAULT_COUNTRY, digits: e164.replace(/\D/g, "") }
  const digits = e164.slice(match.code.length).replace(/\D/g, "")
  return { dial: match.code, digits }
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  defaultValue,
  onChange,
  className,
  id,
  name,
}) => {
  const initial = React.useMemo(() => splitE164(value ?? defaultValue), [value, defaultValue])
  const [dial, setDial] = React.useState<string>(initial.dial)
  const [digits, setDigits] = React.useState<string>(initial.digits)
  const [query, setQuery] = React.useState<string>("")

  const current = React.useMemo<Country>(() => COUNTRY_CODES.find(c => c.code === dial) || COUNTRY_CODES[0], [dial])
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COUNTRY_CODES
    return COUNTRY_CODES.filter(c => c.label.toLowerCase().includes(q) || c.code.includes(q))
  }, [query])

  React.useEffect(() => {
    if (value !== undefined) {
      const parsed = splitE164(value)
      setDial(parsed.dial)
      setDigits(parsed.digits)
    }
  }, [value])

  React.useEffect(() => {
    onChange?.(`${dial}${digits}`)
  }, [dial, digits, onChange])

  return (
    <div className={cn("flex w-full items-center gap-2", className)}>
      {name ? <input type="hidden" id={id} name={name} value={`${dial}${digits}`} readOnly /> : null}
      <Select
        value={dial}
        onValueChange={(v) => {
          setDial(v)
          setQuery("")
        }}
      >
        <SelectTrigger className="w-auto whitespace-nowrap text-xs h-8 px-2 py-1">
          <span className="flex items-center gap-1">
            <span className="text-base leading-none">{current.flag}</span>
            <span className="font-medium">{current.code}</span>
          </span>
        </SelectTrigger>
        <SelectContent>
          <div className="p-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or code"
              className="h-8 text-xs"
            />
          </div>
          {filtered.map((c) => (
            <SelectItem key={c.code} value={c.code} className="text-sm">
              <span className="flex items-center gap-2">
                <span className="text-base leading-none">{c.flag}</span>
                <span className="w-14 text-muted-foreground">{c.code}</span>
                <span>{c.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        inputMode="numeric"
        pattern="[0-9]*"
        value={digits}
        onChange={(e) => {
          const onlyDigits = e.target.value.replace(/\D/g, "")
          setDigits(onlyDigits)
        }}
        placeholder="Phone number"
        className="flex-1"
      />
    </div>
  )
}

export default PhoneInput


