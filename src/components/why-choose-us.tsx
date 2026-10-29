import Image from "next/image"

const features = [
  {
    icon: "/images/ShieldCheck.png",
    title: "Safe & Secure",
    description:
      "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
  },
  {
    icon: "/images/MapTrifold.png",
    title: "Expert Guides",
    description:
      "Local experts who bring destinations to life with authentic cultural insights.",
  },
  {
    icon: "/images/Headset.png",
    title: "24/7 Support",
    description:
      "Round-the-clock customer service to assist you wherever your journey takes you.",
  },
]

export function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="bg-brand/10 py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
        <div className="text-center">
          <h2 className="text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.1] font-normal tracking-[-0.02em] text-balance text-neutral-950">
            Why Choose Wanderlust
          </h2>
          <p className="mt-3 text-base text-neutral-600 sm:text-lg">
            Your trusted partner for exceptional travel experiences
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3 lg:mt-12">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="bg-white p-8 shadow-[0_1px_2px_rgba(15,23,42,0.05)] lg:p-10"
            >
              <Image
                src={feature.icon}
                alt=""
                width={48}
                height={48}
                className="size-8"
              />
              <h3 className="mt-0.5 text-[26px] leading-tight font-medium tracking-[-0.01em] text-neutral-950">
                {feature.title}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
