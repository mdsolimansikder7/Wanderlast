export type Destination = {
  _id: string;
  destinationName: string;
  country: string;
  category: string;
  price: string | number;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description?: string;
};

export const categoryLabels: Record<string, string> = {
  beach: "Beach",
  mountain: "Mountain",
  city: "City",
  desert: "Desert",
  cruise: "Cruise",
  cultural: "Cultural",
};

const FALLBACK_IMAGE = "/images/Banner.png";

/** User supplied image URLs can be empty, malformed or point to HTML pages. */
export function resolveImageUrl(imageUrl: string) {
  const url = (imageUrl ?? "").trim();

  if (!url || !/^https?:\/\//i.test(url)) {
    return FALLBACK_IMAGE;
  }

  // Bing "images/search" links are result pages, not image files.
  if (/bing\.com\/images\/search/i.test(url)) {
    return FALLBACK_IMAGE;
  }

  return url;
}

export function priceValue(price: string | number) {
  const value =
    typeof price === "number" ? price : Number(String(price).replace(/[^\d.]/g, ""));

  return Number.isFinite(value) ? value : 0;
}
