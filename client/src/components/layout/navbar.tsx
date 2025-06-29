"use client";

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Menu,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  Search,
  Rocket,
  Bell,
  Sparkles,
  Home,
  FolderOpen,
  Info,
} from "lucide-react";
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
    { name: "Beranda", href: "/", icon: Home },
    { name: "Portfolio", href: "/portfolio", icon: FolderOpen },
    { name: "Tentang", href: "/about", icon: Info },
  ];

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const NavItems = ({ mobile = false }) => (
    <>
      {navigation.map((item) => {
        const IconComponent = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`${
              mobile
                ? "flex items-center px-4 py-3 rounded-lg transition-all duration-200"
                : "flex items-center px-4 py-2 rounded-lg transition-all duration-200"
            } ${
              location === item.href
                ? mobile
                  ? "bg-amber-100 text-amber-800 font-semibold"
                  : "bg-amber-50 text-amber-800 font-semibold"
                : mobile
                  ? "text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                  : "text-amber-700 hover:bg-amber-50 hover:text-amber-800"
            }`}
            onClick={() => mobile && setMobileMenuOpen(false)}
          >
            <IconComponent className="w-4 h-4 mr-2" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center mr-3">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                    KumpulUKM
                  </h1>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:ml-10 lg:flex space-x-2">
                <NavItems />
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Search Button */}
              <Button
                size="sm"
                variant="ghost"
                className="text-amber-700 hover:text-amber-800 hover:bg-amber-50 transition-all duration-200"
              >
                <Search className="w-4 h-4 mr-2" />
                <span className="hidden lg:inline">Cari UKM</span>
              </Button>

              {/* Notifications (if logged in) */}
              {isLoggedIn && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-amber-700 hover:text-amber-800 hover:bg-amber-50 relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
              )}

              {/* User Menu or Auth Buttons */}
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 text-amber-700 hover:text-amber-800 hover:bg-amber-50 transition-all duration-200"
                    >
                      <Avatar className="h-8 w-8 border-2 border-amber-200">
                        <AvatarFallback className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 font-semibold">
                          {user?.namaMahasiswa?.substring(0, 2).toUpperCase() ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden lg:block font-medium">
                        {user?.namaMahasiswa}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-white border border-amber-200 shadow-lg"
                  >
                    <div className="px-3 py-2 border-b border-amber-100">
                      <p className="text-sm font-medium text-amber-800">
                        {user?.namaMahasiswa}
                      </p>
                      <p className="text-xs text-amber-600">{user?.email}</p>
                    </div>

                    <DropdownMenuItem
                      onClick={() => setLocation("/dashboard")}
                      className="text-amber-700 hover:bg-amber-50 hover:text-amber-800 cursor-pointer"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => setLocation("/profile")}
                      className="text-amber-700 hover:bg-amber-50 hover:text-amber-800 cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profil Saya
                    </DropdownMenuItem>

                    {isAdmin && (
                      <DropdownMenuItem
                        onClick={() => setLocation("/admin")}
                        className="text-amber-700 hover:bg-amber-50 hover:text-amber-800 cursor-pointer"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Panel Admin
                      </DropdownMenuItem>
                    )}

                    <div className="border-t border-amber-100 mt-1">
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Keluar
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLoginModal(true)}
                    className="text-amber-700 hover:text-amber-800 hover:bg-amber-50 font-medium"
                  >
                    Masuk
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowRegisterModal(true)}
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Bergabung
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-amber-700 hover:text-amber-800 hover:bg-amber-50"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[320px] bg-gradient-to-br from-white to-amber-50 border-l border-amber-200"
                >
                  <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="flex items-center mb-8 pb-4 border-b border-amber-200">
                      <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center mr-3">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                        KumpulUKM
                      </h2>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-col space-y-2 mb-6">
                      <NavItems mobile />
                    </div>

                    {/* Search in Mobile */}
                    <div className="mb-6">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-amber-200 text-amber-700 hover:bg-amber-50 bg-transparent"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Cari UKM
                      </Button>
                    </div>

                    {/* User Section */}
                    <div className="mt-auto">
                      {isLoggedIn ? (
                        <div className="bg-white/50 rounded-lg p-4 border border-amber-200">
                          {/* User Info */}
                          <div className="flex items-center space-x-3 mb-4">
                            <Avatar className="h-12 w-12 border-2 border-amber-200">
                              <AvatarFallback className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 font-semibold">
                                {user?.namaMahasiswa
                                  ?.substring(0, 2)
                                  .toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-amber-800 truncate">
                                {user?.namaMahasiswa}
                              </p>
                              <p className="text-sm text-amber-600 truncate">
                                {user?.email}
                              </p>
                            </div>
                          </div>

                          {/* User Actions */}
                          <div className="space-y-2">
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-amber-700 hover:bg-amber-50"
                              onClick={() => {
                                setLocation("/dashboard");
                                setMobileMenuOpen(false);
                              }}
                            >
                              <LayoutDashboard className="mr-2 h-4 w-4" />
                              Dashboard
                            </Button>

                            <Button
                              variant="ghost"
                              className="w-full justify-start text-amber-700 hover:bg-amber-50"
                              onClick={() => {
                                setLocation("/profile");
                                setMobileMenuOpen(false);
                              }}
                            >
                              <User className="mr-2 h-4 w-4" />
                              Profil Saya
                            </Button>

                            {isAdmin && (
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-amber-700 hover:bg-amber-50"
                                onClick={() => {
                                  setLocation("/admin");
                                  setMobileMenuOpen(false);
                                }}
                              >
                                <Settings className="mr-2 h-4 w-4" />
                                Panel Admin
                              </Button>
                            )}

                            <div className="pt-2 border-t border-amber-200">
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
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
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Button
                            variant="outline"
                            className="w-full border-amber-200 text-amber-700 hover:bg-amber-50 bg-transparent"
                            onClick={() => {
                              setShowLoginModal(true);
                              setMobileMenuOpen(false);
                            }}
                          >
                            <User className="mr-2 h-4 w-4" />
                            Masuk
                          </Button>
                          <Button
                            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-md"
                            onClick={() => {
                              setShowRegisterModal(true);
                              setMobileMenuOpen(false);
                            }}
                          >
                            <Rocket className="mr-2 h-4 w-4" />
                            Bergabung Sekarang
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Modals */}
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      <RegisterModal
        open={showRegisterModal}
        onOpenChange={setShowRegisterModal}
      />
    </>
  );
}
