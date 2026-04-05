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

type DeactivateRoleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleName: string;
  onConfirm: () => void;
};

export function DeactivateRoleDialog({
  open,
  onOpenChange,
  roleName,
  onConfirm,
}: DeactivateRoleDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate role?</AlertDialogTitle>
          <AlertDialogDescription>
            All users assigned to{" "}
            <span className="font-semibold">{roleName}</span> must be reassigned
            to another role or removed before deactivation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive-400 hover:bg-destructive-700"
          >
            Deactivate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
