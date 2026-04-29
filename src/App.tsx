import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import Budgets from "@/pages/Budgets";
import Goals from "@/pages/Goals";
import NotFound from "@/pages/NotFound";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>

          {/* 🔓 PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔐 PROTECTED ROUTES */}
          <Route element={<AppLayout />}>
            <Route
              path="/"
              element={
                localStorage.getItem("token")
                  ? <Dashboard />
                  : <Navigate to="/login" />
              }
            />
            <Route
              path="/transactions"
              element={
                localStorage.getItem("token")
                  ? <Transactions />
                  : <Navigate to="/login" />
              }
            />
            <Route
              path="/budgets"
              element={
                localStorage.getItem("token")
                  ? <Budgets />
                  : <Navigate to="/login" />
              }
            />
            <Route
              path="/goals"
              element={
                localStorage.getItem("token")
                  ? <Goals />
                  : <Navigate to="/login" />
              }
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;