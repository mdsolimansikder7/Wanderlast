"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Clock,
  Trash2,
  Compass,
  ArrowRight,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { getApiUrl } from "@/lib/api";

export type BookingItem = {
  _id: string;
  email?: string;
  userEmail?: string;
  username?: string;
  userName?: string;
  image?: string;
  destinationId?: string;
  name?: string;
  destinationName?: string;
  country?: string;
  category?: string;
  price?: string | number;
  duration?: string;
  departureDate?: string;
  imageUrl?: string;
  description?: string;
  bookingDate?: string;
  bookedAt?: string;
  status?: string;
};

type Props = {
  initialBookings: BookingItem[];
  userEmail: string;
};

function formatDepartureDisplay(val?: string): string {
  if (!val) return "Flexible";
  try {
    // If format is mm/dd/yyyy
    const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(val.trim());
    if (m) {
      const d = new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]));
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
    }
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  } catch {}
  return val;
}

export function BookingsList({ initialBookings }: Props) {
  const [bookings, setBookings] = useState<BookingItem[]>(initialBookings);
  const [cancellingBooking, setCancellingBooking] = useState<BookingItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return;

    setIsDeleting(true);
    const target = cancellingBooking;
    const destTitle = target.name || target.destinationName || "Travel Package";

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/booking/${target._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel booking");
      }

      setBookings((prev) => prev.filter((b) => b._id !== target._id));
      setCancellingBooking(null);

      // Toast notification instead of native alert
      toast.success(
        "Booking Cancelled",
        `Your reservation for "${destTitle}" has been cancelled.`
      );
    } catch (error) {
      console.error("Cancel booking error:", error);
      toast.error(
        "Cancellation Failed",
        error instanceof Error ? error.message : "Failed to connect to server"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (bookings.length === 0) {
    return (
      <Card className="mt-8 flex flex-col items-center justify-center border-neutral-200 bg-white p-14 text-center shadow-sm rounded-[4px]">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-brand/10 text-brand">
          <Compass className="size-8" />
        </div>
        <h2 className="text-xl font-medium text-neutral-900">
          No Bookings Found
        </h2>
        <p className="mt-2 max-w-md text-sm text-neutral-500">
          You haven&apos;t booked any travel packages yet. Explore our curated
          destinations and start your next journey!
        </p>
        <Link href="/destination" className="mt-6">
          <Button className="gap-2 bg-[#15a1bf] hover:bg-[#128ea9] text-white">
            Explore Destinations
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-5">
      {bookings.map((booking, index) => {
        const destTitle = booking.name || booking.destinationName || "Bali Paradise";
        const formattedDeparture = formatDepartureDisplay(booking.departureDate);
        const bookingIdDisplay = `b${index + 1}`;
        const isPending = booking.status?.toLowerCase() === "pending";

        return (
          <div
            key={booking._id}
            className="flex flex-col md:flex-row md:items-center justify-between rounded-[4px] border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all gap-5"
          >
            {/* Left Image & Middle Content */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 flex-1 min-w-0">
              {/* Image */}
              <div className="relative h-44 w-full sm:h-36 sm:w-64 shrink-0 overflow-hidden rounded-[3px] bg-neutral-100">
                <img
                  src={booking.imageUrl || "/images/Banner.png"}
                  alt={destTitle}
                  className="size-full object-cover"
                />
              </div>

              {/* Information */}
              <div className="flex-1 min-w-0 flex flex-col">
                {/* Status Badge */}
                <div className="mb-1.5">
                  {isPending ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
                      <Clock className="size-3 text-amber-600" />
                      Pending
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                      <span className="size-1.5 rounded-full bg-emerald-600" />
                      Confirmed
                    </span>
                  )}
                </div>

                {/* Destination Title */}
                <h3 className="text-2xl font-normal text-neutral-900 tracking-tight truncate">
                  {destTitle}
                </h3>

                {/* Departure Date */}
                <p className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
                  <CalendarDays className="size-3.5 text-neutral-400 shrink-0" />
                  <span>Departure: {formattedDeparture}</span>
                </p>

                {/* Booking ID */}
                <p className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                  <MapPin className="size-3.5 text-neutral-400 shrink-0" />
                  <span>Booking ID: {bookingIdDisplay}</span>
                </p>

                {/* Price */}
                <div className="mt-3 text-[26px] font-semibold text-[#15a1bf] leading-tight">
                  ${booking.price || "1299"}
                </div>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center mt-2 sm:mt-0">
              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => setCancellingBooking(booking)}
                className="flex items-center gap-1.5 rounded-[3px] border border-red-200 bg-white px-3.5 py-2 text-xs font-normal text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
              >
                <Trash2 className="size-3.5 text-red-500" />
                Cancel
              </button>

              {/* View Button */}
              <Link href={`/destination/${booking.destinationId || booking._id}`}>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-[3px] bg-[#15a1bf] hover:bg-[#128ea9] px-4 py-2 text-xs font-medium text-white transition-colors"
                >
                  <Eye className="size-3.5" />
                  View
                </button>
              </Link>
            </div>
          </div>
        );
      })}

      {/* CUSTOM CANCEL CONFIRMATION DIALOG (REPLACES WINDOW.CONFIRM) */}
      <Dialog
        open={!!cancellingBooking}
        onOpenChange={(open) => {
          if (!open) setCancellingBooking(null);
        }}
      >
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-medium text-neutral-900">
              <AlertCircle className="size-5 text-red-600" />
              Cancel Booking
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Are you sure you want to cancel your booking for &ldquo;
              <span className="font-semibold text-neutral-800">
                {cancellingBooking?.name || cancellingBooking?.destinationName}
              </span>
              &rdquo;? This reservation will be removed from your account.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setCancellingBooking(null)}
              className="text-xs h-9"
            >
              Keep Booking
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              onClick={handleConfirmCancel}
              className="bg-red-600 hover:bg-red-700 text-white text-xs h-9 gap-1.5 font-medium"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
