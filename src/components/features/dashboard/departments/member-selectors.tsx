"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MemberProfile } from "@/types";
import { AVATAR_COLORS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Span } from "@/components/ui/typography/Text";
import { Checkbox } from "@/components/ui/checkbox";

function getAvatarColor(name: string) {
  if (!name) return AVATAR_COLORS[0];
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

function MemberAvatar({ name }: { name: string }) {
  const color = getAvatarColor(name);

  return (
    <Avatar className="h-5 w-5">
      <AvatarFallback
        className={cn("text-[10px] font-semibold", color.bg, color.text)}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

interface MemberSingleSelectProps {
  options: MemberProfile[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
}

export function MemberSingleSelect({
  options,
  value,
  onChange,
  placeholder = "Select or search",
}: MemberSingleSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = useMemo(
    () => options.find((member) => member.id === value),
    [options, value],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-10 w-full justify-between"
        >
          {selected ? (
            <span className="flex items-center gap-2 truncate">
              <MemberAvatar name={selected.fullName} />
              <span className="truncate">{selected.fullName}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <Command>
          <CommandInput placeholder="Search members..." />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {options.map((member) => (
                <CommandItem
                  key={member.id}
                  value={`${member.fullName}-${member.id}`}
                  onSelect={() => {
                    onChange(member.id);
                    setOpen(false);
                  }}
                >
                  <MemberAvatar name={member.fullName} />
                  <span className="truncate">{member.fullName}</span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === member.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface MemberMultiSelectProps {
  options: MemberProfile[];
  value: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
}

export function MemberMultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select or search",
}: MemberMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const selectedMembers = useMemo(
    () => options.filter((member) => value.includes(member.id)),
    [options, value],
  );

  const summary =
    selectedMembers.length === 0
      ? placeholder
      : selectedMembers.length <= 2
        ? selectedMembers.map((member) => member.fullName).join(", ")
        : `${selectedMembers.length} members selected`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-auto min-h-10 w-full justify-between py-2"
        >
          <Span
            className={cn(
              "truncate text-left",
              value.length === 0 && "text-muted-foreground",
            )}
          >
            {summary}
          </Span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <Command>
          <CommandInput placeholder="Search members..." />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {options.map((member) => {
                const isSelected = value.includes(member.id);
                return (
                  <CommandItem
                    key={member.id}
                    value={`${member.fullName}-${member.id}`}
                    onSelect={() => {
                      onChange(
                        isSelected
                          ? value.filter((id) => id !== member.id)
                          : [...value, member.id],
                      );
                    }}
                    className="gap-2"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <MemberAvatar name={member.fullName} />
                      <div className="min-w-0">
                        <Span className="truncate">{member.fullName}</Span>
                        <Span className="block text-xs text-muted-foreground truncate">
                          {member.email}
                        </Span>
                      </div>
                    </div>
                    <Checkbox checked={isSelected} className="ml-auto" />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          {value.length > 0 && (
            <div className="border-t px-3 py-2 text-xs text-muted-foreground">
              {value.length} member{value.length > 1 ? "s" : ""} selected
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
