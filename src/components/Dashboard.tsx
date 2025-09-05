import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Building2, Calendar, LogOut, Settings, Users, ChevronDown, ChevronRight, User, Bell, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    title: 'Partner',
    url: '/dashboard/partners',
    icon: Users,
  },
  {
    title: 'Partnerverzeichnis',
    url: '/dashboard/directory',
    icon: Building2,
  },
  {
    title: 'Buchungen',
    url: '/dashboard/bookings',
    icon: Calendar,
  },
];

const settingsItems = [
  {
    title: 'Allgemein',
    url: '/dashboard/settings/general',
    icon: Settings,
  },
  {
    title: 'Benutzer',
    url: '/dashboard/settings/users',
    icon: User,
  },
  {
    title: 'Benachrichtigungen',
    url: '/dashboard/settings/notifications',
    icon: Bell,
  },
  {
    title: 'Sicherheit',
    url: '/dashboard/settings/security',
    icon: Shield,
  },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(location.pathname.startsWith('/dashboard/settings'));

  const handleLogout = () => {
    // Hier würde die Logout-Logik implementiert werden
    navigate('/');
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar variant="inset">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">Krankentransport</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          onClick={() => navigate(item.url)}
                        >
                          <button className="flex items-center gap-2 w-full">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                  
                  {/* Expandable Settings Menu */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname.startsWith('/dashboard/settings')}
                      onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
                    >
                      <button className="flex items-center gap-2 w-full justify-between">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          <span>Einstellungen</span>
                        </div>
                        {isSettingsExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  {/* Settings Submenu */}
                  {isSettingsExpanded && (
                    <div className="ml-4 space-y-1">
                      {settingsItems.map((item) => {
                        const isActive = location.pathname === item.url;
                        return (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                              asChild
                              isActive={isActive}
                              onClick={() => navigate(item.url)}
                              size="sm"
                            >
                              <button className="flex items-center gap-2 w-full pl-2">
                                <item.icon className="h-3 w-3" />
                                <span className="text-sm">{item.title}</span>
                              </button>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </div>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Abmelden</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">
                {navigationItems.find(item => item.url === location.pathname)?.title || 
                 settingsItems.find(item => item.url === location.pathname)?.title || 
                 'Dashboard'}
              </h1>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;