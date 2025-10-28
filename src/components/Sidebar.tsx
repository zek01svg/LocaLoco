import React, { useState } from 'react';
import { Home, MessageCircle, User, LogOut, Store, Settings, Bell, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  onNavigate: (view: 'map' | 'forum' | 'profile') => void;
  onLogout: () => void;
  currentView?: string;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  view?: string;
}

export function Sidebar({ onNavigate, onLogout, currentView }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const topNavItems: NavItem[] = [
    {
      icon: <Home className="w-5 h-5" />,
      label: 'Home Page',
      action: () => onNavigate('map'),
      view: 'map',
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      label: 'Forum',
      action: () => onNavigate('forum'),
      view: 'forum',
    },
    {
      icon: <User className="w-5 h-5" />,
      label: 'Profile',
      action: () => onNavigate('profile'),
      view: 'profile',
    },
  ];

  const bottomNavItems: NavItem[] = [
    {
      icon: <Bell className="w-5 h-5" />,
      label: 'Notifications',
      action: () => console.log('Notifications'),
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      label: 'Help',
      action: () => console.log('Help'),
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings',
      action: () => console.log('Settings'),
    },
    {
      icon: <LogOut className="w-5 h-5" />,
      label: 'Logout',
      action: onLogout,
    },
  ];

  const renderNavItem = (item: NavItem, index: number) => {
    const isActive = item.view === currentView;
    const isHovered = hoveredItem === item.label;

    return (
      <div
        key={index}
        className="relative"
        onMouseEnter={() => setHoveredItem(item.label)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <button
          onClick={item.action}
          className={`w-full p-4 flex items-center justify-center transition-colors relative ${
            isActive
              ? 'text-primary bg-gray-700'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          {item.icon}
        </button>

        {/* Tooltip on hover */}
        {isHovered && (
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
            <div className="bg-gray-800 text-white px-3 py-2 rounded-md shadow-lg whitespace-nowrap text-sm">
              {item.label}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-16 bg-gray-900 flex flex-col z-50 shadow-xl">
      {/* Logo Section */}
      <div className="p-3 flex items-center justify-center border-b border-gray-700">
        <div className="p-2 bg-primary rounded-lg">
          <Store className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Top Navigation */}
      <nav className="flex-1 py-4">
        {topNavItems.map((item, index) => renderNavItem(item, index))}
      </nav>

      {/* Bottom Navigation */}
      <nav className="py-4 border-t border-gray-700">
        {bottomNavItems.map((item, index) => renderNavItem(item, index))}
      </nav>
    </div>
  );
}
