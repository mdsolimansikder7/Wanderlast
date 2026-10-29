import { Banner } from "@/components/banner";
import { Featured } from "@/components/featured";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Testimonials } from "@/components/testimonials";
import { Cta } from "@/components/cta";
import type { Destination } from "@/lib/destinations";
import { getApiUrl } from "@/lib/api";

export const dynamic = "force-dynamic";

async function getFeaturedDestinations(): Promise<Destination[]> {
  try {
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/featured-destination`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? (data as Destination[]) : [];
  } catch (error) {
    console.error("Failed to load featured destinations in page.tsx:", error);
    return [];
  }
}

export default async function Home() {
  const featured = await getFeaturedDestinations();

  return (
    <main className="flex flex-1 flex-col">
      <Banner />
      <Featured initialDestinations={featured} />
      <WhyChooseUs />
      <Testimonials />
      <Cta />
    </main>
  );
}
