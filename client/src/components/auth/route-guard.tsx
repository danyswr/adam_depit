import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface RouteGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireUser?: boolean;
}

export default function RouteGuard({ children, requireAdmin = false, requireUser = false }: RouteGuardProps) {
  const { user, isAdmin, isLoggedIn } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect if not logged in and trying to access protected routes
    if (!isLoggedIn && (requireAdmin || requireUser)) {
      setLocation("/");
      return;
    }

    // Redirect admin users away from user-only pages
    if (isLoggedIn && requireUser && isAdmin) {
      setLocation("/admin");
      return;
    }

    // Redirect regular users away from admin pages
    if (isLoggedIn && requireAdmin && !isAdmin) {
      setLocation("/dashboard");
      return;
    }
  }, [isLoggedIn, isAdmin, requireAdmin, requireUser, setLocation]);

  // Don't render if access requirements aren't met
  if (requireAdmin && !isAdmin) return null;
  if (requireUser && (isAdmin || !isLoggedIn)) return null;
  if ((requireAdmin || requireUser) && !isLoggedIn) return null;

  return <>{children}</>;
}