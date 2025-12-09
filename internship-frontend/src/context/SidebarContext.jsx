import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);
  const closeMobileMenu = () => setIsMobileOpen(false);

  return (
    <SidebarContext.Provider value={{ 
      isCollapsed, 
      setIsCollapsed,
      toggleCollapse,
      isMobileOpen,
      setIsMobileOpen,
      toggleMobileMenu,
      closeMobileMenu
    }}>
      {children}
    </SidebarContext.Provider>
  );
};
