
import React from "react";
import AppSidebar from "./AppSidebar";
import Header from "./Header";
import { SidebarTrigger } from "./ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 overflow-auto">
          <SidebarTrigger className="lg:hidden mb-4" />
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
