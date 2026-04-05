"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DepartmentRow } from "@/types";
import { Text } from "@/components/ui/typography/Text";

interface RowActionsMenuProps {
  row: DepartmentRow;
  onEdit: (row: DepartmentRow) => void;
  onExport: (row: DepartmentRow) => void;
  onDeleteRequest: (row: DepartmentRow) => void;
}

export default function RowActionsMenu({
  row,
  onEdit,
  onExport,
  onDeleteRequest,
}: RowActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
      >
        <MoreVertical className="h-4 w-4 text-gray-500" />
      </Button>

      {open && (
        <div
          className="absolute right-0 top-9 z-50 text-right rounded-xl border border-gray-100 bg-gray-50 py-1 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            className="justify-start gap-2 px-3"
            onClick={() => {
              onEdit(row);
              setOpen(false);
            }}
          >
            <Text variant="default">Edit</Text>
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-2 px-3"
            onClick={() => {
              onExport(row);
              setOpen(false);
            }}
          >
            <Text variant="default">Export</Text>
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-2 px-3 "
            onClick={() => {
              onDeleteRequest(row);
              setOpen(false);
            }}
          >
            <Text variant="error">Delete</Text>
          </Button>
        </div>
      )}
    </div>
  );
}
