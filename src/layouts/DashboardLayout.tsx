import { AppSidebar } from "../components/app-sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

const DashboardLayout = () => {
  const { pathname } = useLocation();

  // Derive breadcrumb from path
  const pathSegments = pathname
    .split("/")
    .filter(Boolean)
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1));
  const currentPage = pathSegments[pathSegments.length - 1] || "Dashboard";

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AppSidebar />

      {/* Main Content */}
      <main className="flex flex-1 flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-gray-200/80 bg-white/80 backdrop-blur-md px-6 shadow-sm">
          <nav className="flex items-center gap-1.5 text-sm">
            <a
              href="/admin/home"
              className="text-gray-400 hover:text-gray-600 transition-colors font-medium"
            >
              Dashboard
            </a>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-800">{currentPage}</span>
          </nav>
        </header>

        {/* Page Content */}
        <div className="flex flex-1 flex-col gap-4 p-6">
          <Outlet />
        </div>
      </main>

      <Toaster position="top-center" expand={true} richColors />
    </div>
  );
};

export default DashboardLayout;
