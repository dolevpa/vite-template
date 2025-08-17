import React, { useState, useEffect } from "react";
import { Query } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SearchHistory from "../components/SearchHistory";
import SearchResult from "../components/SearchResult";
import { Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function History() {
  const [history, setHistory] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const queries = await Query.list("-timestamp");
      setHistory(queries);
    } catch (error) {
      console.error("Error fetching search history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuerySelect = (query) => {
    setSelectedQuery(query);
  };

  const handleNewSearch = () => {
    navigate(createPageUrl("Home"));
  };

  const filteredHistory = history.filter(
    item => item.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/5 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Search History
            </h1>
            <Button onClick={handleNewSearch}>New Search</Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Filter history..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <SearchHistory 
            history={filteredHistory}
            onSelect={handleQuerySelect}
            isLoading={isLoading}
          />
        </div>

        <div className="w-full md:w-3/5">
          {selectedQuery ? (
            <SearchResult 
              result={selectedQuery}
              isLoading={false}
            />
          ) : (
            <div className="bg-white p-8 rounded-xl border text-center h-full flex flex-col items-center justify-center">
              <Search className="h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-700">Select a search</h3>
              <p className="text-gray-500">
                Choose from your search history to view results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}