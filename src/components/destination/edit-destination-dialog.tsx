"use client";

import * as React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Trash2, Save, ChevronDown } from "lucide-react";

type DestinationFormData = {
  destinationName: string;
  country: string;
  category: string;
  price: string;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
};

type EditDestinationDialogProps = DestinationFormData & {
  open: boolean;
  onOpenChange: (open: boolean) => boolean | void;
  onSave: (data: DestinationFormData) => Promise<void> | void;
  onChange: (field: keyof DestinationFormData, value: string) => void;
  isLoading?: boolean;
};

export function EditDestinationDialog({
  open,
  onOpenChange,
  destinationName,
  country,
  category,
  price,
  duration,
  departureDate,
  imageUrl,
  description,
  onSave,
  onChange,
  isLoading = false,
}: EditDestinationDialogProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    void onSave({
      destinationName,
      country,
      category,
      price,
      duration,
      departureDate,
      imageUrl,
      description,
    });
  };

  return (
    <DialogContent
      showCloseButton={false}
      className="w-[calc(100%-24px)] max-w-[600px] gap-0 overflow-hidden rounded-none border-0 bg-white p-0 text-neutral-900 shadow-2xl sm:max-w-[600px]"
    >
      <DialogHeader className="relative space-y-1 px-5 pb-5 pt-5 sm:px-6">
        <DialogTitle className="text-[14px] font-normal tracking-tight">
          Update Travel Package
        </DialogTitle>

        <DialogDescription className="text-[11px] text-neutral-500">
          Make changes to the travel package details below
        </DialogDescription>

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
          aria-label="Close dialog"
          className="absolute right-4 top-3 rounded-sm p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50"
        >
          <X className="size-4" />
        </button>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="grid gap-3 px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="grid gap-1">
          <Label htmlFor="destinationName" className="text-[11px] font-medium">
            Destination Name
          </Label>
          <Input
            id="destinationName"
            value={destinationName}
            onChange={(e) => onChange("destinationName", e.target.value)}
            placeholder="e.g., Bali Paradise"
            required
            className="h-[36px] rounded-none border-neutral-200 bg-neutral-50 px-2 text-[11px] shadow-none placeholder:text-neutral-400 focus-visible:ring-1"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="grid min-w-0 gap-1">
            <Label htmlFor="country" className="text-[11px] font-medium">
              Country
            </Label>
            <Input
              id="country"
              value={country}
              onChange={(e) => onChange("country", e.target.value)}
              placeholder="e.g., Indonesia"
              required
              className="h-[36px] rounded-none border-neutral-200 bg-neutral-50 px-2 text-[11px] shadow-none"
            />
          </div>

          <div className="grid min-w-0 gap-1">
            <Label htmlFor="category" className="text-[11px] font-medium">
              Category
            </Label>
<Select
              value={category ?? ""}
              onValueChange={(v) => onChange("category", String(v ?? ""))}
            >
              <SelectTrigger className="w-full">
                <SelectValue className="flex-1 truncate text-left">
                  {category ?? "Select category"}
                </SelectValue>
                <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beach">Beach</SelectItem>
                <SelectItem value="mountain">Mountain</SelectItem>
                <SelectItem value="city">City</SelectItem>
                <SelectItem value="desert">Desert</SelectItem>
                <SelectItem value="cruise">Cruise</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="grid min-w-0 gap-1">
            <Label htmlFor="price" className="text-[11px] font-medium">
              Price (USD)
            </Label>
            <Input
              id="price"
              type="number"
              min="0"
              value={price}
              onChange={(e) => onChange("price", e.target.value)}
              placeholder="e.g., 1299"
              required
              className="h-[36px] rounded-none border-neutral-200 bg-neutral-50 px-2 text-[11px] shadow-none"
            />
          </div>

          <div className="grid min-w-0 gap-1">
            <Label htmlFor="duration" className="text-[11px] font-medium">
              Duration
            </Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => onChange("duration", e.target.value)}
              placeholder="e.g., 7 Days/6 Nights"
              required
              className="h-[36px] rounded-none border-neutral-200 bg-neutral-50 px-2 text-[11px] shadow-none"
            />
          </div>
        </div>

        <div className="grid gap-1">
          <Label htmlFor="departureDate" className="text-[11px] font-medium">
            Departure Date
          </Label>
          <Input
            id="departureDate"
            type="date"
            value={departureDate}
            onChange={(e) => onChange("departureDate", e.target.value)}
            required
            className="h-[36px] rounded-none border-neutral-200 bg-neutral-50 px-2 text-[11px] shadow-none"
          />
        </div>

        <div className="grid gap-1">
          <Label htmlFor="imageUrl" className="text-[11px] font-medium">
            Image URL
          </Label>
          <Input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => onChange("imageUrl", e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="h-[36px] rounded-none border-neutral-200 bg-neutral-50 px-2 text-[11px] shadow-none"
          />
        </div>

        <div className="grid gap-1">
          <Label htmlFor="description" className="text-[11px] font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Describe the travel experience..."
            className="min-h-[82px] resize-y rounded-none border-neutral-200 bg-neutral-50 px-2 py-2 text-[11px] shadow-none"
          />
        </div>

        <DialogFooter className="flex-row justify-end gap-2 border-0 bg-transparent pt-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="h-[38px] rounded-none border-red-300 px-3 text-[11px] font-normal text-red-500 shadow-none hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="mr-1.5 size-3.5" />
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            className="h-[38px] rounded-none bg-[#159fbb] px-4 text-[11px] font-medium text-white shadow-none hover:bg-[#118ba4]"
          >
            <Save className="mr-1.5 size-3.5" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}