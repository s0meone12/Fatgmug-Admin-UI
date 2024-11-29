import { ColumnDef, Table } from '@tanstack/react-table';
// import { Row } from '@tanstack/react-table'; 

export interface TableProps<TData> {
  data: TData[]; // Array of objects
  columns: ColumnDef<TData>[]; // Array of objects
  getIsSelected?: () => boolean;
  toggleSelected?: (value: boolean) => void;
}

export interface FilterTag {
  column: string;
  condition?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

export interface FilterTagProps {
  tag: FilterTag;
  onRemove: (filter: FilterTag) => void;
}

export interface FilterInputProps {
  columns: string[];
  onFilterAdd: (filter: FilterTag) => void;
}

export interface ColumnFilter {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

export interface ImageCardProps {
  images: string[];  
}

export interface DetailProps {
  headingKey: string;
  subheadingKey: string;
  columnKey: string[]; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responseData: any[];
}

export interface DetailHeaderI {
  heading: string,
  subheading: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responseData?: any
}

export type Row = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  original: any;
};

export type FilterFn = (row: Row, columnId: string, filterValue: string) => boolean;

export type GlobalFilterFn = (
  row: Row,           // Adjust 'any' based on your actual row data type
  columnId: string,
  filterValue: string
) => boolean;

export interface ExportTableToCsvProps<T> {
  table: Table<T>;
  filename?: string;
}