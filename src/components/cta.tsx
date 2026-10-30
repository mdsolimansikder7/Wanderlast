import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Cta() {
  return (
    <section className="relative isolate flex min-h-[360px] items-center justify-center overflow-hidden bg-neutral-900 py-20 sm:min-h-[440px]">
      <Image
        src="/images/CTA.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 flex w-full flex-col items-center px-6 text-center">
        <h2 className="text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.1] font-light tracking-[-0.02em] text-white">
          Ready To Start Your Journey?
        </h2>
        <p className="mt-4 max-w-[640px] text-base text-white/90 sm:text-lg">
          Join thousands of travelers who have discovered the world with us
        </p>
        <Link
          href="/destination"
          className="mt-10 inline-flex h-[50px] items-center justify-center gap-5 bg-white px-8 text-[15px] font-medium tracking-[0.04em] text-neutral-950 uppercase transition-colors hover:bg-white/90"
        >
          Book Your Trip Today
          <ArrowRight className="size-5" strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  )
}
