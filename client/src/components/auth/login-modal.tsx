import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginSchema, LoginCredentials } from "@shared/schema";
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
      setLocation("/dashboard");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Masuk</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Masukkan email Anda"
              {...form.register("email")}
              disabled={loginMutation.isPending}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password Anda"
                {...form.register("password")}
                disabled={loginMutation.isPending}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loginMutation.isPending}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>

          {loginMutation.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                Email atau password tidak valid. Silakan coba lagi.
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loginMutation.isPending ? "Masuk..." : "Masuk"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-gray-600">
            Belum punya akun?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold"
              onClick={() => {
                onOpenChange(false);
                // The parent component should handle opening register modal
              }}
            >
              Daftar sekarang
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
