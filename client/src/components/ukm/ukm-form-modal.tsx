"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CloudUpload,
  X,
  Loader2,
  Users,
  FileText,
  ImageIcon,
  Plus,
  Edit,
  AlertCircle,
  CheckCircle,
  Upload,
  Sparkles,
  Target,
} from "lucide-react";
import { insertUkmSchema, type InsertUKM, type UKM } from "@shared/schema";
import { useCreateUKM, useUpdateUKM } from "@/hooks/use-ukm";

interface UKMFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ukm?: UKM | null;
  onSuccess?: () => void;
}

export default function UKMFormModal({
  open,
  onOpenChange,
  ukm,
  onSuccess,
}: UKMFormModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createMutation = useCreateUKM();
  const updateMutation = useUpdateUKM();
  const isEditing = !!ukm;

  const form = useForm<InsertUKM>({
    resolver: zodResolver(
      insertUkmSchema.omit({ imageData: true, mimeType: true, fileName: true }),
    ),
    defaultValues: {
      nama_ukm: ukm?.nama_ukm || "",
      deskripsi: ukm?.deskripsi || "",
      prestasi: ukm?.prestasi || "",
    },
  });

  // Convert Google Drive URL to thumbnail format for better display
  const convertToThumbnailUrl = (url: string) => {
    if (!url) return url;
    
    // Extract file ID from Google Drive URL (both formats)
    let fileId = '';
    
    // Format: https://drive.google.com/uc?export=view&id=FILE_ID
    const ucMatch = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
    if (ucMatch) {
      fileId = ucMatch[1];
    } else {
      // Format: https://drive.google.com/file/d/FILE_ID/view
      const fileMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (fileMatch) {
        fileId = fileMatch[1];
      }
    }
    
    if (fileId) {
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w500`;
    }
    
    // If it's already a thumbnail URL or different format, return as is
    return url;
  };

  // Set preview image when editing existing UKM
  useEffect(() => {
    if (isEditing && ukm?.gambar_url) {
      const thumbnailUrl = convertToThumbnailUrl(ukm.gambar_url);
      setPreviewImage(thumbnailUrl);
    } else {
      setPreviewImage(null);
    }
    
    // Reset form values when ukm changes
    form.reset({
      nama_ukm: ukm?.nama_ukm || "",
      deskripsi: ukm?.deskripsi || "",
      prestasi: ukm?.prestasi || "",
    });
  }, [ukm, isEditing, form]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      alert("File size must be less than 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix to get just the base64 data
        const base64Data = result.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (
    data: Omit<InsertUKM, "imageData" | "mimeType" | "fileName">,
  ) => {
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
      console.error("Error submitting UKM:", error);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-white border-0 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-6 text-white">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
              {isEditing ? (
                <Edit className="w-7 h-7" />
              ) : (
                <Plus className="w-7 h-7" />
              )}
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-white">
                {isEditing ? "Edit UKM" : "Tambah UKM Baru"}
              </DialogTitle>
              <p className="text-white/90 mt-1">
                {isEditing
                  ? "Perbarui informasi UKM"
                  : "Buat UKM baru untuk mahasiswa"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 bg-gradient-to-br from-white to-amber-50">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Nama UKM */}
            <div className="space-y-2">
              <Label
                htmlFor="nama_ukm"
                className="text-amber-800 font-semibold flex items-center text-sm"
              >
                <Users className="w-4 h-4 mr-2" />
                Nama UKM *
              </Label>
              <div className="relative">
                <Input
                  id="nama_ukm"
                  placeholder="Masukkan nama UKM"
                  {...form.register("nama_ukm")}
                  disabled={isPending}
                  className="pl-10 h-11 border-amber-200 focus:border-amber-400 focus:ring-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200"
                />
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-500" />
              </div>
              {form.formState.errors.nama_ukm && (
                <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  {form.formState.errors.nama_ukm.message}
                </div>
              )}
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <Label
                htmlFor="deskripsi"
                className="text-amber-800 font-semibold flex items-center text-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Deskripsi *
              </Label>
              <div className="relative">
                <Textarea
                  id="deskripsi"
                  rows={4}
                  placeholder="Jelaskan tentang UKM ini, kegiatan, dan tujuannya..."
                  {...form.register("deskripsi")}
                  disabled={isPending}
                  className="pl-10 pt-3 border-amber-200 focus:border-amber-400 focus:ring-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200 resize-none"
                />
                <FileText className="absolute left-3 top-3 w-4 h-4 text-amber-500" />
              </div>
              {form.formState.errors.deskripsi && (
                <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  {form.formState.errors.deskripsi.message}
                </div>
              )}
            </div>

            {/* Prestasi */}
            <div className="space-y-2">
              <Label
                htmlFor="prestasi"
                className="text-amber-800 font-semibold flex items-center text-sm"
              >
                <Target className="w-4 h-4 mr-2" />
                Prestasi
              </Label>
              <div className="relative">
                <Textarea
                  id="prestasi"
                  rows={3}
                  placeholder="Jelaskan prestasi yang pernah diraih UKM ini (opsional)..."
                  {...form.register("prestasi")}
                  disabled={isPending}
                  className="pl-10 pt-3 border-amber-200 focus:border-amber-400 focus:ring-amber-400 bg-white/80 backdrop-blur-sm transition-all duration-200 resize-none"
                />
                <Target className="absolute left-3 top-3 w-4 h-4 text-amber-500" />
              </div>
              {form.formState.errors.prestasi && (
                <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  {form.formState.errors.prestasi.message}
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-amber-800 font-semibold flex items-center text-sm">
                <ImageIcon className="w-4 h-4 mr-2" />
                Gambar UKM
              </Label>

              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                  isDragOver
                    ? "border-amber-400 bg-amber-50"
                    : "border-amber-300 hover:border-amber-400 hover:bg-amber-50/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
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
                    <div className="relative inline-block">
                      <img
                        src={previewImage || "/placeholder.svg"}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-xl mx-auto shadow-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isPending}
                        className="border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Ganti Gambar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeImage}
                        disabled={isPending}
                        className="border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Hapus Gambar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CloudUpload className="h-8 w-8 text-amber-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-amber-800 mb-2">
                      Upload Gambar UKM
                    </h4>
                    <p className="text-amber-700/80 mb-2">
                      Klik untuk upload gambar atau drag & drop di sini
                    </p>
                    <p className="text-sm text-amber-600/70">
                      PNG, JPG hingga 5MB
                    </p>
                    <div className="mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-400 font-semibold transition-all duration-200 bg-transparent"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Pilih File
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start">
                  <Target className="w-4 h-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-amber-700">
                    <p className="font-medium mb-1">
                      Tips untuk gambar terbaik:
                    </p>
                    <ul className="space-y-1 text-amber-600/80">
                      <li>
                        • Gunakan gambar dengan resolusi tinggi (minimal
                        800x400px)
                      </li>
                      <li>• Pastikan gambar menggambarkan aktivitas UKM</li>
                      <li>• Hindari gambar yang terlalu gelap atau blur</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Alert */}
            {(createMutation.isError || updateMutation.isError) && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  Terjadi kesalahan saat menyimpan UKM. Silakan periksa data dan
                  coba lagi.
                </AlertDescription>
              </Alert>
            )}

            {/* Success State */}
            {(createMutation.isSuccess || updateMutation.isSuccess) && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  UKM berhasil {isEditing ? "diperbarui" : "ditambahkan"}!
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-amber-200">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11 border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-400 font-semibold transition-all duration-200 bg-transparent"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 h-11 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    {isEditing ? (
                      <Edit className="mr-2 h-4 w-4" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    {isEditing ? "Update UKM" : "Simpan UKM"}
                    <Sparkles className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
