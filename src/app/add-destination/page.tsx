"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CalendarIcon, CheckCircle2, Plus, RotateCcw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getApiUrl } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { countries } from "@/lib/countries";

const categories = {
  beach: "Beach",
  mountain: "Mountain",
  city: "City",
  desert: "Desert",
  cruise: "Cruise",
  cultural: "Cultural",
};

const fieldClassName =
  "h-9 rounded-[3px] border-transparent bg-[#f4f7f9] px-3 text-sm text-neutral-900 transition-colors placeholder:text-neutral-400 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20 md:text-sm";

const selectTriggerClassName =
  "h-9 w-full rounded-[3px] border-transparent bg-[#f4f7f9] pr-2.5 pl-3 text-sm text-neutral-900 transition-colors data-[size=default]:h-9 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20";

const comboboxClassName =
  "h-9 w-full rounded-[3px] border-transparent bg-[#f4f7f9] px-1 text-sm text-neutral-900 transition-colors has-[[data-slot=input-group-control]:focus-visible]:border-brand has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-brand/20 [&_[data-slot=input-group-control]]:h-9 [&_[data-slot=input-group-control]]:px-2 [&_[data-slot=input-group-control]]:text-sm [&_[data-slot=input-group-control]]:text-neutral-900 [&_[data-slot=input-group-control]]:placeholder:text-neutral-400 [&_svg]:text-neutral-500";

const labelClassName = "text-xs font-semibold text-neutral-900";

const dayOptions = Object.fromEntries(
  Array.from({ length: 30 }, (_, index) => {
    const value = String(index + 1);
    return [value, `${value} ${value === "1" ? "Day" : "Days"}`];
  })
);

const nightOptions = Object.fromEntries(
  Array.from({ length: 30 }, (_, index) => {
    const value = String(index);
    return [value, `${value} ${value === "1" ? "Night" : "Nights"}`];
  })
);

const thisYear = new Date().getFullYear();
const calendarStartMonth = new Date(thisYear, 0, 1);
const calendarEndMonth = new Date(thisYear + 5, 11, 31);

type FormState = {
  destinationName: string;
  country: string;
  category: string;
  price: string;
  durationDays: string;
  durationNights: string;
  departureDate: string;
  imageUrl: string;
  description: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const emptyForm: FormState = {
  destinationName: "",
  country: "",
  category: "beach",
  price: "",
  durationDays: "7",
  durationNights: "6",
  departureDate: "",
  imageUrl: "",
  description: "",
};

function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)]
    .filter(Boolean)
    .join("/");
}

function formatDateValue(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}/${day}/${date.getFullYear()}`;
}

function parseDate(value: string) {
  if (!isValidDate(value)) return undefined;

  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return undefined;

  return new Date(Number(match[3]), Number(match[1]) - 1, Number(match[2]));
}

function isValidDate(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return false;

  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.destinationName.trim()) {
    errors.destinationName = "Destination name is required.";
  }
  if (!form.country.trim()) {
    errors.country = "Country is required.";
  }
  if (!form.price.trim()) {
    errors.price = "Price is required.";
  } else if (
    !/^\d+(\.\d{1,2})?$/.test(form.price.trim()) ||
    Number(form.price) <= 0
  ) {
    errors.price = "Enter a valid amount, e.g. 1299.";
  }
  if (!form.durationDays || !form.durationNights) {
    errors.durationDays = "Select the trip length.";
  }
  if (!form.departureDate) {
    errors.departureDate = "Departure date is required.";
  } else if (!isValidDate(form.departureDate)) {
    errors.departureDate = "Use the mm/dd/yyyy format.";
  }
  if (form.imageUrl.trim() && !/^https?:\/\/.+/i.test(form.imageUrl.trim())) {
    errors.imageUrl = "Enter a valid URL starting with http:// or https://.";
  }

  return errors;
}

const AddDestination = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/add-destination");
    }
  }, [status, router]);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
    setSuccess("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // ১. আগে validation
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // ২. তারপর সার্ভারে পাঠানো
    try {
      const { durationDays, durationNights, ...rest } = form;

      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/add-destination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...rest,
          duration: `${durationDays} Days/${durationNights} Nights`,
          durationDays: Number(durationDays),
          durationNights: Number(durationNights),
        }),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        setSuccess("");
        alert(data.message || "Something went wrong");
        return;
      }

      setSuccess(
        `"${form.destinationName.trim()}" has been added to your travel packages.`
      );
      setForm(emptyForm);
    } catch (error) {
      console.error(error);
      alert("Server-এর সাথে কানেক্ট হচ্ছে না।");
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setErrors({});
    setSuccess("");

    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  if (status === "loading") {
    return (
      <main className="flex-1 bg-white flex items-center justify-center py-28">
        <Loader2 className="size-8 animate-spin text-brand" />
      </main>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 pt-4 pb-8 lg:px-20 lg:pt-5">
        <h1 className="text-[24px] leading-tight font-light tracking-[-0.015em] text-neutral-900 sm:text-[26px]">
          Add New Travel Package
        </h1>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="mx-auto mt-3 w-full max-w-[680px] border border-neutral-200 bg-white p-5"
        >
          {success && (
            <div
              role="status"
              className="mb-3 flex items-start gap-2 rounded-[3px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <FieldGroup className="gap-2.5">
            <Field className="gap-1.5" data-invalid={!!errors.destinationName}>
              <FieldLabel htmlFor="destinationName" className={labelClassName}>
                Destination Name
              </FieldLabel>
              <Input
                id="destinationName"
                name="destinationName"
                placeholder="Bali Paradise"
                value={form.destinationName}
                onChange={(event) =>
                  update("destinationName", event.target.value)
                }
                aria-invalid={!!errors.destinationName}
                className={fieldClassName}
              />
              <FieldError>{errors.destinationName}</FieldError>
            </Field>

            <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-x-5">
              <Field className="gap-1.5" data-invalid={!!errors.country}>
                <FieldLabel htmlFor="country" className={labelClassName}>
                  Country
                </FieldLabel>
                <Combobox
                  items={countries}
                  inputValue={form.country}
                  onInputValueChange={(value) => update("country", value)}
                  onValueChange={(value) =>
                    update("country", (value as string | null) ?? "")
                  }
                >
                  <ComboboxInput
                    id="country"
                    name="country"
                    autoComplete="off"
                    placeholder="Indonesia"
                    aria-invalid={!!errors.country}
                    className={comboboxClassName}
                  />
                  <ComboboxContent>
                    <ComboboxList>
                      {(country: string) => (
                        <ComboboxItem key={country} value={country}>
                          {country}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                    <ComboboxEmpty>
                      No match — your text will be kept as typed.
                    </ComboboxEmpty>
                  </ComboboxContent>
                </Combobox>
                <FieldError>{errors.country}</FieldError>
              </Field>

              <Field className="gap-1.5">
                <FieldLabel htmlFor="category" className={labelClassName}>
                  Category
                </FieldLabel>
                <Select
                  name="category"
                  value={form.category}
                  onValueChange={(value) => update("category", String(value))}
                  items={categories}
                >
                  <SelectTrigger
                    id="category"
                    className={selectTriggerClassName}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categories).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-x-5">
              <Field className="gap-1.5" data-invalid={!!errors.price}>
                <FieldLabel htmlFor="price" className={labelClassName}>
                  Price (USD)
                </FieldLabel>
                <Input
                  id="price"
                  name="price"
                  inputMode="decimal"
                  placeholder="e.g., 1299"
                  value={form.price}
                  onChange={(event) => update("price", event.target.value)}
                  aria-invalid={!!errors.price}
                  className={fieldClassName}
                />
                <FieldError>{errors.price}</FieldError>
              </Field>

              <Field className="gap-1.5" data-invalid={!!errors.durationDays}>
                <FieldLabel htmlFor="durationDays" className={labelClassName}>
                  Duration
                </FieldLabel>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    name="durationDays"
                    value={form.durationDays}
                    onValueChange={(value) =>
                      update("durationDays", String(value))
                    }
                    items={dayOptions}
                  >
                    <SelectTrigger
                      id="durationDays"
                      aria-label="Duration in days"
                      className={selectTriggerClassName}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(dayOptions).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    name="durationNights"
                    value={form.durationNights}
                    onValueChange={(value) =>
                      update("durationNights", String(value))
                    }
                    items={nightOptions}
                  >
                    <SelectTrigger
                      id="durationNights"
                      aria-label="Duration in nights"
                      className={selectTriggerClassName}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(nightOptions).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FieldError>{errors.durationDays}</FieldError>
              </Field>
            </div>

            <Field className="gap-1.5" data-invalid={!!errors.departureDate}>
              <FieldLabel htmlFor="departureDate" className={labelClassName}>
                Departure Date
              </FieldLabel>
              <div className="relative">
                <Input
                  id="departureDate"
                  name="departureDate"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="mm/dd/yyyy"
                  value={form.departureDate}
                  onChange={(event) =>
                    update(
                      "departureDate",
                      formatDateInput(event.target.value)
                    )
                  }
                  aria-invalid={!!errors.departureDate}
                  className={cn(fieldClassName, "pr-9")}
                />
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger
                    type="button"
                    aria-label="Pick departure date from calendar"
                    className="absolute inset-y-0 right-0 flex w-9 items-center justify-center rounded-r-[3px] text-neutral-500 transition-colors hover:text-brand focus-visible:text-brand focus-visible:outline-none"
                  >
                    <CalendarIcon className="size-4" />
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-auto p-2">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown-years"
                      startMonth={calendarStartMonth}
                      endMonth={calendarEndMonth}
                      className="[--rdp-day-height:2rem]! [--rdp-day-width:2rem]! [--rdp-day_button-height:2rem]! [--rdp-day_button-width:2rem]! [--rdp-nav-height:2rem]! [--rdp-nav_button-height:1.75rem]! [--rdp-nav_button-width:1.75rem]!"
                      classNames={{ week: "mt-1 flex w-full" }}
                      selected={parseDate(form.departureDate)}
                      defaultMonth={parseDate(form.departureDate)}
                      onSelect={(date) => {
                        if (!date) return;
                        update("departureDate", formatDateValue(date));
                        setCalendarOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <FieldError>{errors.departureDate}</FieldError>
            </Field>

            <Field className="gap-1.5" data-invalid={!!errors.imageUrl}>
              <FieldLabel htmlFor="imageUrl" className={labelClassName}>
                Image URL
              </FieldLabel>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl}
                onChange={(event) => update("imageUrl", event.target.value)}
                aria-invalid={!!errors.imageUrl}
                className={fieldClassName}
              />
              <FieldError>{errors.imageUrl}</FieldError>
            </Field>

            <Field className="gap-1.5">
              <FieldLabel htmlFor="description" className={labelClassName}>
                Description
              </FieldLabel>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the travel experience..."
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                className="min-h-[72px] resize-none rounded-[3px] border-transparent bg-[#f4f7f9] px-3 py-2 text-sm text-neutral-900 transition-colors placeholder:text-neutral-400 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20 md:text-sm"
              />
            </Field>
          </FieldGroup>

          <div className="mt-3 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="h-10 w-full justify-center gap-2 rounded-[3px] border-red-300 px-5 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 sm:w-auto"
            >
              <RotateCcw className="size-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-10 w-full justify-center gap-2 rounded-[3px] border-transparent bg-brand px-5 text-sm font-medium text-white hover:bg-brand/90 sm:w-auto"
            >
              <Plus className="size-4" />
              Add Travel Package
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddDestination;