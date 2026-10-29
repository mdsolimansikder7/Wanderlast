import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  MapPin,
  Star,
} from "lucide-react";

import { DeleteDestinationButton } from "@/components/destination/delete-destination-button";
import { EditDestinationButton } from "@/components/destination/edit-destination-button";
import { Booking } from "@/components/booking/booking";
import { getApiUrl } from "@/lib/api";

export const dynamic = "force-dynamic";

const DestinationDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  let destination = null;
  try {
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/destination/${id}`, {
      cache: "no-store",
    });

    if (res.status === 404 || !res.ok) {
      notFound();
    }

    destination = await res.json();
  } catch {
    notFound();
  }

  if (!destination) {
    notFound();
  }

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-16 pt-5 lg:px-20">
        {/* Navigation and action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/destination"
            className="flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft className="size-4" />
            Back to Destinations
          </Link>

          <div className="flex items-center gap-2.5">
            <EditDestinationButton destination={destination} />
            <DeleteDestinationButton destination={destination} />
          </div>
        </div>

        {/* Destination image */}
        {destination.imageUrl && (
          <img
            src={destination.imageUrl}
            alt={destination.destinationName}
            className="mt-4 h-[300px] w-full rounded-[4px] object-cover sm:h-[400px] lg:h-[460px]"
          />
        )}

        {/* Destination details and booking component */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <section>
            <p className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
              <MapPin className="size-3.5 shrink-0 text-neutral-400" />
              {destination.country}
            </p>

            <h1 className="mt-2 text-3xl font-light text-neutral-900 sm:text-4xl">
              {destination.destinationName}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
              <span className="flex items-center gap-1 text-emerald-600">
                <Star className="size-3.5 fill-emerald-600 text-emerald-600" />
                <span className="font-semibold text-neutral-900">
                  {destination.rating != null
                    ? Number(destination.rating).toFixed(1)
                    : "4.9"}
                </span>
                <span className="text-neutral-400 font-normal">(234 reviews)</span>
              </span>

              {destination.duration && (
                <span className="flex items-center gap-1.5 font-medium text-neutral-700">
                  <CalendarDays className="size-3.5 text-neutral-400" />
                  {destination.duration}
                </span>
              )}
            </div>

            {destination.description && (
              <>
                <h2 className="mt-8 text-xl font-light text-neutral-900">
                  Overview
                </h2>

                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
                  {destination.description}
                </p>

                <h2 className="mt-8 text-xl font-light text-neutral-900">
                  Highlights
                </h2>

                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
                  {destination.description}
                </p>

                <div className="mt-4 grid grid-cols-1 gap-y-2.5 gap-x-6 sm:grid-cols-2 text-xs text-neutral-700">
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600 shrink-0" />
                    <span>Luxury beachfront accommodation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600 shrink-0" />
                    <span>Visit Uluwatu Temple at sunset</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600 shrink-0" />
                    <span>Traditional Balinese spa treatment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600 shrink-0" />
                    <span>Private beach dinner experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600 shrink-0" />
                    <span>Sunrise trek to Mount Batur</span>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* Booking card matching user screenshot */}
          <aside className="h-fit">
            <Booking destination={destination} />
          </aside>
        </div>
      </div>
    </main>
  );
};

export default DestinationDetailsPage;
