import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateOrganization from "./pages/CreateOrganization";
import OrganizationDetail from "./pages/OrganizationDetail";
import Organizations from "./pages/Organizations";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import EventDraw from "./pages/EventDraw";
import NotificationsStatus from "./pages/NotificationsStatus";
import Profile from "./pages/Profile";
import MyAssignment from "./pages/MyAssignment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/organizations/create" element={<CreateOrganization />} />
            <Route path="/organizations/:id" element={<OrganizationDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/create" element={<CreateEvent />} />
            <Route path="/events/draw" element={<EventDraw />} />
            <Route path="/events/:id" element={<MyAssignment />} />
            <Route path="/events/:id/notifications" element={<NotificationsStatus />} />
            <Route path="/notifications" element={<NotificationsStatus />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-assignment" element={<MyAssignment />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
