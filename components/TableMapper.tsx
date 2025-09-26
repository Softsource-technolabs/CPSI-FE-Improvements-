import React, { useRef, useState } from "react";
import { ListFilter, X } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

interface TableHeaderWithFilterProps {
  label: string;
  filterable?: boolean;
  filterComponent?: React.ReactElement | null;
  isFiltered?: boolean;
  onClearFilter?: () => void;
}

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  filterable?: boolean;
  filterValues?: string[];
  selectedFilterValues?: string[];
  onFilterChange?: (values: string[]) => void;
  filterComponent?: React.ReactNode;
}

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export interface CommonTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onSort?: (key: string) => void;
  pagination?: PaginationProps;
  actions?: (row: T) => React.ReactNode;
  emptyMessage?: string;
}

export function TableHeaderWithFilter({
  label,
  filterable,
  filterComponent,
  isFiltered,
  onClearFilter,
}: TableHeaderWithFilterProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const anchorRef = useRef(null);
  return (
    <div ref={anchorRef} className="relative flex items-center gap-1">
      <span>{label}</span>
      {filterable && (
        <>
          <ListFilter
            className={`h-4 w-4 cursor-pointer ${isFiltered ? "text-blue-600" : "text-gray-500 hover:text-blue-600"}`}
            onClick={() => setShowDropdown((prev) => !prev)}
          />
          {isFiltered && (
            <X
              className="h-4 w-4 text-red-500 cursor-pointer hover:text-red-700"
              onClick={onClearFilter}
            />
          )}
          {showDropdown && filterComponent && React.isValidElement(filterComponent) && (
            <div className="absolute z-50 mt-2 left-0" onClick={e => e.stopPropagation()}>
              {React.cloneElement(
                filterComponent as React.ReactElement<any>,
                {
                  ...(filterComponent.props as any),
                  anchorRef,
                  close: () => setShowDropdown(false),
                }
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function TableMapper<T extends { id: string | number }>({
  columns,
  data,
  loading = false,
  onSort,
  pagination,
  actions,
  emptyMessage = "No records found",
}: CommonTableProps<T>) {
  const pageSizeOptions = pagination?.pageSizeOptions || [10, 25, 50, 100];
  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
      <Table className="w-full table-auto divide-y divide-gray-200" style={{ backgroundColor: 'var(--cardBackColor)' }}>
        <TableHeader className="bg-gray-50">
          <TableRow style={{ color: 'var(--gridHeaderForeColor)' }}>
            {columns.map((col) => (
              <TableHead
                key={String(col.key)}
                className={`px-6 py-3 text-left text-md font-medium text-gray-500 tracking-wider relative ${col.sortable ? "cursor-pointer hover:text-gray-900" : ""
                  }`}
                onClick={() => col.sortable && onSort?.(String(col.key))}
              >
                <div className="flex items-center gap-2">
                  {col.filterComponent && React.isValidElement(col.filterComponent) ? (
                    <TableHeaderWithFilter
                      label={col.header}
                      filterable={col.filterable}
                      filterComponent={col.filterComponent}
                      isFiltered={col.selectedFilterValues && col.selectedFilterValues.length > 0}
                      onClearFilter={() => col.onFilterChange && col.onFilterChange([])}
                    />
                  ) : (
                    <>
                      {col.header}
                      {col.sortable && onSort && (
                        <div className="flex flex-col">
                          <div className="w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-gray-400"></div>
                          <div className="w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-400 mt-0.5"></div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TableHead>
            ))}
            {actions && (
              <TableHead className="px-6 py-3 text-left text-md font-medium text-gray-500 tracking-wider sticky right-0 z-0 bg-gray-50 border-b border-gray-200">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <TableRow className="hover:bg-gray-100">
              <TableCell
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-6 py-12 text-center"
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="text-lg font-medium text-gray-900">Loading...</div>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow className="hover:bg-gray-100">
              <TableCell
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-6 py-12 text-center"
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="text-lg font-medium text-gray-900">{emptyMessage}</div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id} className="group hover:bg-gray-100" >
                {columns.map((col) => (
                  <TableCell key={String(col.key)} className="px-6 py-4 text-sm group-hover:bg-gray-100">
                    {col.render ? col.render(row) : (row[col.key as keyof T] as any)}
                  </TableCell>
                ))}
                {actions && (
                <TableCell
  className="
    px-6 py-4 text-sm sticky right-0 z-10 bg-white
    border-b border-gray-200
    group-hover:bg-gray-50
  "
>
  {actions(row)}
</TableCell>

                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Enhanced Pagination */}
      {pagination && !loading && data.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t bg-white gap-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.pageSize) + 1} to {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} items
            </div>
            {pagination.onPageSizeChange && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Items per page:</span>
                <Select
                  value={String(pagination.pageSize)}
                  onValueChange={(value) => pagination.onPageSizeChange?.(Number(value))}
                >
                  <SelectTrigger className="w-[100px] bg-white">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    {pageSizeOptions.map((size) => (
                      <SelectItem
                        key={size}
                        value={String(size)}
                        className="hover:bg-gray-100"
                      >
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 px-3 py-2 rounded-md border-gray-300 hover:bg-gray-100"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>

            {/* Display the current page and total pages */}
            <span className="text-sm text-gray-700">
              Page {pagination.page} of {totalPages}
            </span>

            <Button
              variant="outline"
              className="flex items-center gap-2 px-3 py-2 rounded-md border-gray-300 hover:bg-gray-100"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page * pagination.pageSize >= pagination.total}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}