import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useUser, useIsAuthenticated } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Code2, User, LogOut, LayoutDashboard, PlusCircle, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Application Header
 * Includes navigation and user menu
 */
export default function Header() {
  const navigate = useNavigate();
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-gray-950">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and name */}
        <Link to="/" className="flex items-center space-x-2">
          <Code2 className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold">AgentLogic</span>
        </Link>

        {/* Central navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/exercises"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400"
          >
            Exercises
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400"
              >
                Dashboard
              </Link>

              <Link
                to="/analytics"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400"
              >
                Analytics
              </Link>

              <Link
                to="/exercises/create"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400"
              >
                Create Exercise
              </Link>
            </>
          )}
        </nav>

        {/* User actions */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline-block">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/analytics')}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate('/exercises/create')}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Exercise
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
              <Button
                size="sm"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}