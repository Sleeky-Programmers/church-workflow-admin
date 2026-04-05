"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RefreshCw, Star } from "lucide-react";
import { Span } from "@/components/ui/typography/Text";
import { Button } from "@/components/ui/button";
import { ServiceType } from "@/lib/enums";

type ServiceTypeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectType: (type: ServiceType.REGULAR | ServiceType.SPECIAL) => void;
};

export function ServiceTypeModal({
  open,
  onOpenChange,
  onSelectType,
}: ServiceTypeModalProps) {
  const handleTypeSelect = (
    type: ServiceType.REGULAR | ServiceType.SPECIAL,
  ) => {
    onSelectType(type);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showClose={false}
        mobileSheet
        className="sm:max-w-md max-sm:p-4"
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Service Type
          </DialogTitle>
          <DialogDescription className="sr-only">
            Choose whether to create a regular or special service.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-6">
          <Button
            onClick={() => handleTypeSelect(ServiceType.REGULAR)}
            className="flex flex-col items-center gap-4 p-8 rounded-lg border border-primary-200 bg-primary-50 hover:bg-primary-100 hover:border-primary-300 transition-colors"
          >
            <RefreshCw className="h-10 w-10 text-primary-600" />

            <Span variant="blue">Regular Service</Span>
          </Button>

          <Button
            onClick={() => handleTypeSelect(ServiceType.SPECIAL)}
            className="flex flex-col items-center gap-4 p-8 rounded-lg border border-primary-200 bg-primary-50 hover:bg-primary-100 hover:border-primary-300 transition-colors"
          >
            <Star className="h-10 w-10 text-primary-600" />

            <Span variant="blue">Special Service</Span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
