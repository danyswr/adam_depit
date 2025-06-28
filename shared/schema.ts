import { z } from "zod";

// User schemas
export const userSchema = z.object({
  userId: z.string(),
  nama_mahasiswa: z.string(),
  email: z.string().email(),
  nomor_whatsapp: z.string().optional(),
  nim: z.string(),
  gender: z.string().optional(),
  jurusan: z.string().optional(),
  createdAt: z.string(),
});

export const insertUserSchema = z.object({
  nama_mahasiswa: z.string().min(1, "Nama lengkap wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  nim: z.string().min(1, "NIM wajib diisi"),
  nomor_whatsapp: z.string().optional(),
  gender: z.string().optional(),
  jurusan: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

// UKM schemas
export const ukmSchema = z.object({
  id_ukm: z.string(),
  nama_ukm: z.string(),
  gambar_url: z.string().optional(),
  deskripsi: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const insertUkmSchema = z.object({
  nama_ukm: z.string().min(1, "Nama UKM wajib diisi"),
  deskripsi: z.string().min(1, "Deskripsi wajib diisi"),
  imageData: z.string().optional(),
  mimeType: z.string().optional(),
  fileName: z.string().optional(),
});

// UKM Registration schemas
export const ukmRegistrationSchema = z.object({
  id_daftar: z.string(),
  id_user: z.string(),
  id_ukm: z.string(),
  nama_ukm: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

// API Response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  redirect: z.string().optional(),
});

// Types
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type UKM = z.infer<typeof ukmSchema>;
export type InsertUKM = z.infer<typeof insertUkmSchema>;
export type UKMRegistration = z.infer<typeof ukmRegistrationSchema>;
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  redirect?: string;
};
