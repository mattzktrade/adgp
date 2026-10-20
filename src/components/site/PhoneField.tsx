import { useMemo, useRef, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  buildE164,
  DEFAULT_PHONE_COUNTRY_ISO,
  digitsOnly,
  FEATURED_PHONE_COUNTRIES,
  matchCountryFromDigits,
  OTHER_PHONE_COUNTRIES,
  phoneCountry,
  phoneCountrySearchValue,
  type PhoneCountry,
} from "@/lib/phone";
import { cn } from "@/lib/utils";

type PhoneFieldProps = {
  id?: string;
  disabled?: boolean;
  fieldClassName: string;
  value: string;
  onChange: (e164: string) => void;
};

export function PhoneField({ id, disabled, fieldClassName, value, onChange }: PhoneFieldProps) {
  const [iso, setIso] = useState(DEFAULT_PHONE_COUNTRY_ISO);
  const [national, setNational] = useState("");
  const [open, setOpen] = useState(false);
  const numberRef = useRef<HTMLInputElement>(null);
  const country = useMemo(() => phoneCountry(iso), [iso]);

  const emit = (nextIso: string, nextNational: string) => {
    onChange(buildE164(phoneCountry(nextIso).dial, nextNational) ?? "");
  };

  const pickCountry = (nextIso: string) => {
    setIso(nextIso);
    setOpen(false);
    emit(nextIso, national);
    requestAnimationFrame(() => numberRef.current?.focus());
  };

  return (
    <div>
      <div className="flex items-end gap-3">
        <div className="w-[7.75rem] shrink-0">
          <div className="eyebrow text-muted-foreground">Country</div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                disabled={disabled}
                aria-label={`Country code, ${country.name} +${country.dial}`}
                className={cn(
                  fieldClassName,
                  "flex h-[3.15rem] items-center justify-between gap-1 pr-0.5 text-left",
                  open && "border-primary",
                )}
              >
                <span className="min-w-0">
                  <span className="block font-mono text-[15px] leading-none">+{country.dial}</span>
                  <span className="mt-1 block truncate text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {country.iso}
                  </span>
                </span>
                <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={8}
              className="z-[80] w-[min(22rem,calc(100vw-2.5rem))] border-border bg-card p-0 text-foreground shadow-lg"
            >
              <Command
                className="bg-card"
                filter={(itemValue, search) => (itemValue.toLowerCase().includes(search.trim().toLowerCase()) ? 1 : 0)}
              >
                <CommandInput placeholder="Search country or code" className="text-base" />
                <CommandList className="max-h-64">
                  <CommandEmpty>No country matches.</CommandEmpty>
                  <CountryGroup heading="Common" countries={FEATURED_PHONE_COUNTRIES} selectedIso={iso} onPick={pickCountry} />
                  <CountryGroup heading="All countries" countries={OTHER_PHONE_COUNTRIES} selectedIso={iso} onPick={pickCountry} />
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="min-w-0 flex-1">
          <label className="eyebrow text-muted-foreground" htmlFor={id ?? "phone-national"}>
            Mobile number
          </label>
          <input
            ref={numberRef}
            id={id ?? "phone-national"}
            required
            type="tel"
            name="phoneNational"
            inputMode="tel"
            autoComplete="tel-national"
            disabled={disabled}
            placeholder={country.placeholder}
            value={national}
            onChange={(event) => {
              const nextNational = event.target.value;
              const trimmed = nextNational.trim();
              if (trimmed.startsWith("+") || trimmed.startsWith("00")) {
                let digits = digitsOnly(trimmed);
                if (digits.startsWith("00")) digits = digits.slice(2);
                const matched = matchCountryFromDigits(digits);
                if (matched) {
                  setIso(matched.iso);
                  const local = digits.slice(matched.dial.length);
                  setNational(local);
                  emit(matched.iso, local);
                  return;
                }
              }
              setNational(nextNational);
              emit(iso, nextNational);
            }}
            className={cn(fieldClassName, "h-[3.15rem]")}
          />
        </div>
      </div>
      <input type="hidden" name="phone" value={value} />
    </div>
  );
}

function CountryGroup({
  heading,
  countries,
  selectedIso,
  onPick,
}: {
  heading: string;
  countries: PhoneCountry[];
  selectedIso: string;
  onPick: (iso: string) => void;
}) {
  return (
    <CommandGroup heading={heading} className="text-foreground">
      {countries.map((item) => (
        <CommandItem
          key={item.iso}
          value={phoneCountrySearchValue(item)}
          onSelect={() => onPick(item.iso)}
          className="cursor-pointer gap-3 py-2.5 data-[selected=true]:bg-primary/15 data-[selected=true]:text-foreground"
        >
          <span className="w-14 shrink-0 font-mono text-sm text-muted-foreground">+{item.dial}</span>
          <span className="min-w-0 flex-1 truncate">{item.name}</span>
          {selectedIso === item.iso ? <Check className="h-4 w-4 shrink-0 text-primary" /> : null}
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
