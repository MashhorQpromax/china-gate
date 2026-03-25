'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T extends Record<string, any>> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyText?: string;
  pagination?: {
    pageSize: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  };
  searchable?: boolean;
  searchPlaceholder?: string;
  isRTL?: boolean;
  className?: string;
}

const DataTable = React.forwardRef<HTMLDivElement, DataTableProps<any>>(
  (
    {
      columns,
      data,
      onRowClick,
      isLoading = false,
      isEmpty = false,
      emptyText = 'No data available',
      pagination,
      searchable = false,
      searchPlaceholder = 'Search...',
      isRTL = false,
      className,
    },
    ref
  ) => {
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
      if (!searchable || !searchTerm) return data;

      return data.filter((row) =>
        columns.some((col) => {
          const value = row[col.key];
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }, [data, searchTerm, searchable, columns]);

    const sortedData = useMemo(() => {
      if (!sortColumn) return filteredData;

      const sorted = [...filteredData].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      return sorted;
    }, [filteredData, sortColumn, sortDirection]);

    const paginatedData = useMemo(() => {
      if (!pagination) return sortedData;

      const start = (pagination.currentPage - 1) * pagination.pageSize;
      const end = start + pagination.pageSize;

      return sortedData.slice(start, end);
    }, [sortedData, pagination]);

    const totalPages = pagination
      ? Math.ceil(sortedData.length / pagination.pageSize)
      : 1;

    const handleSort = (column: string) => {
      if (sortColumn === column) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortColumn(column);
        setSortDirection('asc');
      }
    };

    if (isLoading) {
      return (
        <div
          ref={ref}
          className="space-y-3 p-6"
        >
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-[#242830] rounded-lg animate-pulse"
            />
          ))}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('w-full', className)}>
        {searchable && (
          <div className="mb-4">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                'w-full px-4 py-2.5 rounded-lg font-medium',
                'bg-[#242830] border-2 border-[#1a1d23] text-white placeholder-gray-500',
                'focus-visible:outline-none focus-visible:border-[#d4a843] focus-visible:ring-2 focus-visible:ring-[#d4a843] focus-visible:ring-opacity-20',
                isRTL && 'text-right'
              )}
            />
          </div>
        )}

        <div className={cn('overflow-x-auto border border-[#242830] rounded-lg')}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#242830] bg-[#0c0f14]">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={cn(
                      'px-6 py-3 text-left font-semibold text-gray-300 whitespace-nowrap',
                      isRTL && 'text-right',
                      column.sortable && 'cursor-pointer hover:text-[#d4a843]'
                    )}
                    onClick={() =>
                      column.sortable && handleSort(String(column.key))
                    }
                    style={{ width: column.width }}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && sortColumn === String(column.key) && (
                        <svg
                          className={cn(
                            'w-4 h-4 transition-transform',
                            sortDirection === 'desc' && 'rotate-180'
                          )}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16V4m0 0L3 8m0 0h18m-18 0l4-4"
                          />
                        </svg>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={cn(
                      'border-b border-[#242830] transition-colors duration-200',
                      'hover:bg-[#242830] bg-[#1a1d23]',
                      onRowClick && 'cursor-pointer'
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={cn(
                          'px-6 py-3 text-gray-300',
                          isRTL && 'text-right'
                        )}
                        style={{ width: column.width }}
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    {isEmpty || filteredData.length === 0
                      ? emptyText
                      : 'No data available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination && totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Page {pagination.currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  pagination.onPageChange(pagination.currentPage - 1)
                }
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 rounded-lg bg-[#242830] text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  pagination.onPageChange(pagination.currentPage + 1)
                }
                disabled={pagination.currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-[#242830] text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

DataTable.displayName = 'DataTable';

export default DataTable;
