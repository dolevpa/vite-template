import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchBar({ onSearch, isSearching }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "" && !isSearching) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Ask anything..."
          className="pl-10 pr-24 py-6 text-base md:text-lg w-full bg-white rounded-xl border focus-visible:ring-2 focus-visible:ring-blue-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isSearching}
        />
        <Search className="absolute left-3 h-5 w-5 text-gray-400" />
        <Button 
          type="submit" 
          className="absolute right-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          disabled={isSearching || query.trim() === ""}
        >
          {isSearching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching
            </>
          ) : (
            "Search"
          )}
        </Button>
      </div>
    </form>
  );
}