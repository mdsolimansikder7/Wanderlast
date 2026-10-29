"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, LoaderCircle, Trash2 } from "lucide-react";

type DeleteDestinationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => boolean | void;
  destinationName: string;
  onDelete: () => Promise<void> | void;
  isLoading?: boolean;
};

export function DeleteDestinationDialog({
  open,
  onOpenChange,
  destinationName,
  onDelete,
  isLoading = false,
}: DeleteDestinationDialogProps) {
  const handleDelete = async () => {
    await onDelete();
  };

  return (
    <DialogContent className="w-[calc(100%-32px)] max-w-sm gap-0 rounded-lg p-6">
      <DialogHeader>
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="size-5 text-red-600" />
          </div>

          <div className="space-y-2">
            <DialogTitle className="text-base font-semibold">
              Delete Travel Package
            </DialogTitle>

            <DialogDescription className="text-sm leading-6 text-neutral-500">
              Are you sure you want to delete{" "}
              <span className="font-medium text-neutral-900">
                {destinationName}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <DialogFooter className="mt-6 flex-row justify-end gap-2 sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoaderCircle className="mr-2 size-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 size-4" />
              Delete Package
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}