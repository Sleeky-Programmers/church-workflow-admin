"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type ChangeRoleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  currentRoleId: string;
  roles: any[];
  onConfirm: (newRoleId: string) => void;
  isLoading?: boolean;
};

export function ChangeRoleDialog({
  open,
  onOpenChange,
  userName,
  currentRoleId,
  roles,
  onConfirm,
  isLoading,
}: ChangeRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState(currentRoleId);

  useEffect(() => {
    setSelectedRole(currentRoleId);
  }, [currentRoleId, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole && selectedRole !== currentRoleId) {
      onConfirm(selectedRole);
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Role for {userName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Select New Role</Label>
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
              required
            >
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role: any) => (
                  <SelectItem key={role._id} value={role._id}>
                    {role.roleName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || selectedRole === currentRoleId}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
