
import React, { useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useApp } from "@/context/AppContext";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sidebarOpen, setSidebarOpen, isMobile } = useApp();

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobile && sidebarOpen) {
        const target = e.target as Element;
        if (!target.closest("[data-sidebar]") && !target.closest("[data-sidebar-trigger]")) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, sidebarOpen, setSidebarOpen]);

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div
        data-sidebar
        className={cn(
          "fixed md:relative z-30 h-full transition-all duration-300 ease-in-out",
          isMobile
            ? sidebarOpen
              ? "left-0 w-[280px]"
              : "-left-[280px] w-0"
            : sidebarOpen
            ? "w-[280px]"
            : "w-0"
        )}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center px-6 border-b glass">
          <button
            data-sidebar-trigger
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-10 w-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="ml-4">
            <h1 className="text-xl font-medium tracking-tight">Noteverse</h1>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};
