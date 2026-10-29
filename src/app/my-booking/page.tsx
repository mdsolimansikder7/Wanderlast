import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BookingsList, BookingItem } from "@/components/booking/bookings-list";
import { getApiUrl } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Bookings | Wanderlust",
  description: "Manage and view your upcoming travel plans.",
};

async function getBookings(email: string): Promise<BookingItem[]> {
  try {
    const apiUrl = getApiUrl();
    const res = await fetch(
      `${apiUrl}/booking?email=${encodeURIComponent(email)}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to load user bookings:", error);
    return [];
  }
}

export default async function MyBookingPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const bookings = await getBookings(session.user.email);

  return (
    <main className="flex-1 bg-white py-10 lg:py-14">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-20">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[32px] sm:text-[38px] font-normal tracking-tight text-neutral-900">
            My Bookings
          </h1>
          <p className="text-sm text-neutral-500">
            Manage and view your upcoming travel plans
          </p>
        </div>

        <BookingsList
          initialBookings={bookings}
          userEmail={session.user.email}
        />
      </div>
    </main>
  );
}
