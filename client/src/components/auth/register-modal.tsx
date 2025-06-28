import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { insertUserSchema, InsertUser } from "@shared/schema";
import { useRegister } from "@/hooks/use-auth";
import { useLocation } from "wouter";

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RegisterFormData extends InsertUser {
  confirmPassword: string;
}

const registerFormSchema = insertUserSchema.extend({
  confirmPassword: insertUserSchema.shape.password,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password dan konfirmasi password tidak cocok",
  path: ["confirmPassword"],
});

export default function RegisterModal({ open, onOpenChange }: RegisterModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    const result = await registerMutation.mutateAsync(registerData);
    if (result.success) {
      onOpenChange(false);
      form.reset();
      setLocation("/dashboard");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Daftar Akun</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="namaMahasiswa">Nama Lengkap *</Label>
              <Input
                id="namaMahasiswa"
                placeholder="Nama lengkap"
                {...form.register("namaMahasiswa")}
                disabled={registerMutation.isPending}
              />
              {form.formState.errors.namaMahasiswa && (
                <p className="text-sm text-destructive">{form.formState.errors.namaMahasiswa.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                {...form.register("email")}
                disabled={registerMutation.isPending}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nim">NIM *</Label>
              <Input
                id="nim"
                placeholder="Nomor Induk Mahasiswa"
                {...form.register("nim")}
                disabled={registerMutation.isPending}
              />
              {form.formState.errors.nim && (
                <p className="text-sm text-destructive">{form.formState.errors.nim.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nomorWhatsapp">No. WhatsApp</Label>
              <Input
                id="nomorWhatsapp"
                type="tel"
                placeholder="08xxxxxxxxxx"
                {...form.register("nomorWhatsapp")}
                disabled={registerMutation.isPending}
              />
              {form.formState.errors.nomorWhatsapp && (
                <p className="text-sm text-destructive">{form.formState.errors.nomorWhatsapp.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Jenis Kelamin</Label>
              <Select onValueChange={(value) => form.setValue("gender", value)} disabled={registerMutation.isPending}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Jenis Kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.gender && (
                <p className="text-sm text-destructive">{form.formState.errors.gender.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jurusan">Jurusan</Label>
              <Input
                id="jurusan"
                placeholder="Jurusan"
                {...form.register("jurusan")}
                disabled={registerMutation.isPending}
              />
              {form.formState.errors.jurusan && (
                <p className="text-sm text-destructive">{form.formState.errors.jurusan.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 6 karakter"
                {...form.register("password")}
                disabled={registerMutation.isPending}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={registerMutation.isPending}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Ulangi password"
                {...form.register("confirmPassword")}
                disabled={registerMutation.isPending}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={registerMutation.isPending}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          {registerMutation.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                Terjadi kesalahan saat registrasi. Silakan coba lagi.
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
            {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {registerMutation.isPending ? "Mendaftar..." : "Daftar Akun"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-gray-600">
            Sudah punya akun?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold"
              onClick={() => {
                onOpenChange(false);
                // The parent component should handle opening login modal
              }}
            >
              Masuk sekarang
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
