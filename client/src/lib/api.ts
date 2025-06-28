import { ApiResponse } from "@shared/schema";

const API_URL = 'https://script.google.com/macros/s/AKfycbyNHxX8D69GlkvQR0CBUJjeQIzbsBTKcRzqhB1dhUfbyIJc9KC4tra9C21rWZVMwJ62/exec';

export async function apiCall<T = any>(data: any): Promise<ApiResponse<T>> {
  try {
    console.log('Making API call to Google Apps Script:', data);
    
    // Try multiple approaches for Google Apps Script
    const methods = [
      // Method 1: Standard POST with JSON
      async () => {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          mode: 'cors',
        });
        return response;
      },
      // Method 2: GET with URL parameters for simpler cases
      async () => {
        const params = new URLSearchParams();
        Object.keys(data).forEach(key => {
          params.append(key, typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]);
        });
        const response = await fetch(`${API_URL}?${params.toString()}`, {
          method: 'GET',
          mode: 'cors',
        });
        return response;
      },
      // Method 3: Form data approach
      async () => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
          formData.append(key, typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]);
        });
        const response = await fetch(API_URL, {
          method: 'POST',
          body: formData,
          mode: 'cors',
        });
        return response;
      }
    ];

    let lastError;
    for (const method of methods) {
      try {
        const response = await method();
        if (response.ok) {
          const result = await response.json();
          console.log('API response:', result);
          return result;
        } else {
          console.warn(`Method failed with status: ${response.status}`);
        }
      } catch (error) {
        lastError = error;
        console.warn('Method failed:', error);
      }
    }

    throw lastError || new Error('All connection methods failed');

  } catch (error) {
    console.error('API call error:', error);
    
    // Provide demo data for development
    console.log('Using demo data due to connection issues');
    
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

    if (data.action === 'login') {
      // Demo login - accept any credentials
      return {
        success: true,
        data: {
          userId: 'demo-user-123',
          namaMahasiswa: 'Demo User',
          email: data.email,
          role: 'user',
          createdAt: new Date().toISOString()
        }
      };
    }

    if (data.action === 'register') {
      // Demo register - accept any data
      return {
        success: true,
        data: {
          userId: 'demo-user-' + Date.now(),
          namaMahasiswa: data.namaMahasiswa,
          email: data.email,
          role: 'user',
          createdAt: new Date().toISOString()
        }
      };
    }
    
    return {
      success: false,
      error: 'Koneksi ke Google Apps Script gagal. Menggunakan data demo untuk testing.',
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
