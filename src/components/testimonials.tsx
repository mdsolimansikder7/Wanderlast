import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const testimonials = [
  {
    quote:
      '"The Bali Trip Was Absolutely Magical! Every Detail Was Perfectly Planned. The Resorts Were Luxurious And The Cultural Experiences Were Unforgettable."',
    name: "Michael Chen",
    location: "Singapore",
    image: "/images/person2.png",
  },
  {
    quote:
      '"Swiss Alps Adventure Exceeded All Expectations. The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommend!"',
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "/images/person1.png",
  },
  {
    quote:
      '"The Iceland Northern Lights Tour Was A Dream Come True. Seamless Logistics From Start To Finish And Memories That Will Last A Lifetime."',
    name: "David Miller",
    location: "Toronto, Canada",
    image: "/images/person2.png",
  },
  {
    quote:
      '"Our Santorini Escape Was Pure Bliss. Sunset Views, Incredible Food And A Guide Who Knew Every Hidden Spot. We Cannot Wait To Book Again!"',
    name: "Emily Carter",
    location: "London, UK",
    image: "/images/person1.png",
  },
]

const arrowClassName =
  "static size-12 border-neutral-200 bg-white text-neutral-400 disabled:opacity-100 enabled:hover:border-neutral-400 enabled:hover:bg-white enabled:hover:text-neutral-600"

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-white py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
        <Carousel opts={{ align: "start" }}>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.1] font-normal tracking-[-0.02em] text-neutral-950">
                What Travelers Say
              </h2>
              <p className="mt-3 text-base text-neutral-600 sm:text-lg">
                Real experiences from our happy travelers
              </p>
            </div>
            <div className="flex gap-5">
              <CarouselPrevious
                icon={<ArrowLeft className="size-5" strokeWidth={1.5} />}
                aria-label="Previous testimonials"
                className={arrowClassName}
              />
              <CarouselNext
                icon={<ArrowRight className="size-5" strokeWidth={1.5} />}
                aria-label="Next testimonials"
                className={arrowClassName}
              />
            </div>
          </div>

          <CarouselContent className="mt-10 -ml-6 lg:mt-12">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.name} className="pl-6 xl:basis-1/2">
                <article className="flex h-full flex-col border border-neutral-200 bg-white px-7 py-6 sm:flex-row sm:gap-4">
                  <div className="flex flex-1 flex-col">
                    <blockquote className="text-lg leading-6 text-neutral-900">
                      {testimonial.quote}
                    </blockquote>
                    <div className="mt-8 sm:mt-auto">
                      <p className="flex items-center gap-2 text-lg text-brand">
                        <span aria-hidden className="h-px w-4 bg-brand" />
                        {testimonial.name}
                      </p>
                      <p className="mt-1 pl-6 text-base text-neutral-500">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <Image
                    src={testimonial.image}
                    alt=""
                    width={218}
                    height={264}
                    className="mt-6 h-[220px] w-full object-cover object-top sm:mt-0 sm:h-[264px] sm:w-[218px] sm:shrink-0"
                  />
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}
