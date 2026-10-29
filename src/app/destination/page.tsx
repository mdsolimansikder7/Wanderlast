import type { Metadata } from "next";

import { DestinationExplorer } from "@/components/destination/destination-explorer";
import type { Destination } from "@/lib/destinations";
import { getApiUrl } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Explore All Destinations | Wanderlast",
  description:
    "Find your perfect travel experience from our curated collection of destinations.",
};

async function getDestinations(): Promise<Destination[]> {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/destination`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    return Array.isArray(data) ? (data as Destination[]) : [];
  } catch (error) {
    console.error("Failed to load destinations", error);
    return [];
  }
}

export default async function Destination() {
  const destinations = await getDestinations();

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 pt-10 pb-16 lg:px-20 lg:pt-14">
        <h1 className="text-[30px] leading-tight font-light tracking-[-0.02em] text-neutral-950 sm:text-[38px]">
          Explore All Destinations
        </h1>
        <p className="mt-2 text-[15px] text-neutral-500">
          Find your perfect travel experience from our curated collection.
        </p>

        <DestinationExplorer destinations={destinations} />
      </div>
    </main>
  );
}
