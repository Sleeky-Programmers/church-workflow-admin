"use client";

import { MemberProfile } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Text, Span } from "@/components/ui/typography/Text";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatDate } from "@/utils/helpers";

type MembersTableProps = {
  members: MemberProfile[];
  onRowClick: (memberId: string) => void;
  onAddMember?: () => void;
  pagination: {
    page: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  } | null;
  onPageChange: (page: number) => void;
};

export function MembersTable({
  members,
  onRowClick,
  onAddMember,
  pagination,
  onPageChange,
}: MembersTableProps) {
  const isMobile = useIsMobile();
  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 1;

  if (isMobile) {
    return (
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="divide-y">
          <div className="flex items-center justify-between px-3 py-3">
            <div className="flex items-center gap-3">
              <Checkbox />
              <Text text="All Members" variant="default" />
            </div>

            {onAddMember && (
              <Button size="sm" className="h-8 px-4" onClick={onAddMember}>
                <Text text="Add" variant="default" />
              </Button>
            )}
          </div>

          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Checkbox />
                <Text
                  text={member.fullName}
                  variant="default"
                  className="truncate"
                />
              </div>

              <Button
                size="sm"
                variant="outline"
                className="h-8"
                onClick={() => onRowClick(member.id)}
              >
                <Text text="View Profile" variant="default" />
              </Button>
            </div>
          ))}
        </div>

        {members.length === 0 && (
          <div className="p-6 text-center">
            <Text text="No members found" variant="muted" />
          </div>
        )}

        {pagination && members.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <Span
              text={`Page ${currentPage} of ${totalPages}`}
              variant="default"
            />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={!pagination.hasPreviousPage}
                onClick={() => onPageChange(currentPage - 1)}
              >
                <Text text="Previous" variant="default" />
              </Button>
              <Button
                variant="outline"
                disabled={!pagination.hasNextPage}
                onClick={() => onPageChange(currentPage + 1)}
              >
                <Text text="Next" variant="default" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-auto w-full max-w-full">
      <div className="min-w-max border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox />
              </TableHead>
              <TableHead>
                <Text text="Name" variant="default" />
              </TableHead>
              <TableHead>
                <Text text="Birthday" variant="default" />
              </TableHead>
              <TableHead>
                <Text text="Gender" variant="default" />
              </TableHead>
              <TableHead>
                <Text text="Phone" variant="default" />
              </TableHead>
              <TableHead>
                <Text text="Email" variant="default" />
              </TableHead>
              <TableHead>
                <Text text="Action" variant="default" />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {members.map((member) => (
              <TableRow
                key={member.id}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox />
                </TableCell>

                <TableCell>
                  <Text text={member.fullName} variant="default" />
                </TableCell>

                <TableCell>
                  <Text text={formatDate(member.birthday)} variant="default" />
                </TableCell>

                <TableCell>
                  <Text text={member.gender} variant="default" />
                </TableCell>

                <TableCell>
                  <Text text={member.phone} variant="default" />
                </TableCell>

                <TableCell>
                  <Text
                    text={member.email}
                    variant="default"
                    className="truncate"
                  />
                </TableCell>

                <TableCell>
                  <Button
                    onClick={() => onRowClick(member.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Text text="View Profile" variant="default" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {members.length === 0 && (
        <div className="p-8 text-center">
          <Text text="No members found" variant="muted" />
        </div>
      )}

      {pagination && members.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <Span
            text={`Page ${currentPage} of ${totalPages}`}
            variant="default"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={!pagination.hasPreviousPage}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <Text text="Previous" variant="default" />
            </Button>
            <Button
              variant="outline"
              disabled={!pagination.hasNextPage}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <Text text="Next" variant="default" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
