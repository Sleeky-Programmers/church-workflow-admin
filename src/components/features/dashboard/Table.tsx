"use client";
import { useEffect } from "react";
import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table as TableComponent,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Span } from "@/components/ui/typography/Text";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Align = "left" | "center" | "right";

export type Column<T> = {
  key: string;
  header?: React.ReactNode;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  sortAccessor?: (row: T) => string | number;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: Align;
  contentClassName?: string;
};

export interface CustomTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey?: keyof T | ((row: T) => string);
  enablePagination?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  enableSorting?: boolean;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
  showCheckbox?: boolean;
  selectedRowKeys?: string[];
  onSelectedRowKeysChange?: (keys: string[]) => void;
}

type SortState = {
  key: string | null;
  direction: "asc" | "desc" | null;
};

export default function Table<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  enablePagination = false,
  defaultPageSize = 5,
  pageSizeOptions = [5, 10, 20, 50],
  enableSorting = true,
  isLoading = false,
  emptyState,
  onRowClick,
  className = "",
  showCheckbox = false,
  selectedRowKeys,
}: CustomTableProps<T>) {
  const [sort, setSort] = useState<SortState>({
    key: "timestamp",
    direction: "desc",
  });
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [data, pageSize]);

  const getRowKey = (row: T, idx: number) => {
    if (!rowKey) {
      return String(idx);
    }

    if (typeof rowKey === "function") {
      return rowKey(row);
    }

    return String(row[rowKey]);
  };

  const getCellValue = (col: Column<T>, row: T) => {
    if (col.render) {
      return col.render(row);
    }

    if (typeof col.accessor === "function") {
      return col.accessor(row);
    }

    if (typeof col.accessor === "string") {
      return row[col.accessor as string];
    }

    return null;
  };

  const sortedData = useMemo(() => {
    if (!enableSorting || !sort.key || !sort.direction) {
      return data.slice();
    }

    const col = columns.find((c) => c.key === sort.key);
    if (!col) {
      return data.slice();
    }

    if (typeof col.accessor !== "string") {
      return data.slice();
    }

    const key = col.accessor as string;

    const copy = data.slice();
    copy.sort((a, b) => {
      const va = col.sortAccessor ? col.sortAccessor(a) : a[key];
      const vb = col.sortAccessor ? col.sortAccessor(b) : b[key];

      if (va == null && vb == null) return 0;
      if (va == null) return sort.direction === "asc" ? -1 : 1;
      if (vb == null) return sort.direction === "asc" ? 1 : -1;

      if (typeof va === "number" && typeof vb === "number") {
        return sort.direction === "asc" ? va - vb : vb - va;
      }

      return sort.direction === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });

    return copy;
  }, [data, sort, enableSorting, columns]);

  const paginatedData = useMemo(() => {
    if (!enablePagination) {
      return sortedData;
    }
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, enablePagination, currentPage, pageSize]);

  const totalPages = enablePagination
    ? Math.ceil(sortedData.length / pageSize)
    : 1;

  const toggleSort = (col: Column<T>) => {
    if (!enableSorting || !col.sortable) return;
    setSort((prev) => {
      if (prev.key !== col.key) {
        return { key: col.key, direction: "asc" };
      }

      if (prev.direction === "asc") {
        return { key: col.key, direction: "desc" };
      }

      return { key: null, direction: null };
    });
  };

  const controlled = Array.isArray(selectedRowKeys);
  const selectedKeys = controlled ? selectedRowKeys! : internalSelected;

  const visibleColumnCount = columns.length + (showCheckbox ? 1 : 0);

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="overflow-x-auto w-full max-w-full">
          <div className="min-w-max">
            <TableComponent>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead
                      key={col.key}
                      className={`${col.width ?? ""} ${col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"} cursor-pointer select-none font-bold px-4`}
                      onClick={() => toggleSort(col)}
                    >
                      <div className="flex items-center gap-2">
                        <Span className="truncate max-w-[18rem]">
                          {col.header}
                        </Span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={Math.max(1, visibleColumnCount)}>
                      <div className="py-6 text-center">Loading...</div>
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={Math.max(1, visibleColumnCount)}>
                      <div className="py-8 text-center text-xs text-muted-foreground">
                        {emptyState ?? "No records found."}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row: T, rIdx: number) => {
                    const key = getRowKey(row, rIdx);
                    return (
                      <TableRow
                        key={key}
                        className={`${onRowClick ? "hover:bg-surface/60 cursor-pointer" : ""}`}
                        onClick={() => onRowClick?.(row)}
                      >
                        {columns.map((col) => (
                          <TableCell
                            key={col.key}
                            className={`${col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"} align-top ${col.width ?? ""} px-4`}
                          >
                            <div
                              className={`${col.contentClassName ?? "truncate"} sm:whitespace-normal`}
                            >
                              {getCellValue(col, row)}
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </TableComponent>
            {enablePagination && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t">
                <Span variant="default">
                  Page {currentPage} of {totalPages}
                </Span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => setPageSize(Number(value))}
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Page size" />
                  </SelectTrigger>

                  <SelectContent>
                    {pageSizeOptions.map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size} / page
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Button
                    className="px-3 py-1 rounded-md border disabled:opacity-50"
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>

                  <Button
                    className="px-3 py-1 rounded-md border disabled:opacity-50"
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
