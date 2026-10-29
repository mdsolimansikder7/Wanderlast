"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { cn } from "cn";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/components/ui/toast";
import { getApiUrl } from "@/lib/api";

export type BookingDestination = {
  _id?: string;
  destinationName?: string;
  name?: string;
  country?: string;
  category?: string;
  price?: string | number;
  duration?: string;
  departureDate?: string;
  imageUrl?: string;
  description?: string;
  rating?: number;
};

export type BookingProps = {
  destination: BookingDestination;
  className?: string;
  onBookingSuccess?: (bookingId: string) => void;
};

// Format date to mm/dd/yyyy
function formatDefaultDate(val?: string): string {
  if (!val) {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(val.trim())) {
    return val.trim();
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(val.trim());
  if (match) {
    return `${match[2]}/${match[3]}/${match[1]}`;
  }
  return val.trim();
}

function parseDate(str?: string): Date | undefined {
  if (!str) return undefined;
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(str.trim());
  if (m) {
    const d = new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]));
    if (!isNaN(d.getTime())) return d;
  }
  const m2 = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(str.trim());
  if (m2) {
    const d = new Date(Number(m2[1]), Number(m2[2]) - 1, Number(m2[3]));
    if (!isNaN(d.getTime())) return d;
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? undefined : d;
}

export function Booking({
  destination,
  className,
  onBookingSuccess,
}: BookingProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [date, setDate] = useState<string>(
    formatDefaultDate(destination.departureDate)
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<string>("");

  const destName = destination.destinationName || destination.name || "Destination";
  const displayPrice = destination.price ? String(destination.price) : "0";

  const handleBookNow = async () => {
    // If user is not logged in, redirect to login
    if (status !== "authenticated" || !session?.user?.email) {
      toast.info("Please sign in", "You need to log in to book this travel package.");
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "/destination";
      router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        username: session.user.name || session.user.email.split("@")[0],
        email: session.user.email,
        image: session.user.image || session.user.email,
        name: destName,
        country: destination.country || "",
        category: destination.category || "General",
        price: String(destination.price || ""),
        duration: destination.duration || "",
        departureDate: date || destination.departureDate || "",
        imageUrl: destination.imageUrl || "",
        description: destination.description || "",
        destinationId: destination._id || "",
        bookingDate: new Date().toISOString(),
      };

      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to confirm booking.");
      }

      const newId = data.id || data.booking?._id || "";
      setBookingId(newId);
      setBookingSuccess(true);

      toast.success(
        "Booking Confirmed!",
        `Your reservation for "${destName}" has been successfully booked.`
      );

      if (onBookingSuccess) {
        onBookingSuccess(newId);
      }
    } catch (err: unknown) {
      console.error("Booking error:", err);
      const msg = err instanceof Error ? err.message : "Failed to connect to booking server";
      toast.error("Booking failed", msg);
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS CONFIRMATION STATE
  if (bookingSuccess) {
    return (
      <div
        className={cn(
          "rounded-[4px] border border-emerald-200 bg-white p-6 shadow-sm transition-all",
          className
        )}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="size-7" />
          </div>

          <h3 className="text-xl font-medium text-neutral-900">
            Booking Confirmed!
          </h3>
          <p className="mt-1 text-xs text-neutral-500">
            Thank you, {session?.user?.name || "Traveler"}. Your reservation for{" "}
            <span className="font-semibold text-neutral-800">{destName}</span> is
            confirmed.
          </p>

          {bookingId && (
            <p className="mt-2 text-[11px] text-neutral-400">
              Booking ID: <span className="font-mono text-neutral-600">{bookingId}</span>
            </p>
          )}

          <div className="mt-6 flex w-full flex-col gap-2.5">
            <Link
              href="/my-booking"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-[3px] bg-[#15a1bf] text-sm font-medium text-white transition-colors hover:bg-[#128ea9]"
            >
              View in My Bookings
              <ArrowRight className="size-4" />
            </Link>

            <button
              type="button"
              onClick={() => setBookingSuccess(false)}
              className="flex h-9 w-full items-center justify-center rounded-[3px] border border-neutral-200 bg-white text-xs font-normal text-neutral-600 hover:bg-neutral-50"
            >
              Book Another Date
            </button>
          </div>
        </div>
      </div>
    );
  }

  // BOOKING CARD (MATCHES USER IMAGE)
  return (
    <div
      className={cn(
        "rounded-[4px] border border-neutral-200 bg-white p-6 shadow-sm",
        className
      )}
    >
      <span className="text-xs text-neutral-500">Starting from</span>
      <div className="mt-1 flex items-baseline">
        <span className="text-[32px] font-semibold leading-tight text-[#15a1bf]">
          ${displayPrice}
        </span>
      </div>
      <span className="text-xs text-neutral-400">per person</span>

      {/* Date Field with Calendar Picker & Direct Typing */}
      <div className="mt-6">
        <div className="relative flex items-center">
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="MM/DD/YYYY"
            className="w-full rounded-[3px] border-0 bg-[#f4f7f9] px-3.5 pr-10 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#15a1bf]"
          />
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger
              type="button"
              aria-label="Pick departure date from calendar"
              className="absolute right-0 inset-y-0 flex w-10 items-center justify-center text-neutral-400 hover:text-[#15a1bf] transition-colors"
            >
              <CalendarIcon className="size-4" />
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-2 bg-white border border-neutral-200 shadow-md">
              <Calendar
                mode="single"
                selected={parseDate(date)}
                onSelect={(selectedDate) => {
                  if (!selectedDate) return;
                  const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
                  const dd = String(selectedDate.getDate()).padStart(2, "0");
                  const yyyy = selectedDate.getFullYear();
                  setDate(`${mm}/${dd}/${yyyy}`);
                  setCalendarOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Book Now Button */}
      <button
        type="button"
        onClick={handleBookNow}
        disabled={loading}
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[3px] bg-[#15a1bf] text-sm font-medium text-white transition-colors hover:bg-[#128ea9] disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Booking...</span>
          </>
        ) : (
          <>
            <span>Book Now</span>
            <ArrowRight className="size-4" />
          </>
        )}
      </button>

      {/* Policy list */}
      <div className="mt-6 space-y-2.5 text-xs text-neutral-600">
        <div className="flex items-center gap-2">
          <Check className="size-4 text-emerald-600 shrink-0" />
          <span>Free cancellation up to 7 days</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="size-4 text-emerald-600 shrink-0" />
          <span>Travel insurance included</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="size-4 text-emerald-600 shrink-0" />
          <span>24/7 customer support</span>
        </div>
      </div>
    </div>
  );
}
