"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, User, LogOut } from "lucide-react";
import { cn } from "cn";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const mainLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destination" },
  { label: "Add Destinations", href: "/add-destination" },
  { label: "My Booking", href: "/my-booking" },
];

const linkClassName =
  "text-[15px] font-medium whitespace-nowrap text-neutral-900 transition-colors hover:text-brand";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <header className="relative z-40 bg-white border-b border-neutral-100">
      <div className="relative mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-6 px-6 lg:px-8">
        <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={cn(linkClassName, pathname === link.href && "text-brand hover:text-brand")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Sheet>
          <SheetTrigger
            aria-label="Open menu"
            className="inline-flex size-10 items-center justify-center rounded-md text-neutral-900 transition-colors hover:bg-neutral-100 lg:hidden"
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="text-lg">Menu</SheetTitle>
            </SheetHeader>
            <nav aria-label="Mobile" className="flex flex-col px-2">
              {mainLinks.map((link) => (
                <SheetClose
                  key={link.href}
                  nativeButton={false}
                  render={<Link href={link.href} />}
                  className={cn(
                    "flex h-11 items-center rounded-md px-3 text-[15px] font-medium transition-colors hover:bg-neutral-100",
                    pathname === link.href && "text-brand"
                  )}
                >
                  {link.label}
                </SheetClose>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-1 border-t p-2">
              {status === "authenticated" ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 border-b border-neutral-100 mb-1">
                    <div className="size-9 shrink-0 overflow-hidden rounded-full border border-neutral-200">
                      <img
                        src={session?.user?.image || "/images/person1.png"}
                        alt={session?.user?.name || "Profile"}
                        className="size-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/images/person1.png";
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-neutral-900">
                        {session?.user?.name || "User"}
                      </p>
                      <p className="truncate text-xs text-neutral-500">
                        {session?.user?.email}
                      </p>
                    </div>
                  </div>
                  <SheetClose
                    nativeButton={false}
                    render={<Link href="/profile" />}
                    className="flex h-11 items-center gap-2 rounded-md px-3 text-[15px] font-medium transition-colors hover:bg-neutral-100"
                  >
                    <User className="size-4" />
                    My Profile
                  </SheetClose>
                  <SheetClose
                    nativeButton={false}
                    render={
                      <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: "/" })}
                      >
                        <LogOut className="size-4" />
                        Sign Out
                      </button>
                    }
                    className="flex h-11 items-center gap-2 rounded-md px-3 text-[15px] font-medium text-red-600 transition-colors hover:bg-neutral-100"
                  >
                    <LogOut className="size-4" />
                    Sign Out
                  </SheetClose>
                </>
              ) : (
                <>
                  <SheetClose
                    nativeButton={false}
                    render={<Link href="/login" />}
                    className="flex h-11 items-center gap-2 rounded-md px-3 text-[15px] font-medium transition-colors hover:bg-neutral-100"
                  >
                    Login
                  </SheetClose>
                  <SheetClose
                    nativeButton={false}
                    render={<Link href="/signup" />}
                    className="flex h-11 items-center gap-2 rounded-md px-3 text-[15px] font-medium text-brand transition-colors hover:bg-neutral-100"
                  >
                    Sign Up
                  </SheetClose>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <Link
          href="/"
          aria-label="Wanderlast home"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0"
        >
          <Image
            src="/images/Wanderlast.png"
            alt="Wanderlast"
            width={162}
            height={24}
            className="h-5 w-auto sm:h-6"
          />
        </Link>

        <div className="flex items-center gap-4">
          {status === "authenticated" ? (
            <div className="flex items-center gap-4">
              <Link
                href="/profile"
                className={cn(linkClassName, "hidden items-center gap-1.5 md:flex")}
              >
                <User className="size-4" />
                My Profile
              </Link>
              <div className="flex items-center gap-2.5">
                <Link
                  href="/profile"
                  title="My Profile"
                  className="group relative flex size-9 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 overflow-hidden ring-2 ring-transparent transition-all hover:ring-brand/40 hover:border-brand"
                >
                  <img
                    src={session?.user?.image || "/images/person1.png"}
                    alt={session?.user?.name || "Profile"}
                    className="size-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/person1.png";
                    }}
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  title="Sign Out"
                  className="hidden size-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-red-600 transition-colors md:flex"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className={cn(linkClassName, "hidden sm:block")}>
                Login
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-9 items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground shadow transition-colors hover:bg-brand/90"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
