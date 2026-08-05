"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { updateChurch } from "@/services/churchService";

type FormValues = {
  name: string;
  alias: string;
  address: string;
  state: string;
  country: string;
};

export function EditChurchModal({
  open,
  onOpenChange,
  church,
  onUpdated,
}: any) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  useEffect(() => {
    if (open) {
      reset({
        name: church?.name || "",
        alias: church?.alias || "",
        address: church?.address || "",
        state: church?.state || "",
        country: church?.country || "",
      });
    }
  }, [open, church, reset]);
  const isMobile = useIsMobile();
  const onSubmit = async (data: FormValues) => {
    try {
      const updated = await updateChurch(data, file || undefined);

      toast({
        title: "Success",
        description: "Church updated successfully",
      });

      onUpdated?.(updated);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Update failed",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent mobileSheet={isMobile} className="sm:max-w-lg p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Edit Church</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-5 space-y-4">
          <div>
            <Label>Church Name</Label>
            <Input
              {...register("name", { required: "Church name is required" })}
              className="bg-gray-100"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label>Church Address</Label>
            <Input {...register("address")} className="bg-gray-100" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="State" {...register("state")} />
            <Input placeholder="Country" {...register("country")} />
          </div>

          <div>
            <Label>Upload Logo</Label>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <DialogFooter className="pt-4 border-t mt-4">
            <Button
              type="button"
              variant="destructive"
              size={"sm"}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" size={"sm"} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
