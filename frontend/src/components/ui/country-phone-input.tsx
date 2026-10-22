import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { countryCodes, getFlagUrl } from "@/lib/countries";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

function CountryFlag({ countryId }: { countryId: string }) {
  const [unavailable, setUnavailable] = useState(false);
  if (unavailable)
    return (
      <span
        aria-hidden="true"
        className="flex h-4 w-6 shrink-0 items-center justify-center rounded-sm bg-muted text-[10px] font-semibold"
      >
        {countryId}
      </span>
    );
  return (
    <img
      src={getFlagUrl(countryId)}
      alt=""
      width={24}
      height={18}
      loading="lazy"
      onError={() => setUnavailable(true)}
      className="h-4 w-6 shrink-0 rounded-sm object-cover"
    />
  );
}

type Props = {
  id: string;
  name?: string;
  countryId: string;
  value: string;
  onCountryChange: (countryId: string) => void;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
};

export default function CountryPhoneInput({
  id,
  name = "phone",
  countryId,
  value,
  onCountryChange,
  onChange,
  required,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);

  const country =
    countryCodes.find((option) => option.id === countryId) ||
    countryCodes.find((option) => option.id === "IN")!;
  return (
    <div className="mt-2 flex min-h-12 min-w-0 rounded-lg border border-input bg-card transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-label={"Country code: " + country.country + " (" + country.code + ")"}
            className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-l-lg border-r border-input bg-card px-2.5 text-sm font-medium text-foreground hover:bg-muted/50 disabled:opacity-60 sm:px-3"
          >
            <CountryFlag key={country.id} countryId={country.id} />
            <span className="tabular-nums">{country.code}</span>
            <ChevronDown
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          collisionPadding={16}
          className="w-[360px] max-w-[calc(100vw-2rem)] p-0"
        >
          <Command>
            <CommandInput
              aria-label="Search country or calling code"
              placeholder="Search country or calling code..."
            />
            <CommandList className="max-h-[min(20rem,50dvh)]">
              <CommandEmpty>No countries found. Try a country name or code.</CommandEmpty>
              <CommandGroup heading="Country / region">
                {countryCodes.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.id}
                    keywords={[option.country, option.code, option.code.replace(/\D/g, "")]}
                    onSelect={() => {
                      onCountryChange(option.id);
                      setOpen(false);
                    }}
                    className="min-h-11 cursor-pointer gap-3 px-3 py-2 data-[selected=true]:bg-muted data-[selected=true]:text-foreground"
                  >
                    <CountryFlag countryId={option.id} />
                    <span className="min-w-0 flex-1">{option.country}</span>
                    <span className="shrink-0 text-sm tabular-nums">{option.code}</span>
                    <Check
                      aria-hidden="true"
                      className={cn(
                        "h-4 w-4 shrink-0",
                        country.id === option.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <input
        id={id}
        name={name}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        required={required}
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 rounded-r-lg bg-transparent px-3 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
        placeholder="123 456 7890"
      />
    </div>
  );
}
