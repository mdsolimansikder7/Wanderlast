"use client";

import { ChevronDown as SelectPrimitiveIcon } from "lucide-react";
import { Compass } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import { DestinationCard } from "@/components/destination/destination-card";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  categoryLabels,
  priceValue,
  type Destination,
} from "@/lib/destinations";

const filterTriggerClassName =
  "h-11 w-full justify-between rounded-[3px] border-neutral-200 bg-[#f7f8f9] px-4 text-[11px] font-medium tracking-[0.14em] uppercase transition-colors hover:bg-[#f2f4f6] focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20 data-[size=default]:h-11 [&_svg]:size-4 [&_svg]:text-neutral-500";

const categoryOptions = [
  { value: "all", label: "All Categories" },
  ...Object.entries(categoryLabels).map(([value, label]) => ({ value, label })),
];

const priceRangeOptions = [
  { value: "all", label: "Any Price" },
  { value: "under-500", label: "Under $500" },
  { value: "500-1500", label: "$500 – $1,500" },
  { value: "1500-2500", label: "$1,500 – $2,500" },
  { value: "2500-plus", label: "$2,500 & Above" },
];

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

type FilterOption = { value: string; label: string };

function FilterSelect({
  id,
  placeholder,
  value,
  options,
  onChange,
}: {
  id: string;
  placeholder: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}) {
  const isDefault = value === options[0].value;
  const selected = options.find((option) => option.value === value);

  return (
    <Select
      value={value}
      onValueChange={(nextValue) => onChange(String(nextValue))}
    >
      <SelectTrigger
        id={id}
        aria-label={placeholder}
        className={cn(filterTriggerClassName, "border")}
      >
        <SelectValue className="flex-1 truncate text-left">
          {isDefault ? placeholder : selected?.label}
        </SelectValue>
        <SelectPrimitiveIcon className="size-4 text-neutral-500" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function DestinationExplorer({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sort, setSort] = useState("recommended");

  const visibleDestinations = useMemo(() => {
    const filtered = destinations.filter((destination) => {
      if (
        category !== "all" &&
        destination.category?.toLowerCase() !== category
      ) {
        return false;
      }

      const price = priceValue(destination.price);

      if (priceRange === "under-500") return price < 500;
      if (priceRange === "500-1500") return price >= 500 && price <= 1500;
      if (priceRange === "1500-2500") return price > 1500 && price <= 2500;
      if (priceRange === "2500-plus") return price > 2500;

      return true;
    });

    if (sort === "price-asc") {
      filtered.sort((a, b) => priceValue(a.price) - priceValue(b.price));
    } else if (sort === "price-desc") {
      filtered.sort((a, b) => priceValue(b.price) - priceValue(a.price));
    } else if (sort === "name-asc") {
      filtered.sort((a, b) =>
        a.destinationName.localeCompare(b.destinationName)
      );
    }

    return filtered;
  }, [category, destinations, priceRange, sort]);

  const resetFilters = () => {
    setCategory("all");
    setPriceRange("all");
    setSort("recommended");
  };

  return (
    <section className="mt-7">
      <div className="grid gap-3 sm:grid-cols-3">
        <FilterSelect
          id="filter-category"
          placeholder="Category"
          value={category}
          options={categoryOptions}
          onChange={setCategory}
        />
        <FilterSelect
          id="filter-price"
          placeholder="Price Range"
          value={priceRange}
          options={priceRangeOptions}
          onChange={setPriceRange}
        />
        <FilterSelect
          id="filter-sort"
          placeholder="Sort By"
          value={sort}
          options={sortOptions}
          onChange={setSort}
        />
      </div>

      <p className="mt-4 text-[13px] text-muted-foreground">
        Showing {visibleDestinations.length}{" "}
        {visibleDestinations.length === 1 ? "destination" : "destinations"}
      </p>

      {visibleDestinations.length > 0 ? (
        <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {visibleDestinations.map((destination) => (
            <DestinationCard key={destination._id} destination={destination} />
          ))}
        </div>
      ) : (
        <Empty className="mt-6 border border-dashed border-neutral-200 py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Compass />
            </EmptyMedia>
            <EmptyTitle>No destinations found</EmptyTitle>
            <EmptyDescription>
              {destinations.length === 0
                ? "No travel packages are available right now. Please check back soon."
                : "Try a different category or price range to see more packages."}
            </EmptyDescription>
          </EmptyHeader>
          {destinations.length > 0 && (
            <EmptyContent>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="rounded-[3px]"
              >
                Clear filters
              </Button>
            </EmptyContent>
          )}
        </Empty>
      )}
    </section>
  );
}