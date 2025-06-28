"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Loader2,
  User,
  Mail,
  Hash,
  Phone,
  Users,
  GraduationCap,
  Lock,
  UserPlus,
  Sparkles,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  LogIn,
  Trophy,
  Target,
  Star,
  Shield,
  Zap,
  ChevronRight,
  Check,
} from "lucide-react";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { useRegister } from "@/hooks/use-auth";
import { useLocation } from "wouter";

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RegisterFormData extends InsertUser {
  confirmPassword: string;
}

const registerFormSchema = insertUserSchema
  .extend({
    confirmPassword: insertUserSchema.shape.password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export default function RegisterModal({
  open,
  onOpenChange,
}: RegisterModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [, setLocation] = useLocation();
  const registerMutation = useRegister();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      namaMahasiswa: "",
      email: "",
      nim: "",
      nomorWhatsapp: "",
      gender: "",
      jurusan: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    // Force re-render when form values change to update button state
  }, [watchedValues]);

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    const result = await registerMutation.mutateAsync(registerData);
    if (result.success) {
      onOpenChange(false);
      form.reset();
      setCurrentStep(1);
      // Redirect based on user role
      if (result.data && result.data.role === "admin") {
        setLocation("/admin");
      } else {
        setLocation("/dashboard");
      }
    }
  };

  const features = [
    { icon: Users, text: "Bergabung dengan 2500+ Mahasiswa" },
    { icon: Trophy, text: "Akses ke 50+ Prestasi & Event" },
    { icon: Target, text: "Pilih dari 25+ UKM Terbaik" },
  ];

  const steps = [
    { number: 1, title: "Data Pribadi", icon: User },
    { number: 2, title: "Data Akademik", icon: GraduationCap },
    { number: 3, title: "Keamanan", icon: Lock },
  ];

  const nextStep = async () => {
    if (currentStep < 3) {
      // Trigger validation for current step fields
      const fieldsToValidate =
        currentStep === 1
          ? ["namaMahasiswa", "email"]
          : currentStep === 2
            ? ["nim", "gender"]
            : ["password", "confirmPassword"];

      const isValid = await form.trigger(fieldsToValidate);

      if (isValid && validateStep(currentStep)) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const validateStep = (step: number) => {
    const values = form.getValues();
    const errors = form.formState.errors;

    switch (step) {
      case 1:
        // Check if required fields are filled and have no errors
        return (
          values.namaMahasiswa?.trim() &&
          values.email?.trim() &&
          !errors.namaMahasiswa &&
          !errors.email
        );
      case 2:
        return (
          values.nim?.trim() &&
          values.gender?.trim() &&
          !errors.nim &&
          !errors.gender
        );
      case 3:
        return (
          values.password?.trim() &&
          values.confirmPassword?.trim() &&
          values.password === values.confirmPassword &&
          !errors.password &&
          !errors.confirmPassword
        );
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl p-0 bg-white border-0 shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">
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
                  Mulai Perjalanan
                  <br />
                  <span className="text-yellow-200">Luar Biasa Anda</span>
                </h2>
                <p className="text-lg text-white/90 leading-relaxed">
                  Bergabunglah dengan komunitas mahasiswa terbaik dan wujudkan
                  potensi diri Anda bersama kami.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
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

              {/* Progress Steps */}
              <div className="space-y-2 mb-6">
                <p className="text-white/80 text-sm font-medium mb-3">
                  Langkah Pendaftaran:
                </p>
                {steps.map((step) => {
                  const IconComponent = step.icon;
                  const isActive = currentStep === step.number;
                  const isCompleted = currentStep > step.number;

                  return (
                    <div key={step.number} className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 transition-all duration-200 ${
                          isCompleted
                            ? "bg-green-400 text-white"
                            : isActive
                              ? "bg-white text-amber-600"
                              : "bg-white/20 text-white/60"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <span className="text-xs font-bold">
                            {step.number}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium transition-all duration-200 ${
                          isActive ? "text-white" : "text-white/70"
                        }`}
                      >
                        {step.title}
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
                  <span className="text-white/80">Gratis</span>
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  <span className="text-white/80">Cepat</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Register Form */}
          <div className="p-6 lg:p-8 flex flex-col justify-center bg-gradient-to-br from-white to-amber-50">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-amber-800 to-yellow-700 bg-clip-text text-transparent mb-2">
                Buat Akun Baru
              </h3>
              <p className="text-amber-700/70">
                Langkah {currentStep} dari 3 - {steps[currentStep - 1].title}
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Step 1: Personal Data */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="namaMahasiswa"
                      className="text-amber-800 font-semibold flex items-center text-sm"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Nama Lengkap *
                    </Label>
                    <div className="relative">
                      <Input
                        id="namaMahasiswa"
                        placeholder="Masukkan nama lengkap"
                        {...form.register("namaMahasiswa")}
                        disabled={registerMutation.isPending}
                        className="pl-10 h-10 border-amber-200 focus:border-amber-400 focus:ring-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200 text-sm"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-500" />
                    </div>
                    {form.formState.errors.namaMahasiswa && (
                      <div className="flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                        <AlertCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                        {form.formState.errors.namaMahasiswa.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-amber-800 font-semibold flex items-center text-sm"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email *
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="contoh@email.com"
                        {...form.register("email")}
                        disabled={registerMutation.isPending}
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

                  <div className="space-y-2">
                    <Label
                      htmlFor="nomorWhatsapp"
                      className="text-amber-800 font-semibold flex items-center text-sm"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      No. WhatsApp
                    </Label>
                    <div className="relative">
                      <Input
                        id="nomorWhatsapp"
                        type="tel"
                        placeholder="08xxxxxxxxxx"
                        {...form.register("nomorWhatsapp")}
                        disabled={registerMutation.isPending}
                        className="pl-10 h-10 border-amber-200 focus:border-amber-400 focus:ring-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200 text-sm"
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-500" />
                    </div>
                    {form.formState.errors.nomorWhatsapp && (
                      <div className="flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                        <AlertCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                        {form.formState.errors.nomorWhatsapp.message}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Academic Data */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="nim"
                      className="text-amber-800 font-semibold flex items-center text-sm"
                    >
                      <Hash className="w-4 h-4 mr-2" />
                      NIM *
                    </Label>
                    <div className="relative">
                      <Input
                        id="nim"
                        placeholder="Nomor Induk Mahasiswa"
                        {...form.register("nim")}
                        disabled={registerMutation.isPending}
                        className="pl-10 h-10 border-amber-200 focus:border-amber-400 focus:ring-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200 text-sm"
                      />
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-500" />
                    </div>
                    {form.formState.errors.nim && (
                      <div className="flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                        <AlertCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                        {form.formState.errors.nim.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="gender"
                      className="text-amber-800 font-semibold flex items-center text-sm"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Jenis Kelamin *
                    </Label>
                    <Select
                      onValueChange={(value) => form.setValue("gender", value)}
                      disabled={registerMutation.isPending}
                    >
                      <SelectTrigger className="h-10 border-amber-200 focus:border-amber-400 focus:ring-amber-400 bg-white/80 backdrop-blur-sm">
                        <SelectValue placeholder="Pilih Jenis Kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                        <SelectItem value="Perempuan">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.gender && (
                      <div className="flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                        <AlertCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                        {form.formState.errors.gender.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="jurusan"
                      className="text-amber-800 font-semibold flex items-center text-sm"
                    >
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Jurusan
                    </Label>
                    <div className="relative">
                      <Input
                        id="jurusan"
                        placeholder="Masukkan jurusan"
                        {...form.register("jurusan")}
                        disabled={registerMutation.isPending}
                        className="pl-10 h-10 border-amber-200 focus:border-amber-400 focus:ring-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200 text-sm"
                      />
                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-500" />
                    </div>
                    {form.formState.errors.jurusan && (
                      <div className="flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                        <AlertCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                        {form.formState.errors.jurusan.message}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Security */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-amber-800 font-semibold flex items-center text-sm"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimal 6 karakter"
                        {...form.register("password")}
                        disabled={registerMutation.isPending}
                        className="pl-10 pr-12 h-10 border-amber-200 focus:border-amber-400 focus:ring-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200 text-sm"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-500" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-9 w-9 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition-all duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={registerMutation.isPending}
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

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-amber-800 font-semibold flex items-center text-sm"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Konfirmasi Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Ulangi password"
                        {...form.register("confirmPassword")}
                        disabled={registerMutation.isPending}
                        className="pl-10 pr-12 h-10 border-amber-200 focus:border-amber-400 focus:ring-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200 text-sm"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-500" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-9 w-9 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition-all duration-200"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={registerMutation.isPending}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {form.formState.errors.confirmPassword && (
                      <div className="flex items-center text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                        <AlertCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                        {form.formState.errors.confirmPassword.message}
                      </div>
                    )}
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-700">
                      Dengan mendaftar, Anda menyetujui{" "}
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
              )}

              {/* Error Alert */}
              {registerMutation.isError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700 text-sm">
                    Terjadi kesalahan saat registrasi. Silakan periksa data dan
                    coba lagi.
                  </AlertDescription>
                </Alert>
              )}

              {/* Success State */}
              {registerMutation.isSuccess && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700 text-sm">
                    Registrasi berhasil! Mengalihkan...
                  </AlertDescription>
                </Alert>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-2">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 h-10 border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-400 font-semibold transition-all duration-200 bg-transparent"
                    disabled={registerMutation.isPending}
                  >
                    Kembali
                  </Button>
                )}

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={
                      !validateStep(currentStep) || registerMutation.isPending
                    }
                    className="flex-1 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Lanjutkan
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex-1 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mendaftar...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Daftar Sekarang
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>

            {/* Login Link */}
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-amber-200 mt-6">
              <p className="text-amber-700 mb-3 text-sm">Sudah punya akun?</p>
              <Button
                variant="outline"
                className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-400 font-semibold transition-all duration-200 bg-transparent h-10"
                onClick={() => {
                  onOpenChange(false);
                  // The parent component should handle opening login modal
                }}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Masuk Sekarang
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
