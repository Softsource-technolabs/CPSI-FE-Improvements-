import React from "react";
import Drawer from "../components/drawer";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";

export interface FilterField {
  label: string;
  name: string;
  type?: "text" | "date" | "select";
  placeholder?: string;
  value: string;
}

interface FilterDrawerProps {
  drawerOpen: boolean;
  closeDrawer: () => void;
  title?: string;
  filters: { [key: string]: string };
  onChange: (name: string, value: string) => void;
  onApply: () => void;
  onClear?: () => void;
  width?: string;
  height?: string;
  moduleNames?: string[];
  showModuleNameFilter?: boolean;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  drawerOpen,
  closeDrawer,
  title = "Advance Filters",
  filters,
  onChange,
  onApply,
  onClear,
  width = "90vw",
  height = "auto",
  moduleNames,
  showModuleNameFilter,
}) => {
  const fields: FilterField[] = Object.entries(filters).map(([key, value]) => {
    let type: "text" | "date" | "select" = "text";

    if (key.toLowerCase().includes("date")) {
      type = "date";
    } else if (
      key.toLowerCase() === "actiontype" ||
      key.toLowerCase() === "actionresult"
    ) {
      type = "select";
    }

    const label = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());

    return {
      label,
      name: key,
      type,
      value: value,
      placeholder: `Enter ${label}`,
    };
  });

  const MultiSelect: React.FC<{
    options: { label: string; value: string }[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
  }> = ({ options, value, onChange, placeholder }) => {
    const handleToggle = (val: string) => {
      if (value.includes(val)) {
        onChange(value.filter((v) => v !== val));
      } else {
        onChange([...value, val]);
      }
    };
    return (
      <div className="border rounded-lg bg-white p-2 w-full">
        <div className="mb-2 text-gray-500 text-sm">{placeholder}</div>
        <div className="max-h-40 overflow-y-auto space-y-1">
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-100 rounded"
            >
              <Checkbox
                checked={value.includes(opt.value)}
                onCheckedChange={() => handleToggle(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Drawer
      drawerOpen={drawerOpen}
      closeDrawer={closeDrawer}
      title={title}
      width={width}
    >
      <div
        className={`flex flex-col bg-white h-full sm:h-auto`}
        style={{ height }}
      >
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5 custom-scrollbar max-h-[calc(100vh-180px)]">
          {fields.map((field) => {
            if (field.name.toLowerCase() === "modulename" && !showModuleNameFilter) {
              return null;
            }
            return (
              <div key={field.name} className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>

                {field.type === "select" ? (
                  field.name.toLowerCase() === "actiontype" ||
                    field.name.toLowerCase() === "actionresult" ? (
                    <MultiSelect
                      options={
                        field.name.toLowerCase() === "actiontype"
                          ? [
                            { label: "GET", value: "GET" },
                            { label: "POST", value: "POST" },
                            { label: "PUT", value: "PUT" },
                            { label: "DELETE", value: "DELETE" },
                          ]
                          : [
                            { label: "Success", value: "1" },
                            { label: "Failure", value: "0" },
                          ]
                      }
                      value={
                        Array.isArray(field.value)
                          ? field.value
                          : field.value
                            ? field.value.split(",")
                            : []
                      }
                      onChange={(vals) => onChange(field.name, vals.join(","))}
                      placeholder={`Select ${field.label}`}
                    />
                  ) : field.name.toLowerCase() === "modulename" && moduleNames && moduleNames.length > 0 ? (
                    <Select
                      value={field.value}
                      onValueChange={(value) => onChange(field.name, value)}
                    >
                      <SelectTrigger className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder={`Select ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {moduleNames.map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select
                      value={field.value}
                      onValueChange={(value) => onChange(field.name, value)}
                    >
                      <SelectTrigger className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder={`Select ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {/* Add other select options here if needed */}
                      </SelectContent>
                    </Select>
                  )
                ) : (
                  <Input
                    type={field.type || "text"}
                    placeholder={field.placeholder || ""}
                    value={field.value}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-sm shadow-sm transition-all duration-200"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 sm:p-5 border-t border-gray-200 flex justify-end space-x-2">
          <Button
            variant="default"
            className="min-w-[100px] py-2 bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-colors duration-200"
            onClick={onApply}
          >
            Apply
          </Button>
          <Button
            variant="outline"
            className="min-w-[80px] py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            onClick={closeDrawer}
          >
            Cancel
          </Button>
          {onClear && (
            <Button
              variant="outline"
              className="min-w-[80px] py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              onClick={onClear}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default FilterDrawer;