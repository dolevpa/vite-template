
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, Clock, Home, Settings, Menu, X } from "lucide-react";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
      } catch (error) {
        console.log("User not logged in");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await User.logout();
      navigate(createPageUrl("Home"));
    } catch (error) {
      console.error("Error logging out:", error);
    }
    setIsLoggingOut(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative`}
      >
        <div className="p-4 flex justify-between items-center">
          <Link to={createPageUrl("Home")} className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-1 rounded-md">
              <Search className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">InsightAI</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Separator />

        <nav className="p-4 space-y-2">
          <Link
            to={createPageUrl("Home")}
            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
              currentPageName === "Home" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          {/* <Link
            to={createPageUrl("History")}
            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
              currentPageName === "History" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <Clock className="h-5 w-5" />
            <span>Search History</span>
          </Link> */}
          {/* <Link
            to={createPageUrl("Settings")}
            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
              currentPageName === "Settings" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link> */}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          {user ? (
            <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-100">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {user.full_name?.charAt(0) || user.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.full_name || user.email}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "..." : "Logout"}
              </Button>
            </div>
          ) : (
            <Link 
              to={createPageUrl("Home")}
              className="flex w-full justify-center items-center px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => User.login()}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-full md:w-auto">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex items-center justify-between p-4 bg-white border-b md:hidden">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link to={createPageUrl("Home")} className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-1 rounded-md">
                <Search className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold">InsightAI</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
