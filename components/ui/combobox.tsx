import React, { useState, useRef, useEffect } from "react";

interface Option {
  value: number;
  label: string;
}

interface ComboboxProps {
  options: Option[];
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selected = options.find((opt) => opt.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-left"
        onClick={() => setOpen((o) => !o)}
      >
        {selected ? selected.label : <span className="text-gray-400">{placeholder}</span>}
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <input
            type="text"
            className="w-full px-3 py-2 border-b border-gray-200 outline-none"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-2 text-gray-400">No options</div>
            ) : (
              filtered.map((opt) => (
                <div
                  key={opt.value}
                  className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                    value === opt.value ? "bg-blue-50 font-semibold" : ""
                  }`}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  {opt.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};