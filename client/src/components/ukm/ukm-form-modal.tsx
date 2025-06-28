import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CloudUpload, X, Loader2 } from "lucide-react";
import { insertUkmSchema, InsertUKM, UKM } from "@shared/schema";
import { useCreateUKM, useUpdateUKM } from "@/hooks/use-ukm";

interface UKMFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ukm?: UKM | null;
  onSuccess?: () => void;
}

export default function UKMFormModal({ open, onOpenChange, ukm, onSuccess }: UKMFormModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const createMutation = useCreateUKM();
  const updateMutation = useUpdateUKM();
  const isEditing = !!ukm;

  const form = useForm<InsertUKM>({
    resolver: zodResolver(insertUkmSchema.omit({ imageData: true, mimeType: true, fileName: true })),
    defaultValues: {
      nama_ukm: ukm?.nama_ukm || "",
      deskripsi: ukm?.deskripsi || "",
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix to get just the base64 data
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data: Omit<InsertUKM, 'imageData' | 'mimeType' | 'fileName'>) => {
    try {
      let ukmData: InsertUKM = { ...data };

      if (imageFile) {
        const base64Data = await convertImageToBase64(imageFile);
        ukmData = {
          ...data,
          imageData: base64Data,
          mimeType: imageFile.type,
          fileName: imageFile.name,
        };
      }

      if (isEditing && ukm) {
        await updateMutation.mutateAsync({ ukmId: ukm.id_ukm, ukmData });
      } else {
        await createMutation.mutateAsync(ukmData);
      }

      onOpenChange(false);
      form.reset();
      removeImage();
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting UKM:', error);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditing ? "Edit UKM" : "Tambah UKM Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nama_ukm">Nama UKM *</Label>
            <Input
              id="nama_ukm"
              placeholder="Masukkan nama UKM"
              {...form.register("nama_ukm")}
              disabled={isPending}
            />
            {form.formState.errors.nama_ukm && (
              <p className="text-sm text-destructive">{form.formState.errors.nama_ukm.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi *</Label>
            <Textarea
              id="deskripsi"
              rows={4}
              placeholder="Jelaskan tentang UKM ini"
              {...form.register("deskripsi")}
              disabled={isPending}
            />
            {form.formState.errors.deskripsi && (
              <p className="text-sm text-destructive">{form.formState.errors.deskripsi.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Gambar UKM</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                disabled={isPending}
                className="hidden"
              />
              
              {previewImage ? (
                <div className="space-y-4">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="max-w-full h-48 object-cover rounded-lg mx-auto"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={removeImage}
                    disabled={isPending}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hapus Gambar
                  </Button>
                </div>
              ) : (
                <div 
                  className="cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CloudUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Klik untuk upload gambar atau drag & drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG hingga 5MB</p>
                </div>
              )}
            </div>
          </div>

          {(createMutation.isError || updateMutation.isError) && (
            <Alert variant="destructive">
              <AlertDescription>
                Terjadi kesalahan saat menyimpan UKM. Silakan coba lagi.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Menyimpan..." : (isEditing ? "Update UKM" : "Simpan UKM")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
