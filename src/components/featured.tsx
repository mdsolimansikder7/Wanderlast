"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Calendar, MapPin, Star } from "lucide-react";

import {
  priceValue,
  resolveImageUrl,
  type Destination,
} from "@/lib/destinations";
import { getApiUrl } from "@/lib/api";

type CarouselApi = UseEmblaCarouselType[1];

const FALLBACK_FEATURED: Destination[] = [
  {
    _id: "bali-nepal",
    destinationName: "Bali Paradise",
    country: "Nepal",
    category: "beach",
    price: 2700,
    duration: "7 Days/5 Nights",
    departureDate: "05/20/2027",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    description: "Handpicked travel experiences for the adventure seekers",
  },
  {
    _id: "bali-indonesia",
    destinationName: "Bali Paradise",
    country: "Indonesia",
    category: "beach",
    price: 2700,
    duration: "7 Days/5 Nights",
    departureDate: "06/15/2027",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80",
    description: "Pristine turquoise waters and tropical overwater villas.",
  },
  {
    _id: "santorini-greece",
    destinationName: "Santorini Sunset",
    country: "Greece",
    category: "beach",
    price: 1899,
    duration: "6 Days/5 Nights",
    departureDate: "07/10/2027",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
    description: "White-washed villages and breathtaking caldera sunsets.",
  },
  {
    _id: "patagonia-argentina",
    destinationName: "Patagonia Wilderness",
    country: "Argentina",
    category: "mountain",
    price: 2799,
    duration: "10 Days/9 Nights",
    departureDate: "12/01/2026",
    imageUrl: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=900&q=80",
    description: "Glacier hikes and untouched wilderness at the end of the world.",
  },
  {
    _id: "kyoto-japan",
    destinationName: "Kyoto Heritage Journey",
    country: "Japan",
    category: "cultural",
    price: 2450,
    duration: "8 Days/7 Nights",
    departureDate: "04/10/2027",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80",
    description: "Historic shrines, tranquil gardens and traditional tea ceremonies.",
  },
];

interface FeaturedProps {
  initialDestinations?: Destination[];
}

export function Featured({ initialDestinations = [] }: FeaturedProps) {
  const [destinations, setDestinations] = useState<Destination[]>(() => {
    return initialDestinations.length > 0 ? initialDestinations : FALLBACK_FEATURED;
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: false,
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Client-side fetch if initialDestinations was empty
  useEffect(() => {
    if (initialDestinations.length > 0) {
      setDestinations(initialDestinations);
      return;
    }

    let isMounted = true;
    async function fetchFeatured() {
      try {
        const apiUrl = getApiUrl();
        const res = await fetch(`${apiUrl}/featured-destination`);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setDestinations(data);
        }
      } catch (err) {
        console.error("Failed to load featured destinations", err);
      }
    }

    fetchFeatured();

    return () => {
      isMounted = false;
    };
  }, [initialDestinations]);

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const onInit = useCallback((api: CarouselApi) => {
    if (!api) return;
    setScrollSnaps(api.scrollSnapList());
    setSelectedIndex(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("reInit", onInit);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const totalSnaps = scrollSnaps.length || Math.min(destinations.length, 5) || 5;
  const currentSlide = Math.min(selectedIndex + 1, totalSnaps);
  const progressPercent = totalSnaps > 1 ? (currentSlide / totalSnaps) * 100 : 100;

  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-10 sm:pb-12">
          <div>
            <h2 className="text-[32px] sm:text-[40px] lg:text-[46px] font-normal tracking-[-0.02em] text-neutral-900 leading-[1.1]">
              Featured Destinations
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-neutral-500 font-normal">
              Handpicked travel experiences for the adventure seekers
            </p>
          </div>

          <Link
            href="/destination"
            className="inline-flex items-center gap-2 self-start sm:self-auto border border-neutral-300 px-5 py-2.5 text-xs sm:text-[13px] font-medium tracking-[0.1em] text-neutral-800 uppercase transition-all duration-200 hover:border-neutral-950 hover:text-neutral-950 shrink-0"
          >
            All Destinations
            <ArrowRight className="size-4" strokeWidth={1.75} />
          </Link>
        </div>

        {/* Carousel Slider */}
        <div className="overflow-hidden -mx-3 px-3" ref={emblaRef}>
          <div className="flex -ml-6 sm:-ml-8">
            {destinations.map((item, idx) => {
              const price = priceValue(item.price);
              const duration = item.duration?.trim() || "7 Days/6 Nights";
              const country = item.country?.trim() || "Destination";
              const destinationId = item._id || String(idx);

              return (
                <div
                  key={destinationId}
                  className="min-w-0 shrink-0 grow-0 pl-6 sm:pl-8 basis-[88%] sm:basis-[48%] lg:basis-[40%] xl:basis-[36%]"
                >
                  <div className="group flex flex-col bg-white">
                    {/* Destination Image */}
                    <div className="relative aspect-[16/10.5] w-full overflow-hidden bg-neutral-100">
                      <img
                        src={resolveImageUrl(item.imageUrl)}
                        alt={item.destinationName}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "/images/Banner.png";
                        }}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 rounded-[2px] bg-white px-2 py-1 text-xs font-semibold text-neutral-900 shadow-xs">
                        <span>4.5</span>
                        <Star className="size-3 fill-neutral-950 text-neutral-950" />
                      </div>
                    </div>

                    {/* Destination Details */}
                    <div className="pt-4 flex flex-col">
                      {/* Location / Country */}
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                        <MapPin className="size-3.5 shrink-0 stroke-[1.5]" />
                        <span className="truncate">{country}</span>
                      </div>

                      {/* Name & Price */}
                      <div className="mt-1 flex items-baseline justify-between gap-3">
                        <h3 className="line-clamp-1 text-xl sm:text-2xl font-normal text-neutral-900 tracking-tight">
                          {item.destinationName}
                        </h3>
                        <div className="shrink-0 text-right">
                          <span className="text-xl sm:text-2xl font-bold text-neutral-900">
                            ${price}
                          </span>
                          <span className="text-xs text-neutral-400 font-normal">
                            /Person
                          </span>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-500">
                        <Calendar className="size-3.5 shrink-0 stroke-[1.5]" />
                        <span className="truncate">{duration}</span>
                      </div>

                      {/* Book Now Link */}
                      <div className="mt-4">
                        <Link
                          href={`/destination/${destinationId}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand tracking-[0.12em] uppercase transition-colors hover:text-brand/80"
                        >
                          Book Now
                          <ArrowUpRight className="size-4" strokeWidth={2} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Bottom Controls */}
        <div className="mt-12 sm:mt-16 flex items-center justify-between">
          {/* Slide Indicator */}
          <div className="text-base sm:text-lg font-normal text-neutral-900 min-w-[45px]">
            <span>{currentSlide}</span>
            <span className="text-neutral-400">/{totalSnaps}</span>
          </div>

          {/* Progress Bar Track */}
          <div className="mx-6 sm:mx-10 flex-1 h-[2px] bg-neutral-200 relative overflow-hidden rounded-full">
            <div
              className="h-full bg-brand transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Circular Navigation Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Previous slide"
              className="size-10 sm:size-11 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="size-4" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Next slide"
              className="size-10 sm:size-11 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
