import { ApiResponse } from "@shared/schema";

const API_URL = 'https://script.google.com/macros/s/AKfycbyNHxX8D69GlkvQR0CBUJjeQIzbsBTKcRzqhB1dhUfbyIJc9KC4tra9C21rWZVMwJ62/exec';

export async function apiCall<T = any>(data: any): Promise<ApiResponse<T>> {
  try {
    console.log('Making API call to Google Apps Script:', data);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API response:', result);
    return result;
  } catch (error) {
    console.error('API call error:', error);
    
    // Fallback untuk development - return sample data
    if (data.action === 'ukm' && data.method === 'read') {
      return {
        success: true,
        data: [
          {
            id_ukm: '1',
            nama_ukm: 'Robotika',
            deskripsi: 'Unit kegiatan mahasiswa yang berfokus pada pengembangan teknologi robotika dan automasi.',
            gambar_url: 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Robotika',
            prestasi: 'Juara 1 Kontes Robot Indonesia 2024'
          },
          {
            id_ukm: '2',
            nama_ukm: 'KSR PMI',
            deskripsi: 'Korps Sukarela Palang Merah Indonesia yang bergerak di bidang kemanusiaan dan kesehatan.',
            gambar_url: 'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=KSR+PMI',
            prestasi: 'Relawan Terbaik Provinsi 2024'
          },
          {
            id_ukm: '3',
            nama_ukm: 'Bahasa & Sastra',
            deskripsi: 'Komunitas pecinta bahasa dan sastra Indonesia yang aktif dalam berbagai kegiatan literasi.',
            gambar_url: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Bahasa',
            prestasi: 'Juara 2 Lomba Karya Tulis Nasional 2024'
          }
        ]
      };
    }
    
    return {
      success: false,
      error: 'Gagal terhubung ke Google Apps Script. Pastikan Google Apps Script sudah di-deploy dengan benar.',
    };
  }
}

// User authentication
export async function loginUser(email: string, password: string) {
  return apiCall({
    action: 'login',
    email,
    password,
  });
}

export async function registerUser(userData: any) {
  return apiCall({
    action: 'register',
    ...userData,
  });
}

// UKM operations
export async function getUKMs(email: string = 'guest@example.com') {
  return apiCall({
    email,
    action: 'ukm',
    method: 'read',
  });
}

export async function createUKM(email: string, ukmData: any) {
  return apiCall({
    email,
    action: 'ukm',
    method: 'create',
    ukmData: ukmData,
  });
}

export async function updateUKM(email: string, ukmId: string, ukmData: any) {
  return apiCall({
    email,
    action: 'ukm',
    method: 'update',
    ukmId: ukmId,
    ukmData: ukmData,
  });
}

export async function deleteUKM(email: string, ukmId: string) {
  return apiCall({
    email,
    action: 'ukm',
    method: 'delete',
    ukmId: ukmId,
  });
}

// UKM Registration operations
export async function registerToUKM(email: string, ukmId: string) {
  return apiCall({
    email,
    action: 'register_ukm',
    ukmId: ukmId,
  });
}

export async function getUserUKMs(email: string) {
  return apiCall({
    email,
    action: 'get_user_ukms',
  });
}

export async function unregisterFromUKM(email: string, ukmId: string) {
  return apiCall({
    email,
    action: 'unregister_ukm',
    ukmId: ukmId,
  });
}
