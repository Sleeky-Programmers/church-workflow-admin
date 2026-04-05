"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookPlus, ChevronRight, UploadIcon } from "lucide-react";
import { Text, Span } from "@/components/ui/typography/Text";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

import { MemberFormType } from "@/lib/enums";

type AddMemberFormatModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectFormat: (format: MemberFormType.FORM | MemberFormType.CSV) => void;
};

export function AddMemberFormatModal({
  open,
  onOpenChange,
  onSelectFormat,
}: AddMemberFormatModalProps) {
  const isMobile = useIsMobile();

  const handleFormatSelect = (
    format: MemberFormType.FORM | MemberFormType.CSV,
  ) => {
    onSelectFormat(format);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showClose={false}
        mobileSheet
        className="sm:max-w-md max-sm:max-h-[70vh] max-sm:p-4"
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Add Member
          </DialogTitle>
        </DialogHeader>

        {isMobile ? (
          <div className="py-4 space-y-3">
            <Button
              variant="outline"
              onClick={() => handleFormatSelect(MemberFormType.FORM)}
              className="w-full h-auto justify-between p-4"
            >
              <div className="flex items-center gap-3 text-left">
                <Span className="h-10 w-10 rounded-md bg-primary-50 flex items-center justify-center">
                  <BookPlus className="h-5 w-5 text-primary-600" />
                </Span>
                <Span>
                  <Text variant="default">Create a Form</Text>
                  <Text variant="muted">Add a new member manually.</Text>
                </Span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>

            <Button
              variant="outline"
              onClick={() => handleFormatSelect(MemberFormType.CSV)}
              className=" p-4"
            >
              <div className="flex items-center gap-3 text-left">
                <Span className="h-10 w-10 rounded-md bg-primary-50 flex items-center justify-center">
                  <UploadIcon className="h-5 w-5 text-primary-600" />
                </Span>
                <Span>
                  <Text variant="default">Upload CSV</Text>
                  <Text variant="muted">Import multiple members at once.</Text>
                </Span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 py-6">
            <Button
              variant="outline"
              onClick={() => handleFormatSelect(MemberFormType.FORM)}
              className="h-44 flex-col gap-4 "
            >
              <BookPlus className="h-12 w-12 text-primary-600" />
              <Text variant="blue" className="uppercase">
                Create a Form
              </Text>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleFormatSelect(MemberFormType.CSV)}
              className="h-44 flex-col gap-4"
            >
              <UploadIcon className="h-12 w-12 text-primary-600" />
              <Text variant="blue" className="uppercase">
                Upload CVS
              </Text>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
