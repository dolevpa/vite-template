import React from "react";
import { format } from "date-fns";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchHistory({ history, onSelect, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-4 rounded-lg border shadow-sm animate-pulse">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border text-center">
        <Search className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-700">No search history yet</h3>
        <p className="text-gray-500 mb-4">Your search queries will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((item) => (
        <Button
          key={item.id}
          variant="outline"
          className="w-full justify-between p-4 h-auto bg-white hover:bg-gray-50 text-left"
          onClick={() => onSelect(item)}
        >
          <div className="flex flex-col items-start">
            <span className="font-medium text-gray-900">{item.query}</span>
            <span className="text-xs text-gray-500">
              {item.timestamp ? format(new Date(item.timestamp), "MMM d, yyyy • h:mm a") : ""}
            </span>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </Button>
      ))}
    </div>
  );
}