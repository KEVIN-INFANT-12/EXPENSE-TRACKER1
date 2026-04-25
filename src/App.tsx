import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";

import Dashboard from "@/pages/Dashboard";
import TransactionsPage from "./pages/TransactionsPage"; 
import Budgets from "@/pages/Budgets";
import Goals from "@/pages/Goals";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>

            {/* ✅ Dashboard */}
            <Route path="/" element={<Dashboard />} />

            {/* ✅ FIXED Transactions route */}
            <Route path="/transactions" element={<TransactionsPage />} />

            {/* ✅ Other pages */}
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/goals" element={<Goals />} />

          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;