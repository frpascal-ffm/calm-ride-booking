import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PartnerBookingPage from "./components/PartnerBookingPage";
import PartnerDirectory from "./components/PartnerDirectory";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import PartnersPage from "./pages/dashboard/PartnersPage";
import BookingsPage from "./pages/dashboard/BookingsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import GeneralSettingsPage from "./pages/dashboard/settings/GeneralSettingsPage";
import UsersSettingsPage from "./pages/dashboard/settings/UsersSettingsPage";
import NotificationsSettingsPage from "./pages/dashboard/settings/NotificationsSettingsPage";
import SecuritySettingsPage from "./pages/dashboard/settings/SecuritySettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage onAuthSuccess={() => window.location.href = '/dashboard'} />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<PartnersPage />} />
            <Route path="partners" element={<PartnersPage />} />
            <Route path="directory" element={<PartnerDirectory />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="settings/general" element={<GeneralSettingsPage />} />
            <Route path="settings/users" element={<UsersSettingsPage />} />
            <Route path="settings/notifications" element={<NotificationsSettingsPage />} />
            <Route path="settings/security" element={<SecuritySettingsPage />} />
          </Route>
          <Route path="/:companySlug/:partnerSlug" element={<PartnerBookingPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
