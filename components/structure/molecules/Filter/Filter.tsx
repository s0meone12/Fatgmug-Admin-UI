import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/shadcn/dropdown-menu";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/shadcn/select";
import { FilterInputProps } from "@/components/types/types";
import { Filter as FilterIcon}  from 'lucide-react';

const FILTER_CONDITIONS = [
  "isEmpty",
  "isNotEmpty",
  "greaterThan",
  "lessThan",
  "textContains",
  "textNotContains",
  "textStartsWith",
  "textEndsWith",
];

export const Filter: React.FC<FilterInputProps> = ({ columns, onFilterAdd }) => {
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  const handleApplyFilter = () => {
    if (selectedColumn) {
      onFilterAdd({
        column: selectedColumn,
        condition: selectedCondition,
        value: inputValue,
      });

      setSelectedColumn(null);
      setSelectedCondition("");
      setInputValue("");
    }
  };

  const shouldShowInput = !selectedCondition || (!["isEmpty", "isNotEmpty"].includes(selectedCondition));

  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <FilterIcon />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filter by condition or value</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <div className="space-y-2">
            <Select  onValueChange={(value) => setSelectedColumn(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCondition} onValueChange={(value) => setSelectedCondition(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {FILTER_CONDITIONS.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {shouldShowInput && (
              <Input
                type="text"
                placeholder="Enter value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            )}

            <Button variant="secondary" onClick={handleApplyFilter}>
              Apply
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
