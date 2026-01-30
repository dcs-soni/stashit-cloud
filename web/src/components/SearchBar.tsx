import { useState, FormEvent } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({
  onSearch,
  placeholder = "Search your content...",
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-xl">
      <div
        className={`relative flex items-center bg-white border rounded-xl transition-all duration-200 ${
          isFocused
            ? "border-accent-300 ring-2 ring-accent-100 shadow-soft"
            : "border-surface-200 hover:border-surface-300"
        }`}
      >
        <Search className="absolute left-4 w-5 h-5 text-surface-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full py-3 pl-12 pr-12 bg-transparent text-surface-700 placeholder-surface-400 focus:outline-none rounded-xl"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 p-1 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 px-3 py-1.5 bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
