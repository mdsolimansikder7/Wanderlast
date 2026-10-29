import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import type { SVGProps } from "react"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destination" },
  { label: "My Bookings", href: "/my-booking" },
  { label: "My Profile", href: "/profile" },
]

const supportLinks = [
  { label: "Help Center", href: "/help" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
]

const socialLinks = [
  { label: "X", href: "https://x.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Instagram", href: "https://instagram.com" },
]

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M17.53 3h3.02l-6.6 7.54L22 21h-5.98l-4.68-6.12L6.0 21H3l7.06-8.07L2.5 3h6.13l4.23 5.6L17.53 3Zm-1.06 16.2h1.67L7.6 4.7H5.8l10.67 14.5Z" />
    </svg>
  )
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.8v1.65h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21h-4V9Z" />
    </svg>
  )
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

const socialIcons = {
  X: XIcon,
  LinkedIn: LinkedInIcon,
  Instagram: InstagramIcon,
}

const columnHeadingClassName =
  "text-lg leading-none font-medium tracking-[-0.01em] text-white"

const columnLinkClassName =
  "text-[15px] text-neutral-400 transition-colors hover:text-white"

export  default function Footer() {
  return (
    <footer className="bg-neutral-950 text-white">
      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-20 lg:py-20">
        <div>
          <Link href="/" aria-label="Wanderlast home" className="inline-flex">
            <Image
              src="/images/Wanderlast-1.png"
              alt="Wanderlast"
              width={542}
              height={80}
              className="h-8 w-auto sm:h-10"
            />
          </Link>
          <p className="mt-6 max-w-[420px] text-[15px] leading-relaxed text-neutral-400">
            Explore breathtaking destinations and create unforgettable memories
            with our curated travel experiences.
          </p>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_0.8fr] lg:gap-8">
          <div>
            <h2 className={columnHeadingClassName}>Newsletter</h2>
            <p className="mt-4 max-w-[300px] text-[15px] leading-relaxed text-neutral-400">
              Subscribe for travel inspiration and exclusive offers.
            </p>
            <div className="relative mt-5 w-full max-w-[320px]">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                className="h-12 w-full bg-neutral-800 pr-14 pl-4 text-[15px] text-white placeholder:text-neutral-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              />
              <button
                type="button"
                aria-label="Subscribe to newsletter"
                className="absolute top-1 right-1 flex size-10 items-center justify-center text-white transition-colors hover:bg-white/10"
              >
                <ArrowUpRight className="size-5" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          <nav aria-label="Quick links">
            <h2 className={columnHeadingClassName}>Quick Links</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={columnLinkClassName}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Support">
            <h2 className={columnHeadingClassName}>Support</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={columnLinkClassName}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={columnHeadingClassName}>Contact Us</h2>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <a href="tel:+7869011622" className={columnLinkClassName}>
                  786 901 1622
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@wandarland.com"
                  className={columnLinkClassName}
                >
                  info@wandarland.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-500">
            © 2026 Wanderlust. All rights reserved.
          </p>
          <ul className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = socialIcons[social.label as keyof typeof socialIcons]
              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex size-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/60 hover:bg-white/10"
                  >
                    <Icon className="size-[18px]" />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </footer>
  )
}
