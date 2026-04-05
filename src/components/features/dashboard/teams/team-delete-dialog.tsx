"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TeamRow } from "@/types";

interface Props {
  target: TeamRow | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function TeamsDeleteDialog({
  target,
  onOpenChange,
  onConfirm,
}: Props) {
  return (
    <AlertDialog
      open={!!target}
      onOpenChange={(open) => !open && onOpenChange(false)}
    >
      <AlertDialogContent className="max-w-sm rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-semibold text-gray-900">
            Delete team?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-500">
            Are you sure you want to delete this team?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
