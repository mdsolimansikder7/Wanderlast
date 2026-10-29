"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { countries } from "@/lib/countries"

const inputClassName =
  "w-full bg-transparent text-sm text-neutral-700 outline-none placeholder:text-neutral-600"

export function Banner() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [duration, setDuration] = useState("any")
  const [budget, setBudget] = useState("")
  const [people, setPeople] = useState("")

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const params = new URLSearchParams()
    if (location.trim()) params.set("location", location.trim())
    if (duration !== "any") params.set("duration", duration)
    if (budget.trim()) params.set("budget", budget.trim())

    router.push(`/destination?${params.toString()}`)
  }

  return (
    <section className="relative flex min-h-[560px] flex-1 flex-col overflow-hidden bg-neutral-900 lg:min-h-[calc(100svh-72px)]">
      <Image
        src="/images/Banner.png"
        alt="Aerial view of a coastal village on a turquoise bay surrounded by forested hills"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:px-8 lg:py-20">
        <h1 className="text-[clamp(2.25rem,6.1vw,5.5rem)] leading-[0.98] font-light tracking-[-0.02em] text-white">
          Discover Your
          <br />
          Next Adventure
        </h1>
        <p className="mt-8 max-w-[640px] text-base leading-relaxed text-white/90 sm:text-lg">
          Explore breathtaking destinations and create unforgettable memories
          with our curated travel experiences.
        </p>
        <div className="mt-12 flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Link
            href="/destination"
            className="inline-flex h-[54px] items-center justify-center gap-3.5 bg-brand px-8 text-[13px] font-semibold tracking-[0.1em] text-white uppercase transition-colors hover:bg-brand/90"
          >
            Explore Now
            <ArrowRight className="size-[18px]" strokeWidth={1.75} />
          </Link>
          <Link
            href="/destination"
            className="inline-flex h-[54px] items-center justify-center bg-white/25 px-8 text-[13px] font-semibold tracking-[0.1em] text-white uppercase transition-colors hover:bg-white/35"
          >
            View Destination
          </Link>
        </div>
      </div>

      <form
        onSubmit={handleSearch}
        className="relative z-10 bg-white/85 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-[1440px] flex-col lg:h-[72px] lg:flex-row lg:items-stretch">
          <div
            role="group"
            aria-label="Search filters"
            className="grid flex-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          >
            {/* Location */}
            <label className="flex flex-col justify-center gap-1 px-6 py-3.5 lg:px-8 lg:py-0">
  <span className="text-lg leading-tight font-semibold text-neutral-900">
    Location
  </span>
  <input
    type="text"
    list="country-list"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    placeholder="Type or select country"
    autoComplete="off"
    className={inputClassName}
  />
  <datalist id="country-list">
    {countries.map((country) => (
      <option key={country} value={country} />
    ))}
  </datalist>
</label>

            {/* Duration */}
            <label className="flex flex-col justify-center gap-1 px-6 py-3.5 lg:border-l lg:border-white/60 lg:px-8 lg:py-0">
              <span className="text-lg leading-tight font-semibold text-neutral-900">
                Duration
              </span>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className={inputClassName}
              >
                <option value="any">Anytime</option>
                <option value="1-3">1 - 3 Days</option>
                <option value="4-7">4 - 7 Days</option>
                <option value="8+">8+ Days</option>
              </select>
            </label>

            {/* Budget */}
            <label className="flex flex-col justify-center gap-1 px-6 py-3.5 lg:border-l lg:border-white/60 lg:px-8 lg:py-0">
              <span className="text-lg leading-tight font-semibold text-neutral-900">
                Budget
              </span>
              <input
                type="number"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Max price, e.g. 3000"
                className={inputClassName}
              />
            </label>

            {/* People */}
            <label className="flex flex-col justify-center gap-1 px-6 py-3.5 lg:border-l lg:border-white/60 lg:px-8 lg:py-0">
              <span className="text-lg leading-tight font-semibold text-neutral-900">
                People
              </span>
              <input
                type="number"
                min="1"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                placeholder="e.g. 5"
                className={inputClassName}
              />
            </label>
          </div>
          <button
            type="submit"
            className="h-14 shrink-0 bg-brand text-lg font-medium text-white transition-colors hover:bg-brand/90 lg:h-[72px] lg:w-[197px]"
          >
            Search
          </button>
        </div>
      </form>
    </section>
  )
}