"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  LogIn,
  Sparkles,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  User,
  Users,
  Trophy,
  Target,
  Star,
  Shield,
  Zap,
} from "lucide-react";
import { loginSchema, type LoginCredentials } from "@shared/schema";
import { useLogin } from "@/hooks/use-auth";
import { useLocation } from "wouter";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const loginMutation = useLogin();

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    const result = await loginMutation.mutateAsync(data);
    if (result.success) {
      onOpenChange(false);
      form.reset();
      // Redirect based on user role
      if (result.data && result.data.role === "admin") {
        setLocation("/admin");
      } else {
        setLocation("/dashboard");
      }
    }
  };

  const features = [
    { icon: Users, text: "2500+ Mahasiswa Aktif" },
    { icon: Trophy, text: "50+ Prestasi Gemilang" },
    { icon: Target, text: "25+ UKM Terbaik" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 bg-white border-0 shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[480px]">
          {/* Left Panel - Branding & Info */}
          <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 p-6 lg:p-8 flex flex-col justify-center text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px), radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
                  backgroundSize: "60px 60px",
                }}
              />
            </div>

            {/* Floating Elements */}
            <div className="absolute top-8 right-8 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-12 left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              {/* Logo */}
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold">Portfolio UKM</h1>
              </div>

              {/* Main Content */}
              <div className="mb-6">
                <h2 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                  Bergabung dengan
                  <br />
                  <span className="text-yellow-200">Komunitas Terbaik</span>
                </h2>
                <p className="text-lg text-white/90 leading-relaxed">
                  Temukan passion Anda, kembangkan potensi diri, dan raih
                  prestasi gemilang bersama UKM terbaik.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-center">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-4">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white/90 font-medium">
                        {feature.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  <span className="text-white/80">100% Aman</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  <span className="text-white/80">Rating 4.9/5</span>
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  <span className="text-white/80">Akses Instan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="p-6 lg:p-8 flex flex-col justify-center bg-gradient-to-br from-white to-amber-50">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-amber-800 to-yellow-700 bg-clip-text text-transparent mb-2">
                Selamat Datang Kembali
              </h3>
              <p className="text-amber-700/70">
                Masuk ke akun Anda untuk melanjutkan
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-amber-800 font-semibold flex items-center text-sm"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="contoh@email.com"
                    {...form.register("email")}
                    disabled={loginMutation.isPending}
                    className="pl-10 h-10 border-amber-200 focus:border-amber-400 focus:ring-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200 text-sm"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-500" />
                </div>
                {form.formState.errors.email && (
                  <div className="flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                    <AlertCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                    {form.formState.errors.email.message}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-amber-800 font-semibold flex items-center text-sm"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password Anda"
                    {...form.register("password")}
                    disabled={loginMutation.isPending}
                    className="pl-10 pr-12 h-10 border-amber-200 focus:border-amber-400 focus:ring-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200 text-sm"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-500" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-9 w-9 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition-all duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loginMutation.isPending}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {form.formState.errors.password && (
                  <div className="flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                    <AlertCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                    {form.formState.errors.password.message}
                  </div>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                  />
                  <span className="ml-2 text-amber-700">Ingat saya</span>
                </label>
                <Button
                  type="button"
                  variant="link"
                  className="text-amber-600 hover:text-amber-800 font-medium p-0 h-auto text-sm"
                >
                  Lupa password?
                </Button>
              </div>

              {/* Error Alert */}
              {loginMutation.isError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700 text-sm">
                    Email atau password tidak valid. Silakan periksa kembali dan
                    coba lagi.
                  </AlertDescription>
                </Alert>
              )}

              {/* Success State */}
              {loginMutation.isSuccess && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700 text-sm">
                    Login berhasil! Mengalihkan...
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-10 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sedang Masuk...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Masuk Sekarang
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-amber-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-br from-white to-amber-50 text-amber-600 font-medium">
                  Atau
                </span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-amber-200">
              <p className="text-amber-700 mb-3 text-sm">Belum punya akun?</p>
              <Button
                variant="outline"
                className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-400 font-semibold transition-all duration-200 bg-transparent h-10"
                onClick={() => {
                  onOpenChange(false);
                  // The parent component should handle opening register modal
                }}
              >
                <User className="mr-2 h-4 w-4" />
                Daftar Sekarang
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-amber-200 mt-6">
              <p className="text-xs text-amber-600/70">
                Dengan masuk, Anda menyetujui{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs text-amber-600 hover:text-amber-800"
                >
                  Syarat & Ketentuan
                </Button>{" "}
                dan{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs text-amber-600 hover:text-amber-800"
                >
                  Kebijakan Privasi
                </Button>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
