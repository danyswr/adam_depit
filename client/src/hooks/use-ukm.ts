import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUKMs, createUKM, updateUKM, deleteUKM, registerToUKM, unregisterFromUKM, getUserUKMs } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export function useUKMs() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['/api/ukms', user?.email],
    queryFn: () => getUKMs(user?.email || 'guest@example.com'),
    refetchOnWindowFocus: false,
  });
}

export function useCreateUKM() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ukmData: any) => {
      if (!user?.email) throw new Error('User not authenticated');
      return createUKM(user.email, ukmData);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['/api/ukms'] });
        toast({
          title: "UKM berhasil dibuat",
          description: "UKM baru telah ditambahkan ke sistem",
        });
      } else {
        toast({
          title: "Gagal membuat UKM",
          description: result.error || "Terjadi kesalahan saat membuat UKM",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Gagal membuat UKM",
        description: "Terjadi kesalahan saat membuat UKM",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateUKM() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ukmId, ukmData }: { ukmId: string; ukmData: any }) => {
      if (!user?.email) throw new Error('User not authenticated');
      return updateUKM(user.email, ukmId, ukmData);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['/api/ukms'] });
        toast({
          title: "UKM berhasil diperbarui",
          description: "Data UKM telah berhasil diperbarui",
        });
      } else {
        toast({
          title: "Gagal memperbarui UKM",
          description: result.error || "Terjadi kesalahan saat memperbarui UKM",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Gagal memperbarui UKM",
        description: "Terjadi kesalahan saat memperbarui UKM",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteUKM() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ukmId: string) => {
      if (!user?.email) throw new Error('User not authenticated');
      return deleteUKM(user.email, ukmId);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['/api/ukms'] });
        toast({
          title: "UKM berhasil dihapus",
          description: "UKM telah berhasil dihapus dari sistem",
        });
      } else {
        toast({
          title: "Gagal menghapus UKM",
          description: result.error || "Terjadi kesalahan saat menghapus UKM",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Gagal menghapus UKM",
        description: "Terjadi kesalahan saat menghapus UKM",
        variant: "destructive",
      });
    },
  });
}

export function useRegisterToUKM() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ukmId: string) => {
      if (!user?.email) throw new Error('User not authenticated');
      return registerToUKM(user.email, ukmId);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['/api/user-ukms'] });
        toast({
          title: "Berhasil mendaftar",
          description: "Anda telah berhasil mendaftar ke UKM ini",
        });
      } else {
        toast({
          title: "Gagal mendaftar",
          description: result.error || "Terjadi kesalahan saat mendaftar",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Gagal mendaftar",
        description: "Terjadi kesalahan saat mendaftar",
        variant: "destructive",
      });
    },
  });
}

export function useUserUKMs() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['/api/user-ukms', user?.userId],
    queryFn: () => {
      if (!user?.email) throw new Error('User not authenticated');
      return getUserUKMs(user.email);
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
  });
}
