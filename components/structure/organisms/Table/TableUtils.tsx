import { FilterFn } from "@/components/types/types";
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFilterFn = (value: any) => {
  if (typeof value === "string") {
    return "includesString";
  } else if (typeof value === "number") {
    return "weakEquals";
  } else if (Array.isArray(value)) {
    return "arrIncludes";
  } else {
    return "equals";
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatCellValue = (value: any): string | JSX.Element => {
  if (value === null || value === undefined) return "N/A";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") {
    return (
      <div>
        {Object.entries(value).map(([subKey, subValue]) => (
          <div key={subKey}>
            {truncateText(`${subKey}: ${String(subValue)}`, 5)}
          </div>
        ))}
      </div>
    );
  }
  return String(value);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const conditionalFilters: Record<string, FilterFn> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isEmpty: (row: any, columnId: any) => {
    const value = row.getValue(columnId);
    return value === null || value === undefined || value === "";
  },
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  isNotEmpty: (row:any, columnId:any) => {
    const value = row.getValue(columnId);
    return value !== null && value !== undefined && value !== "";
  },
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  greaterThan: (row:any, columnId:any, filterValue:any) => {
    const value = row.getValue(columnId);
    return typeof value === "number" && value > Number(filterValue);
  },
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  lessThan: (row: any, columnId: any, filterValue: any) => {
    const value = row.getValue(columnId);
    return typeof value === "number" && value < Number(filterValue);
  },
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  textContains: (row: any, columnId: any, filterValue: any) => {
    const value = String(row.getValue(columnId)).toLowerCase();
    return value.includes(String(filterValue).toLowerCase());
  },
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  textNotContains: (row: any, columnId: any, filterValue: any) => {
    const value = String(row.getValue(columnId)).toLowerCase();
    return !value.includes(String(filterValue).toLowerCase());
  },
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  textStartsWith: (row: any, columnId: any, filterValue: any) => {
    const value = row.getValue(columnId);
    if (Array.isArray(value)) {
      return value.some((item) =>
        String(item)
          .toLowerCase()
          .startsWith(String(filterValue).toLowerCase()),
      );
    }
    return String(value)
      .toLowerCase()
      .startsWith(String(filterValue).toLowerCase());
  },
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  textEndsWith: (row: any, columnId: any, filterValue: any) => {
    const value = row.getValue(columnId);
    if (Array.isArray(value)) {
      return value.some((item) =>
        String(item).toLowerCase().endsWith(String(filterValue).toLowerCase()),
      );
    }
    return String(value)
      .toLowerCase()
      .endsWith(String(filterValue).toLowerCase());
  },
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const staticColumns = [
  {
    id: "select",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    header: ({ table }: { table: any }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cell: ({ row }: { row: any }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateDynamicColumns = <T extends Record<string, any>>(
  data: T[],
): ColumnDef<T>[] => {
  if (!data || data.length === 0) return [];

  return Object.keys(data[0]).map((key) => {
    const value = data[0][key];
    const filterType = getFilterFn(value);

    return {
      accessorKey: key as keyof T,
      header: ({ column }) => (
        <div
          className="flex"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {key.charAt(0).toUpperCase() + key.slice(1)}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => <div>{formatCellValue(row.getValue(key))}</div>,
      filterFn: (row, columnId, filterValue) => {
        if (filterValue?.condition) {
          console.log(filterValue.condition);

          const filterFunction = conditionalFilters[filterValue.condition];
          return filterFunction
            ? filterFunction(row, columnId, filterValue.value)
            : true;
        }
        // Handle basic filtering based on data type
        const value = row.getValue(columnId);

        switch (filterType) {
          case "includesString":
            return String(value)
              .toLowerCase()
              .includes(String(filterValue).toLowerCase());

          case "weakEquals":
            return Number(value) === Number(filterValue);

          case "arrIncludes":
            return (
              Array.isArray(value) &&
              value.some((item) =>
                String(item)
                  .toLowerCase()
                  .includes(String(filterValue).toLowerCase()),
              )
            );

          case "equals":
            return value === filterValue;

          default:
            return true;
        }
      },
    };
  });
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getColumns = <T extends object>(data: T[]): ColumnDef<T>[] => {
  const dynamicColumns = generateDynamicColumns(data);
  return [staticColumns[0], ...dynamicColumns];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return text;
};
