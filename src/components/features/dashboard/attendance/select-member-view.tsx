"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Member } from "@/types";
import { MemberListItem } from "./member-list";
import Heading from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";

type SelectMembersViewProps = {
  mode: "select" | "present" | "absent";
  title: string;
  actionLabel: string;
  members: Member[];
  selectedMembers: string[];
  onToggleMember: (memberId: string, selected: boolean) => void;
  onAction: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  removedCount?: number;
  onUndoRemove?: () => void;
  onRemoveMember?: (memberId: string) => void;
  editable?: boolean;
};

export function SelectMembersView({
  mode,
  title,
  actionLabel,
  members,
  selectedMembers,
  onToggleMember,
  onAction,
  searchQuery,
  onSearchChange,
  removedCount = 0,
  onUndoRemove,
  onRemoveMember,
  editable = true,
}: SelectMembersViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) {
      return members;
    }

    const query = searchQuery.toLowerCase();
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query),
    );
  }, [members, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize));
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, mode, members]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-4 border-b flex items-start justify-between gap-3">
        <div>
          <Heading level={3} className="mb-1">
            {title}
          </Heading>
          {mode === "select" && selectedMembers.length > 0 && (
            <Text variant="muted">
              {selectedMembers.length} member(s) selected
            </Text>
          )}
          {mode === "present" && removedCount > 0 && (
            <div className="flex items-center gap-4 w-full">
              <Text variant="error">You removed {removedCount} members</Text>
              <Button
                variant="outline"
                className="p-2"
                onClick={onUndoRemove}
                disabled={!onUndoRemove}
              >
                undo
              </Button>
            </div>
          )}
        </div>

        <Button
          onClick={onAction}
          disabled={
            editable && mode !== "present" && selectedMembers.length === 0
          }
          className="whitespace-nowrap"
        >
          {actionLabel}
        </Button>
      </div>

      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Select or search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {paginatedMembers.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-gray-500">
            <Text variant="default">No members found</Text>
          </div>
        ) : (
          <div className="p-4">
            {paginatedMembers.map((member) => (
              <MemberListItem
                key={member.id}
                member={member}
                mode={
                  mode === "present"
                    ? editable
                      ? "view-present"
                      : "readonly-present"
                    : mode === "absent"
                      ? editable
                        ? "view-absent"
                        : "readonly-absent"
                      : "select"
                }
                isSelected={selectedMembers.includes(member.id)}
                onSelect={editable ? onToggleMember : undefined}
                onRemove={editable ? onRemoveMember : undefined}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from(
              { length: Math.max(1, Math.min(3, totalPages)) },
              (_, i) => {
                const page = i + 1;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              },
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
