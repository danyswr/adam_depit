import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { LoginCredentials, InsertUser } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useLogin() {
  const { login } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ email, password }: LoginCredentials) => loginUser(email, password),
    onSuccess: (result) => {
      if (result.success && result.data) {
        login(result.data);
        toast({
          title: "Login berhasil",
          description: "Selamat datang kembali!",
        });
      } else {
        toast({
          title: "Login gagal",
          description: result.error || "Terjadi kesalahan saat login",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Login gagal",
        description: "Terjadi kesalahan saat login",
        variant: "destructive",
      });
    },
  });
}

export function useRegister() {
  const { login } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (userData: InsertUser) => registerUser(userData),
    onSuccess: (result) => {
      if (result.success && result.data) {
        login(result.data);
        toast({
          title: "Registrasi berhasil",
          description: "Akun Anda telah berhasil dibuat!",
        });
      } else {
        toast({
          title: "Registrasi gagal",
          description: result.error || "Terjadi kesalahan saat registrasi",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Registrasi gagal",
        description: "Terjadi kesalahan saat registrasi",
        variant: "destructive",
      });
    },
  });
}
