import React, { useState, useEffect } from "react";
import { Query } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import SearchBar from "../components/SearchBar";
import SearchResult from "../components/SearchResult";
import SuggestedQueries from "../components/SuggestedQueries";
import { Lightbulb, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [currentQuery, setCurrentQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [recentQueries, setRecentQueries] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    fetchRecentQueries();
  }, []);

  const fetchRecentQueries = async () => {
    try {
      const queries = await Query.list("-timestamp", 5);
      setRecentQueries(queries);
    } catch (error) {
      console.error("Error fetching recent queries:", error);
    }
  };

  const handleSearch = async (query) => {
    setCurrentQuery(query);
    setIsSearching(true);
    setShowWelcome(false);
    setSearchResult(null);

    try {
      const result = await InvokeLLM({
        prompt: `The user is asking: "${query}". Provide a comprehensive, accurate, and informative answer based on reliable information from the internet. Include relevant details, explanations, and context. Format your response in clear paragraphs.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            answer: { type: "string" },
            sources: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  url: { type: "string" },
                  snippet: { type: "string" }
                }
              }
            }
          }
        }
      });

      const formattedSources = result.sources?.map(source => ({
        title: source.title,
        url: source.url,
        snippet: source.snippet
      })) || [];

      const queryData = {
        query: query,
        result: result.answer,
        sources: formattedSources,
        timestamp: new Date().toISOString()
      };

      await Query.create(queryData);
      setSearchResult({
        query: query,
        result: result.answer,
        sources: formattedSources
      });
      
      fetchRecentQueries();
    } catch (error) {
      console.error("Error performing search:", error);
      setSearchResult({
        query: query,
        result: "Sorry, I encountered an error while searching. Please try again.",
        sources: []
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestedQuerySelect = (query) => {
    handleSearch(query);
  };

  const handleReset = () => {
    setCurrentQuery("");
    setSearchResult(null);
    setShowWelcome(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-12">
      <div className="space-y-6">
        {!showWelcome && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-4"
            onClick={handleReset}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to search
          </Button>
        )}

        <SearchBar 
          onSearch={handleSearch} 
          isSearching={isSearching} 
        />

        {isSearching && (
          <SearchResult isLoading={true} />
        )}

        {searchResult && !isSearching && (
          <SearchResult result={searchResult} isLoading={false} />
        )}

        {showWelcome && (
          <div className="mt-10 space-y-10">
            {recentQueries.length > 0 && (
              <div className="space-y-4">
                <h2 className="flex items-center text-lg font-medium text-gray-700">
                  <Clock className="mr-2 h-5 w-5 text-gray-500" />
                  Recent Searches
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recentQueries.slice(0, 4).map((item) => (
                    <Button
                      key={item.id}
                      variant="outline"
                      className="justify-between p-4 h-auto bg-white hover:bg-gray-50 text-left"
                      onClick={() => handleSearch(item.query)}
                    >
                      <span className="font-medium truncate">{item.query}</span>
                      <ArrowRight className="h-4 w-4 ml-2 text-gray-400 flex-shrink-0" />
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h2 className="flex items-center text-lg font-medium text-gray-700">
                <Lightbulb className="mr-2 h-5 w-5 text-gray-500" />
                Suggested Searches
              </h2>
              <SuggestedQueries onSelect={handleSuggestedQuerySelect} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}