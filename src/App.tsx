
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MealHistoryProvider } from "./contexts/MealHistoryContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PremiumRoute from "./components/PremiumRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import ProfileSetup from "./pages/ProfileSetup";
import Paywall from "./pages/Paywall";
import NotFound from "./pages/NotFound";
import { ConvexClientProvider } from "./ConvexClientProvider";


const queryClient = new QueryClient();

const App = () => (
  <ConvexClientProvider>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <MealHistoryProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes (require authentication) */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/setup"
                element={
                  <ProtectedRoute>
                    <ProfileSetup />
                  </ProtectedRoute>
                }
              />
              <Route path="/paywall" element={<Paywall />} />

              {/* Premium Routes (require authentication + premium access) */}
              <Route
                path="/dashboard"
                element={
                  <PremiumRoute>
                    <Dashboard />
                  </PremiumRoute>
                }
              />
              <Route
                path="/upload"
                element={
                  <PremiumRoute>
                    <Upload />
                  </PremiumRoute>
                }
              />

              {/* Catch All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </MealHistoryProvider>
    </AuthProvider>
  </QueryClientProvider>
  </ConvexClientProvider>
);

export default App;
