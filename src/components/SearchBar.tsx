"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string, sort: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search products..." }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");

  const handleChange = (value: string, sortValue: string) => {
    setQuery(value);
    setSort(sortValue);
    onSearch(value, sortValue);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value, sort)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <select
        value={sort}
        onChange={(e) => handleChange(query, e.target.value)}
        className="shrink-0 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      >
        <option value="default">Sort: Default</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name-asc">Name: A to Z</option>
        <option value="name-desc">Name: Z to A</option>
      </select>
    </div>
  );
}
