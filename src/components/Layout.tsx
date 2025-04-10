
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Dumbbell, Home, Upload, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleLogout = async () => {
    await logout();
  };
  
  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Dashboard', path: '/dashboard', icon: <Dumbbell className="h-5 w-5" /> },
    { name: 'Upload Meal', path: '/upload', icon: <Upload className="h-5 w-5" /> },
    { name: 'Profile', path: '/profile', icon: <User className="h-5 w-5" /> },
  ];

  const NavLink = ({ item }: { item: typeof navItems[0] }) => (
    <Link
      to={item.path}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
        location.pathname === item.path
          ? "bg-yellow-500 text-white"
          : "hover:bg-yellow-100"
      )}
    >
      {item.icon}
      <span>{item.name}</span>
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 border-b bg-background flex items-center justify-between px-4 h-14">
        <Link to="/" className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-fit-blue" />
          <span className="font-bold text-xl">FitVision</span>
        </Link>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] sm:w-[300px]">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between py-4 border-b">
                <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <Dumbbell className="h-6 w-6 text-fit-blue" />
                  <span className="font-bold text-xl">FitVision</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <nav className="flex flex-col gap-1 py-4">
                {isAuthenticated ? (
                  <>
                    {navItems.map((item) => (
                      <div key={item.path} onClick={() => setIsOpen(false)}>
                        <NavLink item={item} />
                      </div>
                    ))}
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-2 justify-start px-4"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/" 
                      className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-primary/10"
                      onClick={() => setIsOpen(false)}
                    >
                      <Home className="h-5 w-5" />
                      <span>Home</span>
                    </Link>
                    <Link 
                      to="/login" 
                      className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-primary/10"
                      onClick={() => setIsOpen(false)}
                    >
                      <span>Login</span>
                    </Link>
                    <Link 
                      to="/register" 
                      className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-primary/10"
                      onClick={() => setIsOpen(false)}
                    >
                      <span>Register</span>
                    </Link>
                  </>
                )}
              </nav>
              
              {isAuthenticated && (
                <div className="mt-auto border-t py-4">
                  <div className="px-4">
                    <div className="font-medium">{currentUser?.name}</div>
                    <div className="text-sm text-gray-500">{currentUser?.email}</div>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-screen">
        <aside className="w-64 border-r flex flex-col h-full">
          <div className="p-4 border-b">
            <Link to="/" className="flex items-center gap-2">
              <Dumbbell className="h-6 w-6 text-fit-blue" />
              <span className="font-bold text-xl">FitVision</span>
            </Link>
          </div>
          
          <nav className="flex flex-col gap-1 p-2">
            {isAuthenticated ? (
              <>
                {navItems.map((item) => (
                  <NavLink key={item.path} item={item} />
                ))}
              </>
            ) : (
              <>
                <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-primary/10">
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
                <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-primary/10">
                  <span>Login</span>
                </Link>
                <Link to="/register" className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-primary/10">
                  <span>Register</span>
                </Link>
              </>
            )}
          </nav>
          
          {isAuthenticated && (
            <>
              <div className="mt-auto border-t">
                <Button
                  variant="ghost"
                  className="w-full flex items-center gap-2 justify-start px-4 py-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Button>
              </div>
              
              <div className="p-4 border-t">
                <div className="font-medium">{currentUser?.name}</div>
                <div className="text-sm text-gray-500">{currentUser?.email}</div>
              </div>
            </>
          )}
        </aside>
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Content */}
      <main className="flex-1 lg:hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
