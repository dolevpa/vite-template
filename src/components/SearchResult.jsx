import React, { useState } from "react";
import { ExternalLink, Copy, Check, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SearchResult({ result, isLoading }) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result?.result || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const giveFeedback = (type) => {
    setFeedback(type);
    // Here you could also send this feedback to your backend
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md border p-6 space-y-4 animate-pulse">
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="pt-4">
          <Skeleton className="h-5 w-1/3" />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  // Format the result text with paragraph breaks
  const formattedResult = result.result?.split('\n').map((paragraph, index) => (
    paragraph.trim() ? <p key={index} className="mb-3">{paragraph}</p> : <br key={index} />
  ));

  return (
    <div className="bg-white rounded-xl shadow-md border">
      <Tabs defaultValue="answer">
        <div className="px-6 pt-6">
          <TabsList className="w-full max-w-xs mb-4">
            <TabsTrigger value="answer" className="flex-1">Answer</TabsTrigger>
            <TabsTrigger value="sources" className="flex-1">Sources ({result.sources?.length || 0})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="answer" className="p-6 pt-0">
          <div className="prose max-w-none">
            {formattedResult}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-6">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="icon" 
                className={`h-8 w-8 ${feedback === 'up' ? 'bg-green-50 text-green-600' : ''}`}
                onClick={() => giveFeedback('up')}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className={`h-8 w-8 ${feedback === 'down' ? 'bg-red-50 text-red-600' : ''}`}
                onClick={() => giveFeedback('down')}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="p-6 pt-0">
          <div className="space-y-4">
            {result.sources?.length > 0 ? (
              result.sources.map((source, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-blue-600">{source.title}</h3>
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{source.snippet}</p>
                  <div className="text-xs text-gray-400 mt-2 truncate">{source.url}</div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No sources available for this answer.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}