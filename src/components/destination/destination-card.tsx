import Link from "next/link";
import { ArrowUpRight, Clock, MapPin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  priceValue,
  resolveImageUrl,
  type Destination,
} from "@/lib/destinations";

export function DestinationCard({
  destination,
}: {
  destination: Destination;
}) {
  const price = priceValue(destination.price);
  const country = destination.country?.trim() ?? "";
  const duration = destination.duration?.trim() ?? "";

  return (
    <Card className="group/card hover:scale-[1.02] transition-transform duration-300 border-border shadow-sm">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={resolveImageUrl(destination.imageUrl)}
          alt={destination.destinationName}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = "/images/Banner.png";
          }}
          className="size-full object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
        />

        <Badge
          variant="secondary"
          className="absolute top-3 right-3 rounded-[3px] bg-white/95 px-2 text-[11px] font-semibold text-neutral-900 shadow-sm backdrop-blur-sm"
        >
          4.5
          <Star className="fill-amber-400 text-amber-400" aria-hidden />
          <span className="sr-only">out of 5 rating</span>
        </Badge>
      </div>

      <div className="flex flex-col gap-2 px-4 py-4">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{country}</span>
        </p>

        <h3 className="line-clamp-1 text-base font-semibold tracking-[-0.01em] text-foreground">
          {destination.destinationName}
        </h3>

        <div className="flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{duration}</span>
          </span>

          <div className="shrink-0">
            <span className="text-sm font-semibold text-foreground">
              ${price}
            </span>
            <span className="text-[10px] text-muted-foreground">/Person</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-brand tracking-[0.14em] uppercase transition-colors hover:text-brand/80">
          <Link href={`/destination/${destination._id}`}>
            Book Now
          </Link>
          <ArrowUpRight className="size-3.5" aria-hidden />
        </div>
      </div>
    </Card>
  );
}
