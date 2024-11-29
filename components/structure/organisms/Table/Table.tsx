"use client";
import {
  ExportTableToCsvProps,
  FilterTag,
  GlobalFilterFn,
} from "@/components/types/types";
import {
  ColumnFilter,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

import { EditModal } from "@/components/structure/molecules/Modal/EditModal";

import { Filter } from "@/components/structure/molecules/Filter";

import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  DownloadIcon,
} from "@radix-ui/react-icons";

import { Input } from "@/components/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { Button } from "@/components/ui/shadcn/button";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2Icon,
  Upload,
} from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { mkConfig, generateCsv, download } from "export-to-csv";
import Papa from "papaparse";
import { getColumns, truncateText } from "./TableUtils";
import { 
  AlertDialogTrigger, 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogTitle 
} from "@/components/ui/shadcn/alert-dialog";


// eslint-disable-next-line @typescript-eslint/no-explicit-any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Table({ data }: { data: any[] }) {
  const columns = React.useMemo(() => getColumns(data), [data]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [filters, setFilters] = React.useState<FilterTag[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isAddingRow, setIsAddingRow] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [newRowData, setNewRowData] = useState<{ [key: string]: any }>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tableData, setTableData] = useState<any[]>(data);
  const [editedRow, setEditedRow] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editedValues, setEditedValues] = useState<{ [key: string]: any }>({});

  const router = useRouter();
  const pathname = usePathname();
  const productsPerPage: Array<number> = [10, 20, 30, 40, 50];

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingItem, setEditingItem] = useState<any>(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (rowData: any) => {
    setEditingItem(rowData);
    setIsEditModalOpen(true);
  };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleSave = (updatedData: any) => {
  const updatedTableData = tableData.map((row) =>
    row.id === updatedData.id ? updatedData : row
  );
  setTableData(updatedTableData);
  setIsEditModalOpen(false);
};
const initializeNewRow = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emptyRow = table
      .getAllColumns()
      .filter(column => column.getIsVisible() && column.id !== 'select')
      .reduce((acc, column) => {
        acc[column.id] = '';
        return acc;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, {} as { [key: string]: any });
    setNewRowData(emptyRow);
    setIsAddingRow(true);
  };

  const handleAddRow = () => {
    const newRow = { ...newRowData };
    setTableData((prevData) => [...prevData, newRow]);
    setIsAddingRow(false);
    setNewRowData({});
  };

  const handleCancelAdd = () => {
    setIsAddingRow(false);
    setNewRowData({});
  };

  const getStorageKey = React.useCallback(() => {
    if (data.length === 0) return "tableData";
    const structure = Object.keys(data[0]).sort().join("_");
    return `tableData_${structure}_${data.length}`;
  }, [data]);

  useEffect(() => {
    const storageKey = getStorageKey();
    const storedData = localStorage.getItem(storageKey);

    if (!storedData) {
      setTableData(data);
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);

      if (data.length > 0 && parsedData.length > 0) {
        const storedKeys = Object.keys(parsedData[0]).sort().join(",");
        const newKeys = Object.keys(data[0]).sort().join(",");
        if (storedKeys !== newKeys) {
          setTableData(data);
          return;
        }
      }
      setTableData(parsedData);
    } catch (error) {
      console.error("Error parsing stored data:", error);
      setTableData(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const storageKey = getStorageKey();
      const storedData = localStorage.getItem(storageKey);

      if (!storedData) {
        setTableData(data);
        localStorage.setItem(storageKey, JSON.stringify(data));
      } else {
        try {
          const parsedData = JSON.parse(storedData);
          const storedKeys = Object.keys(parsedData[0]).sort().join(",");
          const newKeys = Object.keys(data[0]).sort().join(",");

          if (storedKeys !== newKeys) {
            setTableData(data);
            localStorage.setItem(storageKey, JSON.stringify(data));
          }
        } catch (error) {
          console.error("Error handling data update:", error);
          setTableData(data);
          localStorage.setItem(storageKey, JSON.stringify(data));
        }
      }
    }
  }, [data, getStorageKey]);

  useEffect(() => {
    if (tableData.length > 0) {
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(tableData));
    }
  }, [tableData, getStorageKey]);


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditRow = (rowIndex: number, rowData: any) => {
    setEditedRow(rowIndex);
    setEditedValues(rowData);
  };

  const handleDeleteRow = (rowIndex: number) => {
    const currentPage = table.getState().pagination.pageIndex;
    const pageSize = table.getState().pagination.pageSize;
    
    setTableData((prevData) => {
      const newData = prevData.filter((_, index) => index !== rowIndex);
      
      // Calculate if the current page would be empty after deletion
      const rowsOnCurrentPage = newData.slice(
        currentPage * pageSize,
        (currentPage + 1) * pageSize
      ).length;
      console.log(currentPage);
      
      if (rowsOnCurrentPage === 0 && currentPage > 0) {
        setTimeout(() => {
          table.setPageIndex(currentPage - 1);
        }, 0);
      } else {
    
        setTimeout(() => {
          table.setPageIndex(currentPage);
        }, 0);
      }
      
      return newData;
    });
  };
  

  useEffect(() => {
    const storedData = localStorage.getItem("tableData");
    if (storedData) {
      setTableData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    const initialVisibility: VisibilityState = {};
    columns.forEach((column, index) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialVisibility[(column as any).accessorKey] = index < 8;
    });
    setColumnVisibility(initialVisibility);
  }, [columns]);

  const globalFilterFn: GlobalFilterFn = (row, columnId, filterValue) => {
    const rowValue = row.original;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchInObject = (obj: any, searchTerm: string): boolean => {
      if (typeof obj === "string") {
        return obj.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (Array.isArray(obj)) {
        return obj.some((item) => searchInObject(item, searchTerm));
      } else if (typeof obj === "object" && obj !== null) {
        return Object.values(obj).some((value) =>
          searchInObject(value, searchTerm),
        );
      }
      return false;
    };

    return searchInObject(rowValue, filterValue);
  };

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      pagination,
      sorting,
      globalFilter,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
  });

  const VisibleColumns = table
    .getAllColumns()
    .filter((column) => column.getIsVisible() && column.id !== "select")
    .map((column) => column.id);

  const handleFilterAdd = (newFilter: FilterTag) => {
    const column = table.getColumn(newFilter.column);
    if (!column) return;

    const filterValue = newFilter.condition
      ? { condition: newFilter.condition, value: newFilter.value }
      : newFilter.value;

    setFilters((prev) => [...prev, newFilter]);

    console.log(editedRow)
    console.log(editedValues)

    setColumnFilters((prev) => {
      const otherFilters = prev.filter(
        (filter) => filter.id !== newFilter.column,
      );

      return [
        ...otherFilters,
        {
          id: newFilter.column,
          value: filterValue,
        },
      ];
    });
  };

  const handleFilterRemove = (filterToRemove: FilterTag) => {
    const column = table.getColumn(filterToRemove.column);
    if (!column) return;

    setFilters((prev) =>
      prev.filter(
        (filter) =>
          !(
            filter.column === filterToRemove.column &&
            filter.condition === filterToRemove.condition &&
            filter.value === filterToRemove.value
          ),
      ),
    );

    setColumnFilters((prev) => {
      const columnFilters = filters.filter(
        (f) =>
          f.column === filterToRemove.column &&
          !(
            f.condition === filterToRemove.condition &&
            f.value === filterToRemove.value
          ),
      );

      if (columnFilters.length === 0) {
        return prev.filter((filter) => filter.id !== filterToRemove.column);
      }

      return prev.map((filter) => {
        if (filter.id !== filterToRemove.column) return filter;

        const lastFilter = columnFilters[columnFilters.length - 1];
        return {
          id: filterToRemove.column,
          value: lastFilter.condition
            ? { condition: lastFilter.condition, value: lastFilter.value }
            : lastFilter.value,
        };
      });
    });
  };

  const ExportTableToCsv = <T,>({
    table,
    filename,
  }: ExportTableToCsvProps<T>) => {
    return (
      <Button
        onClick={() => {
          const csvConfig = mkConfig({
            fieldSeparator: ",",
            filename: filename,
            decimalSeparator: ".",
            useKeysAsHeaders: true,
          });

          // Transform the data to only include visible columns and their values
          const rows = table.getFilteredRowModel().rows;
          const rowData = rows.map((row) => {
            const flatRow: Record<
              string,
              string | number | boolean | null | undefined
            > = {};
            VisibleColumns.forEach((columnId) => {
              
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const value: any = row.getValue(columnId);

              if (value === null || value === undefined) {
                flatRow[columnId] = "";
              } else if (typeof value === "object") {
                flatRow[columnId] = JSON.stringify(value);
              } else {
                flatRow[columnId] = String(value);
              }
            });
            return flatRow;
          });

          const csv = generateCsv(csvConfig)(rowData);
          download(csvConfig)(csv);
        }}
        variant="outline"
        className="flex items-center gap-2"
      >
        <DownloadIcon className="h-4 w-4" />
        Export CSV
      </Button>
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const headers = Object.keys(results.data[0] || {});

        const hasAllExpectedHeaders = VisibleColumns.every((header) =>
          headers.includes(header),
        );

        if (!hasAllExpectedHeaders) {
          alert("The CSV file does not match the expected column headers.");
        } else {
          setTableData((prevData) => [...prevData, ...results.data]);
          alert("CSV file imported successfully!");
        }
        event.target.value = '';
      },
      error: () => {
        alert("Failed to parse CSV file.");
        event.target.value = '';
      },
    });
  };

  return (
    <div className="table-wrapper w-full rounded-md border p-4">
      <div className="flex flex-wrap items-center space-x-4 py-3">
        <Input
          type="search"
          placeholder="Search across all col..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />

        <Filter columns={VisibleColumns} onFilterAdd={handleFilterAdd} />

        <Button
          onClick={initializeNewRow}
          disabled={isAddingRow}
          variant="outline"
        >
          Add Row
        </Button>

        <Select
          value={""}
          onValueChange={(value) => {
            const column = table.getColumn(value);
            if (column) {
              column.toggleVisibility(!column.getIsVisible());
            }
          }}
        >
          <SelectTrigger className="flex w-auto cursor-pointer items-center">
            Columns
          </SelectTrigger>

          <SelectContent className="scrollbar-hide max-h-80 overflow-y-auto">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <SelectItem key={column.id} value={column.id}>
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={() =>
                      column.toggleVisibility(!column.getIsVisible())
                    }
                    className="mr-2 h-4 w-4 appearance-none rounded-sm border border-gray-300 checked:border-transparent checked:bg-transparent checked:after:block checked:after:text-center checked:after:text-black checked:after:content-['✔']"
                  />
                  {column.id.charAt(0).toUpperCase() + column.id.slice(1)}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <ExportTableToCsv table={table} filename="table-data" />
        <Input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          id="csv-upload"
        />
        <label htmlFor="csv-upload">
          <Button asChild>
            <span>
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
            </span>
          </Button>
        </label>
      </div>

      <div className="my-2 flex flex-wrap gap-2">
        {filters.map((filter, index) => (
          <div
            key={`${filter.column}-${index}`}
            className="flex items-center gap-2 rounded bg-gray-100 px-2 py-1"
          >
            <span>{filter.column}</span>
            {filter.condition && <span>{filter.condition}</span>}
            <span>{filter.value}</span>
            <Button size="xs" onClick={() => handleFilterRemove(filter)}>
              &times;
            </Button>
          </div>
        ))}
      </div>
      <div className="flex cursor-pointer flex-wrap rounded-md border">
        <ShadTable>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
        {isAddingRow && (
          <TableRow>
            <TableCell></TableCell>
            {table
              .getAllColumns()
              .filter(column => column.getIsVisible() && column.id !== 'select')
              .map((column) => (
                <TableCell key={column.id}>
                  <Input
                    value={newRowData[column.id] || ''}
                    onChange={(e) => 
                      setNewRowData(prev => ({
                        ...prev,
                        [column.id]: e.target.value
                      }))
                    }
                    placeholder={`Enter ${column.id}`}
                  />
                </TableCell>
              ))}
            <TableCell>
              <div className="flex items-center justify-center gap-2">
                <Button size="xs" variant="default" onClick={handleAddRow}>
                  Save
                </Button>
                <Button size="xs" variant="outline" onClick={handleCancelAdd}>
                  Cancel
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}

        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow onClick={() => router.push(`${pathname}/${Number(row.id) + 1}`)} key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                 {typeof cell.getValue() === "string" && cell.column.id !== 'select'
                  ? truncateText(cell.getValue() as string, 3)
                  : flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                <>
                      <Button 
                      size="xs" 
                      variant="ghost" 
                      onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(row.original);
                      handleEditRow(row.index, row.original)

                    }}>
                        <Pencil />
                      </Button>
                      <AlertDialog>
                      <AlertDialogTrigger asChild>
                      <Button size="xs" variant="ghost" onClick={(e) => e.stopPropagation()}>
                      <Trash2Icon />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle onClick={(e)=>{
                          e.stopPropagation();
                      }}>
                        Confirm Deletion
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this row? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => { 
                          e.stopPropagation();
                          handleDeleteRow(row.index);
                        }}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                    </>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length + 1} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
        </ShadTable>

        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}
          data={editingItem || {}}
          columns={table.getAllColumns().filter((col)=> col.getIsVisible() && col.id !== "select")}
        />
      </div>

      <div className="flex flex-wrap items-center justify-end space-x-2 py-1">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center justify-center gap-4 pt-2">
          <span>
            <p className="text-sm">Rows per page</p>
          </span>
          <div className="flex flex-row items-center space-x-2">
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Per Page" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {productsPerPage.map((pageSize) => (
                    <SelectItem key={pageSize} value={String(pageSize)}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <DoubleArrowLeftIcon />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <DoubleArrowRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
