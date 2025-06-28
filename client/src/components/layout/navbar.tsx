import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/auth";
import LoginModal from "@/components/auth/login-modal";
import RegisterModal from "@/components/auth/register-modal";

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Beranda", href: "/" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Tentang", href: "/about" },
  ];

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const NavItems = ({ mobile = false }) => (
    <>
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`${
            mobile ? "block px-3 py-2" : "px-3 py-2"
          } text-gray-700 hover:text-primary transition-colors ${
            location === item.href ? "text-primary font-semibold" : ""
          }`}
          onClick={() => mobile && setMobileMenuOpen(false)}
        >
          {item.name}
        </Link>
      ))}
    </>
  );

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">UKM Portfolio</h1>
              </Link>
              <div className="hidden md:ml-10 md:flex space-x-8">
                <NavItems />
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user?.namaMahasiswa?.substring(0, 2).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden lg:block">{user?.namaMahasiswa}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => setLocation("/dashboard")}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLocation("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => setLocation("/admin")}>
                        <Settings className="mr-2 h-4 w-4" />
                        Panel Admin
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => setShowLoginModal(true)}>
                    Masuk
                  </Button>
                  <Button onClick={() => setShowRegisterModal(true)}>
                    Daftar
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <div className="flex flex-col space-y-4 mt-8">
                    <NavItems mobile />
                    {isLoggedIn ? (
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-3 mb-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {user?.namaMahasiswa?.substring(0, 2).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-semibold">{user?.namaMahasiswa}</span>
                        </div>
                        <div className="space-y-2">
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              setLocation("/dashboard");
                              setMobileMenuOpen(false);
                            }}
                          >
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Button>
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => {
                                setLocation("/admin");
                                setMobileMenuOpen(false);
                              }}
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              Panel Admin
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              handleLogout();
                              setMobileMenuOpen(false);
                            }}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Keluar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-4 border-t border-gray-200 space-y-2">
                        <Button
                          variant="ghost"
                          className="w-full"
                          onClick={() => {
                            setShowLoginModal(true);
                            setMobileMenuOpen(false);
                          }}
                        >
                          Masuk
                        </Button>
                        <Button
                          className="w-full"
                          onClick={() => {
                            setShowRegisterModal(true);
                            setMobileMenuOpen(false);
                          }}
                        >
                          Daftar
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      <RegisterModal open={showRegisterModal} onOpenChange={setShowRegisterModal} />
    </>
  );
}
