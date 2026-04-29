import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";

export function AppLayout() {
let user = null;

try {
  user = JSON.parse(localStorage.getItem("user") || "{}");
} catch {
  user = {};
}

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">

          {/* 🔥 HEADER */}
<header className="h-14 flex items-center border-b border-border px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
  <SidebarTrigger className="mr-4" />

  <div className="flex-1" />

  <div className="flex items-center gap-3">
    {/* ✅ USER NAME HERE */}
    <span className="text-sm text-gray-600">
      {user?.name ? user.name : "User"}
    </span>

    {/* ✅ LOGOUT BUTTON */}
    <button
      className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
      onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }}
    >
      Logout
    </button>
  </div>
</header>

          {/* MAIN */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            <Outlet />
          </main>

        </div>
      </div>
    </SidebarProvider>
  );
}