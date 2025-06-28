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
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal terhubung ke server. Pastikan Google Apps Script sudah di-deploy.',
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
