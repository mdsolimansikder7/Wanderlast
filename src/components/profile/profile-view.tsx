"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Calendar,
  Globe,
  DollarSign,
  Mail,
  ShieldCheck,
  Pencil,
  Loader2,
  Clock,
  User as UserIcon,
  Image as ImageIcon,
} from "lucide-react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { getApiUrl } from "@/lib/api";

export type UserProfile = {
  _id?: string;
  name?: string;
  email: string;
  image?: string;
  createdAt?: string;
  lastLogin?: string;
  lastLoginAt?: string;
  loginHistory?: string[];
  phone?: string;
  location?: string;
  bio?: string;
};

type Props = {
  initialProfile: UserProfile;
  bookingsCount: number;
  authMethod: string;
};

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
];

function formatDate(isoString?: string): string {
  if (!isoString) return "N/A";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

function formatMemberSince(isoString?: string): string {
  if (!isoString) return "Mar 2024";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Mar 2024";
  }
}

export function ProfileView({ initialProfile, bookingsCount, authMethod }: Props) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(initialProfile);

  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name || "");
  const [editImage, setEditImage] = useState(profile.image || "");
  const [isSaving, setIsSaving] = useState(false);

  const userName = profile.name || profile.email.split("@")[0] || "User";
  const userEmail = profile.email || "user@example.com";
  const userImage = profile.image || "/images/person1.png";

  const initials =
    userName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const lastLoginDisplay = formatDate(profile.lastLoginAt || profile.lastLogin);
  const memberSinceDisplay = formatMemberSince(profile.createdAt);

  const handleOpenEdit = () => {
    setEditName(profile.name || "");
    setEditImage(profile.image || "");
    setIsEditDialogOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          name: editName.trim(),
          image: editImage.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setProfile((prev) => ({
        ...prev,
        name: editName.trim(),
        image: editImage.trim(),
      }));

      setIsEditDialogOpen(false);
      toast.success("Profile Updated", "Your name and photo have been updated.");
      router.refresh();
    } catch (err: unknown) {
      toast.error(
        "Update Failed",
        err instanceof Error ? err.message : "Failed to update profile"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 py-10 lg:px-20 lg:py-14">
      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-[30px] leading-tight font-light tracking-[-0.02em] text-neutral-950 sm:text-[38px]">
            My Profile
          </h1>
          <p className="text-[15px] text-neutral-500">
            Manage your account settings and travel preferences
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-4">
        {/* Profile Column */}
        <div className="lg:col-span-1">
          <Card className="flex flex-col items-center gap-4 p-6 shadow-sm border-neutral-200">
            <div className="relative flex size-40 shrink-0 items-center justify-center rounded-full border border-neutral-100 bg-neutral-50 overflow-hidden">
              <Avatar className="size-40">
                <AvatarImage src={userImage} alt={userName} className="object-cover" />
                <AvatarFallback className="text-2xl font-medium bg-brand/10 text-brand">
                  {initials}
                </AvatarFallback>
                <AvatarBadge className="bg-emerald-500">
                  <Activity className="size-2.5 text-white" />
                </AvatarBadge>
              </Avatar>
            </div>

            <div className="text-center w-full">
              <CardTitle className="text-xl font-medium tracking-tight text-neutral-900">
                {userName}
              </CardTitle>
              <CardDescription className="flex items-center justify-center gap-1.5 mt-1 text-xs text-neutral-500">
                <Mail className="size-3.5 shrink-0" />
                <span className="truncate max-w-[200px]">{userEmail}</span>
              </CardDescription>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mt-4 pt-4 border-t border-neutral-100">
              <div className="text-center">
                <CardDescription className="text-xs text-muted-foreground">
                  Member since
                </CardDescription>
                <div className="text-sm font-medium text-foreground mt-0.5">
                  {memberSinceDisplay}
                </div>
              </div>
              <div className="text-center border-l border-neutral-100 pl-4">
                <CardDescription className="text-xs text-muted-foreground">
                  Status
                </CardDescription>
                <div className="text-sm font-medium text-emerald-600 mt-0.5">
                  Active
                </div>
              </div>
            </div>

            {/* Last Login Info Box */}
            <div className="w-full rounded-md border border-neutral-100 bg-neutral-50/70 p-3 text-xs text-neutral-600">
              <span className="text-neutral-400 block mb-1 font-medium flex items-center gap-1.5">
                <Clock className="size-3 text-brand" />
                Last Logged In:
              </span>
              <p className="font-semibold text-neutral-800">
                {lastLoginDisplay}
              </p>
            </div>

            <Button
              type="button"
              variant="default"
              onClick={handleOpenEdit}
              className="w-full mt-2 bg-brand text-brand-foreground hover:bg-brand/90 flex items-center justify-center gap-2 rounded-[3px] h-10 text-sm font-medium"
            >
              <Pencil className="size-3.5" />
              Edit Profile
            </Button>
          </Card>
        </div>

        {/* Travel Statistics & User Details */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4 shadow-sm border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between space-0 p-0">
                <div>
                  <CardTitle className="text-xs font-medium text-neutral-500">
                    Total Bookings
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs text-neutral-400">
                    All time
                  </CardDescription>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Activity className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="pt-3 p-0">
                <div className="text-2xl font-medium text-neutral-900">
                  {bookingsCount}
                </div>
              </CardContent>
            </Card>

            <Card className="p-4 shadow-sm border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between space-0 p-0">
                <div>
                  <CardTitle className="text-xs font-medium text-neutral-500">
                    Countries Visited
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs text-neutral-400">
                    Destinations
                  </CardDescription>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Globe className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="pt-3 p-0">
                <div className="text-2xl font-medium text-neutral-900">18</div>
              </CardContent>
            </Card>

            <Card className="p-4 shadow-sm border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between space-0 p-0">
                <div>
                  <CardTitle className="text-xs font-medium text-neutral-500">
                    Upcoming Trips
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs text-neutral-400">
                    Scheduled
                  </CardDescription>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Calendar className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="pt-3 p-0">
                <div className="text-2xl font-medium text-neutral-900">2</div>
              </CardContent>
            </Card>

            <Card className="p-4 shadow-sm border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between space-0 p-0">
                <div>
                  <CardTitle className="text-xs font-medium text-neutral-500">
                    Total Spent
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs text-neutral-400">
                    All time
                  </CardDescription>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <DollarSign className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="pt-3 p-0">
                <div className="text-2xl font-medium text-neutral-900">$15,750</div>
              </CardContent>
            </Card>
          </div>

          {/* User Details Section */}
          <Card className="p-6 shadow-sm border-neutral-200">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">
              User Details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-neutral-100 bg-neutral-50/50 p-4">
                <span className="text-xs font-medium text-neutral-500 block">
                  Full Name
                </span>
                <p className="mt-1 text-base font-medium text-neutral-900">
                  {userName}
                </p>
              </div>

              <div className="rounded-md border border-neutral-100 bg-neutral-50/50 p-4">
                <span className="text-xs font-medium text-neutral-500 block">
                  Email Address
                </span>
                <p className="mt-1 text-base font-medium text-neutral-900 truncate">
                  {userEmail}
                </p>
              </div>

              <div className="rounded-md border border-neutral-100 bg-neutral-50/50 p-4">
                <span className="text-xs font-medium text-neutral-500 block">
                  Last Login Date & Time
                </span>
                <p className="mt-1 text-base font-medium text-neutral-900 flex items-center gap-1.5">
                  <Clock className="size-4 text-brand shrink-0" />
                  {lastLoginDisplay}
                </p>
              </div>

              <div className="rounded-md border border-neutral-100 bg-neutral-50/50 p-4">
                <span className="text-xs font-medium text-neutral-500 block">
                  Account Status
                </span>
                <p className="mt-1 text-base font-medium text-emerald-600 flex items-center gap-1.5">
                  <ShieldCheck className="size-4 shrink-0" />
                  Verified Active Account
                </p>
              </div>

              <div className="rounded-md border border-neutral-100 bg-neutral-50/50 p-4">
                <span className="text-xs font-medium text-neutral-500 block">
                  Authentication Method
                </span>
                <p className="mt-1 text-base font-medium text-neutral-900">
                  {authMethod}
                </p>
              </div>

              <div className="rounded-md border border-neutral-100 bg-neutral-50/50 p-4">
                <span className="text-xs font-medium text-neutral-500 block">
                  Member Since
                </span>
                <p className="mt-1 text-base font-medium text-neutral-900">
                  {memberSinceDisplay}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* EDIT PROFILE DIALOG */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleSaveProfile}>
            <DialogHeader>
              <DialogTitle className="text-xl font-medium text-neutral-900">
                Edit Profile
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-500">
                Update your name and profile avatar image URL.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              {/* Avatar Live Preview */}
              <div className="flex items-center gap-4 rounded-[4px] bg-[#f8fafc] border border-neutral-100 p-3">
                <Avatar className="size-16 border border-neutral-200 shadow-sm shrink-0">
                  <AvatarImage src={editImage || userImage} alt={editName} />
                  <AvatarFallback className="text-lg bg-brand/10 text-brand">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="text-xs font-semibold text-neutral-800 block">
                    Avatar Preview
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Live preview of your chosen profile image
                  </span>
                </div>
              </div>

              {/* Name Field */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-name" className="text-xs font-semibold text-neutral-900">
                  Full Name
                </Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                  <Input
                    id="edit-name"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter your name"
                    className="pl-9 text-sm"
                  />
                </div>
              </div>

              {/* Picture URL Field */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-image" className="text-xs font-semibold text-neutral-900">
                  Profile Picture URL
                </Label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                  <Input
                    id="edit-image"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="pl-9 text-sm"
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-neutral-600 block">
                  Or pick a preset avatar:
                </Label>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditImage(preset)}
                      className={`relative size-10 shrink-0 rounded-full overflow-hidden border-2 transition-all ${
                        editImage === preset
                          ? "border-brand ring-2 ring-brand/30"
                          : "border-transparent opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img src={preset} alt={`preset ${idx}`} className="size-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={() => setIsEditDialogOpen(false)}
                className="text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-brand text-brand-foreground hover:bg-brand/90 text-xs h-9 gap-1.5 font-medium"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
