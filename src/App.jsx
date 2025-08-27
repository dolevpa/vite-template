import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
    const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    }}));

  return (
    <>
      <QueryClientProvider client={{queryClient}}>
        <Pages />
        <Toaster />
      </QueryClientProvider>
    </>
  )
}

export default App 