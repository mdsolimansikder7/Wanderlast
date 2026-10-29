"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import { EditDestinationDialog } from "@/components/destination/edit-destination-dialog";
import { getApiUrl } from "@/lib/api";

type Destination = {
  _id: string;
  destinationName: string;
  country: string;
  category: string;
  price: string;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
};

// ডেটাবেসে তারিখ mm/dd/yyyy, কিন্তু <input type="date"> চায় yyyy-mm-dd
function toInputDate(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value ?? "");
  if (!match) return "";
  return `${match[3]}-${match[1]}-${match[2]}`;
}

function toSavedDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");
  if (!match) return value;
  return `${match[2]}/${match[3]}/${match[1]}`;
}

export function EditDestinationButton({
  destination,
}: {
  destination: Destination;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    destinationName: destination.destinationName ?? "",
    country: destination.country ?? "",
    category: destination.category ?? "beach",
    price: destination.price ?? "",
    duration: destination.duration ?? "",
    departureDate: toInputDate(destination.departureDate),
    imageUrl: destination.imageUrl ?? "",
    description: destination.description ?? "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleSave = async (data: typeof form) => {
    setIsLoading(true);

    try {
      const apiUrl = getApiUrl();
      const res = await fetch(
        `${apiUrl}/destination/${destination._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            departureDate: toSavedDate(data.departureDate),
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Update failed");
        return;
      }

      setOpen(false);
      router.refresh(); // পেজে নতুন ডেটা দেখাবে
    } catch (error) {
      console.error(error);
      alert("Server-এর সাথে কানেক্ট হচ্ছে না।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 items-center gap-2 rounded-[3px] border border-neutral-300 px-4 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
      >
        <Pencil className="size-4" />
        Edit
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <EditDestinationDialog
          open={open}
          onOpenChange={setOpen}
          {...form}
          onChange={handleChange}
          onSave={handleSave}
          isLoading={isLoading}
        />
      </Dialog>
    </>
  );
}
