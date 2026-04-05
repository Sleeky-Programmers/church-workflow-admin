"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/typography/Text";
import { GripVertical, Plus } from "lucide-react";

type OrderOfServiceModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceName: string;
  items: string[];
  editable?: boolean;
  onSave?: (items: string[]) => void;
};

export function OrderOfServiceModal({
  open,
  onOpenChange,
  serviceName,
  items,
  editable = false,
  onSave,
}: OrderOfServiceModalProps) {
  const [localItems, setLocalItems] = useState(items);
  const [newItem, setNewItem] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      setLocalItems(items);
      setNewItem("");
      setDragIndex(null);
    }
  }, [open, items]);

  const handleDrop = (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) return;

    const reordered = [...localItems];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    setLocalItems(reordered);
    setDragIndex(null);
  };

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    setLocalItems((prev) => [...prev, newItem.trim()]);
    setNewItem("");
  };

  const handleRemoveItem = (index: number) => {
    setLocalItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave?.(localItems);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        mobileSheet
        className="max-w-sm p-0 overflow-hidden max-sm:max-h-[88vh]"
      >
        <DialogHeader className="px-5 py-4 border-b">
          <DialogTitle className="text-lg">
            {serviceName} Order of Service
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 py-4 space-y-2">
          {localItems.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex items-center gap-3 rounded-md border px-3 py-2 bg-white"
              draggable={editable}
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => {
                if (editable) e.preventDefault();
              }}
              onDrop={() => {
                if (editable) handleDrop(index);
              }}
            >
              {editable && <GripVertical className="h-4 w-4 text-gray-500" />}
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs font-medium flex-shrink-0">
                {index + 1}
              </span>
              <Text className="flex-1">{item}</Text>
              {editable && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveItem(index)}
                  className="text-destructive-600 hover:text-destructive-700"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}

          {editable && (
            <div className="flex items-center gap-2 pt-2">
              <Input
                placeholder="Add order item"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
              />
              <Button
                size="icon"
                onClick={handleAddItem}
                aria-label="Add order item"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="px-5 pb-5">
          {editable ? (
            <Button className="w-full" onClick={handleSave}>
              Save Order
            </Button>
          ) : (
            <Button className="w-full" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
