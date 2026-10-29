import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ProfileView, UserProfile } from "@/components/profile/profile-view";
import { getApiUrl } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Profile | Wanderlust",
  description: "View and edit your personal profile and account settings.",
};

async function getUserBookingsCount(email?: string | null): Promise<number> {
  if (!email) return 0;
  try {
    const apiUrl = getApiUrl();
    const res = await fetch(
      `${apiUrl}/booking?email=${encodeURIComponent(email)}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data.length : 0;
    }
  } catch (error) {
    console.error("Failed to fetch bookings count:", error);
  }
  return 0;
}

async function getUserProfile(
  email: string,
  name?: string | null,
  image?: string | null
): Promise<UserProfile> {
  try {
    const apiUrl = getApiUrl();
    const res = await fetch(
      `${apiUrl}/user/profile?email=${encodeURIComponent(email)}`,
      { cache: "no-store" }
    );

    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        return data.user;
      }
    }

    const initRes = await fetch(`${apiUrl}/user/login-event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name: name || email.split("@")[0],
        image: image || "",
        loginAt: new Date().toISOString(),
      }),
    });

    if (initRes.ok) {
      const initData = await initRes.json();
      if (initData.user) {
        return initData.user;
      }
    }
  } catch (error) {
    console.error("Failed to load user profile:", error);
  }

  return {
    email,
    name: name || email.split("@")[0],
    image: image || "",
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const userEmail = session.user.email;
  const userName = session.user.name;
  const userImage = session.user.image;
  const authMethod = userImage && userImage.includes("google") ? "Google OAuth" : "Credentials";

  const [profile, bookingsCount] = await Promise.all([
    getUserProfile(userEmail, userName, userImage),
    getUserBookingsCount(userEmail),
  ]);

  return (
    <main className="flex-1 bg-white">
      <ProfileView
        initialProfile={profile}
        bookingsCount={bookingsCount}
        authMethod={authMethod}
      />
    </main>
  );
}
