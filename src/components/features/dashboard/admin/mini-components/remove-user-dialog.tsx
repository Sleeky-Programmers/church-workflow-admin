"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text, Span } from "@/components/ui/typography/Text";

type RemoveUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  onConfirm: () => void;
};

export function RemoveUserDialog({
  open,
  onOpenChange,
  userName,
  onConfirm,
}: RemoveUserDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const isConfirmValid = confirmText.toLowerCase() === "remove user";

  const handleConfirm = () => {
    if (isConfirmValid) {
      onConfirm();
      setConfirmText("");
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setConfirmText("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove user?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <Text variant="muted">This action cannot be undone. </Text>

            <Text variant="muted">
              {" "}
              If you are sure you want to remove{" "}
              <Span className="default">{userName}</Span> from this role, type
              &quot;remove user&quot; below.
            </Text>
            <div className="space-y-2">
              <Label htmlFor="confirm-input">
                Type &quot;remove user&quot;
              </Label>
              <Input
                id="confirm-input"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="remove user"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isConfirmValid}
            className="bg-destructive-600 hover:bg-destructive-700 disabled:opacity-50"
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
