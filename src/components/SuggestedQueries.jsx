import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const defaultSuggestions = [
  "Explain quantum computing in simple terms",
  "What are the latest breakthroughs in AI?",
  "How does climate change affect biodiversity?",
  "What is the history of the internet?",
  "Explain how blockchain technology works"
];

export default function SuggestedQueries({ onSelect, customSuggestions = [] }) {
  const suggestions = customSuggestions.length > 0 ? customSuggestions : defaultSuggestions;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {suggestions.map((query, index) => (
        <Button
          key={index}
          variant="outline"
          className="justify-between p-4 h-auto bg-white hover:bg-gray-50 text-left"
          onClick={() => onSelect(query)}
        >
          <span className="font-medium">{query}</span>
          <ArrowRight className="h-4 w-4 ml-2 text-gray-400" />
        </Button>
      ))}
    </div>
  );
}