"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { DeleteDestinationDialog } from "@/components/destination/delete-destination-dialog";
import { getApiUrl } from "@/lib/api";

type Props = {
  destination: {
    _id: string;
    destinationName: string;
  };
};

export function DeleteDestinationButton({ destination }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(
        `${apiUrl}/destination/${destination._id}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Failed to delete destination");
        return;
      }

      setOpen(false);
      router.replace("/destination");
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Backend server-এর সাথে সংযোগ করা যাচ্ছে না।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-9 gap-2 rounded-[3px] border border-red-300 bg-white px-4 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="mr-2 size-4" />
        Cancel
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DeleteDestinationDialog
          open={open}
          onOpenChange={setOpen}
          destinationName={destination.destinationName}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </Dialog>
    </>
  );
}
