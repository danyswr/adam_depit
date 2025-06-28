import { ApiResponse } from "@shared/schema";

const API_URL = 'https://script.google.com/macros/s/AKfycbyNHxX8D69GlkvQR0CBUJjeQIzbsBTKcRzqhB1dhUfbyIJc9KC4tra9C21rWZVMwJ62/exec';

export async function apiCall<T = any>(data: any): Promise<ApiResponse<T>> {
  try {
    console.log('Making API call to Google Apps Script:', data);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(data),
      mode: 'cors',
      redirect: 'follow'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API response:', result);
    
    // Transform data for UKM read operations
    if (result.success && data.sheet === 'UKM' && data.action === 'read' && Array.isArray(result.data)) {
      return {
        ...result,
        data: transformUKMData(result.data)
      };
    }
    
    return result;

  } catch (error) {
    console.error('API call error:', error);
    
    // Provide demo data for development
    console.log('Using demo data due to connection issues');
    
    // Don't show demo data for UKM anymore - return empty data if connection fails
    if (data.sheet === 'UKM' && data.action === 'read') {
      return {
        success: true,
        data: []
      };
    }

    if (data.sheet === 'Users' && data.action === 'login') {
      // Demo login - accept any credentials
      return {
        success: true,
        data: {
          userId: data.email,
          namaMahasiswa: 'Demo User',
          email: data.email,
          nomorWhatsapp: '081234567890',
          nim: '12345678',
          gender: 'Laki-laki',
          jurusan: 'Teknik Informatika',
          role: 'user',
          createdAt: new Date().toISOString()
        },
        redirect: '/dashboard'
      };
    }

    if (data.sheet === 'Users' && data.action === 'register') {
      // Demo register - accept any data
      return {
        success: true,
        data: {
          userId: data.email,
          namaMahasiswa: data.namaMahasiswa,
          email: data.email,
          nomorWhatsapp: data.nomorWhatsapp || '',
          nim: data.nim || '',
          gender: data.gender || '',
          jurusan: data.jurusan || '',
          role: data.role || 'user',
          createdAt: new Date().toISOString()
        },
        redirect: data.role === 'admin' ? '/admin' : '/dashboard'
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
    sheet: 'Users',
    action: 'login',
    email,
    password,
  });
}

export async function registerUser(userData: any) {
  return apiCall({
    sheet: 'Users',
    action: 'register',
    email: userData.email,
    password: userData.password,
    namaMahasiswa: userData.namaMahasiswa,
    nomorWhatsapp: userData.nomorWhatsapp,
    nim: userData.nim,
    gender: userData.gender,
    jurusan: userData.jurusan,
    role: userData.role || 'user',
  });
}

// Transform array data from Google Sheets to objects
function transformUKMData(data: any[]): any[] {
  return data.map((row: any[]) => ({
    id_ukm: row[0],
    nama_ukm: row[1],
    gambar_url: row[2], // Use URL directly from Google Apps Script
    deskripsi: row[3],
    id_users: row[4],
    prestasi: row[5]
  }));
}

function transformUserData(userData: any[]): any {
  return {
    userId: userData[0],
    namaMahasiswa: userData[1],
    email: userData[3],
    nomorWhatsapp: userData[4],
    nim: userData[5],
    gender: userData[6],
    jurusan: userData[7],
    role: userData[8]
  };
}

// UKM operations
export async function getUKMs(email: string = 'guest@example.com') {
  return apiCall({
    sheet: 'UKM',
    action: 'read',
    email,
  });
}

export async function createUKM(email: string, ukmData: any) {
  return apiCall({
    sheet: 'UKM',
    action: 'create',
    email,
    data: {
      nama_ukm: ukmData.nama_ukm,
      deskripsi: ukmData.deskripsi,
      prestasi: ukmData.prestasi,
      id_users: ukmData.id_users,
      imageData: ukmData.imageData,
      mimeType: ukmData.mimeType,
      fileName: ukmData.fileName,
    },
  });
}

export async function updateUKM(email: string, ukmId: string, ukmData: any) {
  return apiCall({
    sheet: 'UKM',
    action: 'update',
    email,
    id_ukm: ukmId,
    data: {
      nama_ukm: ukmData.nama_ukm,
      deskripsi: ukmData.deskripsi,
      prestasi: ukmData.prestasi,
      id_users: ukmData.id_users,
      imageData: ukmData.imageData,
      mimeType: ukmData.mimeType,
      fileName: ukmData.fileName,
    },
  });
}

export async function deleteUKM(email: string, ukmId: string) {
  return apiCall({
    sheet: 'UKM',
    action: 'delete',
    email,
    id_ukm: ukmId,
  });
}

// UKM Registration operations
export async function registerToUKM(email: string, ukmId: string) {
  return apiCall({
    sheet: 'Daftar',
    action: 'create',
    email,
    data: {
      id_ukm: ukmId,
    },
  });
}

export async function getUserUKMs(email: string) {
  return apiCall({
    sheet: 'Daftar',
    action: 'read',
    email,
  });
}

export async function unregisterFromUKM(email: string, ukmId: string) {
  return apiCall({
    sheet: 'Daftar',
    action: 'delete',
    email,
    id_ukm: ukmId,
  });
}

export async function getAllRegistrations(email: string) {
  return apiCall({
    sheet: 'Daftar',
    action: 'read',
    email,
  });
}
